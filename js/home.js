const homeSchedule = document.getElementById("homeSchedule");
const homeEvents = document.getElementById("homeEvents");
const homeTimetables = document.getElementById("homeTimetables");
const homePlannedTasks = document.getElementById("homePlannedTasks");
const homeCalendar = document.getElementById("homeCalendar");
const calendarTitle = document.getElementById("calendarTitle");
const prevMonth = document.getElementById("prevMonth");
const nextMonth = document.getElementById("nextMonth");
const selectedDateSchedule = document.getElementById("selectedDateSchedule");
const todayButton = document.getElementById("todayButton");
const homeItemsTitle = document.getElementById("homeItemsTitle");

const MAX_CALENDAR_ENTRIES = 3;

let calendarDate = new Date();

let selectedDate = null;

let holidays = {};


async function loadHolidays() {
    const response = await fetch("https://holidays-jp.github.io/api/v1/date.json");
    holidays = await response.json();
}

function getHolidayName(date) {
    return holidays[formatDateKey(date)] ?? null;
}


function getTodayTasks() {

    const today =
        new Date();

    return tasks.filter(task =>

        !task.completed &&

        isSameDate(
            task.due,
            today
        )

    );

}

function groupTodayTasksBySubject() {

    const groups =
        new Map();

    for (const task of getTodayTasks()) {

        const subjectId =
            task.subjectId;

        if (

            !groups.has(subjectId)

        ) {

            groups.set(

                subjectId,

                {

                    subject:

                        subjects.find(

                            subject =>

                                subject.id ===
                                subjectId

                        ) ?? null,

                    tasks: []

                }

            );

        }

        groups.get(subjectId)
            .tasks
            .push(task);

    }

    return [...groups.values()];

}

function getTodayEvents() {

    const today =
        new Date();

    return events.filter(event =>

        isSameDate(
            event.start,
            today
        )

    );

}

function groupTodayEventsBySubject() {

    const groups =
        new Map();

    for (const event of getTodayEvents()) {

        const subjectId =
            event.subjectId;

        if (

            !groups.has(subjectId)

        ) {

            groups.set(

                subjectId,

                {

                    subject:

                        subjects.find(

                            subject =>

                                subject.id ===
                                subjectId

                        ) ?? null,

                    events: []

                }

            );

        }

        groups.get(subjectId)
            .events
            .push(event);

    }

    return [...groups.values()];

}

function getTodayTimetable() {

    return getSubjectsForDate(
        new Date()
    );

}

function getScheduleEntries(
    startDate,
    endDate
) {

    const entries = [];

    // イベント
    const rangeEvents =
        getEventsInRange(
            startDate,
            endDate
        );

    for (const event of rangeEvents) {

        entries.push({

            type: 'event',

            subject:
                subjects.find(
                    subject =>
                        subject.id ===
                        event.subjectId
                ) ?? null,

            title: event.title,

            start: event.start,

            end: event.end,

            data:event/*
                events.find(
                    e => e.id === event.originalId
                ) ?? event*/

        });

    }

    // Todo
    for (const task of tasks) {

        if (
            !task.due ||
            !isDateInRange(
                task.due,
                startDate,
                endDate
            )
        ) {

            continue;

        }

        entries.push({

            type: 'todo',

            subject:
                subjects.find(
                    subject =>
                        subject.id ===
                        task.subjectId
                ) ?? null,

            title: task.title,

            due: task.due,

            completed: task.completed,

            data: task

        });

    }

    entries.sort(compareScheduleEntry);

    return entries;

}

function getTodaySchedule() {

    const today =
        new Date();

    return getScheduleEntries(

        today,

        today

    );

}

function getTodayPlannedTasks() {
    const today = new Date();

    return tasks.filter(task =>
        !task.completed &&
        isDateInRange(
            today,
            task.plan.start,
            task.plan.end
        )
    );
}

function groupTodayPlannedTasks() {

    const groups =
        new Map();

    for (const task of getTodayPlannedTasks()) {

        const subjectId =
            task.subjectId;

        if (

            !groups.has(subjectId)

        ) {

            groups.set(

                subjectId,

                {

                    subject:

                        subjects.find(

                            subject =>

                                subject.id ===
                                subjectId

                        ) ?? null,

                    tasks: []

                }

            );

        }

        groups.get(subjectId)
            .tasks
            .push(task);

    }

    return [...groups.values()];

}

