document.addEventListener("DOMContentLoaded", () => {

    updateCartCount();
    updateWishlistCount();
    updateWishlistIcons();

    const dealButtons = document.querySelectorAll(".deal-btn");
    dealButtons.forEach(button => {
        button.addEventListener("click", () => addToCart(button));
    });

    document.querySelectorAll('.deal-card .wishlist').forEach(item => {
        item.addEventListener('click', () => {
            const icon = item.querySelector('i');
            if (!icon) return;
            const card = item.closest('.deal-card');
            toggleWishlist(icon, card);
        });
    });

});
