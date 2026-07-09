from django.shortcuts import render, redirect
from django.urls import reverse
from django.contrib import messages

import threading
from threading import Thread
from django.core.mail import send_mail

from .models import Contact, Categories, Product

# Create your views here.
def index(request):
    categories = Categories.objects.all()
    return render(request, 'main/index.html', {"category": categories})  #{"key":value} ==> dictionary


def shop(request):
    return render(request, 'main/shop.html')

def categories(request):
    categories = Categories.objects.all()
    return render(request, 'main/categories.html', {"category": categories})  #{"key":value} ==> dictionary

def new_arrival(request):
    return render(request, 'main/new_arrival.html')

def deals(request):
    return render(request, 'main/deals.html')

from django.shortcuts import render, redirect
from .models import Contact

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

            #send mail
            subject = "Himlungroo"
            message =  f"dear {name}"
            from_email =  'zeleonyagami@gmail.com'
            recipient_list =  [email]

            send_mail(
                subject = "Thanks you for contacting us", 
                message =  f"dear {name}", 
                from_email =  'zeleonyagami', 
                recipient_list =  [email], 
                fail_silently =  False,
            )

            t1 = threading.Thread(target=send_mail,
                                  kwargs={
                                      'subject': subject,
                                      'message': message,
                                      'from_email': from_email,
                                      'recipient_list': recipient_list,
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

    #receive cate_id from url
    c_id = request.GET.get('cate_id')

    if c_id and c_id != "all_find":
         products = Product.objects.filter(categories=c_id)
    else:
         products = Product.objects.all()


    
    categories = Categories.objects.all()
   

    context = {
        "category":categories,
        "products":products,
    }
    return render(request, 'product/fashion.html', context)




def whishlist(request):
    return render(request, "whishlist/whishlist.html")