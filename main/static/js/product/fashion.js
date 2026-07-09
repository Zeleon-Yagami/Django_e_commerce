document.addEventListener(
    "DOMContentLoaded",

    () => {

        const buttons =
            document.querySelectorAll(
                ".fashion-btn"
            );

        buttons.forEach(btn => {

            btn.addEventListener(
                "click",

                () => {

                    btn.innerText =
                        "Added ✓";

                    btn.disabled =
                        true;

                });

        });

        const filters =
            document.querySelectorAll(
                ".fashion-filter-btn"
            );

        filters.forEach(filter => {

            filter.addEventListener(
                "click",

                () => {

                    filters.forEach(
                        f => f.classList.remove(
                            "active"
                        )
                    );

                    filter.classList.add(
                        "active"
                    );

                });

        });

    });