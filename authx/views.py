from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth import login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import PasswordChangeForm
from django.contrib.auth import update_session_auth_hash
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
                login(request, user)
                messages.success(request, "Login successful.")
                return redirect('index-page')  # Redirect to a home page or dashboard after successful login
            else:
                messages.error(request, "Invalid password.")
        except CustomUser.DoesNotExist:
            messages.error(request, "User with this email does not exist.")

    return render(request, 'log_in.html')


@login_required
def profile(request):
    return render(request, 'profile/profile.html')


@login_required
def change_password(request):
    if request.method == 'POST':
        form = PasswordChangeForm(request.user, request.POST)
        if form.is_valid():
            user = form.save()
            update_session_auth_hash(request, user)  # Important to keep the user logged in
            messages.success(request, 'Your password was successfully updated!')
            return redirect('profile')
        else:
            messages.error(request, 'Please correct the error below.')
    else:
        form = PasswordChangeForm(request.user)

    return render(request, 'change_password.html', {'form': form})


@login_required
def log_out(request):
    logout(request)
    messages.success(request, 'Logged out successfully.')
    return redirect('index-page')
