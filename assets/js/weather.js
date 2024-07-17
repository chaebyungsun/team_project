// OpenWeatherMap API 키 설정
const API_KEY = config.apikey

// 위치 정보를 받아 날씨 정보를 가져오는 함수 정의
const getWeather = async (position) => {
  // 현재 위치의 위도(latitude)와 경도(longitude) 추출
  const { latitude, longitude } = position.coords
  // API 호출을 위한 URL 생성
  const url = new URL(
    `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
  )

  // 비동기 fetch 호출을 사용하여 API 요청
  try {
    // API로부터 응답을 받음
    const response = await fetch(url)
    // 응답을 JSON 형태로 파싱
    const data = await response.json()

    // HTML 요소들을 ID를 사용하여 선택
    const weatherBox = document.getElementById("weather-box")

    // 날씨에 따른 아이콘 설정
    const weatherIcons = {
      Rain: "🌧️",
      Snow: "🌨️",
      Clouds: "⛅️",
      Clear: "☀️",
      Wind: "💨",
    }

    // 날씨에 따른 메시지 설정
    const weatherMessages = {
      Rain: "우산 챙기는 걸 잊지마!",
      Snow: "눈이 와요! 미끄러지지 않게 조심해요!",
      Clouds: "구름이 많아요!",
      Clear: "맑아요!",
      Wind: "날아가지 않게 조심해요!",
    }

    // 온도에 따른 메시지 설정
    const tempMessages = {
      hot: "폭염 주의!!! 에어컨을 키자구요!!",
      cold: "롱패딩 입어요 안 그럼 얼어죽어요!!!",
    }

    // 날씨 정보를 통해 온도에 따른 메시지 결정
    const tempMessage =
      // 만약 온도가 30도 이상이면
      data.main.temp > 30
        ? //tempMessages.hot 메시지 반환
          tempMessages.hot
        : // 만약 온도가 10도 미만이면
        data.main.temp < 10
        ? //tempMessages.cold 메시지 반환
          tempMessages.cold
        : // 그 외의 경우 빈 문자열 반환
          ""

    // 날씨에 따른 메시지 결정
    const weatherMessage =
      weatherMessages[data.weather[0].main] || "날씨 정보를 제공할 수 없어요."

    // 날씨 아이콘과 메시지 설정
    weatherBox.innerHTML = `
      <span id="weather">${weatherIcons[data.weather[0].main] || ""}</span>
      <span id="temp">${Math.ceil(data.main.temp)}°C</span>
      <span id="notice">${weatherMessage} ${tempMessage}</span>
    `
  } catch (error) {
    // 에러가 발생한 경우 알림 요소에 메시지 설정
    const notice = document.getElementById("notice")
    notice.innerText = "당신을 찾을 수 없어서 날씨 정보를 제공할 수 없어요."
  }
}

// DOM이 완전히 로드된 후에 코드 실행
document.addEventListener("DOMContentLoaded", () => {
  // 사용자의 현재 위치를 가져와 getWeather 함수를 호출
  navigator.geolocation.getCurrentPosition(getWeather, (error) => {
    // 위치 정보를 가져오지 못했을 경우의 에러 처리
    const notice = document.getElementById("notice")
    notice.innerText = "위치 정보를 가져오는데 실패했습니다."
  })
})
