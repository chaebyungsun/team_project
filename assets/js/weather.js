// OpenWeatherMap API 키 설정
const API_KEY = config.apikey;

// 위치 정보를 받아 날씨 정보를 가져오는 함수 정의
const getWeather = async (position) => {
  // 현재 위치의 위도(latitude)와 경도(longitude) 추출
  const { latitude, longitude } = position.coords;
  // API 호출을 위한 URL 생성
  const url = new URL(
    `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
  );

  // 비동기 fetch 호출을 사용하여 API 요청
  try {
    // API로부터 응답을 받음
    const response = await fetch(url);
    // 응답을 JSON 형태로 파싱
    const data = await response.json();

    console.log("API 응답 상태:", response.status); // 응답 상태 코드 확인
    console.log("API 응답 데이터:", data); // API 응답을 콘솔에 출력

    // HTML 요소들을 ID를 사용하여 선택
    const weatherBox = document.getElementById("weather-box");

    // 날씨에 따른 아이콘 설정
    const weatherIcons = {
      Thunderstorm: "⛈️",
      Drizzle: "🌦️",
      Rain: "🌧️",
      Snow: "🌨️",
      Smoke: "🌫️",
      Clouds: "⛅️",
      Clear: "☀️",
      Wind: "💨",
      Mist: "🌫️",
      Haze: "🌫️",
      Dust: "😷",
      Fog: "🌁",
      Sand: "🏜️",
      Ash: "🌋",
      Squall: "🌬️",
      Tornado: "🌪️",
    };

    // 날씨에 따른 메시지 설정
    const weatherMessages = {
      Thunderstorm: "천둥번개가 치니 조심해요!",
      Drizzle: "이슬비가 내려요!",
      Rain: "우산 챙기는 걸 잊지마!",
      Snow: "미끄러지지 않게 조심해요!",
      Clouds: "구름이 많아요!",
      Clear: "맑아요!",
      Wind: "바람이 많이 불어요!",
      Mist: "안개가 꼈네요!",
      Smoke: "연기가 많아요!",
      Haze: "안개가 많아요!",
      Dust: "미세먼지가 많으니 마스크쓰세요!",
      Fog: "안개가 짙으니 조심해요!",
      Sand: "모래바람이 불어요!",
      Ash: "화산재가 날리고 있어요!",
      Squall: "돌풍이 불어요!",
      Tornado: "날아가지 않게 조심해요",
      Clear: "오늘은 맑은 날 외출하자!!",
    };

    // 온도에 따른 메시지 설정
    const tempMessages = {
      hot: "폭염 주의!!! 에어컨 가동!!",
      cold: "날씨가 추워요! 롱패딩 개시!!",
    };

    // 날씨 정보를 통해 온도에 따른 메시지 결정
    const tempMessage =
      // 만약 온도가 30도 이상이면
      data.main.temp > 33
        ? //tempMessages.hot 메시지 반환
          tempMessages.hot
        : // 만약 온도가 10도 미만이면
        data.main.temp < 10
        ? //tempMessages.cold 메시지 반환
          tempMessages.cold
        : // 그 외의 경우 빈 문자열 반환
          "";

    // 날씨에 따른 메시지 결정
    const weatherMessage =
      weatherMessages[data.weather[0].main] || "날씨 정보를 제공할 수 없어요.";

    console.log([data.weather[0].main]);

    // 날씨 아이콘과 메시지 설정
    weatherBox.innerHTML = `
      <div class="weather-wrap">
        <span id="weather-icon">${
          weatherIcons[data.weather[0].main] || ""
        }</span>
        <span id="weather-temp">${Math.ceil(data.main.temp)}°C</span>
      </div>
      <span id="weather-notice">${weatherMessage} <br /> ${tempMessage}</span>
    `;
  } catch (error) {
    // 에러가 발생한 경우 알림 요소에 메시지 설정
    const notice = document.getElementById("notice");
    notice.innerText = "당신을 찾을 수 없어서 날씨 정보를 제공할 수 없어요.";
    console.error("오류 메시지:", error); // 오류 메시지를 콘솔에 출력
  }
};

// DOM이 완전히 로드된 후에 코드 실행
document.addEventListener("DOMContentLoaded", () => {
  // 사용자의 현재 위치를 가져와 getWeather 함수를 호출
  navigator.geolocation.getCurrentPosition(getWeather, (error) => {
    // 위치 정보를 가져오지 못했을 경우의 에러 처리
    const notice = document.getElementById("notice");
    notice.innerText = "위치 정보를 가져오는데 실패했습니다.";
    console.error("위치 정보 오류:", error); // 위치 정보 오류를 콘솔에 출력
  });
});
