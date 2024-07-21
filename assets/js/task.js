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

document.addEventListener("DOMContentLoaded", loadTasks)

let isEditing = false // 편집 모드 플래그
let editingTaskId = null // 편집 중인 태스크 ID

// 한국 시간대로 변환하는 함수
const toKoreaTime = (date) => {
  const koreaOffset = 9 * 60 // 한국 시간은 UTC+9
  const currentOffset = date.getTimezoneOffset()
  const offset = koreaOffset - currentOffset
  return new Date(date.getTime() + offset * 60 * 1000)
}

function loadTasks() {
  const pendingTasks = JSON.parse(localStorage.getItem("pendingTasks")) || []
  const completedTasks =
    JSON.parse(localStorage.getItem("completedTasks")) || []

  if (pendingTasks.length === 0) {
    document.getElementById("noPendingTasks").style.display = "table-row"
  } else {
    document.getElementById("noPendingTasks").style.display = "none"

    pendingTasks.forEach((task) => addTaskToDOM(task, false))
  }

  if (completedTasks.length === 0) {
    document.getElementById("noCompletedTasks").style.display = "table-row"
  } else {
    document.getElementById("noCompletedTasks").style.display = "none"
    completedTasks.forEach((task) => addTaskToDOM(task, true))
  }
}

function addTask() {
  const taskInput = document.getElementById("task")
  const deadlineInput = document.getElementById("deadline")
  const categoryInput = document.getElementById("category")

  if (taskInput.value === "" || deadlineInput.value === "") {
    alert("Please enter a task, deadline, and category.")
    return
  }

  const task = {
    id: Date.now(),
    text: taskInput.value,
    deadline: deadlineInput.value,
    dateAdded: new Date().toLocaleDateString(),
    category: categoryInput.value,
    completed: false,
    favorite: false,
  }

  addTaskToDOM(task, false)

  const pendingTasks = JSON.parse(localStorage.getItem("pendingTasks")) || []
  pendingTasks.push(task)
  localStorage.setItem("pendingTasks", JSON.stringify(pendingTasks))

  taskInput.value = ""
  deadlineInput.value = ""
  categoryInput.value = "Personal"

  document.getElementById("noPendingTasks").style.display = "none"
}

document.getElementById("pend-filter").addEventListener("change", function () {
  const filter = this.value
  console.log("filter : ", filter)
  filterTasks(filter, "pend")
})
document.getElementById("comp-filter").addEventListener("change", function () {
  const filter = this.value
  console.log("filter : ", filter)
  filterTasks(filter, "comp")
})

function filterTasks(filter, element) {
  let pcTasks = ""
  if (element == "pend") {
    pcTasks = JSON.parse(localStorage.getItem("pendingTasks")) || []
  } else if (element == "comp") {
    pcTasks = JSON.parse(localStorage.getItem("completedTasks")) || []
  }

  console.log("pcTasks : ", pcTasks)
  let filteredTasks = []

  const today = moment().startOf("day")
  const startOfWeek = moment().startOf("week")
  const endOfWeek = moment().endOf("week")
  const startOfMonth = moment().startOf("month")
  const endOfMonth = moment().endOf("month")

  console.log(today)

  if (filter === "all") {
    filteredTasks = pcTasks
  } else if (filter === "favorite") {
    filteredTasks = pcTasks.filter((task) => task.favorite)
  } else if (filter === "daily") {
    console.log("daily pcTasks : ", pcTasks)
    filteredTasks = pcTasks.filter((task) => {
      const deadline = moment(task.deadline)
      return deadline.isSame(today, "day")
    })
  } else if (filter === "weekly") {
    console.log("weekly pcTasks : ", pcTasks)
    filteredTasks = pcTasks.filter((task) => {
      const deadline = moment(task.deadline)
      return deadline.isBetween(startOfWeek, endOfWeek, null, "[]")
    })
  } else if (filter === "monthly") {
    console.log("monthly pcTasks : ", pcTasks)
    filteredTasks = pcTasks.filter((task) => {
      const deadline = moment(task.deadline)
      return deadline.isBetween(startOfMonth, endOfMonth, null, "[]")
    })
  }
  console.log("filteredTasks : ", filteredTasks)
  element === "pend" ? pendTasks(filteredTasks) : compTasks(filteredTasks)
}

