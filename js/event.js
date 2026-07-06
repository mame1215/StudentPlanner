const eventList = document.getElementById("eventList");
const openAddEventButton = document.getElementById("openAddEventButton");

const eventTitleInput =
    document.getElementById("eventTitleInput");

const eventStartInput =
    document.getElementById("eventStartInput");

const eventEndInput =
    document.getElementById("eventEndInput");

const eventSubjectInput =
    document.getElementById("eventSubjectInput");

const eventTagInput =
    document.getElementById("eventTagInput");

const eventMemoInput =
    document.getElementById("eventMemoInput");

const eventItemList =
    document.getElementById("eventItemList");

const eventItemInput =
    document.getElementById("eventItemInput");

const eventAddItemButton =
    document.getElementById("eventAddItemButton");

const addEventButton =
    document.getElementById("addEventButton");

function saveEvents() {

    localStorage.setItem(
        "events",
        JSON.stringify(events)
    );

}

function loadEvents() {

    const data =
        localStorage.getItem("events");

    if (data !== null) {

        events = JSON.parse(data);

    }

}

function addEvent(form) {

    events.push({

        id: Date.now(),

        title: form.title,

        start: form.start,

        end: form.end,

        allDay: form.allDay,

        subjectId: form.subjectId,

        tagIds: form.tagIds,

        items: [...form.items],

        memo: form.memo

    });

    saveEvents();
}

function updateEvent(id, form) {

    const event = events.find(
        event => event.id === id
    );

    if (!event) {
        return;
    }

    event.title = form.title;
    event.start = form.start;
    event.add = form.end;
    event.allDay = form.allDay;
    event.subjectId = form.subjectId;
    event.tagIds = form.tagIds;
    event.items = [...form.items];
    event.memo = form.memo;

    saveEvents();

}

function deleteEvent(id) {

    events = events.filter(
        event => event.id !== id
    );

    saveEvents();

}

function renderEvents(eventArray) {

    eventList.innerHTML = "";

    for (const event of eventArray) {

        eventList.appendChild(
            createEventElement(event)
        );

    }

}

function createEventElement(event) {

    const li = document.createElement("li");

    li.appendChild(
        createEventContent(event)
    );

    li.appendChild(
        createEventActions(event)
    );

    return li;

}

function createEventDate(event) {

    const date = document.createElement("div");

    date.classList.add("task-due");

    if (!event.start) {

        return date;

    }

    const start = new Date(event.start);

    let text =
        "📅 "
        + (start.getMonth() + 1)
        + "/"
        + start.getDate()
        + " "
        + String(start.getHours()).padStart(2, "0")
        + ":"
        + String(start.getMinutes()).padStart(2, "0");

    if (event.end) {

        const end = new Date(event.end);

        text +=
            " ～ "
            + String(end.getHours()).padStart(2, "0")
            + ":"
            + String(end.getMinutes()).padStart(2, "0");

    }

    date.textContent = text;

    return date;

}

function createEventLabels(event) {

    const labels = document.createElement("div");

    labels.classList.add("task-labels");

    addTagLabels(labels, event);

    addSubjectLabel(labels, event);

    return labels;

}

function createEventContent(event) {

    const content = document.createElement("div");

    content.classList.add("task-content");

    const labels = createEventLabels(event);

    const titles = createTitle(labels, event);

    content.appendChild(titles.titleRow);

    content.appendChild(
        createEventDate(event)
    );

    createMemo(content, event);

    return content;
}

function createEventActions(event) {

    const actions =
        document.createElement("div");

    actions.classList.add("task-actions");

    const editButton =
        document.createElement("button");

    const deleteButton =
        document.createElement("button");

    editButton.textContent = "🖋️";

    deleteButton.textContent = "🗑";

    actions.appendChild(editButton);

    actions.appendChild(deleteButton);

    return actions;

}





function initializeEvent() {
    loadEvents();

    loadSubjects(eventSubjectInput);

    loadTags(eventTagInput);

    renderEvents(events);
}