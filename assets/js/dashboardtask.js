/**
 * Dashboard Task : 대쉬보드에 할 일을 렌더링
 * TaskRender 함수는 로컬 스토리지에 저장된 deadline 데이터를 가져와서
 * 오늘 날짜와 비교하여 오늘 할 일과 내일 할 일을 구분하여 렌더링
 * MonthToNumber 함수는 월 이름을 숫자로 변환하는 함수
 * RenderTaskTitle 함수는 클릭한 날짜에 따라 할 일 타이틀을 렌더링
 * RenderDateTasks 함수는 클릭한 날짜의 할 일을 렌더링
 * RenderDailyTasks 함수는 할 일이 없는 경우 "할 일이 없습니다" 메시지를 렌더링하고,
 * 할 일이 있으면 선택된 날짜와 다음 날 할 일을 뿌려주는 함수
 * CheckedDate 함수는 대쉬보드 내 캘린더 날짜를 가져와서
 * 연 월 일을 합쳐서 YYYY-MM-DD 형식으로 반환하고 클릭한 날짜에 active 클래스를 추가하는 함수
 *
 */

// 한국 시간대로 변환하는 함수
const toKoreaTime = (date) => {
  const koreaOffset = 9 * 60 // 한국 시간은 UTC+9
  const currentOffset = date.getTimezoneOffset()
  const offset = koreaOffset - currentOffset
  return new Date(date.getTime() + offset * 60 * 1000)
}

