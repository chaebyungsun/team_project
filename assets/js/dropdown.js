// 모든 'task-dash-optionBox' 클래스 요소 선택
let selectElements = document.getElementsByClassName("task-dash-optionBox")
let optionCount = selectElements.length

for (let i = 0; i < optionCount; i++) {
  // 각 'task-dash-optionBox' 요소 내의 첫 번째 <select> 요소 선택
  let selElmnt = selectElements[i].getElementsByTagName("select")[0]
  let selectList = selElmnt.length

  // 새로운 <div> 요소를 생성하고 'select-selected' 클래스를 설정
  let selected = document.createElement("DIV")
  selected.setAttribute("class", "select-selected")
  selected.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML
  selectElements[i].appendChild(selected)

  // 새로운 <div> 요소를 생성하고 'select-items' 및 'select-hide' 클래스를 설정
  let items = document.createElement("DIV")
  items.setAttribute("class", "select-items select-hide")

  // <select> 요소의 각 옵션에 대해 반복
  for (let j = 0; j < selectList; j++) {
    let item = document.createElement("DIV")
    item.innerHTML = selElmnt.options[j].innerHTML
    item.setAttribute("data-value", selElmnt.options[j].value)

    // 옵션 클릭 시 작동할 이벤트 리스너 추가
    item.addEventListener("click", function (e) {
      let parentSelect =
        this.parentNode.parentNode.getElementsByTagName("select")[0]
      let selectedDiv = this.parentNode.previousSibling

      // <select> 요소의 각 옵션과 일치 여부 확인
      for (let k = 0; k < parentSelect.length; k++) {
        if (parentSelect.options[k].value == this.getAttribute("data-value")) {
          parentSelect.selectedIndex = k
          selectedDiv.innerHTML = this.innerHTML

          // 선택된 옵션의 클래스를 업데이트
          let sameAsSelected =
            this.parentNode.getElementsByClassName("same-as-selected")
          for (let l = 0; l < sameAsSelected.length; l++) {
            sameAsSelected[l].removeAttribute("class")
          }
          this.setAttribute("class", "same-as-selected")
          break
        }
      }
      selectedDiv.click()
    })
    items.appendChild(item)
  }
  selectElements[i].appendChild(items)

  // 'select-selected' <div> 클릭 시 드롭다운 토글
  selected.addEventListener("click", function (e) {
    e.stopPropagation()
    closeAllSelect(this)
    this.nextSibling.classList.toggle("select-hide")
    this.classList.toggle("select-arrow-active")
  })
}

// 다른 모든 드롭다운을 닫는 함수
const closeAllSelect = (elmnt) => {
  let selectItems = document.getElementsByClassName("select-items")
  let selectSelected = document.getElementsByClassName("select-selected")

  for (let i = 0; i < selectSelected.length; i++) {
    if (elmnt == selectSelected[i]) {
      continue
    }
    selectSelected[i].classList.remove("select-arrow-active")
  }

  for (let i = 0; i < selectItems.length; i++) {
    if (elmnt == selectItems[i]) {
      continue
    }
    selectItems[i].classList.add("select-hide")
  }
}

// 문서 클릭 시 모든 드롭다운 닫기
document.addEventListener("click", closeAllSelect)
