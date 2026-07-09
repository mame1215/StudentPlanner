//=================subject==================

let editingSubjectId = null;

let subjectDefaultItems = [];

let editSubjectDefaultItems = [];

const subjectList =
    document.getElementById("subjectList");

const subjectNameInput =
    document.getElementById("subjectNameInput");

const subjectColorInput =
    document.getElementById("subjectColorInput");

const addSubjectButton =
    document.getElementById("addSubjectButton");

const subjectDefaultItemList =
    document.getElementById(
        "subjectDefaultItemList"
    );

const subjectDefaultItemInput =
    document.getElementById(
        "subjectDefaultItemInput"
    );

const addSubjectDefaultItemButton =
    document.getElementById(
        "addSubjectDefaultItemButton"
    );


const subjectModal =
    document.getElementById("subjectModal");

const editSubjectName =
    document.getElementById("editSubjectName");

const editSubjectColor =
    document.getElementById("editSubjectColor");

const saveSubjectButton =
    document.getElementById("saveSubjectButton");

const cancelSubjectButton =
    document.getElementById("cancelSubjectButton");

const editSubjectDefaultItemList =
    document.getElementById(
        "editSubjectDefaultItemList"
    );

const editSubjectDefaultItemInput =
    document.getElementById(
        "editSubjectDefaultItemInput"
    );

const editSubjectDefaultItemButton =
    document.getElementById(
        "editSubjectDefaultItemButton"
    );



function getSubjectFormData() {

    return {

        name:
            subjectNameInput.value.trim(),

        color:
            subjectColorInput.value,

        defaultItems:
            [...subjectDefaultItems]

    };

}

function getEditSubjectFormData() {

    return {

        name:
            editSubjectName.value.trim(),

        color:
            editSubjectColor.value,

        defaultItems:
            [...editSubjectDefaultItems]

    };

}

function addSubject(form) {

    subjects.push({

        id: Date.now(),

        name: form.name,

        color: form.color,

        defaultItems:
            [...form.defaultItems]

    });

    saveSubjects();

}

function updateSubject(subject, form) {

    subject.name = form.name;

    subject.color = form.color;

    subject.defaultItems = [...form.defaultItems];

    saveSubjects();

}

function deleteSubject(id) {

    for (const task of tasks) {

        if (task.subjectId === id) {

            task.subjectId = null;

        }

    }

    for (const event of events) {

        if (event.subjectId === id) {

            event.subjectId = null;

        }

    }

    const index =
        subjects.findIndex(
            subject => subject.id === id
        );

    if (index === -1) {

        return;

    }

    subjects.splice(index, 1);

    saveSubjects();

    saveTasks();

    saveEvents();

    renderSubjects();

    renderTasks(tasks);

    renderEvents(events);

    refreshSubjectInputs();

}

function clearSubjectForm() {

    subjectNameInput.value = "";

    subjectColorInput.value = "#4285F4";

    subjectDefaultItems.length = 0;

    renderItemList(

        subjectDefaultItemList,

        subjectDefaultItems

    )

}

function submitSubject() {

    const form =
        getSubjectFormData();

    if (subjects.some(subject =>
        subject.name === form.name
    )) {

        showConfirmDialog(
            "同じ名前の教科があります。",
            false
        );

        return;
    }

    if (form.name === "") {

        return;

    }

    addSubject(form);

    renderSubjects();

    refreshSubjectInputs();

    clearSubjectForm();

}

function renderSubjects() {

    subjectList.innerHTML = "";

    for (const subject of subjects) {

        subjectList.appendChild(

            createSubjectElement(subject)

        );

    }

}

function createSubjectElement(subject) {

    const li = document.createElement("li");

    const label =
        document.createElement("span");

    label.textContent =
        subject.name;

    label.classList.add("label");

    label.style.backgroundColor =
        subject.color;

    label.style.color = "white";

    li.appendChild(label);

    const actions =
        document.createElement("div");

    actions.classList.add("task-actions");

    const editButton =
        document.createElement("button");

    editButton.textContent = "🖋️";

    editButton.addEventListener("click", () => {

        openEditSubjectModal(subject);

    });

    actions.appendChild(editButton);

    li.appendChild(actions);

    const deleteButton =
        document.createElement("button");

    deleteButton.textContent = "🗑️";

    actions.appendChild(deleteButton);

    deleteButton.addEventListener("click", async () => {

        const result =
            await showConfirmDialog(
                "この教科を削除しますか？"
            );

        if (!result) {

            return;

        }

        deleteSubject(subject.id);

    });

    return li;

}

