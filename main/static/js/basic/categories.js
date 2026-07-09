const cards = document.querySelectorAll(".category-card");

cards.forEach(card => {
    card.addEventListener("click", () => {
        const anchor = card.closest('a');
        if (anchor && anchor.href) {
            window.location.href = anchor.href;
        }
    });
});