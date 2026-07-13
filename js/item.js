let itemOverrides = [];

const itemPageContainer =
    document.getElementById(
        "itemPageContainer"
    );

const ITEM_SOURCE = {

    TODO: "todo",

    EVENT: "event",

    TIMETABLE: "timetable"

};

function getItemDates(days = 30) {

    const dates = [];

    const today = new Date();

    today.setHours(

        0,

        0,

        0,

        0

    );

    for (

        let i = 0;

        i < days;

        i++

    ) {

        const date =

            new Date(today);

        date.setDate(

            today.getDate() + i

        );

        const items =

            collectItemsForDate(date);

        if (

            items.length > 0

        ) {

            dates.push(date);

        }

    }

    const hasUndated =

        tasks.some(task =>

            !task.due &&

            task.items.length > 0

        )

        ||

        events.some(event =>

            !event.start &&

            event.items.length > 0

        );

    return {

        dates,

        hasUndated

    };

}

function formatItemDate(dateString) {

    const today = new Date();

    const target =
        new Date(dateString);

    if (

        isSameDate(
            dateString,
            today
        )

    ) {

        return "今日";

    }

    const tomorrow =
        new Date(today);

    tomorrow.setDate(
        tomorrow.getDate() + 1
    );

    if (

        isSameDate(
            dateString,
            tomorrow
        )

    ) {

        return "明日";

    }

    return (

        target.getMonth() + 1

    )

        + "/"

        + target.getDate();

}

function collectItems() {

    const items = [];

    for (const task of tasks) {

        items.push(...task.items);

    }

    for (const event of events) {

        items.push(...event.items);

    }

    for (const subject of subjects) {

        items.push(...subject.defaultItems);

    }

    return items;
}

function collectItemsForDate(date) {

    const collectedItems = [];

    for (const task of tasks) {

        if (task.items.length === 0) {

            continue;

        }

        if (!isSameDate(task.due, date)) {

            continue;

        }

        collectedItems.push({

            source: ITEM_SOURCE.TODO,

            subject:
                subjects.find(

                    subject =>
                        subject.id ===
                        task.subjectId

                ) ?? null,

            title: task.title,

            items: task.items.map(name => ({
                name,

                removed: false,

                added: false
            })),

            data:
                task

        });

    }

    for (const event of events) {

        if (event.items.length === 0) {

            continue;

        }

        if (!isSameDate(event.start, date)) {

            continue;

        }

        collectedItems.push({

            source: ITEM_SOURCE.EVENT,

            subject:
                subjects.find(
                    subject =>
                        subject.id ===
                        event.subjectId

                ) ?? null,

            title: event.title,

            items: event.items.map(name => ({
                name,
                removed:false,
                added:false
            })),

            data:
                event

        });

    }

    for (const timetableItem of getTimetableItemsForDate(date)) {

        collectedItems.push({

            source: ITEM_SOURCE.TIMETABLE,

            subject: timetableItem.subject,

            title: timetableItem.subject.name,

            items: [...timetableItem.items],

            data:
                timetableItem.subject

        });

    }

    return collectedItems;

}

function refreshItems() {

    renderItemPage();
}

function renderItemPage() {

    itemPageContainer.innerHTML = "";

    const {

        dates,

        hasUndated

    } = getItemDates();

    for (

        const date of dates

    ) {

        const details =

            createDateGroup(

                date

            );

        itemPageContainer.appendChild(

            details

        );

    }

    if (

        hasUndated

    ) {

        itemPageContainer.appendChild(

            createUndatedGroup()

        );

    }

}

function isSameDate(dateTime, date) {

    if (!dateTime) {

        return false;

    }

    const target = new Date(dateTime);

    return (

        target.getFullYear() === date.getFullYear() &&

        target.getMonth() === date.getMonth() &&

        target.getDate() === date.getDate()

    );

}

function createDateGroup(date) {

    const details =
        document.createElement(
            "details"
        );

    details.open = true;

    const summary =
        document.createElement(
            "summary"
        );

    summary.textContent =
        formatItemDate(
            date.toISOString()
        );

    details.appendChild(
        summary
    );

    const items =
        collectItemsForDate(date);

    const groups =
        groupItemsBySource(items);

    if (
        groups[ITEM_SOURCE.TIMETABLE].length > 0
    ) {

        details.appendChild(

            createSourceGroup(

                "時間割より",

                groups[ITEM_SOURCE.TIMETABLE],

                date

            )

        );

    }

    if (
        groups[ITEM_SOURCE.TODO].length > 0
    ) {

        details.appendChild(

            createSourceGroup(

                ITEM_SOURCE.TODO,

                groups[ITEM_SOURCE.TODO],

                date

            )

        );

    }

    if (
        groups[ITEM_SOURCE.EVENT].length > 0
    ) {

        details.appendChild(

            createSourceGroup(

                ITEM_SOURCE.EVENT,

                groups[ITEM_SOURCE.EVENT],

                date

            )

        );

    }

    return details;

}

