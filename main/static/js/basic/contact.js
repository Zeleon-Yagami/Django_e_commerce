document.addEventListener("DOMContentLoaded", () => {

    const contactForm = document.querySelector(".contact-form");

    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            const name = contactForm.querySelector('input[name="name"]');
            const email = contactForm.querySelector('input[name="email"]');
            const msg = contactForm.querySelector('textarea[name="msg"]');

            if (name && name.value.trim() === '') {
                e.preventDefault();
                alert('Please enter your name');
                name.focus();
                return;
            }
            if (email && email.value.trim() === '') {
                e.preventDefault();
                alert('Please enter your email');
                email.focus();
                return;
            }
            if (email && !email.value.includes('@')) {
                e.preventDefault();
                alert('Please enter a valid email address');
                email.focus();
                return;
            }
            if (msg && msg.value.trim() === '') {
                e.preventDefault();
                alert('Please enter your message');
                msg.focus();
                return;
            }
            const button = document.querySelector(".contact-btn");
            if (button) {
                button.innerText = "Sending...";
                button.disabled = true;
            }
        });
    }

});