function getCalendarDates(
    year,
    month
) {

    const dates = [];

    const firstDate =
        new Date(
            year,
            month,
            1
        );

    const lastDate =
        new Date(
            year,
            month + 1,
            0
        );

    const startOffset =
        firstDate.getDay();

    for (let i = startOffset; i>0; i--) {
        dates.push({
            date: new Date(year, month, 1-i),
            isCurrentMonth: false
        });
    }

    for (
        let day = 1;
        day <= lastDate.getDate();
        day++
    ) {

        dates.push({

            date: new Date(year, month, day),

            isCurrentMonth: true

        });

    }

    let nextDay = 1;

    while (

        dates.length < 42

    ) {

        dates.push({
            date: new Date(year, month + 1, nextDay++),
            isCurrentMonth: false
        });

    }

    return dates;

}

function getCalendarEntries(
    year,
    month
) {

    const firstDate =
        new Date(
            year,
            month,
            1
        );

    const lastDate =
        new Date(
            year,
            month + 1,
            0
        );

    const entries =
        getScheduleEntries(
            firstDate,
            lastDate
        );

    const map =
        new Map();

    for (const entry of entries) {

        const key =

            getEntryDate(
                entry
            );

        if (

            !map.has(key)

        ) {

            map.set(
                key,
                []
            );

        }

        map.get(key).push(
            entry
        );

    }

    return map;

}

function getEntryDate(entry) {

    return (

        entry.type === "event"

            ? entry.start

            : entry.due

    ).slice(0, 10);

}

function occursOnDate(event, date) {

    const start = new Date(event.start);

    // 繰り返しなし
    if (
        !event.repeat ||
        !event.repeat.enabled ||
        event.repeat.frequency === 'none'
    ) {

        return isSameDate(start, date);

    }

    const repeat = event.repeat;

    // 開始日より前には出さない
    if (stripTime(date) < stripTime(start)) {

        return false;

    }

    switch (repeat.frequency) {

        case 'day':

            return (
                getDayDifference(start, date) %
                repeat.interval === 0
            );

        case 'week':

            if (
                !repeat.weekdays.includes(
                    date.getDay()
                )
            ) {

                return false;

            }

            return (
                Math.floor(
                    getDayDifference(start, date) / 7
                ) %
                repeat.interval === 0
            );

        case 'month':

            return (
                date.getDate() === start.getDate() &&
                getMonthDifference(start, date) %
                    repeat.interval ===
                    0
            );

        case 'year':

            return (
                date.getDate() === start.getDate() &&
                date.getMonth() === start.getMonth() &&
                (date.getFullYear() -
                    start.getFullYear()) %
                    repeat.interval ===
                    0
            );

    }

    return false;

}

function combineDateAndTime(date, original) {

    const source = new Date(original);

    const result = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        source.getHours(),
        source.getMinutes()
    );

    return toDateTimeLocalString(result);

}

function stripTime(date) {
    return new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
    );
}

function getDayDifference(a, b) {
    const oneDay = 86400000;

    return Math.floor(
        (stripTime(b) - stripTime(a)) / oneDay
    );
}

function getMonthDifference(a, b) {
    return (
        (b.getFullYear() - a.getFullYear()) * 12 +
        (b.getMonth() - a.getMonth())
    );
}

function toDateTimeLocalString(date) {

    const pad = n => String(n).padStart(2, '0');

    return (
        `${date.getFullYear()}-` +
        `${pad(date.getMonth() + 1)}-` +
        `${pad(date.getDate())}T` +
        `${pad(date.getHours())}:` +
        `${pad(date.getMinutes())}`
    );

}

function expandEvent(
    event,
    startDate,
    endDate
) {

    const result = [];

    let current = new Date(startDate);

    while (current <= endDate) {

        const date = new Date(current);

        if (occursOnDate(event, date)) {

            const dateKey = formatDateKey(date);

            const skipException = event.exceptions?.find(
                exception => 
                        exception.type === "skip" &&
                        exception.date === dateKey
            );

            if (skipException) {
                current.setDate(current.getDate() + 1);
                continue;
            }

            const overrideException = event.exceptions?.find(
                exception =>
                    exception.type === "override" &&
                    exception.date === dateKey
            );

            const instance = overrideException
                ? {
                    ...event,
                    ...overrideException,

                    originalId: event.id,
                    occurrenceDate: dateKey
                }
                : {
                    ...event,

                    start: combineDateAndTime(
                        date,
                        event.start
                    ),

                    end: combineDateAndTime(
                        date,
                        event.end
                    ),

                    originalId: event.id,
                    occurrenceDate: dateKey
                };

            result.push(instance);

        }

        current.setDate(
            current.getDate() + 1
        );

    }

    return result;

}

