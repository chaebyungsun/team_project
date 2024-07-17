const addEntryButton = document.getElementById("add-entry"); // 추가 버튼
const diaryEntryTextarea = document.getElementById("diary-entry"); // 일기 입력 textarea
const entriesDiv = document.getElementById("entries"); // 일기 항목이 표시될 div
const modal = document.getElementById("modal"); // 수정 모달 div
const viewModal = document.getElementById("view-modal"); // 확인 모달 div
const deleteModal = document.getElementById("delete-modal"); // 삭제 확인 모달 div
const closeButton = document.querySelector(".close-button"); // 수정 모달 닫기 버튼
const closeViewButton = document.querySelector(".close-view-button"); // 확인 모달 닫기 버튼
const saveEditButton = document.getElementById("save-edit"); // 수정 저장 버튼
const editEntryTextarea = document.getElementById("edit-entry-textarea"); // 수정 textarea
const viewEntryContent = document.getElementById("view-entry-content"); // 확인 모달 내용
const confirmDeleteButton = document.getElementById("confirm-delete"); // 삭제 확인 모달의 삭제 버튼
const cancelDeleteButton = document.getElementById("cancel-delete"); // 삭제 확인 모달의 취소 버튼

let currentEditEntry = null; // 현재 수정 중인 일기 항목
let entryToDelete = null; // 삭제할 일기 항목

// 일기를 추가하는 함수 정의
const addEntry = () => {
  let entryText = diaryEntryTextarea.value.trim(); // 일기 내용을 textarea에서 가져오고 공백 제거
  if (entryText === "") {
    alert("일기 내용을 입력하세요!"); // 일기 내용이 비어있으면 알림창 띄우고 함수 종료
    return;
  }

  const currentDate = new Date(); // 현재 날짜 객체 생성
  const formatDate = (date) => {
    // 날짜 포맷팅 함수 정의 (YYYY.MM.DD)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}.${month}.${day} `;
  };

  let formattedDate = formatDate(currentDate); // 현재 날짜 포맷팅

  const entryDiv = document.createElement("div"); // 새로운 일기 항목 div 생성
  entryDiv.classList.add("entry"); // entry 클래스 추가

  const entryContent = document.createElement("p"); // 일기 내용을 표시할 p 요소 생성
  entryContent.textContent = entryText;
  entryContent.classList.add("entry-content"); // entry-content 클래스 추가 (기본적으로 숨김 처리)

  const entryDate = document.createElement("span"); // 일기 작성 날짜를 표시할 span 요소 생성
  entryDate.textContent = formattedDate;
  entryDate.classList.add("entry-date"); // entry-date 클래스 추가

  const buttonBox = document.createElement("div"); // 버튼을 감싸는 div 요소 생성
  buttonBox.classList.add("button-box"); // button-box 클래스 추가

  const viewButton = document.createElement("button"); // 확인 버튼 생성
  viewButton.textContent = "확인";
  viewButton.classList.add("view-entry");

  const editButton = document.createElement("button"); // 수정 버튼 생성
  editButton.textContent = "수정";
  editButton.classList.add("edit-entry");

  const deleteButton = document.createElement("button"); // 삭제 버튼 생성
  deleteButton.textContent = "삭제";
  deleteButton.classList.add("delete-entry");

  entryDiv.appendChild(entryContent); // 일기 내용 추가
  entryDiv.appendChild(entryDate); // 일기 작성 날짜 추가
  entryDiv.appendChild(buttonBox); // 버튼을 감싸는 div 추가

  buttonBox.appendChild(viewButton); // 확인 버튼을 buttonBox에 추가
  buttonBox.appendChild(editButton); // 수정 버튼을 buttonBox에 추가
  buttonBox.appendChild(deleteButton); // 삭제 버튼을 buttonBox에 추가

  entriesDiv.prepend(entryDiv); // 일기 항목 div를 entriesDiv의 맨 앞에 추가

  diaryEntryTextarea.value = ""; // textarea 초기화

  deleteButton.addEventListener("click", () => {
    // 삭제 버튼 클릭 시 삭제 확인 모달 표시
    entryToDelete = entryDiv; // 삭제할 일기 항목 설정
    deleteModal.style.display = "block"; // 삭제 확인 모달 표시
  });

  editButton.addEventListener("click", () => {
    // 수정 버튼 클릭 시 모달 창 열기
    currentEditEntry = entryContent; // 현재 수정 중인 일기 항목 설정
    editEntryTextarea.value = entryContent.textContent; // 모달 textarea에 일기 내용 설정
    modal.style.display = "block"; // 모달 표시
  });
  viewButton.addEventListener("click", () => {
    // 확인 버튼 클릭 시 모달 창 열기
    viewEntryContent.textContent = entryContent.textContent; // 확인 모달에 일기 내용 설정
    viewModal.style.display = "block"; // 확인 모달 표시
  });
};

addEntryButton.addEventListener("click", addEntry); // 추가 버튼 클릭 시 addEntry 함수 실행

closeViewButton.addEventListener("click", () => {
  // 확인 모달 닫기 버튼 클릭 시 모달 숨김 처리
  viewModal.style.display = "none";
});

closeButton.addEventListener("click", () => {
  // 모달 닫기 버튼 클릭 시 모달 숨김 처리
  modal.style.display = "none";
});

saveEditButton.addEventListener("click", () => {
  // 수정 저장 버튼 클릭 시
  if (currentEditEntry) {
    currentEditEntry.textContent = editEntryTextarea.value.trim(); // 수정된 일기 내용으로 업데이트
  }
  modal.style.display = "none"; // 모달 숨김 처리
});

confirmDeleteButton.addEventListener("click", () => {
  // 삭제 확인 모달의 삭제 버튼 클릭 시
  if (entryToDelete) {
    entriesDiv.removeChild(entryToDelete); // 선택된 일기 항목 삭제
    entryToDelete = null; // 삭제할 항목 초기화
  }
  deleteModal.style.display = "none"; // 삭제 확인 모달 숨김 처리
});

cancelDeleteButton.addEventListener("click", () => {
  // 삭제 확인 모달의 취소 버튼 클릭 시 모달 숨김 처리
  deleteModal.style.display = "none";
});

window.addEventListener("click", (event) => {
  // 모달 외부 클릭 시 모달 숨김 처리
  if (event.target === modal) {
    modal.style.display = "none";
  }
});