function createSourceGroup(title, entries, date) {

    const details =
        document.createElement(
            "details"
        );

    details.open = true;

    const summary =
        document.createElement(
            "summary"
        );

    summary.textContent = title;

    details.appendChild(summary);

    for (const entry of entries) {

        details.appendChild(
            createEntryGroup(entry, date)
        );

    }

    return details;

}

function createUndatedGroup() {

    const details =
        document.createElement(
            "details"
        );

    details.open = true;

    const summary =
        document.createElement(
            "summary"
        );

    summary.textContent =
        "日付未設定";

    details.appendChild(
        summary
    );

    return details;

}

function createSubjectLabel(

    text,

    color

) {

    const span =
        document.createElement(
            "span"
        );

    span.textContent = text;

    if (color) {

        span.style.color =
            color;

    }

    return span;

}

function createEntryGroup(entry, date) {

    const details =
        document.createElement(
            "details"
        );

    details.open = true;

    const summary =
        document.createElement(
            "summary"
        );

    summary.appendChild(

        createSubjectLabel(

            entry.title,

            entry.subject?.color

        )
    )

    details.appendChild(summary);

    details.appendChild(

        createItemList(
            entry,
            date
        )

    );

    details.appendChild(
        createAddItemArea(entry,date)
    );

    return details;

}

function createItemList(entry, date) {

    const list =
        document.createElement("ul");

    for (const item of entry.items) {

        const li =
            document.createElement("li");

        if (item.removed) {
            li.classList.add("removed-item");
        }

        const text =
            document.createElement("span");

        text.className = "item-name"
        text.textContent = item.name;
        
        if (item.added) {
            text.textContent = item.name + "（追加）";
        }

        li.appendChild(text);

        if (entry.source === ITEM_SOURCE.TIMETABLE) {
            if (item.added) {
                li.appendChild(createDeleteAddedItemButton(entry.subject,item.name,date));
            } else if (item.removed){
                li.appendChild(createRestoreButton(entry.subject,item.name,date));
            } else {
                li.appendChild(createRemoveButton(entry.subject,item.name,date))
            }
        }

        list.appendChild(li);

    }

    return list;

}

function createRemoveButton(
    subject,
    item,
    date
) {

    const button =
        document.createElement(
            "button"
        );

    button.className = "item-action-button item-remove-button";

    button.textContent =
        " ー 不要";

    button.type = "button";

    button.addEventListener(

        "click",

        () => {

            removeTimetableItem(

                subject,

                item,

                date

            );

        }

    );

    return button;

}

function createRestoreButton(
    subject,
    item,
    date
) {

    const button =
        document.createElement(
            "button"
        );

    button.className = "item-action-button item-restore-button";

    button.textContent =
        " ＋ 戻す";

    button.type = "button";

    button.addEventListener(

        "click",

        () => {

            restoreTimetableItem(

                subject,

                item,

                date

            );

        }

    );

    return button;

}

function createDeleteAddedItemButton(
    subject,
    item,
    date
) {

    const button =
        document.createElement(
            "button"
        );

    button.type = "button";

    button.className =
        "item-action-button";

    button.textContent =
        "削除";

    button.addEventListener(

        "click",

        () => {

            removeAddedTimetableItem(

                subject,

                item,

                date

            );

        }

    );

    return button;

}

function removeTimetableItem(
    subject,
    item,
    date
) {

    let override =
        getOrCreateItemOverride(date);

    if (

        !override.removals[
            subject.id
        ]

    ) {

        override.removals[
            subject.id
        ] = [];

    }

    const removals = override.removals[subject.id];

    if (removals.includes(item)){
        return;
    }
    
    removals.push(item);


    saveItemOverrides();

    refreshItems();
    refreshHome();

}

function restoreTimetableItem(
    subject,
    item,
    date
) {

    const override =
        getItemOverride(date);

    if (!override) {

        return;

    }

    const removals =

        override.removals[
            subject.id
        ];

    if (!removals) {

        return;

    }

    override.removals[
        subject.id
    ] = removals.filter(

        removedItem =>

            removedItem !== item

    );

    if (override.removals[subject.id].length === 0) {
        delete override.removals[subject.id];
    }

    if (Object.keys(override.removals).length === 0 && Object.keys(override.additions).length === 0) {
        itemOverrides = itemOverrides.filter(
            itemOverride => itemOverride !== override
        )
    }

    saveItemOverrides();

    refreshItems();
    refreshHome();

}

function removeAddedTimetableItem(
    subject,
    item,
    date
) {

    const override =
        getItemOverride(date);

    if (!override) {

        return;

    }

    const additions =

        override.additions[
            subject.id
        ];

    if (!additions) {

        return;

    }

    override.additions[
        subject.id
    ] = additions.filter(

        addedItem =>

            addedItem !== item

    );

    if (

        override.additions[
            subject.id
        ].length === 0

    ) {

        delete override.additions[
            subject.id
        ];

    }

    if (

        Object.keys(
            override.additions
        ).length === 0 &&

        Object.keys(
            override.removals
        ).length === 0

    ) {

        itemOverrides =
            itemOverrides.filter(

                itemOverride =>

                    itemOverride !== override

            );

    }

    saveItemOverrides();

    refreshItems();
    refreshHome();

}

