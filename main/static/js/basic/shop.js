document.addEventListener('DOMContentLoaded', () => {

    // WISHLIST (toggle heart)
    const wishlist = document.querySelectorAll('.wishlist');
    wishlist.forEach(item => {
        item.addEventListener('click', () => {
            const icon = item.querySelector('i');
            if (!icon) return;
            icon.classList.toggle('fa-regular');
            icon.classList.toggle('fa-solid');
            icon.style.color = '#d4af37';
        });
    });

    // CART (handle different button classes)
    const cartCountEl = document.getElementById('cart-count');
    let count = 0;
    if (cartCountEl) {
        const parsed = parseInt(cartCountEl.innerText, 10);
        if (!Number.isNaN(parsed)) count = parsed;
    }

    const cartButtons = document.querySelectorAll('.cart-btn, .add-cart, .arrival-btn, .wish-cart-btn');
    cartButtons.forEach(button => {
        button.addEventListener('click', () => {
            count++;
            if (cartCountEl) cartCountEl.innerText = count;
            button.innerText = 'Added';
            button.style.background = 'green';
            button.disabled = true;
        });
    });

});