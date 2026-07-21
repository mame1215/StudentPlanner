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

const eventRepeatType =
    document.getElementById("eventRepeatType");

const repeatOptions =
    document.getElementById("repeatOptions");

const eventRepeatInterval =
    document.getElementById("eventRepeatInterval");

const repeatIntervalLabel =
    document.getElementById("repeatIntervalLabel");

const repeatWeekdays =
    document.getElementById("repeatWeekdays");

const singleDateInputs =
    document.getElementById(
        'singleDateInputs'
    );

const repeatTimeInputs =
    document.getElementById(
        'repeatTimeInputs'
    );

const eventStartTime =
    document.getElementById(
        'eventStartTime'
    );

const eventEndTime =
    document.getElementById(
        'eventEndTime'
    );



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

const editSingleDateInputs =
    document.getElementById(
        'editSingleDateInputs'
    );

const editRepeatTimeInputs =
    document.getElementById(
        'editRepeatTimeInputs'
    );

const editEventStartTime =
    document.getElementById(
        'editEventStartTime'
    );

const editEventEndTime =
    document.getElementById(
        'editEventEndTime'
    );

const saveEventButton =
    document.getElementById("saveEventButton");

const cancelEventButton =
    document.getElementById("cancelEventButton");

const editEventRepeatType = document.getElementById("editEventRepeatType");
const editRepeatOptions = document.getElementById("editRepeatOptions");
const editEventRepeatInterval = document.getElementById("editEventRepeatInterval");
const editRepeatIntervalLabel = document.getElementById("editRepeatIntervalLabel");
const editRepeatWeekdays = document.getElementById("editRepeatWeekdays");

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

    const repeating =
        eventRepeatType.value !== 'none';

    let start;
    let end;

    if (repeating) {

        const today = new Date();

        const datePart =
            today.toISOString().slice(0, 10);

        start =
            `${datePart}T${eventStartTime.value}`;

        end =
            `${datePart}T${eventEndTime.value}`;

    } else {

        start = eventStartInput.value;

        end = eventEndInput.value;

    }

    return {

        title:
            eventTitleInput.value.trim(),

        start,

        end,

        allDay: false,

        subjectId:
            getSelectedSubject(eventSubjectInput),

        tagIds:
            getSelectedTagIds(eventTagInput),

        items:
            [...eventItems],

        memo:
            eventMemoInput.value.trim(),

        repeat: {
            enabled: eventRepeatType.value !== "none",
            frequency: eventRepeatType.value,
            interval: Number(eventRepeatInterval.value),
            weekdays:
                [...repeatWeekdays.querySelectorAll("input:checked")].map(input => Number(input.value))
        }

    };

}

function getEditEventFormData() {

    const repeating =
        editEventRepeatType.value !== 'none';

    let start;
    let end;

    if (repeating) {

        const originalDate =
            editEventStart.value.slice(0, 10);

        start =
            `${originalDate}T${editEventStartTime.value}`;

        end =
            `${originalDate}T${editEventEndTime.value}`;

    } else {

        start = editEventStart.value;

        end = editEventEnd.value;

    }

    return {

        title:
            editEventTitle.value.trim(),

        start,

        end,

        allDay: false,

        subjectId:
            getSelectedSubject(editEventSubject),

        tagIds:
            getSelectedTagIds(editEventTagInput),

        items:
            [...editEventItems],

        memo:
            editEventMemo.value.trim(),

        repeat: {
            enabled: editEventRepeatType.value !== "none",
            frequency: editEventRepeatType.value,
            interval: Number(editEventRepeatInterval.value),
            weekdays:
                [...editRepeatWeekdays.querySelectorAll("input:checked")].map(input => Number(input.value))
        }

    };

}

function clearEventForm() {

    eventTitleInput.value = "";

    eventStartInput.value = "";

    eventEndInput.value = "";

    eventStartTime.value = '16:00';
    eventEndTime.value = '18:00';

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

    eventRepeatType.value = "none";

    eventRepeatInterval.value = 1;

    repeatWeekdays
        .querySelectorAll("input")
        .forEach(
            input => input.checked = false
        );

    updateRepeatOptions();

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

    refreshItems();
    refreshHome();

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

        memo: form.memo,

        repeat: form.repeat

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

    event.repeat = form.repeat;

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

    const repeat =

        event.repeat

        ??

        {

            enabled: false,

            frequency: "none",

            interval: 1,

            weekdays: []

        };

    editEventRepeatType.value =
        repeat.frequency;

    editEventRepeatInterval.value =
        repeat.interval;

    if (repeat.enabled) {

        const startDate = new Date(event.start);
        const endDate = new Date(event.end);

        editEventStartTime.value =
            `${String(startDate.getHours()).padStart(2, '0')}:` +
            `${String(startDate.getMinutes()).padStart(2, '0')}`;

        editEventEndTime.value =
            `${String(endDate.getHours()).padStart(2, '0')}:` +
            `${String(endDate.getMinutes()).padStart(2, '0')}`;

    }

    editRepeatWeekdays

        .querySelectorAll("input")

        .forEach(

            input =>

                input.checked =

                    repeat.weekdays.includes(

                        Number(input.value)

                    )

        );

    updateEditRepeatOptions();

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

        refreshItems();
        refreshHome();
    });

    editButton.addEventListener("click", () => {

        openEditEventModal(event);

    });

    return actions;

}

function updateRepeatOptions() {

    const type = eventRepeatType.value;

    // 繰り返しなし
    if (type === 'none') {

        // 日時入力を表示
        singleDateInputs.classList.remove('hidden');

        // 繰り返し関連を非表示
        repeatOptions.classList.add('hidden');
        repeatTimeInputs.classList.add('hidden');
        repeatWeekdays.classList.add('hidden');

        return;

    }

    // 繰り返しあり

    // 日時入力を非表示
    singleDateInputs.classList.add('hidden');

    // 繰り返し設定を表示
    repeatOptions.classList.remove('hidden');
    repeatTimeInputs.classList.remove('hidden');

    // 曜日は毎週のときだけ表示
    if (type === 'week') {

        repeatWeekdays.classList.remove('hidden');

    } else {

        repeatWeekdays.classList.add('hidden');

    }

    const labels = {

        day: '日ごと',

        week: '週間ごと',

        month: 'か月ごと',

        year: '年ごと'

    };

    repeatIntervalLabel.textContent =
        labels[type] ?? '日ごと';

}

function updateEditRepeatOptions() {

    const type = editEventRepeatType.value;

    // 繰り返しなし
    if (type === 'none') {

        editSingleDateInputs.classList.remove('hidden');

        editRepeatOptions.classList.add('hidden');
        editRepeatTimeInputs.classList.add('hidden');
        editRepeatWeekdays.classList.add('hidden');

        return;

    }

    // 繰り返しあり
    editSingleDateInputs.classList.add('hidden');

    editRepeatOptions.classList.remove('hidden');
    editRepeatTimeInputs.classList.remove('hidden');

    if (type === 'week') {

        editRepeatWeekdays.classList.remove('hidden');

    } else {

        editRepeatWeekdays.classList.add('hidden');

    }

    const labels = {

        day: '日ごと',

        week: '週間ごと',

        month: 'か月ごと',

        year: '年ごと'

    };

    editRepeatIntervalLabel.textContent =
        labels[type] ?? '日ごと';

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

    refreshItems();
    refreshHome();

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

    eventRepeatType.addEventListener(

        "change",

        updateRepeatOptions

    );
    updateRepeatOptions();
    editEventRepeatType.addEventListener("change", updateEditRepeatOptions);
    updateEditRepeatOptions();
}