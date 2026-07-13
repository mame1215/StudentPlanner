//初期化処理
initializeSettings();
initializeTodo();
initializeEvent();
initializeItem();
initializeHome();

const tabButtons = document.querySelectorAll(".tab-button");
const pages = {

    home: document.getElementById("homePage"),

    todo: document.getElementById("todoPage"),

    event: document.getElementById("eventPage"),

    item: document.getElementById("itemPage"),

    settings: document.getElementById("settingsPage")
};

tabButtons.forEach(button => {

    button.addEventListener("click", () => {

        tabButtons.forEach(tab =>
            tab.classList.remove("active")
        );

        button.classList.add("active");

        Object.values(pages).forEach(page =>
            page.classList.remove("active")
        );

        pages[
            button.dataset.tab
        ].classList.add("active");
    });
});

document.querySelectorAll(".collapse-button").forEach(button => {
    button.addEventListener("click", () => {
        const area = document.getElementById(button.dataset.target);

        const hidden = area.classList.toggle("collapsed");

        button.textContent =
            hidden
                ? "▶ " +
                    button.textContent.slice(2)

                : "▼ " +
                    button.textContent.slice(2);
    });
});