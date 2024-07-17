// HTML 요소들을 선택하여 변수에 할당
const elements = ["date-box", "today", "day", "date", "month", "year"].map(
  (id) => document.getElementById(id)
)
// 비구조화 할당으로 각 요소를 개별 변수에 할당
const [
  dateBox,
  todayElement,
  dayElement,
  dateElement,
  monthElement,
  yearElement,
] = elements

// 요일과 월의 이름을 배열로 정의
const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] // 요일의 이름을 순서대로 배열에 저장
const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] // 월의 이름을 순서대로 배열에 저장

// 현재 날짜와 시간을 나타내는 Date 객체 생성
const now = new Date()
now.setHours(0, 0, 0, 0) // 현재 날짜의 시간 정보를 제거

// 현재 요일, 일, 월, 년도를 HTML 요소에 설정하는 함수
const updateCurrentDateElements = () => {
  // 현재 요일을 dayNames 배열에서 가져와 설정
  dayElement.innerText = dayNames[now.getDay()]
  // 현재 일(date)을 설정
  dateElement.innerText = now.getDate()
  // 현재 월을 monthNames 배열에서 가져와 설정
  monthElement.innerText = monthNames[now.getMonth()]
  // 현재 년도를 설정
  yearElement.innerText = now.getFullYear()
}

// 날짜 문자열을 Date 객체로 변환하는 함수
const parseDate = (dateStr, monthStr, yearStr) => {
  // 주어진 일(date), 월(month), 년도(year)를 사용하여 Date 객체를 생성하여 반환
  const date = new Date(yearStr, monthNames.indexOf(monthStr), dateStr)
  date.setHours(0, 0, 0, 0) // 생성된 날짜의 시간 정보를 제거
  return date
}

// 현재 날짜를 기준으로 상대적 날짜 텍스트를 반환하는 함수
const getRelativeDateText = (targetDate) => {
  // 목표 날짜와 현재 날짜의 시간 차이를 밀리초 단위로 계산하여 일 단위로 변환
  const diffTime = targetDate - now
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  // 날짜 차이가 0일 경우 "Today," 반환
  if (diffDays === 0) return "Today,"
  // 날짜 차이가 1일 경우 "Tomorrow," 반환
  if (diffDays === 1) return "Tomorrow,"
  // 날짜 차이가 -1일 경우 "Yesterday," 반환
  if (diffDays === -1) return "Yesterday,"
  // 날짜 차이가 1일보다 큰 경우 "n days later," 반환
  return diffDays > 1
    ? // 날짜 차이가 1일보다 큰 경우 "n days later," 반환
      `${diffDays} days later,`
    : // 날짜 차이가 -1일보다 작은 경우 "n days ago," 반환
      `${Math.abs(diffDays)} days ago,`
}

// 현재 요일, 일, 월, 년도를 HTML 요소에 설정하고 today 요소 업데이트하는 초기화 함수
const initializeDateDisplay = () => {
  // 현재 날짜를 설정하는 함수를 호출
  updateCurrentDateElements()
  // targetDate를 설정
  const targetDate = parseDate(
    dateElement.innerText,
    monthElement.innerText,
    yearElement.innerText
  )
  // 상대적 날짜 텍스트를 설정하는 함수를 호출
  todayElement.innerText = getRelativeDateText(targetDate)
}

// 초기화 함수 호출
initializeDateDisplay()
