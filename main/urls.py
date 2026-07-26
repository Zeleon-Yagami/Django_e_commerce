from django.urls import path
# from .views import index, shop, categories, new_arrival, deals, contact_page, fashion

from .views import (
    index,
    shop,
    categories, new_arrival,
    deals,
    contact_page,
    fashion,
    cart_page,
    checkout_page,
    wishlist_view,
    wishlist_toggle,
    wishlist_remove,
    wishlist_count,
    wishlist_ids,
)

urlpatterns = [
    path('', index, name='index-page'),
    path('shop/', shop, name='shop-page'),
    path('categories/', categories, name='categories-page'),
    path('new-arrival/', new_arrival, name='new-arrival-page'),
    path('deals/', deals, name='deals-page'),
    path('contact/', contact_page, name='contact-page'),
    path('fashion/', fashion, name='fashion-page'),
    path('cart/', cart_page, name='cart-page'),
    path('cart/checkout/', checkout_page, name='checkout-page'),
    path('wishlist/', wishlist_view, name='whishlist-page'),
    path('wishlist/toggle/', wishlist_toggle, name='wishlist-toggle'),
    path('wishlist/remove/', wishlist_remove, name='wishlist-remove'),
    path('wishlist/count/', wishlist_count, name='wishlist-count'),
    path('wishlist/ids/', wishlist_ids, name='wishlist-ids'),
]
