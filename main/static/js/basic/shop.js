// WISHLIST

let wishlist = document.querySelectorAll(".wishlist");

wishlist.forEach((item) => {

    item.addEventListener("click", () => {

        let icon = item.querySelector("i");

        icon.classList.toggle("fa-regular");
        icon.classList.toggle("fa-solid");

        icon.style.color = "#d4af37";

    });

});

// CART

let cartButtons = document.querySelectorAll(".cart-btn");

let cartCount = document.getElementById("cart-count");

let count = 0;

cartButtons.forEach((button) => {

    button.addEventListener("click", () => {

        count++;

        cartCount.innerText = count;

        button.innerText = "Added";

        button.style.background = "green";

    });

});