setTimeout(() => {
    const msg = document.getElementById('hideMsg');
    if (msg) {
        msg.style.display = 'none';
    }
}, 3000);


document.addEventListener(
    "DOMContentLoaded",

    () => {

        const form =
            document.querySelector(
                ".reg-form"
            );

        const password =
            document.getElementById(
                "regPassword"
            );

        const confirm =
            document.getElementById(
                "regConfirm"
            );

        const message =
            document.getElementById(
                "regMessage"
            );

        if (form) {

            form.addEventListener(

                "submit",

                (e) => {

                    e.preventDefault();

                    message.innerHTML = "";

                    if (
                        password.value
                        !==

                        confirm.value
                    ) {

                        message.innerHTML =
                            "Passwords do not match";

                        message.style.color =
                            "#e53935";

                        return;

                    }

                    message.innerHTML =
                        "Account Ready ✓";

                    message.style.color =
                        "green";

                });

        }

    });


