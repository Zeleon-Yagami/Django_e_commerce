document.addEventListener("DOMContentLoaded", () => {

    const form = document.querySelector(".profile-form");

    const message = document.getElementById("profileMessage");

    const menuButtons = document.querySelectorAll(".profile-menu-btn");

    menuButtons.forEach(btn => {

        btn.addEventListener("click", () => {

            menuButtons.forEach(item => {

                item.classList.remove("profile-active");

            });

            btn.classList.add("profile-active");

        });

    });

    if (form) {

        form.addEventListener("submit", (e) => {

            e.preventDefault();

            message.innerHTML = "Profile Updated Successfully ✓";

            message.style.color = "green";

        });

    }

});