function pendTasks(tasks) {
  const pendingTasksElement = document.getElementById("pendingTasks")
  console.log("pendingTasksElement: ", pendingTasksElement)

  const noPendingTasksElement = document.getElementById("noPendingTasks")

  if (tasks.length === 0) {
    pendingTasksElement.innerHTML = `<tr id="noPendingTasks" style="display: table-row;">
                            <td colspan="7" class="text-center no-task">
                                No tasks registered.
                            </td>
                        </tr>` // 기존 태스크 목록을 비웁니다.
  } else {
    if (noPendingTasksElement) {
      noPendingTasksElement.style.display = "none"
    }
    pendingTasksElement.innerHTML = "" // 기존 태스크 목록을 비웁니다.
    tasks.forEach((task) => addTaskToDOM(task, false))
  }
}
function compTasks(tasks) {
  const completedTasksElement = document.getElementById("completedTasks")
  console.log("completedTasksElement: ", completedTasksElement)

  const noCompletedTasksElement = document.getElementById("noCompletedTasks")

  if (tasks.length === 0) {
    completedTasksElement.innerHTML = `<tr id="noCompletedTasks" style="display: table-row;">
                            <td colspan="7" class="text-center no-task">
                                No tasks registered.
                            </td>
                        </tr>` // 기존 태스크 목록을 비웁니다.
  } else {
    if (noCompletedTasksElement) {
      noCompletedTasksElement.style.display = "none"
    }
    completedTasksElement.innerHTML = "" // 기존 태스크 목록을 비웁니다.
    tasks.forEach((task) => addTaskToDOM(task, true))
  }
}

function addTaskToDOM(task, isCompleted) {
  const taskRow = document.createElement("tr")
  taskRow.setAttribute("data-id", task.id)
  taskRow.innerHTML = `
    <td>
      <button class="favorite-button" onclick="toggleFavorite(this)">
       ${
         task.favorite
           ? '<i class="fa-solid fa-heart"></i>'
           : '<i class="fa-regular fa-heart"></i>'
       }
      </button>
    </td>
    <td class="${task.completed ? "completed" : ""}">${task.text}</td>
    <td><span>${task.category}</span></td>
    <td>${moment(task.deadline).format("YY.MM.DD HH:mm")}</td>
    <div class="icon-box">
    ${
      isCompleted
        ? '<td><button class="fill-button" onclick="cancelCompleteTask(this)"><i class="fas fa-undo"></i></button></td>'
        : '<td><button class="fill-button" onclick="editTask(this)"><i class="fas fa-edit"></i></button></td>'
    }
    ${
      isCompleted
        ? ""
        : '<td><button class="fill-button" onclick="completeTask(this)"><i class="fas fa-check"></i></button></td>'
    }
    <td><button class="fill-button" onclick="deleteTask(this, ${isCompleted})"><i class="fas fa-trash"></i></button></td>
    </div>
    `

  document
    .getElementById(isCompleted ? "completedTasks" : "pendingTasks")
    .appendChild(taskRow)
}

function editTask(button) {
  const row = button.parentElement.parentElement
  const taskId = row.getAttribute("data-id")

  let pendingTasks = JSON.parse(localStorage.getItem("pendingTasks")) || []
  let completedTasks = JSON.parse(localStorage.getItem("completedTasks")) || []
  let task =
    pendingTasks.find((task) => task.id == taskId) ||
    completedTasks.find((task) => task.id == taskId)

  if (task) {
    document.getElementById("task").value = task.text
    document.getElementById("deadline").value = task.deadline
    document.getElementById("category").value = task.category
    isEditing = true
    editingTaskId = taskId

    addTaskOpen()
  }
}
function updateTaskInLocalStorage(updatedTask) {
  let pendingTasks = JSON.parse(localStorage.getItem("pendingTasks")) || []
  let completedTasks = JSON.parse(localStorage.getItem("completedTasks")) || []

  console.log("Updated Task ID:", updatedTask.id)
  pendingTasks.forEach((task) => console.log("Pending Task ID:", task.id))
  completedTasks.forEach((task) => console.log("Completed Task ID:", task.id))

  // pendingTasks 배열에서 해당 task를 찾고 업데이트
  const pendingTaskIndex = pendingTasks.findIndex(
    (task) => task.id == updatedTask.id
  )
  console.log("pendingTaskIndex", pendingTaskIndex)
  if (pendingTaskIndex > -1) {
    pendingTasks[pendingTaskIndex] = updatedTask
  } else {
    // completedTasks 배열에서 해당 task를 찾고 업데이트
    const completedTaskIndex = completedTasks.findIndex(
      (task) => task.id == updatedTask.id
    )
    if (completedTaskIndex > -1) {
      completedTasks[completedTaskIndex] = updatedTask
    }
  }

  // 수정된 배열을 로컬 스토리지에 저장
  localStorage.setItem("pendingTasks", JSON.stringify(pendingTasks))
  localStorage.setItem("completedTasks", JSON.stringify(completedTasks))

  // DOM을 다시 로드하여 변경 사항 반영
  location.reload(true)
  //loadTasks();
}
function completeTask(button) {
  const row = button.parentElement.parentElement
  const taskId = row.getAttribute("data-id")

  let pendingTasks = JSON.parse(localStorage.getItem("pendingTasks")) || []
  let completedTasks = JSON.parse(localStorage.getItem("completedTasks")) || []

  const taskIndex = pendingTasks.findIndex((task) => task.id == taskId)
  const [task] = pendingTasks.splice(taskIndex, 1)
  task.completed = true
  completedTasks.push(task)

  localStorage.setItem("pendingTasks", JSON.stringify(pendingTasks))
  localStorage.setItem("completedTasks", JSON.stringify(completedTasks))

  row.remove()
  addTaskToDOM(task, true)

  if (pendingTasks.length === 0) {
    document.getElementById("noPendingTasks").style.display = "table-row"
  }

  document.getElementById("noCompletedTasks").style.display = "none"
}

