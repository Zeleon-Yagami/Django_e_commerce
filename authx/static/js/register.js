document.addEventListener("DOMContentLoaded", () => {

    const form = document.querySelector(".reg-form");
    const password = document.getElementById("regPassword");
    const confirm = document.getElementById("regConfirm");
    const message = document.getElementById("regMessage");

    if (form) {
        form.addEventListener("submit", (e) => {
            message.innerHTML = "";
            if (password && confirm && password.value !== confirm.value) {
                e.preventDefault();
                message.innerHTML = "Passwords do not match";
                message.style.color = "#e53935";
                return;
            }
            if (password && password.value.length < 6) {
                e.preventDefault();
                message.innerHTML = "Password must be at least 6 characters";
                message.style.color = "#e53935";
                return;
            }
        });
    }

});
