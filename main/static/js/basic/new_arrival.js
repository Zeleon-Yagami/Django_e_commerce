document.addEventListener("DOMContentLoaded", () => {

    updateCartCount();
    updateWishlistCount();
    updateWishlistIcons();

    const arrivalButtons = document.querySelectorAll(".arrival-btn");
    arrivalButtons.forEach(button => {
        button.addEventListener("click", () => addToCart(button));
    });

    document.querySelectorAll('.arrival-card .wishlist').forEach(item => {
        item.addEventListener('click', () => {
            const icon = item.querySelector('i');
            if (!icon) return;
            const card = item.closest('.arrival-card');
            toggleWishlist(icon, card);
        });
    });

});