function cancelCompleteTask(button) {
  const row = button.parentElement.parentElement
  const taskId = row.getAttribute("data-id")

  let pendingTasks = JSON.parse(localStorage.getItem("pendingTasks")) || []
  let completedTasks = JSON.parse(localStorage.getItem("completedTasks")) || []

  const taskIndex = completedTasks.findIndex((task) => task.id == taskId)
  const [task] = completedTasks.splice(taskIndex, 1)
  task.completed = false
  pendingTasks.push(task)

  localStorage.setItem("pendingTasks", JSON.stringify(pendingTasks))
  localStorage.setItem("completedTasks", JSON.stringify(completedTasks))

  row.remove()
  addTaskToDOM(task, false)

  if (completedTasks.length === 0) {
    document.getElementById("noCompletedTasks").style.display = "table-row"
  }

  document.getElementById("noPendingTasks").style.display = "none"
}

function deleteTask(button, isCompleted) {
  const row = button.parentElement.parentElement
  const taskId = row.getAttribute("data-id")

  let tasks =
    JSON.parse(
      localStorage.getItem(isCompleted ? "completedTasks" : "pendingTasks")
    ) || []
  tasks = tasks.filter((task) => task.id != taskId)

  localStorage.setItem(
    isCompleted ? "completedTasks" : "pendingTasks",
    JSON.stringify(tasks)
  )

  row.remove()

  if (!isCompleted && tasks.length === 0) {
    document.getElementById("noPendingTasks").style.display = "table-row"
  }

  if (isCompleted && tasks.length === 0) {
    document.getElementById("noCompletedTasks").style.display = "table-row"
  }
}

function toggleFavorite(button) {
  const row = button.parentElement.parentElement
  const taskId = row.getAttribute("data-id")
  let pendingTasks = JSON.parse(localStorage.getItem("pendingTasks")) || []
  let completedTasks = JSON.parse(localStorage.getItem("completedTasks")) || []
  let task =
    pendingTasks.find((task) => task.id == taskId) ||
    completedTasks.find((task) => task.id == taskId)

  if (task) {
    task.favorite = !task.favorite
    button.innerHTML = task.favorite
      ? '<i class="fa-solid fa-heart"></i>'
      : '<i class="fa-regular fa-heart"></i>'

    localStorage.setItem("pendingTasks", JSON.stringify(pendingTasks))
    localStorage.setItem("completedTasks", JSON.stringify(completedTasks))
  }
}

function addTaskOpen() {
  const modal = document.querySelector(".taskModal-wrap")
  modal.style.display = "block"
  setTimeout(() => {
    modal.style.opacity = 1
  }, 10)

  // 오늘 날짜와 현재 시간을 기본 값으로 설정
  if (isEditing == false) {
    let deadlineInput = document.getElementById("deadline")
    const now = new Date()
    const formattedDate = now.toISOString().slice(0, 16) // "YYYY-MM-DDTHH:MM" 형식
    deadlineInput.value = toKoreaTime(formattedDate)
  }
}

function addTaskClose() {
  const modal = document.querySelector(".taskModal-wrap")
  modal.style.opacity = 0
  setTimeout(() => {
    modal.style.display = "none"
  }, 250)

  // 모달을 닫을 때 입력 필드를 초기화
  document.getElementById("task").value = ""
  document.getElementById("deadline").value = ""
  document.getElementById("category").value = "Personal"
  isEditing = false
  editingTaskId = null
}

function confirmTask() {
  if (isEditing) {
    const updatedTask = {
      id: editingTaskId,
      text: document.getElementById("task").value,
      deadline: document.getElementById("deadline").value,
      dateAdded: new Date().toLocaleDateString(),
      category: document.getElementById("category").value,
      completed: false, // 여기가 문제가 될 수 있음. 실제 태스크의 완료 상태를 유지하도록 수정 필요
      favorite: false, // 여기도 문제가 될 수 있음. 실제 태스크의 즐겨찾기 상태를 유지하도록 수정 필요
    }

    // 기존 태스크의 completed 및 favorite 상태를 유지하도록 수정
    let pendingTasks = JSON.parse(localStorage.getItem("pendingTasks")) || []
    let completedTasks =
      JSON.parse(localStorage.getItem("completedTasks")) || []
    let task =
      pendingTasks.find((task) => task.id == editingTaskId) ||
      completedTasks.find((task) => task.id == editingTaskId)

    if (task) {
      updatedTask.completed = task.completed
      updatedTask.favorite = task.favorite
    }

    updateTaskInLocalStorage(updatedTask)
  } else {
    addTask()
  }
  addTaskClose()
}