// HTML 문서의 모든 요소가 로드된 후 실행
document.addEventListener("DOMContentLoaded", () => {
  // 로컬 스토리지에 저장된 pendingTasks 데이터를 가져오고, 데이터가 없으면 빈 배열로 초기화
  const pendingTasks = JSON.parse(localStorage.getItem("pendingTasks")) || []

  // 할 일 목록을 표시할 요소 선택
  const taskToday = document.querySelector(".todo-dash-today")
  const taskTomorrow = document.querySelector(".todo-dash-tomorrow")

  // 월 이름을 숫자로 변환하는 함수
  const monthToNumber = (monthString) => {
    const months = {
      January: "01",
      February: "02",
      March: "03",
      April: "04",
      May: "05",
      June: "06",
      July: "07",
      August: "08",
      September: "09",
      October: "10",
      November: "11",
      December: "12",
    }
    return months[monthString] // 월 이름을 숫자로 반환
  }

  // 날짜를 한 자리수로 표시하는 함수
  const formatDay = (day) => {
    return day.startsWith("0") ? day.substring(1) : day
  }

  // 클릭한 날짜에 따라 할 일 타이틀 렌더링 함수
  const renderTaskTitle = (clickDate) => {
    // Today 타이틀과 Tomorrow 타이틀 요소 선택
    const todayTitle = document.querySelector(
      ".todo-dash-today .todo-dash-title h3"
    )
    const tomorrowTitle = document.querySelector(
      ".todo-dash-tomorrow .todo-dash-title h3"
    )

    // 선택한 날짜를 기반으로 내일 날짜 계산
    const todayDate = toKoreaTime(new Date(clickDate))
    const tomorrowDate = new Date(todayDate)
    tomorrowDate.setDate(todayDate.getDate() + 1)

    // 타이틀을 설정합니다.
    // 오늘 날짜와 내일 날짜를 "YYYY-MM-DD" 형식으로 가져오기
    const todayString = toKoreaTime(new Date()).toISOString().split("T")[0]
    const tomorrowString = tomorrowDate.toISOString().split("T")[0]
    // 내일 날짜의 일자를 가져오기
    const tomorrowDay = formatDay(tomorrowString.split("-")[2])
    // 클릭한 날짜의 일자를 가져오기
    const clickDay = formatDay(clickDate.split("-")[2])

    // 오늘과 내일 타이틀을 설정
    // 클릭한 날짜가 오늘인 경우 "Today"로 설정
    // 클릭한 날짜가 오늘이 아닌 경우 클릭한 날짜의 일자로 설정
    todayTitle.innerHTML = clickDate === todayString ? "Today" : clickDay
    // 클릭한 날짜가 오늘인 경우 "Tomorrow"로 설정
    // 클릭한 날짜가 오늘이 아닌 경우 내일 날짜의 일자로 설정
    tomorrowTitle.innerHTML =
      clickDate === todayString ? "Tomorrow" : tomorrowDay
  }

  // 클릭한 날짜의 할 일 렌더링 함수
  const renderDateTasks = (clickDate) => {
    // 오늘 날짜를 가져오기
    const today = toKoreaTime(new Date()).toISOString().split("T")[0]
    // 내일 날짜 객체 생성
    const tomorrow = toKoreaTime(new Date())
    // 내일 날짜로 설정
    tomorrow.setDate(tomorrow.getDate() + 1)
    // 내일 날짜를 "YYYY-MM-DD" 형식으로 가져오기
    const tomorrowString = tomorrow.toISOString().split("T")[0]

    // 기존 할 일 목록을 초기화하지만 타이틀 요소는 유지합니다.
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

    let hasTaskForToday = false
    let hasTaskForTomorrow = false

    // pendingTasks 배열을 순회하며 날짜에 맞는 할 일을 추가합니다.
    pendingTasks.forEach((task) => {
      const taskDate = task.deadline.split("T")[0] // 할 일의 날짜를 가져오기
      const taskTime = task.deadline.split("T")[1] // 할 일의 시간을 가져오기

      // 클릭한 날짜와 할 일의 날짜가 같은 경우
      if (clickDate === taskDate) {
        const li = document.createElement("li")
        taskToday.appendChild(li)
        li.innerHTML = `
          <div>
            <div class="state-box"></div>
            <span>${task.text}</span>
          </div>
          <span>${taskTime}</span>
        `
        hasTaskForToday = true
      } else if (taskDate === tomorrowString) {
        // 내일 날짜와 할 일의 날짜가 같은 경우
        const li = document.createElement("li")
        taskTomorrow.appendChild(li)
        li.innerHTML = `
          <div>
            <div class="state-box"></div>
            <span>${task.text}</span>
          </div>
          <span>${taskTime}</span>
        `
        hasTaskForTomorrow = true
      }
    })

    // 클릭한 날이 오늘이고 오늘 할 일이 없는 경우 오늘 할 일 타이틀에 "No tasks for today." 메시지를 추가
    if (clickDate === today && !hasTaskForToday) {
      const li = document.createElement("li")
      taskToday.appendChild(li)
      li.innerHTML = `
        <div>
          <div class="state-box"></div>
          <span>No tasks for today.</span>
        </div>
      `
    } // 클릭한 날이 오늘이고 내일 할 일이 없는 경우 내일 할 일 타이틀에 "No tasks for tomorrow." 메시지를 추가
    else if (clickDate === today && !hasTaskForTomorrow) {
      const li2 = document.createElement("li")
      taskTomorrow.appendChild(li2)
      li2.innerHTML = `
        <div>
          <div class="state-box"></div>
          <span>No tasks for tomorrow.</span>
        </div>
      `
    } // 그 외 클릭한 날짜에 할 일이 없는 경우 "No tasks registered." 메시지를 추가
    if (!hasTaskForToday && !hasTaskForTomorrow && clickDate !== today) {
      const li = document.createElement("li")
      taskToday.appendChild(li)
      li.innerHTML = `
        <div>
          <div class="state-box"></div>
          <span>No tasks registered.</span>
        </div>
      `
      const li2 = document.createElement("li")
      taskTomorrow.appendChild(li2)
      li2.innerHTML = `
        <div>
          <div class="state-box"></div>
          <span>No tasks registered.</span>
        </div>
      `
    }
  }

  // 할 일이 없는 경우 "No tasks registered." 메시지를 렌더링하고,
  // 할 일이 있으면 오늘 날짜와 내일 날짜 할 일을 뿌려주는 함수
  const renderDailyTasks = () => {
    const todayString = toKoreaTime(new Date()).toISOString().split("T")[0] // 오늘 날짜를 "YYYY-MM-DD" 형식으로 가져오기

    if (pendingTasks.length === 0) {
      // 할 일이 없는 경우
      taskToday.innerHTML = `
      <li class="todo-dash-title">
        <div>
          <img src="./assets/images/calendar.png" alt="달력 아이콘" />
          <h3>Today</h3>
        </div>
      </li>
      <li>
        <div class="state-box"></div>
        <span>No tasks registered.</span>
      </li>`
      taskTomorrow.innerHTML = `
      <li class="todo-dash-title">
        <div>
          <img src="./assets/images/calendar.png" alt="달력 아이콘" />
          <h3>Tomorrow</h3>
        </div>
      </li>
      <li>
        <div class="state-box"></div>
        <span>No tasks registered.</span>
      </li>`
    } else {
      // 할 일이 있는 경우
      renderDateTasks(todayString) // 오늘 날짜의 할 일 렌더링
      renderTaskTitle(todayString) // 오늘 날짜의 타이틀 렌더링
    }
  }

  // 대쉬보드 내 캘린더 날짜를 가져와서
  // 연 월 일을 합쳐서 YYYY-MM-DD 형식으로 반환하고
  // 클릭한 날짜에 active 클래스를 추가하는 함수
  const checkedDate = () => {
    // 대쉬보드 내 캘린더 날짜를 순회하면서
    const calendarDates = document.querySelectorAll(
      ".calendar-body .calendar-days div, .calendar-body .prev-month, .calendar-body .next-month"
    )
    calendarDates.forEach((dateElement) => {
      // 캘린더의 연월 정보 가져오기
      const calendarYearMonthBox = document.getElementById("main-month-year")
      const calendarYearMonth = calendarYearMonthBox.textContent

      // 연월 정보를 분리 예: "July 2024" -> ["July", "2024"]
      const monthString = calendarYearMonth.split(" ")[0]
      const year = calendarYearMonth.split(" ")[1]

      // 월 이름을 숫자로 변환
      monthToNumber(monthString)

      // monthString을 숫자로 변환
      const month = monthToNumber(monthString)

      // 날짜를 클릭하면
      dateElement.addEventListener("click", (event) => {
        const target = event.target
        const active = document.querySelector(".active")
        const today = document.querySelector(".today")
        // 기존 active 클래스를 제거합니다.
        if (active) {
          active.classList.remove("active")
        }
        // 클릭한 날짜 요소에 active 클래스를 추가
        target.classList.add("active")
        // 오늘 날짜 요소에 today 클래스를 제거
        if (today) {
          today.classList.remove("today")
        }
        // 클릭한 날짜를 가져오기
        const day = target.textContent.padStart(2, "0")
        // YYYY-MM-DD 형식으로 변환
        const checkDate = `${year}-${month}-${day}`

        // 클릭한 날짜에 따라 할 일 렌더링
        renderDateTasks(checkDate)
        // 클릭한 날짜에 따라 타이틀 렌더링
        renderTaskTitle(checkDate)
      })
    })
  }
  // 페이지 로드 시 오늘의 할 일 렌더링
  renderDailyTasks()
  // 날짜 클릭 이벤트 설정
  checkedDate()

  // 달력 업데이트 후에 이벤트 리스너를 다시 추가
  const originalRenderCalendarByType = renderCalendarByType
  renderCalendarByType = (type) => {
    originalRenderCalendarByType(type)
    checkedDate()
  }
})