function getEventsInRange(
    startDate,
    endDate
) {

    const result = [];

    for (const event of events) {

        if (!event.start) {

            continue;

        }

        result.push(
            ...expandEvent(
                event,
                startDate,
                endDate
            )
        );

    }

    return result;

}



function renderHomeItems() {

    homeItems.innerHTML = "";

    let totalItemCount = 0;

    const groups =

        groupItemsForHome(
            new Date()
        );

    for (const group of groups) {

        totalItemCount += group.items.length;

        homeItems.appendChild(

            createHomeSubjectGroup(
                group
            )

        );

    }

    homeItemsTitle.textContent = `今日の持ち物（${totalItemCount}個）`

}

function renderHomeSchedule() {

    homeSchedule.innerHTML = "";

    const entries =
        getTodaySchedule();

    if (entries.length === 0) {

        homeSchedule.textContent =
            "予定はありません";

        return;

    }

    const list =
        document.createElement("ul");

    for (const entry of entries) {

        list.appendChild(

            createHomeScheduleEntry(
                entry
            )

        );

    }

    homeSchedule.appendChild(
        list
    );

}

function renderHomeTimetable() {

    homeTimetable.innerHTML = "";

    const timetable =
        getSubjectsForDate(new Date());

    if (timetable.length === 0) {

        homeTimetable.textContent =
            "授業はありません";

        return;

    }

    const list =
        document.createElement("ol");

    let period = 1;

    for (const subject of timetable) {

        const li =
            document.createElement("li");

        li.textContent =
            `${period}限　${
                subject
                    ? subject.name
                    : "-"
                }`;

        list.appendChild(li);

        period++;

    }

    homeTimetable.appendChild(list);

}

function renderHomePlannedTasks() {

    homePlannedTasks.innerHTML = "";

    const groups =
        groupTodayPlannedTasks();

    if (groups.length === 0) {

        homePlannedTasks.textContent =
            "ありません";

        return;

    }

    for (const group of groups) {

        const section =
            document.createElement(
                "section"
            );

        const title =
            document.createElement(
                "h4"
            );

        title.textContent =

            group.subject?.name
            ?? "教科なし";

        section.appendChild(title);

        const list =
            document.createElement("ul");

        for (const task of group.tasks) {

            const li =
                document.createElement("li");

            li.textContent =
                task.title;

            list.appendChild(li);

        }

        section.appendChild(list);

        homePlannedTasks.appendChild(
            section
        );

    }

}

function renderHomeCalendar() {;

    homeCalendar.innerHTML = "";

    const year = calendarDate.getFullYear();

    const month = calendarDate.getMonth();

    calendarTitle.textContent = `${year}年 ${month + 1}月`

    const dates =
        getCalendarDates(
            year,month
        );

    const entries =
        getCalendarEntries(
            year,month
        );

    homeCalendar.appendChild(

        createCalendarTable(
            dates,
            entries
        )

    );

}

function renderSelectedDateSchedule() {
    selectedDateSchedule.innerHTML = "";

    if (!selectedDate) {
        return;
    }

    const heading = document.createElement("h3");

    heading.textContent = "選択中の日の予定"

    selectedDateSchedule.appendChild(heading);

    const title = document.createElement("h4");

    title.textContent = formatSelectedDate(selectedDate);

    selectedDateSchedule.appendChild(title);

    const entries = getScheduleEntries(selectedDate, selectedDate);

    if (entries.length === 0) {
        const empty = document.createElement("p");

        empty.textContent = "予定はありません。";

        selectedDateSchedule.appendChild(empty);

        return;
    }

    for (const entry of entries) {
        selectedDateSchedule.appendChild(
            createSelectedScheduleEntry(entry)
        );
    }
}



function createHomeSubjectGroup(group) {

    const section =
        document.createElement(
            "section"
        );

    const title =
        document.createElement(
            "h4"
        );

    title.textContent =

        group.subject?.name
        ?? "教科なし";

    section.appendChild(
        title
    );

    const list =
        document.createElement(
            "ul"
        );

    for (const item of group.items) {

        list.appendChild(

            createHomeItem(
                item
            )

        );

    }

    section.appendChild(
        list
    );

    return section;

}

