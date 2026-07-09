document.addEventListener("DOMContentLoaded", () => {

    const arrivalButtons =
        document.querySelectorAll(".arrival-btn");

    arrivalButtons.forEach(button => {

        button.addEventListener("click", () => {

            button.innerText = "Added ✓";

            button.style.background = "green";

        });

    });

});