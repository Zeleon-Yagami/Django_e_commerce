document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll(".cat-card");
    cards.forEach(card => {
        card.addEventListener("click", () => {
            const anchor = card.closest('a');
            if (anchor && anchor.href) {
                window.location.href = anchor.href;
            }
        });
    });
});
