function getCSRFToken() {
    let cookie = document.cookie.split('; ').find(r => r.startsWith('csrftoken'));
    return cookie ? cookie.split('=')[1] : '';
}

// ===== WISHLIST (localStorage) =====

function getWishlist() {
    return JSON.parse(localStorage.getItem('wishlist')) || [];
}

function saveWishlist(wishlist) {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

function isInWishlist(name) {
    return getWishlist().some(item => item.name === name);
}

function toggleWishlist(icon, card) {
    if (!card) return;

    // Extract product info from the card
    const nameEl = card.querySelector('.fashion-name, .arrival-product-title, .deal-product-title, h3, h4');
    const name = nameEl ? nameEl.innerText.trim() : null;
    if (!name) return;

    const priceEl = card.querySelector('.fashion-price, .arrival-price, .price')
                 || card.querySelector('.deal-price');
    let price = 0;
    if (priceEl) {
        let priceText = priceEl.innerText;
        const oldPriceEl = priceEl.querySelector('.deal-old-price');
        if (oldPriceEl) {
            priceText = priceText.replace(oldPriceEl.innerText, '');
        }
        const matches = priceText.match(/\$(\d+)/g);
        if (matches && matches.length > 0) {
            price = parseInt(matches[matches.length - 1].replace('$', '')) || 0;
        }
    }

    const imgEl = card.querySelector('img');
    const img = imgEl ? imgEl.src : '';

    let wishlist = getWishlist();
    const existingIndex = wishlist.findIndex(item => item.name === name);

    if (existingIndex > -1) {
        // Remove from wishlist
        wishlist.splice(existingIndex, 1);
        icon.classList.remove('fa-solid');
        icon.classList.add('fa-regular');
        icon.style.color = '';
    } else {
        // Add to wishlist
        wishlist.push({ name, price, image: img });
        icon.classList.remove('fa-regular');
        icon.classList.add('fa-solid');
        icon.style.color = '#d4af37';
    }

    saveWishlist(wishlist);
    updateWishlistCount();
}

function updateWishlistCount() {
    const wishlist = getWishlist();
    const el = document.getElementById('wishlist-count');
    if (el) {
        el.innerText = wishlist.length;
        el.style.display = wishlist.length > 0 ? '' : 'none';
    }
}

// Sync heart icons on page load — fill hearts for items already in wishlist
function updateWishlistIcons() {
    const wishlist = getWishlist();
    const wishlistNames = wishlist.map(item => item.name);

    document.querySelectorAll('.product-card, .fashion-card, .arrival-card, .deal-card').forEach(card => {
        const nameEl = card.querySelector('.fashion-name, .arrival-product-title, .deal-product-title, h3, h4');
        if (!nameEl) return;
        const name = nameEl.innerText.trim();
        const icon = card.querySelector('.wishlist i');
        if (!icon) return;

        if (wishlistNames.includes(name)) {
            icon.classList.remove('fa-regular');
            icon.classList.add('fa-solid');
            icon.style.color = '#d4af37';
        } else {
            icon.classList.remove('fa-solid');
            icon.classList.add('fa-regular');
            icon.style.color = '';
        }
    });
}

// ===== CART =====

function addToCart(button) {
    const card = button.closest('.product-card, .fashion-card, .arrival-card, .deal-card, .wish-card');
    if (!card) return;

    const nameEl = card.querySelector('.fashion-name, .arrival-product-title, .deal-product-title, .wish-name, h3, h4');
    const name = nameEl ? nameEl.innerText.trim() : 'Product';

    const priceEl = card.querySelector('.fashion-price, .arrival-price, .wish-price, .price')
                 || card.querySelector('.deal-price');
    let price = 0;
    if (priceEl) {
        let priceText = priceEl.innerText;
        const oldPriceEl = priceEl.querySelector('.deal-old-price');
        if (oldPriceEl) {
            priceText = priceText.replace(oldPriceEl.innerText, '');
        }
        const matches = priceText.match(/\$(\d+)/g);
        if (matches && matches.length > 0) {
            price = parseInt(matches[matches.length - 1].replace('$', '')) || 0;
        }
    }

    const imgEl = card.querySelector('img');
    const img = imgEl ? imgEl.src : '';

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existing = cart.find(i => i.name === name);
    if (existing) {
        existing.qty = (existing.qty || 1) + 1;
    } else {
        cart.push({ name, price, image: img, qty: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    button.dataset.originalText = button.dataset.originalText || button.innerText;
    button.innerText = 'Added ✓';
    button.style.background = '#2e7d32';
    button.style.color = '#fff';
    setTimeout(() => {
        button.innerText = button.dataset.originalText || 'Add To Cart';
        button.style.background = '';
        button.style.color = '';
    }, 1000);
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const count = cart.reduce((sum, i) => sum + (i.qty || 1), 0);
    const cartCountEl = document.getElementById('cart-count');
    if (cartCountEl) cartCountEl.innerText = count;
}

// ===== INIT =====

document.addEventListener("DOMContentLoaded", () => {

    const mobileBtn = document.getElementById("mobileMenuBtn");
    const navLinks = document.getElementById("navLinks");

    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener("click", () => {
            navLinks.classList.toggle("active");
        });
    }

    const hideMsg = document.getElementById('hideMsg');
    if (hideMsg) {
        setTimeout(() => { hideMsg.style.display = 'none'; }, 3000);
    }

    updateCartCount();
    updateWishlistCount();
    updateWishlistIcons();

    // ===== SEARCH BAR FUNCTIONALITY =====
    const searchToggle = document.getElementById('searchToggle');
    const searchOverlay = document.getElementById('searchOverlay');
    const searchInput = document.getElementById('searchInput');
    const searchClose = document.getElementById('searchClose');

    if (searchToggle && searchOverlay) {
        searchToggle.addEventListener('click', (e) => {
            e.preventDefault();
            searchOverlay.classList.add('active');
            if (searchInput) searchInput.focus();
        });

        if (searchClose) {
            searchClose.addEventListener('click', () => {
                searchOverlay.classList.remove('active');
                if (searchInput) searchInput.value = '';
            });
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
                searchOverlay.classList.remove('active');
                if (searchInput) searchInput.value = '';
            }
        });

        searchOverlay.addEventListener('click', (e) => {
            if (e.target === searchOverlay) {
                searchOverlay.classList.remove('active');
                if (searchInput) searchInput.value = '';
            }
        });

        const searchForm = document.getElementById('searchForm');
        if (searchForm) {
            searchForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const query = searchInput.value.trim();
                if (query) {
                    window.location.href = `/fashion/?search=${encodeURIComponent(query)}`;
                }
            });
        }
    }

});
