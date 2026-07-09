document.addEventListener("DOMContentLoaded", () => {

    const mobileBtn =
        document.getElementById("mobileMenuBtn");

    const navLinks =
        document.getElementById("navLinks");

    if (mobileBtn && navLinks) {

        mobileBtn.addEventListener("click", () => {

            navLinks.classList.toggle("active");

        });

    }

});