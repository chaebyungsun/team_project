const today = new Date(); // 오늘 날짜
let currentMonth = today.getMonth(); // 현재 월
let currentYear = today.getFullYear(); // 현재 연도

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]; // 월 이름 배열

function renderCalendar(calendarId, monthYearId, month, year) {
  const calendarDays = document.getElementById(calendarId); // 달력의 날짜들을 표시할 요소
  const monthYear = document.getElementById(monthYearId); // 달력의 월과 연도를 표시할 요소
  const monthTitle = document.getElementById("month"); // todo 대쉬에 월을 표시할 요소

  const firstDay = new Date(year, month, 1).getDay(); // 월의 첫 번째 날의 요일
  const daysInMonth = new Date(year, month + 1, 0).getDate(); // 해당 월의 일 수

  calendarDays.innerHTML = ""; // 이전에 표시된 날짜들을 초기화
  monthYear.innerText = `${months[month]} ${year}`; // 월과 연도를 설정
  if (monthTitle) monthTitle.innerText = `${months[month]}`;

  // 이전 달의 일자에 대한 자리표시자를 생성
  for (let i = 1; i < firstDay; i++) {
    const day = document.createElement("div");
    calendarDays.appendChild(day);
  }

  // 현재 월의 날짜를 생성
  for (let i = 1; i <= daysInMonth; i++) {
    const day = document.createElement("div");
    day.innerText = i;
    if (
      i === today.getDate() &&
      year === today.getFullYear() &&
      month === today.getMonth()
    ) {
      day.classList.add("today"); // 오늘 날짜를 표시
    }
    calendarDays.appendChild(day);
  }
}

function prevMonth(calendarType) {
  currentMonth = currentMonth === 0 ? 11 : currentMonth - 1; // 이전 월 계산
  currentYear = currentMonth === 11 ? currentYear - 1 : currentYear; // 연도 계산
  renderCalendarByType(calendarType); // 달력 렌더링
}

function nextMonth(calendarType) {
  currentMonth = currentMonth === 11 ? 0 : currentMonth + 1; // 다음 월 계산
  currentYear = currentMonth === 0 ? currentYear + 1 : currentYear; // 연도 계산
  renderCalendarByType(calendarType); // 달력 렌더링
}

function renderCalendarByType(type) {
  if (type === 'main') {
    renderCalendar('main-calendar-days', 'main-month-year', currentMonth, currentYear);
  } else if (type === 'modal') {
    renderCalendar('modal-calendar-days', 'modal-month-year', currentMonth, currentYear);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderCalendarByType('main'); // 메인 페이지의 초기 달력 렌더링
  renderCalendarByType('modal'); // 모달 창의 초기 달력 렌더링
});

// 클릭 시 모달창 fadeIn
function addTaskOpen() {
  const modal = document.querySelector('.taskModal-wrap');
  modal.style.display = 'block';
  setTimeout(() => {
    modal.style.opacity = 1;
  }, 10);
}

// 클릭 시 모달창 fadeOut
function addTaskClose() {
  const modal = document.querySelector('.taskModal-wrap');
  modal.style.opacity = 0;
  setTimeout(() => {
    modal.style.display = 'none';
  }, 250);
}
