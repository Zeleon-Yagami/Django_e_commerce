from django.urls import path
from .views import register, log_in, profile, change_password, log_out

urlpatterns = [
    path('register/', register, name='register'),
    path('log_in/', log_in, name='log_in'),
    path('profile/', profile, name='profile'),
    path('change-password/', change_password, name='change-password'),
    path('log_out/', log_out, name='log_out'),
]