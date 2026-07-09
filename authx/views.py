from django.shortcuts import render, redirect
from django.contrib import messages
from .models import CustomUser

# Create your views here.
def register(request):
    if request.method == 'POST':
        data = request.POST
        name = data['full_name']
        username = data['username']
        email = data['email']
        phone_number = data['phone']
        password = data['password']
        confirm_password = data['confirm_password']

        if password != confirm_password:
            messages.error(request, "Passwords do not match.")
            return render(request, 'register.html')
        
        if CustomUser.objects.filter(email=email).exists():
            messages.error(request, "User with this email already exists")
            return redirect('register.html')
        
        if CustomUser.objects.filter(username=username).exists():
            messages.error(request, "This username already exists")
            return redirect('register.html')
        
        custom_user = CustomUser.objects.create_user(name=name, username=username, email=email, phone_number=phone_number, password=password)
        messages.success(request, "Registration successful.")
        return redirect('log_in')
        
    return render(request, 'register.html')


def log_in(request):
    if request.method == 'POST':
        data = request.POST
        email = data['email']
        password = data['password']

        try:
            user = CustomUser.objects.get(email=email)
            if user.check_password(password):
                messages.success(request, "Login successful.")
                return redirect('index-page')  # Redirect to a home page or dashboard after successful login
            else:
                messages.error(request, "Invalid password.")
        except CustomUser.DoesNotExist:
            messages.error(request, "User with this email does not exist.")

    return render(request, 'log_in.html')
