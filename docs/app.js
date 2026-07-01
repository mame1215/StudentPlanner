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
const dueInput = document.getElementById("dueInput")

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

        const button = document.createElement("button");

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
        }
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

        content.appendChild(title);
        content.appendChild(due);

        li.appendChild(checkbox);
        li.appendChild(content);
        li.appendChild(button);
        taskList.appendChild(li);
    }
}

//タスクに追加
function addTask(taskName, deadline) {
    tasks.push({
        id: Date.now(),
        title: taskName,
        completed: false,
        due: deadline
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