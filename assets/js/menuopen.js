// 요소 선택
const openMenu = document.querySelector(".open-menu")
const closeMenu = document.querySelector(".close-menu")
const nav = document.querySelector(".nav")

// 윈도우 크기에 따라 메뉴 버튼을 숨기거나 보이게 하는 함수
const checkWindowWidth = () => {
  const width = window.innerWidth

  if (width <= 768) {
    openMenu.classList.remove("hide")
  } else {
    openMenu.classList.add("hide")
    nav.classList.remove("open")
    closeMenu.classList.add("hide")
  }
}

// nav를 열고 닫는 함수
const openNav = () => {
  nav.classList.add("open")
  closeMenu.classList.remove("hide")
}

const closeNav = () => {
  nav.classList.remove("open")
  closeMenu.classList.add("hide")
}

// 윈도우 크기 변경 이벤트에 함수 등록
window.addEventListener("resize", () => {
  checkWindowWidth()
  closeNav()
})

// 페이지 로드 시 처음 실행
window.addEventListener("load", checkWindowWidth)

// 초기 호출
checkWindowWidth()

// 메뉴 버튼 클릭 이벤트 등록
openMenu.addEventListener("click", openNav)
closeMenu.addEventListener("click", closeNav)
