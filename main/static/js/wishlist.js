document.addEventListener('DOMContentLoaded', () => {

    updateCartCount();

    const removeButtons = document.querySelectorAll('.wish-remove');
    removeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.wish-card');
            const productId = card ? card.dataset.productId : null;
            if (!productId) {
                if (card) card.remove();
                return;
            }
            const formData = new FormData();
            formData.append('product_id', productId);
            fetch('/wishlist/remove/', {
                method: 'POST',
                headers: { 'X-CSRFToken': getCSRFToken() },
                body: formData
            }).then(() => {
                card.remove();
            }).catch(() => {
                if (card) card.remove();
            });
        });
    });

    const wishCartButtons = document.querySelectorAll('.wish-cart-btn');
    wishCartButtons.forEach(btn => {
        btn.addEventListener('click', () => addToCart(btn));
    });

});
