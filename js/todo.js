let addItems = [];

let editItems = [];

let previousAddSubjectId = "";
let previousEditSubjectId = "";

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

function loadTags(container) {

    container.innerHTML = "";

    for(const tag of tags) {
        
        const label = document.createElement("label");
        label.classList.add("tag-option");

        const checkbox = document.createElement("input");

        checkbox.type = "checkbox";
        checkbox.value = tag.id;

        label.appendChild(checkbox);
        label.append(" " + tag.name);

        container.appendChild(label);
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
const planStartInput = document.getElementById("planStartInput");
const planEndInput = document.getElementById("planEndInput");
const itemList = document.getElementById("itemList");
const itemInput = document.getElementById("itemInput");
const addItemButton = document.getElementById("addItemButton");

const modal = document.getElementById("modal");
const editTitle = document.getElementById("editTitle");
const editDue = document.getElementById("editDue");
const editPriority = document.getElementById("editPriority");
const saveButton = document.getElementById("saveButton");
const cancelButton = document.getElementById("cancelButton");
const editSubject = document.getElementById("editSubject");
const editTagInput = document.getElementById("editTagInput");
const editMemo = document.getElementById("editMemo");
const editPlanStart = document.getElementById("editPlanStart");
const editPlanEnd = document.getElementById("editPlanEnd");
const editItemList = document.getElementById("editItemList");
const editItemInput = document.getElementById("editItemInput");
const editAddItemButton = document.getElementById("editAddItemButton");

const confirmModal = document.getElementById("confirmModal");
const confirmMessage = document.getElementById("confirmMessage");
const confirmOk = document.getElementById("confirmOk");
const confirmCancel = document.getElementById("confirmCancel");

function sortTasks(taskArray) {
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

    return sortedTasks;
}

//タスクのリストを更新
function renderTasks(taskArray) {

    const sortedTasks = sortTasks(taskArray);

    taskList.innerHTML = "";

    for (const task of sortedTasks) {
        taskList.appendChild(
            createTaskElement(task)
        );
    }
}

//タスクに追加
function addTask(form) {

    const subject = subjects.find(
        subject => subject.id === form.subjectId
    );

    tasks.push({
        id: Date.now(),

        title: form.title,

        completed: false,

        completedAt: null,

        due: form.due,

        plan: form.plan,

        priority: form.priority,

        subjectId: form.subjectId,

        tagIds: form.tagIds,

        items: [...form.items],

        memo: form.memo
    });

    priorityInput.value = "3";

    saveTasks();
}

function getSelectedTagIds(container) {

    const tagIds = [];
    
    const checked =
        container.querySelectorAll("input:checked");

    for (const checkbox of checked) {
        tagIds.push(Number(checkbox.value));
    }

    return tagIds;
}

function getSelectedSubject(selectElement){

    if(selectElement.value === ""){
        return null;
    }

    return Number(selectElement.value);
}

function getPriority(selectElement) {
    return Number(selectElement.value);
}

function getTaskFormData(){

    return {

        title:
            taskInput.value.trim(),

        due:
            dueInput.value,

        priority:
            getPriority(priorityInput),

        memo:
            memoInput.value.trim(),

        subjectId:
            getSelectedSubject(subjectInput),

        tagIds:
            getSelectedTagIds(tagInput),

        plan: {
            start: planStartInput.value,
            end: planEndInput.value
        },

        items: [...addItems]
    };
}

function getEditFormData(){

    return {

        title:
            editTitle.value.trim(),

        due:
            editDue.value,

        priority:
            getPriority(editPriority),

        memo:
            editMemo.value.trim(),

        subjectId:
            getSelectedSubject(editSubject),

        tagIds:
            getSelectedTagIds(editTagInput),

        plan: {
            start: editPlanStart.value,
            end: editPlanEnd.value
        },

        items: [...editItems]
    };
}

//入力欄から読み取り、タスクに追加し、画面を更新
function submitTask() {

    const form = getTaskFormData();
    
    if(form.title !== ""){
        addTask(form);
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
    editPlanStart.value = task.plan.start;
    editPlanEnd.value = task.plan.end;
    editPriority.value = task.priority;
    editSubject.value =
        task.subjectId ?? "";
    
    const checkboxes =
        editTagInput.querySelectorAll("input");
    editMemo.value = task.memo;

    editItems.length = 0;

    editItems.push(...task.items);

    renderItemList(
        editItemList,
        editItems
    );

    for(const checkbox of checkboxes) {

        checkbox.checked =
            task.tagIds.includes(
                Number(checkbox.value)
            );
    }

    previousEditSubjectId = editSubject.value;

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

//確認画面を開く
function showConfirmDialog(message) {

    confirmMessage.textContent = message;

    confirmModal.classList.remove("hidden");

    return new Promise(resolve => {

        function close(result) {

            confirmModal.classList.add("hidden");

            confirmOk.removeEventListener(
                "click",
                ok
            );

            confirmCancel.removeEventListener(
                "click",
                cancel
            );

            resolve(result);

        }

        function ok() {

            close(true);

        }

        function cancel() {

            close(false);

        }

        confirmOk.addEventListener(
            "click",
            ok
        );

        confirmCancel.addEventListener(
            "click",
            cancel
        );

    });

}

//labelそのものを作る
function createLabel(text, classNames = [], backgroundColor = null) {

    const label = document.createElement("span");

    label.classList.add("label");

    label.textContent = text;

    for (const className of classNames) {
        label.classList.add(className);
    }

    if (backgroundColor) {
        label.style.backgroundColor = backgroundColor;
    }

    return label;
}

//締め切りを作って、色など設定
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

//labelにtagを追加
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

//labelにsubjectを追加
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

//ゴミ箱ボタンや編集ボタンを作る
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

//締め切りを作る
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

//タグなどを表示するためのLabelをつくる
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

//タスク完了のためのチェックボックスを作る
function createCheckbox(task) {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", function () {
        task.completed = checkbox.checked;
        task.completeAt =
            checkbox.checked
                ? Date.now()
                : null;
        saveTasks();
        renderTasks(tasks);
    });

    return checkbox;
}

//Memoをつくる
function createMemo(container, task) {
    const memo = document.createElement("div");
    memo.classList.add("task-memo");
    memo.title = task.memo.trim();

    if (task.memo.trim() !== "") {

        memo.textContent = truncateText(task.memo.trim(), 30);

        container.appendChild(memo);
    }
}

//タスク名の要素をつくる
function createTitle(labels, task) {
    const title = document.createElement("div");
    const titleRow = document.createElement("div");

    title.classList.add("task-title");
    title.textContent = task.title;
    titleRow.classList.add("task-title-row");

    titleRow.appendChild(title);
    titleRow.appendChild(labels);

    return {
        title: title,
        titleRow: titleRow
    };
}

//dateを見やすい形にする
function formatPlanDate(date) {

    return (
        date.getMonth() + 1
        + "/"
        + date.getDate()
        + " "
        + String(date.getHours()).padStart(2,"0")
        + ":"
        + String(date.getMinutes()).padStart(2,"0")
    );
}

//作業予定日時設定
function createPlan(task) {
    const plan = document.createElement("div");
    plan.classList.add("task-plan");

    if(!task.plan.start && !task.plan.end) {
        return plan;
    }

    let text = "🕑️ ";

    if (task.plan.start) {
        const start = new Date(task.plan.start);

        text += formatPlanDate(start);
    }

    if (task.plan.end) {
        const end = new Date(task.plan.end);

        text += " ～ ";

        text += formatPlanDate(end);
    }

    plan.textContent = text;

    return plan;
}

//各種要素を作り出す関数
function createContent(task) {

    const labels = createLabels(task);
    
    const due = createDue(task);

    const plan = createPlan(task);

    const titles = createTitle(labels, task)
    const title = titles.title;
    const titleRow = titles.titleRow;

    const content = document.createElement("div");
    content.classList.add("task-content");

    content.appendChild(titleRow);
    content.appendChild(due);
    content.appendChild(plan);

    createMemo(content, task);

    return content;
}

//長い文字を後半...に置き換える
function truncateText(text, maxLength) {

    if (text.length <= maxLength) {
        return text;
    }

    return text.substring(0,maxLength) + "...";
}

//taskに関する要素を作成する
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

//持ち物から削除
function removeItem(
    items,
    index,
    itemListElement
){

    items.splice(index,1);

    renderItemList(
        itemListElement,
        items
    );

}

//持ち物らへんの要素
function renderItemList(itemListElement, items) {

    itemListElement.innerHTML = "";

    items.forEach((item, index) => {
        
        const row = document.createElement("div");
        row.classList.add("item-row");

        const name = document.createElement("span");
        name.textContent = item;

        const remove = document.createElement("button");
        remove.classList.add("item-remove");
        remove.type = "button";
        remove.textContent = "✕";

        remove.addEventListener("click", () => {

            removeItem(
                items,
                index,
                itemListElement
            );
        });

        row.appendChild(name);
        row.appendChild(remove);

        itemListElement.appendChild(row);
    })
}

//教科変更時に持ち物に残っていたら、持ち物を新しい教科の規定の持ち物に変更するか確認
async function handleSubjectChange(
    selectElement,
    items,
    itemListElement,
    previousSubjectId,
    setPreviousSubjectId
) {

    const subject = subjects.find(
        subject => subject.id === Number(selectElement.value)
    );

    if (!subject) {

        setPreviousSubjectId("");

        items.length = 0;

        renderItemList(
            itemListElement,
            items
        );

        return;
    }

    if (items.length > 0) {

        const result = await showConfirmDialog(
            "教科を変更すると、現在の持ち物は初期化されます。 \n\nこのまま変更しますか？"
        );

        if (!result) {

            selectElement.value = previousSubjectId;

            return;
        }

    }

    items.length = 0;

    items.push(...subject.defaultItems);

    renderItemList(
        itemListElement,
        items
    );

    setPreviousSubjectId(selectElement.value);

}

//持ち物を追加
function addItem(inputElement, items, itemListElement) {

    const value = inputElement.value.trim();

    if (!value) {

        return;

    }

    items.push(value);

    inputElement.value = "";

    renderItemList(itemListElement, items);

}

//taskにformの内容を入れる
function updateTask(task, form) {

    task.title = form.title;
    task.due = form.due;
    task.plan = form.plan;
    task.priority = form.priority;
    task.memo = form.memo;
    task.subjectId = form.subjectId;
    task.tagIds = form.tagIds;
    task.items = [...form.items];
    
}

//教科が変更されたら持ち物に規定の持ち物を追加
subjectInput.addEventListener("change", async () => {

    await handleSubjectChange(
        subjectInput,
        addItems,
        itemList,
        previousAddSubjectId,
        value => previousAddSubjectId = value
    );

});

//編集画面でも同様
editSubject.addEventListener("change", async () => {

    await handleSubjectChange(
        editSubject,
        editItems,
        editItemList,
        previousEditSubjectId,
        value => previousEditSubjectId = value
    );

});

//クリックで入力欄のを追加
addTaskButton.addEventListener("click", function () {

    submitTask();

});

//編集後に保存
saveButton.addEventListener("click", function () {

    const task = tasks.find(task => task.id === editingTaskId);

    if (task) {

        const form = getEditFormData();

        updateTask(task, form);

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

//持ち物追加ボタン
addItemButton.addEventListener("click", () => {

    addItem(
        itemInput,
        addItems,
        itemList
    );

});

//編集画面での持ち物追加ボタン
editAddItemButton.addEventListener("click", () => {

    addItem(
        editItemInput,
        editItems,
        editItemList
    );

});

function initializeTodo() {

    loadTasks();
    renderTasks(tasks);
    loadSubjects(subjectInput);
    loadSubjects(editSubject);
    loadTags(tagInput);
    loadTags(editTagInput);
    
}