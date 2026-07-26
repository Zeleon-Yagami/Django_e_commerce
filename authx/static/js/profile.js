document.addEventListener("DOMContentLoaded", () => {

    const form = document.querySelector(".profile-form");
    const message = document.getElementById("profileMessage");
    const menuButtons = document.querySelectorAll(".profile-menu-btn");
    const nameInput = document.querySelector('input[name="name"]');
    const emailInput = document.querySelector('input[name="email"]');
    const phoneInput = document.querySelector('input[name="phone_number"]');

    menuButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            menuButtons.forEach(item => item.classList.remove("profile-active"));
            btn.classList.add("profile-active");
        });
    });

    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();

            const name = nameInput ? nameInput.value.trim() : '';
            const email = emailInput ? emailInput.value.trim() : '';
            const phone = phoneInput ? phoneInput.value.trim() : '';

            if (!name) {
                message.innerHTML = "Name is required";
                message.style.color = "#e53935";
                return;
            }
            if (!email) {
                message.innerHTML = "Email is required";
                message.style.color = "#e53935";
                return;
            }
            if (!email.includes('@')) {
                message.innerHTML = "Enter a valid email address";
                message.style.color = "#e53935";
                return;
            }

            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            if (phone) formData.append('phone_number', phone);

            fetch('/authx/profile/update/', {
                method: 'POST',
                headers: { 'X-CSRFToken': getCSRFToken() },
                body: formData
            })
            .then(r => r.json())
            .then(data => {
                if (data.success) {
                    message.innerHTML = "Profile Updated Successfully ✓";
                    message.style.color = "green";
                    const nameEl = document.querySelector('.profile-name');
                    const emailEl = document.querySelector('.profile-email');
                    if (nameEl) nameEl.innerText = data.name;
                    if (emailEl) emailEl.innerText = data.email;
                } else {
                    message.innerHTML = data.error || "Update failed";
                    message.style.color = "#e53935";
                }
            })
            .catch(() => {
                message.innerHTML = "Network error. Please try again.";
                message.style.color = "#e53935";
            });
        });
    }

});
