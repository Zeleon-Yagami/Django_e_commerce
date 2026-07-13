document.addEventListener('DOMContentLoaded', () => {

    // Remove wishlist card
    const removeButtons = document.querySelectorAll('.wish-remove');
    removeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.wish-card');
            if (card) card.remove();
        });
    });

    // Add to cart from wishlist
    const wishCartButtons = document.querySelectorAll('.wish-cart-btn');
    const cartCountEl = document.getElementById('cart-count');

    // try to reuse same counter as shop.js
    let count = 0;
    if (cartCountEl) {
        const parsed = parseInt(cartCountEl.innerText, 10);
        if (!Number.isNaN(parsed)) count = parsed;
    }

    wishCartButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            count++;
            if (cartCountEl) cartCountEl.innerText = count;
            btn.innerText = 'Added';
            btn.disabled = true;
        });
    });

});
