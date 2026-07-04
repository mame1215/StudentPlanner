let tasks = [
    {
        id: 1,
        title: "数学",

        completed: false,
        conpletedAt: null,

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

const subjects = [
    {
        id: 1,
        name: "数学",
        color: "#4285F4",
        items: []
    }
];

const tags = [
    { id: 1, name: "提出物", color: "#ef5350" }
];

const priorityText = [
    "最低",
    "低",
    "中",
    "高",
    "最優先"
];

function loadSubjects(selectElement) {

    selectElement.innerHTML = "";

    const empty = document.createElement("option");
    empty.value = "";
    empty.textContent = "未設定";
    selectElement.appendChild(empty);
    
    for (const subject of subjects) {
        
        const option = document.createElement("option");

        option.value = subject.id;
        option.textContent = subject.name;

        selectElement.appendChild(option);

    }
}

function loadTags() {

    for(const tag of tags) {
        
        const label = document.createElement("label");

        const checkbox = document.createElement("input");

        checkbox.type = "checkbox";
        checkbox.value = tag.id;

        label.appendChild(checkbox);
        label.append(" " + tag.name);

        tagInput.appendChild(label);
    }
}

let editingTaskId = null;

const taskList = document.getElementById("taskList");
const taskInput = document.getElementById("taskInput");
const addTaskButton = document.getElementById("addTaskButton");
const dueInput = document.getElementById("dueInput")
const priorityInput = document.getElementById("priorityInput");
const memoInput = document.getElementById("memoInput");
const subjectInput = document.getElementById("subjectInput");
const tagInput = document.getElementById("tagInput");

const modal = document.getElementById("modal");
const editTitle = document.getElementById("editTitle");
const editDue = document.getElementById("editDue");
const editPriority = document.getElementById("editPriority");
const saveButton = document.getElementById("saveButton");
const cancelButton = document.getElementById("cancelButton");
const editSubject = document.getElementById("editSubject");
console.log(editSubject);

//タスクのリストを更新
function renderTasks(taskArray) {

    //期限順に並び替え
    const sortedTasks = [...taskArray];
    sortedTasks.sort(function (a, b) {

        if (!a.due && !b.due) {
            return 0;
        }

        if (!a.due) {
            return 1;
        }

        if (!b.due) {
            return -1;
        }

        return new Date(a.due) - new Date(b.due);
    });

    taskList.innerHTML = "";

    for (const task of sortedTasks) {
        taskList.appendChild(
            createTaskElement(task)
        );
    }
}

//タスクに追加
function addTask(taskName, deadline, priority,memo, subjectId, tagIds) {

    tasks.push({
        id: tasks.length + 1,
        title: taskName,

        completed: false,
        completedAt: null,

        due: deadline,

        plan: {
            start: "",
            end: ""
        },

        priority: priority,

        subjectId: subjectId,

        tagIds: tagIds,

        items: [],

        memo: memo
    });

    priorityInput.value = "3";

    saveTasks();
}

//入力欄から読み取り、タスクに追加し、画面を更新
function submitTask() {
    const newTask = taskInput.value.trim();
    const deadline = dueInput.value;

    const tagIds = [];

    const checkedTags =
        tagInput.querySelectorAll("input:checked");

    for (const checkbox of checkedTags) {
        tagIds.push(Number(checkbox.value));
    }

    if(newTask !== ""){
        addTask(
            newTask,
            deadline,
            Number(priorityInput.value),
            memoInput.value.trim(),
            subjectInput.value === ""
                ? null
                : Number(subjectInput.value),
            tagIds
        );
        renderTasks(tasks);
        taskInput.value = "";
        dueInput.value = "";
        memoInput.value = "";
        subjectInput.value = "";
        
        const checkedTags =
            tagInput.querySelectorAll("input:checked");

        for (const checkbox of checkedTags) {
            checkbox.checked = false;
        }
    }
}

//タスクを削除
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);

    saveTasks();
}

//タスクを保存
function saveTasks() {
    localStorage.setItem("tasks",JSON.stringify(tasks));
}

//タスクを読み取り
function loadTasks() {
    const data = localStorage.getItem("tasks")

    if(data !== null){
        tasks = JSON.parse(data);
    }
}

//タスク編集画面を開く
function openEditModal(task) {

    editingTaskId = task.id;

    editTitle.value = task.title;
    editDue.value = task.due;
    editPriority.value = task.priority;
    editSubject.value =
        task.subjectId ?? "";

    editTitle.focus();
    editTitle.select();

    modal.classList.remove("hidden");
    
}

//編集画面を閉じる
function closeEditModal() {

    modal.classList.add("hidden");

    editingTaskId = null;
    document.activeElement.blur();
}

