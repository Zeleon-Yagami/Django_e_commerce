document.addEventListener("DOMContentLoaded", () => {

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const checkoutItems = document.getElementById("checkoutItems");
    const checkoutSubtotal = document.getElementById("checkoutSubtotal");
    const checkoutTotal = document.getElementById("checkoutTotal");
    const form = document.getElementById("checkoutForm");
    const message = document.getElementById("checkoutMessage");

    if (cart.length === 0) {
        checkoutItems.innerHTML = '<p style="color:#888;">Your cart is empty. <a href="/shop/" style="color:#d4af37;">Go shopping</a></p>';
        if (checkoutSubtotal) checkoutSubtotal.innerText = "$0";
        if (checkoutTotal) checkoutTotal.innerText = "$0";
        return;
    }

    let subtotal = 0;
    cart.forEach(item => {
        const div = document.createElement("div");
        div.className = "checkout-item";
        div.innerHTML = `<span>${item.name} × ${item.qty || 1}</span><span>$${(item.price || 0) * (item.qty || 1)}</span>`;
        checkoutItems.appendChild(div);
        subtotal += (item.price || 0) * (item.qty || 1);
    });

    checkoutSubtotal.innerText = `$${subtotal}`;
    checkoutTotal.innerText = `$${subtotal}`;

    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();

            const name = form.querySelector('[name="full_name"]').value.trim();
            const email = form.querySelector('[name="email"]').value.trim();
            const phone = form.querySelector('[name="phone"]').value.trim();
            const address = form.querySelector('[name="address"]').value.trim();
            const city = form.querySelector('[name="city"]').value.trim();

            if (!name || !email || !phone || !address || !city) {
                message.innerHTML = "Please fill in all required fields.";
                message.style.color = "#e53935";
                return;
            }
            if (!email.includes("@")) {
                message.innerHTML = "Enter a valid email address.";
                message.style.color = "#e53935";
                return;
            }

            localStorage.removeItem("cart");
            const btn = form.querySelector(".checkout-place-btn");
            btn.disabled = true;
            btn.innerText = "Order Placed ✓";

            message.innerHTML = `Thank you, ${name}! Your order has been placed successfully.`;
            message.style.color = "green";
            checkoutItems.innerHTML = "";
            checkoutSubtotal.innerText = "$0";
            checkoutTotal.innerText = "$0";
            updateCartCount();
        });
    }

});
