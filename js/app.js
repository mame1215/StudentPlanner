//初期化処理
initializeTodo();
initializeEvent();

const tabButtons = document.querySelectorAll(".tab-button");
const pages = {

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