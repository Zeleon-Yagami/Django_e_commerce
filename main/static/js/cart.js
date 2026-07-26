document.addEventListener("DOMContentLoaded", () => {

    const cartItems = document.getElementById("cartItems");
    const cartEmpty = document.getElementById("cartEmpty");
    const cartSubtotal = document.getElementById("cartSubtotal");
    const cartTotal = document.getElementById("cartTotal");
    const cartCountEl = document.getElementById("cart-count");
    const checkoutBtn = document.querySelector(".cart-checkout-btn");

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    function renderCart() {
        cartItems.querySelectorAll(".cart-item").forEach(el => el.remove());

        if (cart.length === 0) {
            cartEmpty.style.display = "block";
            if (cartSubtotal) cartSubtotal.innerText = "$0";
            if (cartTotal) cartTotal.innerText = "$0";
            if (cartCountEl) cartCountEl.innerText = "0";
            if (checkoutBtn) checkoutBtn.disabled = true;
            return;
        }

        if (checkoutBtn) checkoutBtn.disabled = false;

        cartEmpty.style.display = "none";
        let subtotal = 0;

        cart.forEach((item, index) => {
            const div = document.createElement("div");
            div.className = "cart-item";
            div.innerHTML = `
                <img class="cart-item-img" src="${item.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200'}" alt="${item.name}">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">$${item.price}</div>
                    <div class="cart-item-qty">
                        <button class="cart-qty-btn" data-index="${index}" data-action="minus">−</button>
                        <span class="cart-qty-num">${item.qty || 1}</span>
                        <button class="cart-qty-btn" data-index="${index}" data-action="plus">+</button>
                    </div>
                </div>
                <div class="cart-item-remove" data-index="${index}"><i class="fa-solid fa-trash-can"></i></div>
            `;
            cartItems.appendChild(div);

            subtotal += (item.price || 0) * (item.qty || 1);
        });

        if (cartSubtotal) cartSubtotal.innerText = `$${subtotal}`;
        if (cartTotal) cartTotal.innerText = `$${subtotal}`;
        if (cartCountEl) cartCountEl.innerText = cart.reduce((sum, i) => sum + (i.qty || 1), 0);

        document.querySelectorAll(".cart-qty-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const idx = parseInt(btn.dataset.index);
                if (btn.dataset.action === "plus") {
                    cart[idx].qty = (cart[idx].qty || 1) + 1;
                } else {
                    cart[idx].qty = (cart[idx].qty || 1) - 1;
                    if (cart[idx].qty < 1) {
                        cart.splice(idx, 1);
                    }
                }
                localStorage.setItem("cart", JSON.stringify(cart));
                renderCart();
            });
        });

        document.querySelectorAll(".cart-item-remove").forEach(btn => {
            btn.addEventListener("click", () => {
                const idx = parseInt(btn.dataset.index);
                cart.splice(idx, 1);
                localStorage.setItem("cart", JSON.stringify(cart));
                renderCart();
            });
        });
    }

    renderCart();

});
