from django.contrib import admin
from .models import Categories, Product, Wishlist
# Register your models here.
@admin.register(Categories)
class CategoriesModelAdmin(admin.ModelAdmin):
    list_display = ['id', 'name']
    ordering = ['id']
    search_fields = ['id', 'name']


@admin.register(Product)
class ProductModelAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'price']
    ordering = ['id']
    search_fields = ['id', 'name']


@admin.register(Wishlist)
class WishlistModelAdmin(admin.ModelAdmin):
    list_display = ['id', 'product', 'user', 'created_at']
    ordering = ['-created_at']
    search_fields = ['product__name', 'user__email']