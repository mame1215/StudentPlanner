let eventItems = [];

let previousEventSubjectId = "";

let editEventItems = [];

let previousEditEventSubjectId = "";

let editingEventId = null;

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



const eventModal =
    document.getElementById("eventModal");

const editEventTitle =
    document.getElementById("editEventTitle");

const editEventStart =
    document.getElementById("editEventStart");

const editEventEnd =
    document.getElementById("editEventEnd");

const editEventSubject =
    document.getElementById("editEventSubject");

const editEventTagInput =
    document.getElementById("editEventTagInput");

const editEventMemo =
    document.getElementById("editEventMemo");

const editEventItemList =
    document.getElementById("editEventItemList");

const editEventItemInput =
    document.getElementById("editEventItemInput");

const editEventAddItemButton =
    document.getElementById("editEventAddItemButton");

const saveEventButton =
    document.getElementById("saveEventButton");

const cancelEventButton =
    document.getElementById("cancelEventButton");

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

function getEventFormData() {

    return {

        title:
            eventTitleInput.value.trim(),

        start:
            eventStartInput.value,

        end:
            eventEndInput.value,

        allDay: false,

        subjectId:
            getSelectedSubject(eventSubjectInput),

        tagIds:
            getSelectedTagIds(eventTagInput),

        items:
            [...eventItems],

        memo:
            eventMemoInput.value.trim()

    };

}

function getEditEventFormData() {

    return {

        title:
            editEventTitle.value.trim(),

        start:
            editEventStart.value,

        end:
            editEventEnd.value,

        allDay: false,

        subjectId:
            getSelectedSubject(editEventSubject),

        tagIds:
            getSelectedTagIds(editEventTagInput),

        items:
            [...editEventItems],

        memo:
            editEventMemo.value.trim()

    };

}

function clearEventForm() {

    eventTitleInput.value = "";

    eventStartInput.value = "";

    eventEndInput.value = "";

    eventSubjectInput.value = "";

    eventMemoInput.value = "";

    eventItems.length = 0;

    renderItemList(
        eventItemList,
        eventItems
    );

    const checkedTags =
        eventTagInput.querySelectorAll("input:checked");

    for (const checkbox of checkedTags) {

        checkbox.checked = false;

    }

}

async function submitEvent() {

    const form = getEventFormData();

    if (
        form.start &&
        form.end &&
        new Date(form.start) > new Date(form.end)
    ) {
        
        await showConfirmDialog(
            "開始日時は終了日時以前にしてください。",
            false
        );

        return;

    }

    if (form.title === "") {

        return;

    }

    addEvent(form);

    renderEvents(events);

    clearEventForm();

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

function updateEvent(event, form) {

    event.title = form.title;

    event.start = form.start;

    event.end = form.end;

    event.allDay = form.allDay;

    event.subjectId = form.subjectId;

    event.tagIds = form.tagIds;

    event.items = [...form.items];

    event.memo = form.memo;

}

function deleteEvent(id) {

    events = events.filter(
        event => event.id !== id
    );

    saveEvents();

}

function openEditEventModal(event) {

    editingEventId = event.id;

    editEventTitle.value = event.title;

    editEventStart.value = event.start;

    editEventEnd.value = event.end;

    editEventSubject.value =
        event.subjectId ?? "";

    editEventMemo.value = event.memo;

    editEventItems.length = 0;

    editEventItems.push(...event.items);

    renderItemList(
        editEventItemList,
        editEventItems
    );

    const checkboxes =
        editEventTagInput.querySelectorAll("input");

    for (const checkbox of checkboxes) {

        checkbox.checked =
            event.tagIds.includes(
                Number(checkbox.value)
            );

    }

    previousEditEventSubjectId =
        editEventSubject.value;

    editEventTitle.focus();

    editEventTitle.select();

    eventModal.classList.remove("hidden");

}

function closeEditEventModal() {

    eventModal.classList.add("hidden");

    editingEventId = null;

    document.activeElement.blur();

}

function sortEvents(eventArray) {

    const sortedEvents = [...eventArray];

    sortedEvents.sort((a, b) => {

        if (!a.start && !b.start) {
            return 0;
        }

        if (!a.start) {
            return 1;
        }

        if (!b.start) {
            return -1;
        }

        return new Date(a.start) - new Date(b.start);

    });

    return sortedEvents;

}

function renderEvents(eventArray) {

    const sortedEvents =
        sortEvents(eventArray);

    eventList.innerHTML = "";

    for (const event of sortedEvents) {

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

    const title = createTitle(labels, event);

    content.appendChild(title.titleRow);

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

    deleteButton.addEventListener("click", () => {

        deleteEvent(event.id);

        renderEvents(events);
    });

    editButton.addEventListener("click", () => {

        openEditEventModal(event);

    });

    return actions;

}



eventAddItemButton.addEventListener("click", () => {

    addItem(
        eventItemInput,
        eventItems,
        eventItemList
    );

});

eventSubjectInput.addEventListener("change", async () => {

    await handleSubjectChange(

        eventSubjectInput,

        eventItems,

        eventItemList,

        previousEventSubjectId,

        value => previousEventSubjectId = value

    );

});

addEventButton.addEventListener("click", () => {

    submitEvent();

});

eventTitleInput.addEventListener("keydown", async event => {

    if (event.key === "Enter") {

        await submitEvent();

    }
})

saveEventButton.addEventListener("click", async () => {

    const event = events.find(
        event => event.id === editingEventId
    );

    if (!event) {

        return;

    }

    const form = getEditEventFormData();

    if (
        form.start &&
        form.end &&
        new Date(form.start) > new Date(form.end)
    ) {

        await showConfirmDialog(
            "開始日時は終了日時以前にしてください。",
            false
        );

        return;
    }

    updateEvent(
        event,
        form
    );

    saveEvents();

    renderEvents(events);

    closeEditEventModal();

});

cancelEventButton.addEventListener("click", () => {

    closeEditEventModal();

});

eventModal.addEventListener("click", event => {

    if (event.target === eventModal) {

        closeEditEventModal();

    }

});

editEventAddItemButton.addEventListener("click", () => {

    addItem(

        editEventItemInput,

        editEventItems,

        editEventItemList

    );

});

editEventSubject.addEventListener("change", async () => {

    await handleSubjectChange(

        editEventSubject,

        editEventItems,

        editEventItemList,

        previousEditEventSubjectId,

        value => previousEditEventSubjectId = value

    );

});

function initializeEvent() {
    loadEvents();

    loadSubjects(eventSubjectInput);
    loadSubjects(editEventSubject);

    loadTags(eventTagInput);
    loadTags(editEventTagInput);

    renderEvents(events);
}