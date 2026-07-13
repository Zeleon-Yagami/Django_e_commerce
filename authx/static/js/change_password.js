document.addEventListener("DOMContentLoaded", () => {

    const form = document.querySelector(".cp-form");

    const newPass = document.getElementById("cpNew");

    const confirm = document.getElementById("cpConfirm");

    const message = document.getElementById("cpMessage");

    document.querySelectorAll(".cp-toggle").forEach(icon => {

        icon.addEventListener("click", () => {

            const input = document.getElementById(icon.dataset.target);

            if (input.type === "password") {

                input.type = "text";

                icon.classList.remove("fa-eye");

                icon.classList.add("fa-eye-slash");

            } else {

                input.type = "password";

                icon.classList.remove("fa-eye-slash");

                icon.classList.add("fa-eye");

            }

        });

    });

    form.addEventListener("submit", (e) => {

        e.preventDefault();

        if (newPass.value !== confirm.value) {

            message.innerHTML = "Passwords do not match.";

            message.style.color = "#e53935";

            return;

        }

        message.innerHTML = "Password updated successfully ✓";

        message.style.color = "green";

    });

});