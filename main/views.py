import json
import logging
import threading

from django.conf import settings
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.core.mail import send_mail
from django.db.models import Count
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, redirect, render
from django.urls import reverse
from django.views.decorators.http import require_POST

from .models import (
    Categories,
    Contact,
    Order,
    OrderItem,
    Product,
    Wishlist,
)

logger = logging.getLogger(__name__)


def index(request):
    """Homepage with categories and trending products."""
    categories = Categories.objects.all()
    trending = Product.objects.filter(is_active=True, is_featured=True)[:8]
    context = {
        'category': categories,
        'trending_products': trending,
    }
    return render(request, 'main/index.html', context)


def shop(request):
    """Shop page with all products, sidebar categories, and filtering."""
    categories = Categories.objects.all()
    products = Product.objects.filter(is_active=True)

    category_id = request.GET.get('category')
    if category_id:
        try:
            products = products.filter(categories_id=int(category_id))
        except (ValueError, TypeError):
            pass

    wishlist_ids = []
    if request.user.is_authenticated:
        wishlist_ids = list(
            Wishlist.objects.filter(user=request.user).values_list('product_id', flat=True)
        )

    context = {
        'categories': categories,
        'products': products,
        'wishlist_ids': wishlist_ids,
    }
    return render(request, 'main/shop.html', context)


def categories(request):
    """Categories listing page with product counts."""
    categories_list = Categories.objects.annotate(product_count=Count('products'))
    return render(request, 'main/categories.html', {'category': categories_list})


def new_arrival(request):
    """New arrivals page showing recently added products."""
    products = Product.objects.filter(is_active=True, is_new_arrival=True)[:12]
    wishlist_ids = []
    if request.user.is_authenticated:
        wishlist_ids = list(
            Wishlist.objects.filter(user=request.user).values_list('product_id', flat=True)
        )
    context = {
        'products': products,
        'wishlist_ids': wishlist_ids,
    }
    return render(request, 'main/new_arrival.html', context)


def deals(request):
    """Deals page showing products with discounts."""
    products = Product.objects.filter(
        is_active=True, discount_price__isnull=False,
    )[:12]
    wishlist_ids = []
    if request.user.is_authenticated:
        wishlist_ids = list(
            Wishlist.objects.filter(user=request.user).values_list('product_id', flat=True)
        )
    context = {
        'products': products,
        'wishlist_ids': wishlist_ids,
    }
    return render(request, 'main/deals.html', context)


def contact_page(request):
    """Contact page with form submission and email notification."""
    if request.method == 'POST':
        try:
            name = request.POST.get('name', '').strip()
            email = request.POST.get('email', '').strip()
            msg = request.POST.get('msg', '').strip()

            if not name or not email or not msg:
                messages.error(request, 'All fields are required.')
                return redirect(reverse('contact-page') + '#contact')

            Contact.objects.create(name=name, email=email, msg=msg)

            # Send confirmation email in background thread
            t1 = threading.Thread(
                target=send_mail,
                kwargs={
                    'subject': 'Thank you for contacting us',
                    'message': (
                        f'Dear {name},\n\n'
                        'Thank you for reaching out. We have received your message '
                        'and will get back to you shortly.\n\n'
                        'Best regards,\nShopora Team'
                    ),
                    'from_email': settings.EMAIL_HOST_USER,
                    'recipient_list': [email],
                    'fail_silently': True,
                },
                daemon=True,
            )
            t1.start()

            messages.success(request, 'Thanks for contacting us.')
            return redirect(reverse('contact-page') + '#contact')

        except Exception:
            logger.exception('Error processing contact form')
            messages.error(request, 'Internal server error. Please try again.')
            return redirect(reverse('contact-page') + '#contact')

    return render(request, 'main/contact.html')


