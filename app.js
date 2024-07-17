// OpenWeatherMap API 키 설정
const API_KEY = config.apikey

// 위치 정보를 받아 날씨 예보를 가져오는 함수 정의
const getWeatherForecast = async (latitude, longitude) => {
  // API 호출을 위한 URL 생성
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`

  // 비동기 fetch 호출을 사용하여 API 요청
  try {
    // API로부터 응답을 받음
    const response = await fetch(url)
    // 응답을 JSON 형태로 파싱
    const data = await response.json()

    // HTML 요소를 ID로 선택
    const forecastBox = document.getElementById("forecast-box")

    // 날짜와 날씨 데이터를 생성
    let forecastHTML = ""
    data.list.forEach((forecast, index) => {
      // 각 날의 예보를 추가 (하루에 8번의 예보가 있으므로 8의 배수만 선택)
      if (index % 8 === 0) {
        const date = new Date(forecast.dt * 1000) // 유닉스 타임스탬프를 Date 객체로 변환
        const day = date.toLocaleDateString("en-US", { weekday: "long" }) // 요일 이름 가져오기
        const weather = forecast.weather[0].main // 날씨 상태 가져오기
        const temp = forecast.main.temp // 온도 가져오기

        // 각 날의 예보를 HTML 문자열로 추가
        forecastHTML += `
          <div class="forecast-item">
            <span class="forecast-date">${day}</span>
            <span class="forecast-weather">${weather}</span>
            <span class="forecast-temp">${Math.round(temp)}°C</span>
          </div>
        `
      }
    })

    // 생성된 HTML을 forecastBox 요소에 설정
    forecastBox.innerHTML = forecastHTML
  } catch (error) {
    // 에러가 발생한 경우 알림 요소에 메시지 설정
    const forecastBox = document.getElementById("forecast-box")
    forecastBox.innerText = "날씨 정보를 가져올 수 없습니다."
  }
}

// 사용자의 현재 위치를 가져와 getWeatherForecast 함수를 호출
navigator.geolocation.getCurrentPosition(
  (position) => {
    const { latitude, longitude } = position.coords // 현재 위치의 위도와 경도 추출
    getWeatherForecast(latitude, longitude) // 날씨 예보를 가져오는 함수 호출
  },
  (error) => {
    // 위치 정보를 가져오지 못했을 경우의 에러 처리
    const forecastBox = document.getElementById("forecast-box")
    forecastBox.innerText = "위치 정보를 가져오는데 실패했습니다."
  }
)

// 페이지 로드 시 getWeatherForecast 함수 호출
window.onload = () => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords // 현재 위치의 위도와 경도 추출
      getWeatherForecast(latitude, longitude) // 날씨 예보를 가져오는 함수 호출
    },
    (error) => {
      // 위치 정보를 가져오지 못했을 경우의 에러 처리
      const forecastBox = document.getElementById("forecast-box")
      forecastBox.innerText = "위치 정보를 가져오는데 실패했습니다."
    }
  )
}