function createHomeItem(item) {

    const li =
        document.createElement("li");

    li.className = "home-item-list";

    const name =
        document.createElement("div");

    name.className = "home-item-name";

    name.textContent =
        item.name;

    li.appendChild(name);

    const source = document.createElement("div");

    source.className = "home-item-source";

    source.textContent =
        item.sources
            .map(formatHomeSource)
            .join(" / ");

    li.appendChild(source);

    return li;

}

function createHomeScheduleEntry(
    entry
) {

    const li =
        document.createElement("li");

    const title =
        document.createElement("div");

    title.className =
        "home-schedule-title";

    title.textContent =
        entry.title;

    li.appendChild(title);

    const info =
        document.createElement("div");

    info.className =
        "home-schedule-info";

    info.textContent =
        formatHomeScheduleInfo(
            entry
        );

    li.appendChild(info);

    return li;

}

function formatHomeSource(source) {

    switch (source.source) {

        case ITEM_SOURCE.TIMETABLE:

            return "時間割";

        case ITEM_SOURCE.TODO:

            return source.title;

        case ITEM_SOURCE.EVENT:

            return source.title;

    }

    return "";

}

function formatHomeScheduleInfo(
    entry
) {

    const parts = [];

    if (entry.type === "event") {

        parts.push(

            formatTimeRange(
                entry.start,
                entry.end
            )

        );

    }

    else {

        parts.push("Todo");

    }

    if (entry.subject) {

        parts.push(
            entry.subject.name
        );

    }

    return parts.join("　");

}

function formatTimeRange(
    start,
    end
) {

    if (!start) {

        return "";

    }

    const startDate =
        new Date(start);

    const startTime =

        startDate
            .toLocaleTimeString(
                "ja-JP",
                {

                    hour: "2-digit",

                    minute: "2-digit"

                }

            );

    if (!end) {

        return startTime;
    }

    const endDate =
        new Date(end);

    const endTime =

        endDate
            .toLocaleTimeString(
                "ja-JP",
                {

                    hour: "2-digit",

                    minute: "2-digit"

                }

            );

    return

        startTime +

        " ～ " +

        endTime;

}

function formatDateKey(date) {
    const year = date.getFullYear();

    const month = String(date.getMonth() + 1).padStart(2,"0");

    const day = String(date.getDate()).padStart(2,"0");

    return `${year}-${month}-${day}`;
}

function formatSelectedDate(date) {
    return
        `${date.getMonth() + 1}月
        ${date.getDate()}日（
        ${CALENDAR_WEEKDAYS[date.getDay()]}）`;
}

function formatEventTime(event) {

    return

        event.start.slice(11,16)

        + " ～ "

        + event.end.slice(11,16);

}

function isDateInRange(
    dateTime,
    startDate,
    endDate
) {

    const target =
        new Date(dateTime);

    target.setHours(
        0,
        0,
        0,
        0
    );

    const start =
        new Date(startDate);

    start.setHours(
        0,
        0,
        0,
        0
    );

    const end =
        new Date(endDate);

    end.setHours(
        0,
        0,
        0,
        0
    );

    return (

        target >= start &&

        target <= end

    );

}

function isHoliday(date) {
    return holidays.hasOwnProperty(
        formatDateKey(date)
    );
}

function compareScheduleEntry(
    a,
    b
) {

    const aTime =

        a.type === "event"

            ? a.start

            : a.due + "T23:59";

    const bTime =

        b.type === "event"

            ? b.start

            : b.due + "T23:59";

    return (

        new Date(aTime) -

        new Date(bTime)

    );

}

function createCalendarTable(
    dates,
    entries
) {

    const table =
        document.createElement(
            "table"
        );

    table.className = "calendar";

    table.appendChild(
        createCalendarHeader()
    );

    const tbody =
        document.createElement(
            "tbody"
        );

    for (
        let week = 0;
        week < 6;
        week++
    ) {

        const tr =
            document.createElement(
                "tr"
            );

        for (
            let day = 0;
            day < 7;
            day++
        ) {

            tr.appendChild(

                createCalendarCell(

                    dates[
                        week * 7 + day
                    ],

                    entries

                )

            );

        }

        tbody.appendChild(
            tr
        );

    }

    table.appendChild(
        tbody
    );

    return table;

}

