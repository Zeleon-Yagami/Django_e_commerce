document.addEventListener("DOMContentLoaded", () => {

    const form = document.querySelector(".cp-form");
    const current = document.getElementById("cpCurrent");
    const newPass = document.getElementById("cpNew");
    const confirm = document.getElementById("cpConfirm");
    const message = document.getElementById("cpMessage");
    const toggles = document.querySelectorAll(".cp-toggle");

    toggles.forEach(toggle => {
        toggle.addEventListener("click", () => {
            const target = document.getElementById(toggle.dataset.target);
            if (target) {
                if (target.type === "password") {
                    target.type = "text";
                    toggle.classList.replace("fa-eye", "fa-eye-slash");
                } else {
                    target.type = "password";
                    toggle.classList.replace("fa-eye-slash", "fa-eye");
                }
            }
        });
    });

    if (form) {
        form.addEventListener("submit", (e) => {
            message.innerHTML = "";

            if (current && current.value.trim() === '') {
                e.preventDefault();
                message.innerHTML = "Current password is required";
                message.style.color = "#e53935";
                current.focus();
                return;
            }
            if (newPass && newPass.value.length < 6) {
                e.preventDefault();
                message.innerHTML = "New password must be at least 6 characters";
                message.style.color = "#e53935";
                newPass.focus();
                return;
            }
            if (newPass && confirm && newPass.value !== confirm.value) {
                e.preventDefault();
                message.innerHTML = "Passwords do not match";
                message.style.color = "#e53935";
                confirm.focus();
                return;
            }
        });
    }

});