function saveSubjects() {

    localStorage.setItem(
        "subjects",
        JSON.stringify(subjects)
    );

}

function loadSubjectsData() {

    const data =
        localStorage.getItem("subjects");

    if (data === null) {

        return;

    }

    const loadedSubjects =
        JSON.parse(data);

    subjects.length = 0;

    subjects.push(...loadedSubjects);

}

function openEditSubjectModal(subject) {

    editingSubjectId = subject.id;

    editSubjectName.value =
        subject.name;

    editSubjectColor.value =
        subject.color;

    editSubjectDefaultItems.length = 0;

    editSubjectDefaultItems.push(

        ...(subject.defaultItems ?? [])

    );

    renderItemList(

        editSubjectDefaultItemList,

        editSubjectDefaultItems

    );

    editSubjectName.focus();

    editSubjectName.select();

    subjectModal.classList.remove("hidden");

}

function closeEditSubjectModal() {

    subjectModal.classList.add("hidden");

    editingSubjectId = null;

    document.activeElement.blur();

}

function refreshSubjectInputs() {

    loadSubjects(subjectInput);
    loadSubjects(editSubject);
    loadSubjects(eventSubjectInput);
    loadSubjects(editEventSubject);

}


addSubjectButton.addEventListener("click", () => {

    submitSubject();

});

subjectNameInput.addEventListener("keydown", event => {

    if (event.key === "Enter") {

        submitSubject();

    }

});

cancelSubjectButton.addEventListener("click", () => {

    closeEditSubjectModal();

});

subjectModal.addEventListener("click", event => {

    if (event.target === subjectModal) {

        closeEditSubjectModal();

    }

});

saveSubjectButton.addEventListener("click", () => {

    const subject = subjects.find(
        subject => subject.id === editingSubjectId
    );

    if (!subject) {

        return;

    }

    const form =
        getEditSubjectFormData();

    if (subjects.some(subject =>

        subject.id !== editingSubjectId &&
        subject.name === form.name
    )) {

        showConfirmDialog(
            "同じ名前の教科があります。",
            false
        );

        return;
    }

    if (form.name === "") {

        return;

    }

    updateSubject(
        subject,
        form
    );

    renderSubjects();

    refreshSubjectInputs();

    closeEditSubjectModal();

});

addSubjectDefaultItemButton.addEventListener(
    "click",
    () => {

        addItem(

            subjectDefaultItemInput,

            subjectDefaultItems,

            subjectDefaultItemList

        );

    }
);

editSubjectDefaultItemButton.addEventListener(
    "click",
    () => {

        addItem(

            editSubjectDefaultItemInput,

            editSubjectDefaultItems,

            editSubjectDefaultItemList

        );

    }
);

//====================tag======================

const tagList =
    document.getElementById("tagList");

const tagNameInput =
    document.getElementById("tagNameInput");

const tagColorInput =
    document.getElementById("tagColorInput");

const addTagButton =
    document.getElementById("addTagButton");


let editingTagId = null;

const tagModal =
    document.getElementById("tagModal");

const editTagName =
    document.getElementById("editTagName");

const editTagColor =
    document.getElementById("editTagColor");

const saveTagButton =
    document.getElementById("saveTagButton");

const cancelTagButton =
    document.getElementById("cancelTagButton");


function getTagFormData() {

    return {

        name:
            tagNameInput.value.trim(),

        color:
            tagColorInput.value
    };

}

function getEditTagFormData() {

    return {

        name:
            editTagName.value.trim(),

        color:
            editTagColor.value

    };

}

function addTag(form) {

    tags.push({

        id: Date.now(),

        name: form.name,

        color: form.color
    });

    saveTags();
}

function updateTag(tag, form) {

    tag.name = form.name;

    tag.color = form.color;

    saveTags();

}