function createCalendarHeader() {

    const thead =
        document.createElement(
            "thead"
        );

    const tr =
        document.createElement(
            "tr"
        );

    CALENDAR_WEEKDAYS.forEach((weekday,index) => {

        const th =
            document.createElement(
                "th"
            );

        th.textContent =
            weekday;

        if (index === 0) {
            th.classList.add("calendar-sunday");
        } else if (index === 6) {
            th.classList.add("calendar-saturday");
        }

        tr.appendChild(
            th
        );

    });

    thead.appendChild(
        tr
    );

    return thead;
}

function createCalendarCell(
    calendarDate,
    entries
) {

    const date = calendarDate.date;

    const td =
        document.createElement(
            "td"
        );

    td.className = "calendar-cell";

    if (!calendarDate.isCurrentMonth) {
        td.classList.add("other-month");
    }

    if (!date) {

        return td;

    }


    const day = date.getDay();

    if (day === 0) {
        td.classList.add("calendar-sunday");
    } else if (day === 6) {
        td.classList.add("calendar-saturday");
    }

    if (isHoliday(date)) {
        td.classList.add(
            "calendar-holiday"
        );
    }



    if (isSameDate(date, new Date())) {
        td.classList.add("today");
    }


    if (selectedDate && isSameDate(date, selectedDate)) {
        td.classList.add("selected-date");
    }



    const number =
        document.createElement(
            "div"
        );

    number.className = "calendar-date";

    number.textContent =
        date.getDate();

    td.appendChild(
        number
    );


    const holidayName = getHolidayName(date);

    if (holidayName) {
        const holiday = document.createElement("div");

        holiday.className = "calendar-holiday-name";

        holiday.textContent = holidayName;

        td.appendChild(holiday);
    }



    const key = formatDateKey(date);

    const dayEntries =

        entries.get(key)

        ?? [];

    const visibleEntries = dayEntries.slice(0,MAX_CALENDAR_ENTRIES);

    for (
        const entry of
        visibleEntries
    ) {

        const div =
            document.createElement(
                "div"
            );
        
        div.classList.add("calendar-entry");
        div.classList.add(
            entry.type === "event"
                ? "calendar-event"
                : "calendar-todo"
        );

        if (entry.type === "todo" && entry.completed) {
            div.classList.add("completed");
        }

        let text = entry.title;

        if(entry.type === "event") {
            text = entry.start.slice(11,16)
            + " "
            + text;
        }
        div.textContent = text;

        td.appendChild(
            div
        );

    }

    const hiddenCount = dayEntries.length - MAX_CALENDAR_ENTRIES;
    if (hiddenCount > 0) {
        const more = document.createElement("div");

        more.className = "calendar-more";

        more.textContent = `+${hiddenCount}件`;

        td.appendChild(more);
    }


    td.addEventListener("click",() => {
        selectedDate = date;
        refreshHome();
    });



    return td;

}

function createSelectedScheduleEntry(entry) {
    const div = document.createElement("div");

    div.className = "selected-schedule-entry";

    if (entry.type === "event") {
        div.classList.add("schedule-event");

        const time = document.createElement("div");

        time.className = "schedule-time";

        time.textContent = formatEventTime(entry);

        div.prepend(time);

    } else {
        if (entry.type === "todo" && entry.completed) {
            div.classList.add("completed");
        }
        div.classList.add("schedule-todo");
    }

    const title = document.createElement("div");

    title.className = "schedule-title";

    title.textContent = entry.title;

    div.appendChild(title);

    div.addEventListener("click", async () => {
        if (entry.type === "todo") {
            openEditModal(entry.data);
        } else {
            await openEventEditMode(entry.data);
        }
    });

    return div;
}



prevMonth.addEventListener(
    "click",
    () => {

        calendarDate.setMonth(
            calendarDate.getMonth() - 1
        );

        renderHomeCalendar();

    }
);

nextMonth.addEventListener(
    "click",
    () => {

        calendarDate.setMonth(
            calendarDate.getMonth() + 1
        );

        renderHomeCalendar();

    }
);

todayButton.addEventListener("click", () => {

    console.log("today");
    const today = new Date();

    calendarDate = new Date(today);

    selectedDate = new Date(today);

    refreshHome();
});




function refreshHome() {
    renderHomeItems();

    renderHomeSchedule();

    renderHomeTimetable();

    renderHomePlannedTasks();

    renderHomeCalendar();

    renderSelectedDateSchedule();
}

function initializeHome() {

    loadHolidays()
        .then(() => {
            refreshHome();
        });
}