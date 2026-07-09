document.addEventListener("DOMContentLoaded", () => {

    const dealButtons =
        document.querySelectorAll(".deal-btn");

    dealButtons.forEach(button => {

        button.addEventListener("click", () => {

            button.innerText = "Deal Claimed ✓";

            button.disabled = true;

        });

    });

});