from django.shortcuts import render, redirect, get_object_or_404
from django.urls import reverse
from django.contrib import messages
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.db.models import Count

import threading
from django.core.mail import send_mail

from .models import Contact, Categories, Product, Wishlist

# Create your views here.
def index(request):
    categories = Categories.objects.all()
    return render(request, 'main/index.html', {"category": categories})  #{"key":value} ==> dictionary


def shop(request):
    return render(request, 'main/shop.html')

def categories(request):
    categories = Categories.objects.annotate(product_count=Count('categories'))
    return render(request, 'main/categories.html', {"category": categories})

def new_arrival(request):
    return render(request, 'main/new_arrival.html')

def deals(request):
    return render(request, 'main/deals.html')

def contact_page(request):
    try:
        if request.method == "POST":
            name = request.POST.get("name")
            email = request.POST.get("email")
            msg = request.POST.get("msg")

            Contact.objects.create(
                name=name,
                email=email,
                msg=msg
            )

            t1 = threading.Thread(
                target=send_mail,
                kwargs={
                    'subject': "Thank you for contacting us",
                    'message': f"Dear {name},\n\nThank you for reaching out. We have received your message and will get back to you shortly.\n\nBest regards,\nShopora Team",
                    'from_email': 'zeleonyagami@gmail.com',
                    'recipient_list': [email],
                    'fail_silently': True,
                },
                daemon=True
            )
            t1.start()

            messages.success(request, "Thanks for contacting us.")
            # return redirect(reverse("contact-page"))  # Optional but recommended
            return redirect(reverse('contact-page')+'#contact')

    except Exception as e:
        # print(f"Error: {e}")
        messages.error(request, "Internal server error. Please try again")
        return redirect(reverse('contact-page')+'#contact')

    return render(request, "main/contact.html")



def fashion(request):
    c_id = request.GET.get('cate_id')
    search_query = request.GET.get('search', '').strip()

    if search_query:
         products = Product.objects.filter(name__icontains=search_query)
    elif c_id and c_id != "all_find":
         products = Product.objects.filter(categories=c_id)
    else:
         products = Product.objects.all()

    categories = Categories.objects.all()
    wishlist_ids = []
    if request.user.is_authenticated:
        wishlist_ids = list(Wishlist.objects.filter(user=request.user).values_list('product_id', flat=True))

    context = {
        "category": categories,
        "products": products,
        "wishlist_ids": wishlist_ids,
        "search_query": search_query,
    }
    return render(request, 'product/fashion.html', context)




def cart_page(request):
    return render(request, 'cart/cart.html')


def checkout_page(request):
    return render(request, 'cart/checkout.html')


@login_required
def wishlist_view(request):
    items = Wishlist.objects.filter(user=request.user).select_related('product', 'product__categories')
    return render(request, "whishlist/whishlist.html", {"wishlist_items": items})


@login_required
def wishlist_toggle(request):
    if request.method == 'POST':
        product_id = request.POST.get('product_id')
        if not product_id:
            return JsonResponse({'success': False, 'error': 'Product ID required'})
        product = get_object_or_404(Product, id=product_id)
        wish_item, created = Wishlist.objects.get_or_create(user=request.user, product=product)
        if not created:
            wish_item.delete()
            return JsonResponse({'success': True, 'action': 'removed'})
        return JsonResponse({'success': True, 'action': 'added'})
    return JsonResponse({'success': False, 'error': 'Invalid request method'})


@login_required
def wishlist_remove(request):
    if request.method == 'POST':
        product_id = request.POST.get('product_id')
        if not product_id:
            return JsonResponse({'success': False, 'error': 'Product ID required'})
        Wishlist.objects.filter(user=request.user, product_id=product_id).delete()
        return JsonResponse({'success': True})
    return JsonResponse({'success': False, 'error': 'Invalid request method'})


@login_required
def wishlist_count(request):
    count = Wishlist.objects.filter(user=request.user).count()
    return JsonResponse({'count': count})


@login_required
def wishlist_ids(request):
    ids = list(Wishlist.objects.filter(user=request.user).values_list('product_id', flat=True))
    return JsonResponse({'ids': ids})