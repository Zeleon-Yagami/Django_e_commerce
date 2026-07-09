// Wishlist Toggle

let wishlist = document.querySelectorAll(".wishlist");

wishlist.forEach((item) => {

    item.addEventListener("click", () => {

        let icon = item.querySelector("i");

        icon.classList.toggle("fa-regular");
        icon.classList.toggle("fa-solid");

        icon.style.color = "#d4af37";

    });

});
// 