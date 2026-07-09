from django.urls import path
# from .views import index, shop, categories, new_arrival, deals, contact_page, fashion

from .views import (
    index,
    shop,
    categories, new_arrival,
    deals,
    contact_page,
    fashion,
    whishlist,
)

urlpatterns = [
    path('', index, name='index-page'),
    path('shop/', shop, name='shop-page'),
    path('categories/', categories, name='categories-page'),
    path('new-arrival/', new_arrival, name='new-arrival-page'),
    path('deals/', deals, name='deals-page'),
    path('contact/', contact_page, name='contact-page'),
    path('fashion/', fashion, name='fashion-page'),
    path('whishlist/', whishlist, name='whishlist-page'),
]