function deleteTag(id) {

    for (const task of tasks) {

        task.tagIds =
            task.tagIds.filter(
                tagId => tagId !== id
            );

    }

    for (const event of events) {

        event.tagIds =
            event.tagIds.filter(
                tagId => tagId !== id
            );

    }

    const index =
        tags.findIndex(
            tag => tag.id === id
        );

    if (index === -1) {

        return;

    }

    tags.splice(index, 1);

    saveTags();

    saveTasks();

    saveEvents();

    renderTags();

    refreshTagInputs();

    renderTasks(tasks);

    renderEvents(events);

}

function clearTagForm() {

    tagNameInput.value = "";

    tagColorInput.value = "#ef5350";

}

function saveTags() {

    localStorage.setItem(
        "tags",
        JSON.stringify(tags)
    );

}

function loadTagsData() {

    const data =
        localStorage.getItem("tags");

    if (data === null) {

        return;

    }

    const loadedTags =
        JSON.parse(data);

    tags.length = 0;

    tags.push(...loadedTags);

}

function openEditTagModal(tag) {

    editingTagId = tag.id;

    editTagName.value =
        tag.name;

    editTagColor.value =
        tag.color;

    editTagName.focus();

    editTagName.select();

    tagModal.classList.remove("hidden");

}

function closeEditTagModal() {

    tagModal.classList.add("hidden");

    editingTagId = null;

    document.activeElement.blur();

}

function renderTags() {

    tagList.innerHTML = "";

    for (const tag of tags) {

        tagList.appendChild(

            createTagElement(tag)

        );

    }

}

function createTagElement(tag) {

    const li =
        document.createElement("li");

    const label =
        document.createElement("span");

    label.classList.add("label");

    label.textContent = tag.name;

    label.style.backgroundColor =
        tag.color;

    label.style.color = "white";

    li.appendChild(label);

    const actions =
        document.createElement("div");

    actions.classList.add("task-actions");

    const editButton =
        document.createElement("button");

    editButton.textContent = "🖋️";

    const deleteButton =
        document.createElement("button");

    deleteButton.textContent = "🗑️";

    editButton.addEventListener("click", () => {

        openEditTagModal(tag);

    });

    deleteButton.addEventListener("click", async () => {

        const result =
            await showConfirmDialog(
                "このタグを削除しますか？"
            );

        if (!result) {

            return;

        }

        deleteTag(tag.id);

    });

    actions.appendChild(editButton);
    actions.appendChild(deleteButton);

    li.appendChild(actions);

    return li;

}

function submitTag() {

    const form =
        getTagFormData();

    if (form.name === "") {

        return;

    }

    if (tags.some(tag =>
        tag.name === form.name
    )) {

        showConfirmDialog(
            "同じ名前のタグがあります。",
            false
        );

        return;

    }

    addTag(form);

    renderTags();

    refreshTagInputs();

    clearTagForm();

}

function refreshTagInputs() {

    loadTags(eventTagInput);

    loadTags(editEventTagInput);

    loadTags(tagInput);

    loadTags(editTagInput);

}

addTagButton.addEventListener("click", () => {

    submitTag();

});

tagNameInput.addEventListener("keydown", event => {

    if (event.key === "Enter") {

        submitTag();

    }

});

cancelTagButton.addEventListener("click", () => {

    closeEditTagModal();

});

tagModal.addEventListener("click", event => {

    if (event.target === tagModal) {

        closeEditTagModal();

    }

});

saveTagButton.addEventListener("click", () => {

    const tag = tags.find(
        tag => tag.id === editingTagId
    );

    if (!tag) {

        return;

    }

    const form =
        getEditTagFormData();

    if (form.name === "") {

        return;

    }

    if (tags.some(tag =>

        tag.id !== editingTagId &&
        tag.name === form.name

    )) {

        showConfirmDialog(
            "同じ名前のタグがあります。",
            false
        );

        return;

    }

    updateTag(
        tag,
        form
    );

    renderTags();

    refreshTagInputs();

    renderTasks(tasks);

    renderEvents(events);

    closeEditTagModal();

});
   
//======================================================

function initializeSettings() {

    loadSubjectsData();

    renderSubjects();

    loadSubjects(subjectInput);
    loadSubjects(editSubject);
    loadSubjects(eventSubjectInput);
    loadSubjects(editEventSubject);

    loadTagsData();

    renderTags();

    refreshTagInputs();

}