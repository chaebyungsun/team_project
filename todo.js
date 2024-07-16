/**
 * TODO:자바스클비트 내용구성
 * 	•	loadTasks: 로컬 스토리지를 확인하여 태스크를 표시하거나 “등록된 데이터가 없습니다” 메시지를 적절히 표시합니다.
	•	addTask: 새로운 태스크를 진행 중인 태스크 목록에 추가하고 필요 시 “등록된 데이터가 없습니다” 메시지를 숨깁니다.
	•	addTaskToDOM: 태스크를 적절한 섹션(진행 중 또는 완료됨)에 표시하고, 완료된 태스크에는 “완료 취소” 버튼을 포함합니다.
	•	editTask: 태스크 데이터를 입력 필드에 로드하여 편집할 수 있도록 하고 목록에서 태스크를 제거합니다.
	•	completeTask: 태스크를 진행 중에서 완료됨으로 이동하고 DOM과 로컬 스토리지를 업데이트합니다.
	•	cancelCompleteTask: 태스크를 완료됨에서 다시 진행 중으로 이동하고 DOM과 로컬 스토리지를 업데이트합니다.
	•	deleteTask: 적절한 섹션에서 태스크를 삭제하고 필요 시 “등록된 데이터가 없습니다” 메시지를 표시합니다.
 */

// app.js

// app.js

document.addEventListener("DOMContentLoaded", loadTasks);

function loadTasks() {
    const pendingTasks = JSON.parse(localStorage.getItem("pendingTasks")) || [];
    const completedTasks = JSON.parse(localStorage.getItem("completedTasks")) || [];

    if (pendingTasks.length === 0) {
        document.getElementById("noPendingTasks").style.display = "table-row";
    } else {
        document.getElementById("noPendingTasks").style.display = "none";
        pendingTasks.forEach((task) => addTaskToDOM(task, false));
    }

    if (completedTasks.length === 0) {
        document.getElementById("noCompletedTasks").style.display = "table-row";
    } else {
        document.getElementById("noCompletedTasks").style.display = "none";
        completedTasks.forEach((task) => addTaskToDOM(task, true));
    }
}

function addTask() {
    const taskInput = document.getElementById("task");
    const deadlineInput = document.getElementById("deadline");
    const categoryInput = document.getElementById("category");

    if (taskInput.value === "" || deadlineInput.value === "") {
        alert("Please enter a task, deadline, and category.");
        return;
    }

    const task = {
        id: Date.now(),
        text: taskInput.value,
        deadline: deadlineInput.value,
        dateAdded: new Date().toLocaleDateString(),
        category: categoryInput.value,
        completed: false,
    };

    addTaskToDOM(task, false);

    const pendingTasks = JSON.parse(localStorage.getItem("pendingTasks")) || [];
    pendingTasks.push(task);
    localStorage.setItem("pendingTasks", JSON.stringify(pendingTasks));

    taskInput.value = "";
    deadlineInput.value = "";
    categoryInput.value = "Personal";

    document.getElementById("noPendingTasks").style.display = "none";
}

function addTaskToDOM(task, isCompleted) {
    const taskRow = document.createElement("tr");
    taskRow.setAttribute("data-id", task.id);
    taskRow.innerHTML = `
    <td>${task.dateAdded}</td>
    <td class="${task.completed ? "completed" : ""}">${task.text}</td>
    <td>${task.deadline}</td>
    <td>${task.category}</td>
    ${isCompleted ? '<td><button class="btn btn-warning" onclick="cancelCompleteTask(this)"><i class="fas fa-undo"></i></button></td>' : '<td><button class="btn btn-warning" onclick="editTask(this)"><i class="fas fa-edit"></i></button></td>'}
    ${isCompleted ? "" : '<td><button class="btn btn-success" onclick="completeTask(this)"><i class="fas fa-check"></i></button></td>'}
    <td><button class="btn btn-danger" onclick="deleteTask(this, ${isCompleted})"><i class="fas fa-trash"></i></button></td>
  `;

    document.getElementById(isCompleted ? "completedTasks" : "pendingTasks").appendChild(taskRow);
}

function editTask(button) {
    const row = button.parentElement.parentElement;
    const taskId = row.getAttribute("data-id");
    const taskText = row.children[1].innerText;
    const taskDeadline = row.children[2].innerText;
    const taskCategory = row.children[3].innerText;

    document.getElementById("task").value = taskText;
    document.getElementById("deadline").value = taskDeadline;
    document.getElementById("category").value = taskCategory;

    deleteTask(button, false);
}

function completeTask(button) {
    const row = button.parentElement.parentElement;
    const taskId = row.getAttribute("data-id");

    let pendingTasks = JSON.parse(localStorage.getItem("pendingTasks")) || [];
    let completedTasks = JSON.parse(localStorage.getItem("completedTasks")) || [];

    const taskIndex = pendingTasks.findIndex((task) => task.id == taskId);
    const [task] = pendingTasks.splice(taskIndex, 1);
    task.completed = true;
    completedTasks.push(task);

    localStorage.setItem("pendingTasks", JSON.stringify(pendingTasks));
    localStorage.setItem("completedTasks", JSON.stringify(completedTasks));

    row.remove();
    addTaskToDOM(task, true);

    if (pendingTasks.length === 0) {
        document.getElementById("noPendingTasks").style.display = "table-row";
    }

    document.getElementById("noCompletedTasks").style.display = "none";
}

function cancelCompleteTask(button) {
    const row = button.parentElement.parentElement;
    const taskId = row.getAttribute("data-id");

    let pendingTasks = JSON.parse(localStorage.getItem("pendingTasks")) || [];
    let completedTasks = JSON.parse(localStorage.getItem("completedTasks")) || [];

    const taskIndex = completedTasks.findIndex((task) => task.id == taskId);
    const [task] = completedTasks.splice(taskIndex, 1);
    task.completed = false;
    pendingTasks.push(task);

    localStorage.setItem("pendingTasks", JSON.stringify(pendingTasks));
    localStorage.setItem("completedTasks", JSON.stringify(completedTasks));

    row.remove();
    addTaskToDOM(task, false);

    if (completedTasks.length === 0) {
        document.getElementById("noCompletedTasks").style.display = "table-row";
    }

    document.getElementById("noPendingTasks").style.display = "none";
}

function deleteTask(button, isCompleted) {
    const row = button.parentElement.parentElement;
    const taskId = row.getAttribute("data-id");

    let tasks = JSON.parse(localStorage.getItem(isCompleted ? "completedTasks" : "pendingTasks")) || [];
    tasks = tasks.filter((task) => task.id != taskId);

    localStorage.setItem(isCompleted ? "completedTasks" : "pendingTasks", JSON.stringify(tasks));

    row.remove();

    if (!isCompleted && tasks.length === 0) {
        document.getElementById("noPendingTasks").style.display = "table-row";
    }

    if (isCompleted && tasks.length === 0) {
        document.getElementById("noCompletedTasks").style.display = "table-row";
    }
}
