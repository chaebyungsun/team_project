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

// HTML 문서의 모든 요소가 로드된 후 실행
document.addEventListener("DOMContentLoaded", () => {
  // 로컬 스토리지에 저장된 pendingTasks 데이터를 가져오고, 데이터가 없으면 빈 배열로 초기화
  const pendingTasks = JSON.parse(localStorage.getItem("pendingTasks")) || []

  // 할 일 목록을 표시할 요소 선택
  const taskToday = document.querySelector(".todo-dash-today")
  const taskTomorrow = document.querySelector(".todo-dash-tomorrow")

  /**
   * 월 이름을 숫자로 변환하는 함수
   * @param {*} monthString
   * @returns
   */
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

  /**
   * 주어진 날짜를 한국 시간대로 변환하는 함수
   * @param {Date} date - 변환할 날짜 객체
   * @returns {Date} 한국 시간대로 변환된 날짜 객체
   */
  // 한국 시간대로 변환하는 함수
  const toKoreaTime = (date) => {
    const utc = date.getTime() + date.getTimezoneOffset() * 60000
    const koreaTime = new Date(utc + 9 * 3600000)
    return koreaTime
  }
  /**
   * 날짜를 한 자리수로 표시하는 함수
   * @param {string} day - 날짜
   * @returns {string} 한 자리수로 표시된 날짜
   */
  const formatDay = (day) => {
    return day.startsWith("0") ? day.substring(1) : day
  }

  // 할 일이 없는 경우 메시지를 추가하는 함수
  const addNoTaskMessage = (element, message) => {
    const li = document.createElement("li")
    element.appendChild(li)
    li.innerHTML = `
              <div>
                <div class="state-box"></div>
                <span>${message}</span>
              </div>`
  }

  // 기존 할 일 목록 초기화하고 타이틀 요소는 유지하는 함수
  const resetTaskList = (element, title) => {
    element.innerHTML = ` 
      <li class="todo-dash-title">
        <div>
          <img src="./assets/images/calendar.png" alt="달력 아이콘" />
          <h3>${title}</h3>
        </div>
      </li>`
  }

  // 날짜를 "YYYY-MM-DD" 형식으로 반환하는 함수
  const formatDateToISO = (date) => {
    return date.toISOString().split("T")[0]
  }

  // 한국 시간대로 변환하여 "YYYY-MM-DD" 형식으로 반환하는 함수
  const toKoreaISODate = (date) => {
    return toKoreaTime(date).toISOString().split("T")[0]
  }

  const renderTaskTitle = (clickDate) => {
    // Today 타이틀과 Tomorrow 타이틀 요소 선택
    const todayTitle = document.querySelector(
      ".todo-dash-today .todo-dash-title h3"
    )
    const tomorrowTitle = document.querySelector(
      ".todo-dash-tomorrow .todo-dash-title h3"
    )

    // 클릭한 날짜를 기반으로 한국 시간대로 변환 및 다음 날짜 계산
    const clickTodayDate = toKoreaTime(new Date(clickDate))
    const clickTomorrowDate = new Date(clickTodayDate)
    clickTomorrowDate.setDate(clickTodayDate.getDate() + 1)

    // 클릭한 날짜와 다음 날짜를 "YYYY-MM-DD" 형식으로 변환
    const clickTodayString = clickTodayDate.toISOString().split("T")[0]
    const clickTomorrowString = clickTomorrowDate.toISOString().split("T")[0]

    // 오늘 날짜와 내일 날짜를 한국 시간대로 변환 및 "YYYY-MM-DD" 형식으로 변환
    const today = toKoreaISODate(new Date())
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tomorrowString = toKoreaISODate(tomorrow)

    // 클릭한 날짜의 일자와 클릭한 날짜의 다음 날 일자 가져오기
    const clickDay = formatDay(clickTodayString.split("-")[2])
    const tomorrowDay = formatDay(clickTomorrowString.split("-")[2])

    // 오늘과 내일 타이틀 설정
    // 클릭한 날짜가 오늘인 경우 "Today"로 설정, 아니면 클릭한 날짜의 일자로 설정
    todayTitle.innerHTML = clickTodayString === today ? "Today" : clickDay

    // 클릭한 날짜의 다음 날이 내일인 경우 "Tomorrow"로 설정, 아니면 클릭한 날짜의 다음 날 일자로 설정
    tomorrowTitle.innerHTML =
      clickTomorrowString === tomorrowString ? "Tomorrow" : tomorrowDay
  }

  // 클릭한 날짜의 할 일 렌더링 함수
  const renderDateTasks = (clickDate) => {
    // 오늘과 내일 날짜를 한국 시간대로 변환하여 가져오기
    const today = toKoreaISODate(new Date())
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tomorrowString = toKoreaISODate(tomorrow)

    // 클릭한 날짜의 다음 날을 한국 시간대로 변환하여 가져오기
    const clickDateObject = new Date(clickDate)
    const clickNextDate = new Date(clickDateObject)
    clickNextDate.setDate(clickDateObject.getDate() + 1)
    const clickNextDateString = toKoreaISODate(clickNextDate)

    // 기존 할 일 목록 초기화
    resetTaskList(taskToday, "Today")
    resetTaskList(taskTomorrow, "Tomorrow")

    // 클릭한 날짜에 해당하는 할 일이 없는 경우
    const tasksForClickDate = pendingTasks.filter(
      (task) => task.deadline.split("T")[0] === clickDate
    )

    // 클릭한 날짜 다음 날에 해당하는 할 일이 없는 경우
    const tasksForClickNextDate = pendingTasks.filter(
      (task) => task.deadline.split("T")[0] === clickNextDateString
    )

    // 저장된 할 일 목록을 순회하며 날짜에 맞는 할 일을 추가
    pendingTasks.forEach((task) => {
      const taskDate = task.deadline.split("T")[0] // 할 일의 날짜 가져오기
      const taskTime = task.deadline.split("T")[1] // 할 일의 시간 가져오기

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
      } // 클릭한 날짜의 다음 날과 할 일의 날짜가 같은 경우
      else if (clickNextDateString === taskDate) {
        const li = document.createElement("li")
        taskTomorrow.appendChild(li)
        li.innerHTML = `
          <div>
            <div class="state-box"></div>
            <span>${task.text}</span>
          </div>
          <span>${taskTime}</span>
        `
      }
    })

    // 오늘 할 일이 없는 경우 메시지를 추가
    if (tasksForClickDate.length === 0) {
      const message =
        clickDate === today ? "No tasks for today." : "No tasks registered."
      addNoTaskMessage(taskToday, message)
    }

    // 내일 할 일이 없는 경우 메시지를 추가
    if (tasksForClickNextDate.length === 0) {
      const message =
        clickDate === today ? "No tasks for tomorrow." : "No tasks registered."
      addNoTaskMessage(taskTomorrow, message)
    }
  }

  // 대쉬보드 로드 했을 때
  // 오늘과 내일 할 일이 없는 경우 “No tasks registered.” 메시지를 렌더링하고,
  // 할 일이 있으면 오늘 내일 할 일을 뿌려주는 함수
  const renderDailyTasks = () => {
    // 오늘 날짜를 한국 시간대로 변환하여 “YYYY-MM-DD” 형식으로 가져오기
    const today = toKoreaTime(new Date()).toISOString().split("T")[0]

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
             <div>
          <div class="state-box"></div>
          <span>No tasks registered.</span>
          </div>
        </li>`
      taskTomorrow.innerHTML = `
        <li class="todo-dash-title">
          <div>
            <img src="./assets/images/calendar.png" alt="달력 아이콘" />
            <h3>Tomorrow</h3>
          </div>
        </li>
        <li>
        <div>
          <div class="state-box"></div>
          <span>No tasks registered.</span>
          </div>
        </li>`
    } else {
      // 할 일이 있는 경우
      renderDateTasks(today) // 해당 날짜의 할 일 렌더링
      renderTaskTitle(today) // 해당 날짜의 타이틀 렌더링
    }
  }

  // 대쉬보드 내 캘린더 날짜를 가져와서
  // 연 월 일을 합쳐서 YYYY-MM-DD 형식으로 반환하고
  // 클릭한 날짜에 active 클래스를 추가하는 함수
  const checkedDate = (event) => {
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

    // 캘린더의 연월 정보 가져오기
    const calendarYearMonthBox = document.getElementById("main-month-year")
    const calendarYearMonth = calendarYearMonthBox.textContent

    // 연월 정보를 분리 예: "July 2024" -> ["July", "2024"]
    const monthString = calendarYearMonth.split(" ")[0]
    const year = calendarYearMonth.split(" ")[1]

    // 월 이름을 숫자로 변환
    const month = monthToNumber(monthString)

    // 클릭한 날짜를 가져오기
    const day = target.textContent.padStart(2, "0")
    // YYYY-MM-DD 형식으로 변환
    const checkDate = `${year}-${month}-${day}`

    // 클릭한 날짜에 따라 할 일 렌더링
    renderDateTasks(checkDate)
    // 클릭한 날짜에 따라 타이틀 렌더링
    renderTaskTitle(checkDate)
  }

  // 캘린더의 날짜 요소에 클릭 이벤트 리스너를 추가하는 함수
  const addClickListenerToDates = () => {
    const calendarDates = document.querySelectorAll(
      ".calendar-body .calendar-days div, .calendar-body .prev-month, .calendar-body .next-month"
    )

    calendarDates.forEach((dateElement) => {
      dateElement.addEventListener("click", checkedDate)
    })
  }

  // 초기 로드 시 날짜 요소에 클릭 이벤트 리스너를 추가
  addClickListenerToDates()

  // 페이지 로드 시 오늘의 할 일 렌더링
  renderDailyTasks()

  // 달력 업데이트 후에 이벤트 리스너를 다시 추가하는 함수
  const originalRenderCalendarByType = renderCalendarByType
  renderCalendarByType = (type) => {
    originalRenderCalendarByType(type)
    addClickListenerToDates()
  }
})
