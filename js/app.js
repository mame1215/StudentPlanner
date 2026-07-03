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

        priorty: 3,

        subject: "",

        tags: [],

        items: [],

        memo: ""
    }
];

let editingTaskId = null;

const taskList = document.getElementById("taskList");
const taskInput = document.getElementById("taskInput");
const addTaskButton = document.getElementById("addTaskButton");
const dueInput = document.getElementById("dueInput")

const modal = document.getElementById("modal");
const editTitle = document.getElementById("editTitle");
const editDue = document.getElementById("editDue");
const editPriority = document.getElementById("editPriority");
const saveButton = document.getElementById("saveButton");
const cancelButton = document.getElementById("cancelButton");

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
        const li = document.createElement("li");

        if (task.completed) {
            li.classList.add("completed");
        }

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        const content = document.createElement("div");

        const title = document.createElement("div")
        const due = document.createElement("div");

        content.classList.add("task-content");
        title.classList.add("task-title");
        due.classList.add("task-due");

        const actions = document.createElement("div");
        actions.classList.add("task-actions");
        const editButton = document.createElement("button");
        const deleteButton = document.createElement("button");

        title.textContent = task.title;
        if (task.due) {
            const date = new Date(task.due);

            const hour = String(date.getHours()).padStart(2, "0");
            const minute = String(date.getMinutes()).padStart(2, "0");

            due.textContent =
            "📅 "+ date.getFullYear()
            + "/"+ (date.getMonth() + 1)
            + "/" + date.getDate()
            + " " + hour
            + ":" + minute;

            const now = new Date();

            const today = new Date();
            today.setHours(23,59,59,999);

            if (date < now) {
                due.style.color = "#d32f2f";
            }
            else if (date <= today) {
                due.style.color = "#f57c00";
            }
        }
        deleteButton.textContent = "🗑";
        editButton.textContent = "🖋️";
        checkbox.checked = task.completed;

        checkbox.addEventListener("change", function () {
            task.completed = checkbox.checked;
            saveTasks();
            renderTasks(tasks);
        });

        deleteButton.addEventListener("click",function () {
            deleteTask(task.id);
            renderTasks(tasks);
        });

        editButton.addEventListener("click", function () {
            openEditModal(task);
        });

        content.appendChild(title);
        content.appendChild(due);

        actions.appendChild(editButton);
        actions.appendChild(deleteButton);

        li.appendChild(checkbox);
        li.appendChild(content);

        li.appendChild(actions);
        taskList.appendChild(li);
    }
}

//タスクに追加
function addTask(taskName, deadline) {
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

        priority: 3,

        subject: "",

        tags: [],

        items: [],

        memo: ""
    });

    saveTasks();
}

//入力欄から読み取り、タスクに追加し、画面を更新
function submitTask() {
    const newTask = taskInput.value.trim();
    const deadline = dueInput.value;

    if(newTask !== ""){
        addTask(newTask,deadline);
        renderTasks(tasks);
        taskInput.value = "";
        dueInput.value = "";
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

loadTasks();
renderTasks(tasks);

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