def fashion(request):
    """Product listing page with category and search filtering."""
    c_id = request.GET.get('cate_id')
    search_query = request.GET.get('search', '').strip()

    if search_query:
        products = Product.objects.filter(is_active=True, name__icontains=search_query)
    elif c_id and c_id != 'all_find':
        try:
            products = Product.objects.filter(is_active=True, categories_id=int(c_id))
        except (ValueError, TypeError):
            products = Product.objects.filter(is_active=True)
    else:
        products = Product.objects.filter(is_active=True)

    categories_list = Categories.objects.all()
    wishlist_ids = []
    if request.user.is_authenticated:
        wishlist_ids = list(
            Wishlist.objects.filter(user=request.user).values_list('product_id', flat=True)
        )

    context = {
        'category': categories_list,
        'products': products,
        'wishlist_ids': wishlist_ids,
        'search_query': search_query,
    }
    return render(request, 'product/fashion.html', context)


def cart_page(request):
    """Shopping cart page (cart is managed client-side via localStorage)."""
    return render(request, 'cart/cart.html')


def checkout_page(request):
    """Checkout page — renders form on GET, processes order on POST."""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
        except (json.JSONDecodeError, ValueError):
            return JsonResponse({'success': False, 'error': 'Invalid request data.'})

        full_name = data.get('full_name', '').strip()
        email = data.get('email', '').strip()
        phone = data.get('phone', '').strip()
        address = data.get('address', '').strip()
        city = data.get('city', '').strip()
        zip_code = data.get('zip', '').strip()
        payment = data.get('payment', 'cod')
        cart_items = data.get('items', [])

        if not all([full_name, email, phone, address, city]):
            return JsonResponse({'success': False, 'error': 'All fields are required.'})

        if not cart_items:
            return JsonResponse({'success': False, 'error': 'Cart is empty.'})

        # Calculate total from cart items
        total = sum(
            float(item.get('price', 0)) * int(item.get('qty', 1))
            for item in cart_items
        )

        order = Order.objects.create(
            user=request.user if request.user.is_authenticated else None,
            full_name=full_name,
            email=email,
            phone=phone,
            address=address,
            city=city,
            zip_code=zip_code,
            payment_method=payment,
            total=total,
        )

        for item in cart_items:
            product = None
            product_id = item.get('product_id')
            if product_id:
                try:
                    product = Product.objects.get(id=int(product_id))
                except (Product.DoesNotExist, ValueError, TypeError):
                    pass

            OrderItem.objects.create(
                order=order,
                product=product,
                product_name=item.get('name', 'Unknown Product'),
                price=float(item.get('price', 0)),
                quantity=int(item.get('qty', 1)),
            )

        return JsonResponse({
            'success': True,
            'order_id': order.id,
            'message': f'Thank you, {full_name}! Your order #{order.id} has been placed.',
        })

    return render(request, 'cart/checkout.html')


@login_required
def wishlist_view(request):
    """Display the user's wishlist."""
    items = Wishlist.objects.filter(
        user=request.user,
    ).select_related('product', 'product__categories')
    return render(request, 'wishlist/wishlist.html', {'wishlist_items': items})


@login_required
@require_POST
def wishlist_toggle(request):
    """Toggle a product in/out of the user's wishlist."""
    product_id = request.POST.get('product_id')
    if not product_id:
        return JsonResponse({'success': False, 'error': 'Product ID required'})

    try:
        product = get_object_or_404(Product, id=int(product_id))
    except (ValueError, TypeError):
        return JsonResponse({'success': False, 'error': 'Invalid product ID'})

    wish_item, created = Wishlist.objects.get_or_create(
        user=request.user, product=product,
    )
    if not created:
        wish_item.delete()
        return JsonResponse({'success': True, 'action': 'removed'})
    return JsonResponse({'success': True, 'action': 'added'})


@login_required
@require_POST
def wishlist_remove(request):
    """Remove a product from the user's wishlist."""
    product_id = request.POST.get('product_id')
    if not product_id:
        return JsonResponse({'success': False, 'error': 'Product ID required'})
    Wishlist.objects.filter(user=request.user, product_id=product_id).delete()
    return JsonResponse({'success': True})


@login_required
def wishlist_count(request):
    """Return the count of items in the user's wishlist."""
    count = Wishlist.objects.filter(user=request.user).count()
    return JsonResponse({'count': count})


@login_required
def wishlist_ids(request):
    """Return the product IDs in the user's wishlist."""
    ids = list(
        Wishlist.objects.filter(user=request.user).values_list('product_id', flat=True)
    )
    return JsonResponse({'ids': ids})