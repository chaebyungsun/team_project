/**
 * Dashboard Task : 대쉬보드에 할 일을 렌더링
 * TaskRender 함수는 로컬 스토리지에 저장된 deadline 데이터를 가져와서
 * 오늘 날짜와 비교하여 오늘 할 일과 내일 할 일을 구분하여 렌더링
 */

// HTML 문서의 모든 요소가 로드된 후 실행
document.addEventListener("DOMContentLoaded", () => {
  // 로컬 스토리지에 저장된 pendingTasks 데이터를 가져오고, 데이터가 없으면 빈 배열로 초기화
  const pendingTasks = JSON.parse(localStorage.getItem("pendingTasks")) || []

  // 할 일 목록을 표시할 요소 선택
  const taskToday = document.querySelector(".todo-dash-today")
  const taskTomorrow = document.querySelector(".todo-dash-tomorrow")

  // 한국 시간대로 변환하는 함수
  const toKoreaTime = (date) => {
    const koreaOffset = 9 * 60 // 한국 시간은 UTC+9
    const currentOffset = date.getTimezoneOffset()
    const offset = koreaOffset - currentOffset
    return new Date(date.getTime() + offset * 60 * 1000)
  }

  // 오늘과 내일 할 일 렌더링 함수
  const renderDateTasks = () => {
    // 오늘 날짜 가져오기
    const today = toKoreaTime(new Date()).toISOString().split("T")[0]
    // 내일 날짜 객체 생성
    const tomorrow = new Date(toKoreaTime(new Date()))
    // 내일 날짜로 설정
    tomorrow.setDate(tomorrow.getDate() + 1)
    // 내일 날짜를 "YYYY-MM-DD" 형식으로 가져오기
    const tomorrowString = toKoreaTime(tomorrow).toISOString().split("T")[0]

    // 기존 할 일 목록 초기화하고 타이틀 요소는 유지
    taskToday.innerHTML = `
      <li class="todo-dash-title">
        <div>
          <img src="./assets/images/calendar.png" alt="달력 아이콘" />
          <h3>Today</h3>
        </div>
      </li>`
    taskTomorrow.innerHTML = `
      <li class="todo-dash-title">
        <div>
          <img src="./assets/images/calendar.png" alt="달력 아이콘" />
          <h3>Tomorrow</h3>
        </div>
      </li>`

    let hasTasksToday = false
    let hasTasksTomorrow = false

    // 저장된 할 일 목록을 순회하며 날짜에 맞는 할 일을 추가
    pendingTasks.forEach((task) => {
      const taskDate = toKoreaTime(new Date(task.deadline))
        .toISOString()
        .split("T")[0] // 할 일의 날짜 가져오기
      const taskTime = task.deadline.split("T")[1] // 할 일의 시간 가져오기

      // 오늘 날짜와 할 일의 날짜가 같은 경우
      if (today === taskDate) {
        const li = document.createElement("li")
        taskToday.appendChild(li)
        li.innerHTML = `
          <div>
            <div class="state-box"></div>
            <span>${task.text}</span>
          </div>
          <span>${taskTime}</span>
        `
        hasTasksToday = true
      } // 내일 날짜와 할 일의 날짜가 같은 경우
      else if (tomorrowString === taskDate) {
        const li = document.createElement("li")
        taskTomorrow.appendChild(li)
        li.innerHTML = `
          <div>
            <div class="state-box"></div>
            <span>${task.text}</span>
          </div>
          <span>${taskTime}</span>
        `
        hasTasksTomorrow = true
      }
    })

    // 오늘 할 일이 없는 경우
    if (!hasTasksToday) {
      const li = document.createElement("li")
      taskToday.appendChild(li)
      li.innerHTML = `
        <div>
          <div class="state-box"></div>
          <span>No tasks for today.</span>
        </div>`
    }

    // 내일 할 일이 없는 경우
    if (!hasTasksTomorrow) {
      const li2 = document.createElement("li")
      taskTomorrow.appendChild(li2)
      li2.innerHTML = `
        <div>
          <div class="state-box"></div>
          <span>No tasks for tomorrow.</span>
        </div>`
    }
  }

  // 페이지 로드 시 오늘과 내일의 할 일 렌더링
  renderDateTasks()
})
