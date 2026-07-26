document.addEventListener('DOMContentLoaded', () => {

    updateCartCount();
    updateWishlistCount();
    updateWishlistIcons();

    document.querySelectorAll('.wishlist').forEach(item => {
        item.addEventListener('click', () => {
            const icon = item.querySelector('i');
            if (!icon) return;
            const card = item.closest('.product-card');
            toggleWishlist(icon, card);
        });
    });

    document.querySelectorAll('.cart-btn').forEach(button => {
        button.addEventListener('click', () => addToCart(button));
    });

});
