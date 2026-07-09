from django.db import models

from django.contrib.auth.models import User

# Create your models here.
class Contact(models.Model):
    name = models.CharField(max_length=50)
    email = models.EmailField(max_length=254, unique=True)
    msg = models.TextField()

    class Meta:
        db_table = 'contacts'



class Categories(models.Model):
    name = models.CharField(max_length=225, unique=True)
    image = models.ImageField(upload_to='images/')

    class Meta:
        db_table = 'categories'

    def __str__(self):
        return self.name



# class SubCategory(models.Model):
#     name = models.CharField
#     cateory = models.ForeignKey(Categories)


class Product(models.Model):
    categories = models.ForeignKey(Categories, on_delete=models.CASCADE, related_name='categories')
    name = models.CharField(max_length=255)
    price = models.IntegerField()
    image = models.ImageField(upload_to='images/',)

    class Meta:
        db_table = 'products'





# class Whishlist(models.Model):
#     product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='whishlist_products')
#     user = models.ForeignKey(User, on_delete=models.CASCADE)