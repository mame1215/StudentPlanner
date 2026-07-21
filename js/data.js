let tasks = [
    {
        id: 1,
        title: "数学",

        completed: false,
        completedAt: null,

        due: "",

        plan: {
            start: "",
            end: ""
        },

        priority: 3,

        subjectId: null,

        tagIds: [],

        items: [],

        memo: ""
    }
];

let events = [
    
    {
        id: 1,

        title: "文化祭",

        start: "2025-08-20T09:00",
        end: "2025-08-20T15:00",

        allDay: false,

        subjectId: null,

        tagIds: [],

        items: [],

        memo: "",

        repeat: {
            enabled: false,
            frequency: "none",
            interval: 1,
            weekdays: []
        }
    }
    
];

const subjects = [
    {
        id: 1,
        name: "数学",
        color: "#4285F4",
        defaultItems: [
            "教科書",
            "ノート",
            "青チャート"
        ]
    },
    {
        id: 2,
        name: "英語",
        color: "#df42f4",
        defaultItems: [
            "文法書",
            "単語帳"
        ]
    }
];

const tags = [
    { id: 1, name: "提出物", color: "#ef5350" },
    { id: 2, name: "イベント", color: "#ef5350" }
];

const priorityText = [
    "最低",
    "低",
    "中",
    "高",
    "最優先"
];

const WEEKDAYS = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday"
];

const WEEKDAY_NAMES = {

    monday: "月",

    tuesday: "火",

    wednesday: "水",

    thursday: "木",

    friday: "金"
};

const CALENDAR_WEEKDAYS = [
    "日",
    "月",
    "火",
    "水",
    "木",
    "金",
    "土"
];

let periodCounts = {

    monday: 7,

    tuesday: 6,

    wednesday: 7,

    thursday: 6,

    friday: 6
};

let timetable = {};

function initializeTimetable() {

    timetable = {};

    for (const weekday of WEEKDAYS) {

        timetable[weekday] = Array(
            periodCounts[weekday]
        ).fill(null);
    }
}