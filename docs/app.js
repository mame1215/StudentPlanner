let tasks = [
    {
        id: 1,
        title: "数学",
        completed: false
    },
    {
        id:2,
        title: "英語",
        completed: false
    }
];

const taskList = document.getElementById("taskList");
const taskInput = document.getElementById("taskInput");
const addTaskButton = document.getElementById("addTaskButton");

//タスクのリストを更新
function renderTasks(taskArray) {
    taskList.innerHTML = "";

    for (const task of taskArray) {
        const li = document.createElement("li");

        if (tasks.completed) {
            li.classList.add("completed");
        }

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        const span = document.createElement("span");
        const button = document.createElement("button");

        span.textContent = task.title;
        button.textContent = "🗑"
        checkbox.checked = task.completed;

        checkbox.addEventListener("change", function () {
            task.completed = checkbox.checked;
            saveTasks();
            renderTasks(tasks);
        });

        button.addEventListener("click",function () {
            deleteTask(task.id);
            renderTasks(tasks);
        });

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(button);
        taskList.appendChild(li);
    }
}

//タスクに追加
function addTask(taskName) {
    tasks.push({
        id: tasks.length + 1,
        title: taskName,
        completed: false
    });

    saveTasks();
}

//入力欄から読み取り、タスクに追加し、画面を更新
function submitTask() {
    const newTask = taskInput.value.trim();

    if(newTask !== ""){
        addTask(newTask);
        renderTasks(tasks);
        taskInput.value = "";
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

loadTasks();
renderTasks(tasks);

//クリックで入力欄のを追加
addTaskButton.addEventListener("click", function () {

    submitTask();

});

//Enterで入力欄のを追加
taskInput.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {
        submitTask();
    }

});