function groupItemsBySource(items) {

    const groups = {

        [ITEM_SOURCE.TODO]: [],

        [ITEM_SOURCE.EVENT]: [],

        [ITEM_SOURCE.TIMETABLE]: []

    };

    for (const item of items) {

        groups[item.source].push(item);

    }

    return groups;

}

function groupItemsBySubject(items) {

    const groups = new Map();

    for (const item of items) {

        const subjectId =
            item.subject?.id ?? null;

        if (

            !groups.has(
                subjectId
            )

        ) {

            groups.set(

                subjectId,

                {

                    subject:
                        item.subject,

                    entries: []

                }

            );

        }

        groups.get(
            subjectId
        ).entries.push(item);

    }

    return [...groups.values()];

}

function getItemOverride(date) {

    const dateString =

        date instanceof Date

            ? date.toISOString().slice(0, 10)

            : date;

    return itemOverrides.find(

            override =>

                override.date === dateString

        )

        ?? null;

}

function getOrCreateItemOverride(date) {

    const dateString =

        date instanceof Date

            ? date.toISOString().slice(0, 10)

            : date;

    let override =

        itemOverrides.find(

            override =>

                override.date === dateString

        );

    if (override) {

        return override;

    }

    override = {

        date: dateString,

        additions: {},

        removals: {}

    };

    itemOverrides.push(

        override

    );

    saveItemOverrides();

    return override;

}

function saveItemOverrides() {

    localStorage.setItem(

        "itemOverrides",

        JSON.stringify(

            itemOverrides

        )

    );

}

function loadItemOverrides() {

    const data =

        localStorage.getItem(
            "itemOverrides"
        );

    if (data === null) {

        return;

    }

    itemOverrides =

        JSON.parse(data);

}

function applyItemOverride(subject, date) {

    const override =
        getItemOverride(date);

    const removedItems =

        override?.removals[
            subject.id
        ] ?? [];

    const addedItems =

        override?.additions[
            subject.id
        ] ?? [];

    const items = [];

    for (const name of subject.timetableItems ?? []) {

        items.push({

            name,

            removed:
                removedItems.includes(name),

            added: false

        });

    }

    for (const name of addedItems) {

        items.push({

            name,

            removed: false,

            added: true

        });

    }

    return items;

}

function createAddItemArea(
    entry,
    date
) {

    if (
        entry.source !==
        ITEM_SOURCE.TIMETABLE
    ) {

        return document.createDocumentFragment();

    }

    const container =
        document.createElement("div");

    container.className =
        "item-add-area";

    const input =
        document.createElement("input");

    input.type = "text";

    input.placeholder =
        "持ち物を追加";

    input.className =
        "text-input";

    const button =
        document.createElement("button");

    button.type = "button";

    button.classList.add("add-button");

    button.textContent =
        "＋追加";

    button.addEventListener(

        "click",

        () => {

            addTimetableItem(

                entry.subject,

                input.value,

                date

            );

            input.value = "";

        }

    );

    container.append(
        input,
        button
    );

    return container;

}

function addTimetableItem(
    subject,
    item,
    date
) {

    item = item.trim();

    if (item === "") {

        return;

    }

    const override =
        getOrCreateItemOverride(date);

    if ( !override.additions[subject.id]){
        override.additions[subject.id] = [];
    }

    const additions =

        override.additions[
            subject.id
        ];

    if (

        additions.includes(item)

    ) {

        return;

    }

    additions.push(item);

    saveItemOverrides();

    refreshItems();
    refreshHome();

}

function groupItemsForHome(date) {

    const entries =
        collectItemsForDate(date);

    const subjects = new Map();

    for (const entry of entries) {

        const subjectId =
            entry.subject?.id ?? null;

        if (!subjects.has(subjectId)) {

            subjects.set(
                subjectId,
                {

                    subject:
                        entry.subject,

                    items:
                        new Map()

                }

            );

        }

        const subjectGroup =
            subjects.get(subjectId);

        for (const item of entry.items) {

            if (item.removed) {

                continue;

            }

            if (

                !subjectGroup.items.has(
                    item.name
                )

            ) {

                subjectGroup.items.set(

                    item.name,

                    {

                        name:
                            item.name,

                        sources: []

                    }

                );

            }

            subjectGroup.items
                .get(item.name)
                .sources
                .push({

                    source:
                        entry.source,

                    title:
                        entry.title

                });

        }

    }

    return [...subjects.values()].map(

        subjectGroup => ({

            subject:
                subjectGroup.subject,

            items:
                [...subjectGroup.items.values()]

        })

    );

}

function initializeItem() {

    loadItemOverrides();

    refreshItems();

}