function createLabel(text, classNames = [], backgroundColor = null) {

    const label = document.createElement("span");

    label.textContent = text;

    for (const className of classNames) {
        label.classList.add(className);
    }

    if (backgroundColor) {
        label.style.backgroundColor = backgroundColor;
    }

    return label;
}

function getDueInfo(due){
    const hour = String(due.getHours()).padStart(2, "0");
    const minute = String(due.getMinutes()).padStart(2, "0");

    const text =
        "📅 "+ due.getFullYear()
        + "/"+ (due.getMonth() + 1)
        + "/" + due.getDate()
        + " " + hour
        + ":" + minute;

    const now = new Date();

    const today = new Date();
    today.setHours(23,59,59,999);

    let color = "";

    if (due < now) {
        color = "#d32f2f";
    }
    else if (due <= today) {
        color = "#f57c00";
    }

    return {
        text: text,
        color: color
    };
}

function addTagLabels(container, task){
    for (const tagId of task.tagIds) {
            
        const tagData = tags.find(tag => tag.id === tagId);

        if (!tagData) {
            continue;
        }

        container.appendChild(
            createLabel(
                tagData.name,
                ["tag"],
                tagData.color
            )
        );
    }
}

function addSubjectLabel(container, task){
    const subjectData = subjects.find(
        s => s.id === task.subjectId
    );

    if(subjectData) {
        container.appendChild(
            createLabel(
                subjectData.name,
                ["subject"]
            )
        );
    }
}

function createActions(task){
    const actions = document.createElement("div");
    actions.classList.add("task-actions");

    const editButton = document.createElement("button");
    const deleteButton = document.createElement("button");

    deleteButton.textContent = "🗑";
    editButton.textContent = "🖋️";

    actions.appendChild(editButton);
    actions.appendChild(deleteButton);

    deleteButton.addEventListener("click",function () {
        deleteTask(task.id);
        renderTasks(tasks);
    });

    editButton.addEventListener("click", function () {
        openEditModal(task);
    });


    return actions;
}

function createDue(task){
    const due = document.createElement("div");
    due.classList.add("task-due");

    if (task.due) {

        const dueInfo = getDueInfo(new Date(task.due));

        due.textContent = dueInfo.text;
        due.style.color = dueInfo.color;
    }

    return due;
}

function createLabels(task){
    const labels = document.createElement("div");

    labels.classList.add("task-labels");

    addTagLabels(labels, task);

    addSubjectLabel(labels, task);

    labels.appendChild(
        createLabel(
            priorityText[task.priority - 1],
            [
                "priority",
                `priority-${task.priority}`
            ]
        )
    );

    return labels;
}

function createCheckbox(task) {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", function () {
        task.completed = checkbox.checked;
        saveTasks();
        renderTasks(tasks);
    });

    return checkbox;
}

function createContent(task) {

    const labels = createLabels(task);
    
    const due = createDue(task);

    const title = document.createElement("div");
    const titleRow = document.createElement("div");

    title.classList.add("task-title");
    title.textContent = task.title;
    titleRow.classList.add("task-title-row");

    titleRow.appendChild(title);
    titleRow.appendChild(labels);


    const content = document.createElement("div");
    content.classList.add("task-content");
    content.appendChild(titleRow);
    content.appendChild(due);

    return content;
}

function createTaskElement(task) {
    const li = document.createElement("li");

    if (task.completed) {
        li.classList.add("completed");
    }

    li.appendChild(createCheckbox(task));
    li.appendChild(createContent(task));
    li.appendChild(createActions(task));

    return li;
}

loadTasks();
renderTasks(tasks);
loadSubjects(subjectInput);
loadSubjects(editSubject);
loadTags();

//クリックで入力欄のを追加
addTaskButton.addEventListener("click", function () {

    submitTask();

});

//編集後に保存
saveButton.addEventListener("click", function () {

    const task = tasks.find(task => task.id === editingTaskId);

    if (task) {
        task.title = editTitle.value;
        task.due = editDue.value;
        task.priority = Number(editPriority.value);
        task.subjectId =
            editSubject.value === ""
                ? null
                : Number(editSubject.value);

        saveTasks();
        renderTasks(tasks);
        closeEditModal();
    }

});

//編集キャンセル
cancelButton.addEventListener("click", function () {
    closeEditModal();
});

//編集キャンセル（modal以外を押したとき）
modal.addEventListener("click", function (event) {

    if (event.target === modal){
        closeEditModal();
    }
});

//編集キャンセル（esc）
document.addEventListener("keydown", function (event) {
    if (
        event.key === "Escape" &&
        !modal.classList.contains("hidden")
    ){
        closeEditModal();
    }
});

//Enterで入力欄のを追加
taskInput.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {
        submitTask();
    }

});