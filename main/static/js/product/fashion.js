document.addEventListener("DOMContentLoaded", () => {

    updateCartCount();
    updateWishlistCount();
    updateWishlistIcons();

    document.querySelectorAll(".fashion-btn").forEach(btn => {
        btn.addEventListener("click", () => addToCart(btn));
    });

    document.querySelectorAll(".fashion-filter-btn").forEach(filter => {
        filter.addEventListener("click", () => {
            document.querySelectorAll(".fashion-filter-btn").forEach(f => f.classList.remove("active"));
            filter.classList.add("active");
        });
    });

    document.querySelectorAll('.wishlist').forEach(item => {
        item.addEventListener('click', () => {
            const icon = item.querySelector('i');
            if (!icon) return;
            const card = item.closest('.fashion-card');
            toggleWishlist(icon, card);
        });
    });

});
