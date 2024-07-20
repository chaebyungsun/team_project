const addEntryButton = document.getElementById("add-entry"); // 추가 버튼
const diaryTitleInput = document.getElementById("diary-title"); // 일기 제목 입력 input
const diaryEntryTextarea = document.getElementById("diary-entry"); // 일기 입력 textarea
const entriesDiv = document.getElementById("entries"); // 일기 항목이 표시될 div
const modal = document.getElementById("modal"); // 수정 모달 div
const viewModal = document.getElementById("view-modal"); // 확인 모달 div
const deleteModal = document.getElementById("delete-modal"); // 삭제 확인 모달 div
const diaryModal = document.getElementById("diary-modal"); // 일기 추가 모달 div
const closeButton = document.querySelector(".close-button"); // 수정 모달 닫기 버튼
const closeViewButton = document.querySelector(".close-view-button"); // 확인 모달 닫기 버튼
const closeDiaryButton = document.querySelector(".close-diary-button"); // 일기 추가 모달 닫기 버튼
const saveEditButton = document.getElementById("save-edit"); // 수정 저장 버튼
const editEntryTitle = document.getElementById("edit-title"); // 수정 제목 input
const editEntryDate = document.getElementById("edit-date"); // 수정 날짜 input
const editEntryTextarea = document.getElementById("edit-entry-textarea"); // 수정 textarea
const viewEntryContent = document.getElementById("view-entry-content"); // 확인 모달 내용
const confirmDeleteButton = document.getElementById("confirm-delete"); // 삭제 확인 모달의 삭제 버튼
const cancelDeleteButton = document.getElementById("cancel-delete"); // 삭제 확인 모달의 취소 버튼
const noEntriesMessage = document.getElementById("no-entries-message"); // "일기를 작성해주세요" 메시지
const filterDropdown = document.getElementById("filter-dropdown"); // 필터 드롭다운

let currentEditEntry = null; // 현재 수정 중인 일기 항목을 저장
let entryToDelete = null; // 삭제할 일기 항목을 저장

// 로컬 스토리지에 일기 목록을 저장하는 함수
const saveEntries = () => {
  const entries = []; // 모든 일기 항목을 저장할 배열 생성
  document.querySelectorAll(".entry").forEach((entryDiv) => {
    const entryTitle = entryDiv.querySelector(".entry-title").textContent; // 일기 제목
    const entryContent = entryDiv.querySelector(".entry-content").textContent; // 일기 내용
    const entryDate = entryDiv.querySelector(".entry-date").textContent; // 일기 작성 날짜
    entries.push({
      title: entryTitle,
      content: entryContent,
      date: entryDate,
    }); // 배열의 끝에 일기 객체 추가
  });
  localStorage.setItem("diaryEntries", JSON.stringify(entries)); // 배열을 JSON 문자열로 변환하여 로컬 스토리지에 저장
};

// 로컬 스토리지에서 일기 목록을 불러오는 함수
const loadEntries = () => {
  const entries = JSON.parse(localStorage.getItem("diaryEntries")) || []; // 로컬 스토리지에서 일기 목록을 불러오거나 빈 배열 생성
  entriesDiv.innerHTML = ""; // 기존 일기 항목 초기화
  if (entries.length === 0) {
    noEntriesMessage.style.display = "block"; // 일기가 없으면 메시지 표시
  } else {
    noEntriesMessage.style.display = "none"; // 일기가 있으면 메시지 숨김
    entries.forEach((entry) => {
      // 저장된 일기들을 불러옴
      createEntryElement(entry.title, entry.content, entry.date);
    });
  }
};

// 일기 항목을 생성하는 함수
const createEntryElement = (title, content, date) => {
  const entryDiv = document.createElement("div"); // 새로운 일기 항목 div 생성
  entryDiv.classList.add("entry"); // entry 클래스 추가

  const entryTitle = document.createElement("h3"); // 일기 제목을 표시할 h3 요소 생성
  entryTitle.textContent = title;
  entryTitle.classList.add("entry-title"); // entry-title 클래스 추가

  const entryDate = document.createElement("span"); // 일기 작성 날짜를 표시할 span 요소 생성
  entryDate.textContent = date;
  entryDate.classList.add("entry-date"); // entry-date 클래스 추가

  const entryContent = document.createElement("p"); // 일기 내용을 표시할 p 요소 생성
  entryContent.textContent = content;
  entryContent.classList.add("entry-content"); // entry-content 클래스 추가

  const buttonBox = document.createElement("div"); // 버튼을 감싸는 div 요소 생성
  buttonBox.classList.add("button-box"); // button-box 클래스 추가

  const editButton = document.createElement("button"); // 수정 버튼 생성
  editButton.innerHTML = '<i class="fa-regular fa-pen-to-square"></i>';
  editButton.classList.add("edit-entry"); // edit-entry 클래스 추가

  const deleteButton = document.createElement("button"); // 삭제 버튼 생성
  deleteButton.innerHTML = '<i class="fa-regular fa-trash-can"></i>';
  deleteButton.classList.add("delete-entry"); // delete-entry 클래스 추가

  // 생성한 요소들을 entryDiv에 추가
  entryDiv.appendChild(entryTitle); // 일기 제목 추가
  entryDiv.appendChild(entryDate); // 일기 작성 날짜 추가
  entryDiv.appendChild(entryContent); // 일기 내용 추가
  entryDiv.appendChild(buttonBox); // 버튼을 감싸는 div 추가

  buttonBox.appendChild(editButton); // 수정 버튼을 buttonBox에 추가
  buttonBox.appendChild(deleteButton); // 삭제 버튼을 buttonBox에 추가

  entriesDiv.appendChild(entryDiv); // entryDiv를 entriesDiv에 추가

  // 삭제 버튼 클릭 시 삭제 확인 모달 표시
  deleteButton.addEventListener("click", () => {
    entryToDelete = entryDiv; // 삭제할 일기 항목 설정
    deleteModal.style.display = "block"; // 삭제 확인 모달 표시
  });

  // 수정 버튼 클릭 시 수정 모달 표시
  editButton.addEventListener("click", () => {
    currentEditEntry = entryDiv; // 현재 수정 중인 일기 항목 설정
    editEntryTitle.value = entryTitle.textContent; // 수정 모달에 제목 설정
    editEntryDate.value = entryDate.textContent; // 수정 모달에 날짜 설정
    editEntryTextarea.value = entryContent.textContent; // 수정 모달에 일기 내용 설정
    modal.style.display = "block"; // 수정 모달 표시
  });

  // 일기 내용 클릭 시 확인 모달 표시
  entryContent.addEventListener("click", () => {
    viewEntryContent.textContent = entryContent.textContent; // 확인 모달에 일기 내용 설정
    viewModal.style.display = "block"; // 확인 모달 표시
  });
};

// 일기를 추가하는 함수 정의
const addEntry = () => {
  const entryTitle = diaryTitleInput.value.trim(); // 일기 제목을 input에서 가져오고 공백 제거
  const entryText = diaryEntryTextarea.value.trim(); // 일기 내용을 textarea에서 가져오고 공백 제거
  const entryDate = document.getElementById("diary-date").value; // 일기 날짜를 input에서 가져옴

  if (entryTitle === "" || entryText === "" || entryDate === "") {
    alert("제목, 날짜, 일기 내용을 입력하세요!"); // 일기 내용이 비어있으면 알림창 띄우고 함수 종료
    return;
  }

  createEntryElement(entryTitle, entryText, entryDate); // 새로운 일기 항목 생성

  diaryTitleInput.value = ""; // 제목 input 초기화
  diaryEntryTextarea.value = ""; // textarea 초기화
  document.getElementById("diary-date").value = ""; // 날짜 input 초기화

  saveEntries(); // 일기 추가 후 로컬 스토리지에 저장
  diaryModal.style.display = "none"; // 일기 추가 모달 숨김 처리
  noEntriesMessage.style.display = "none"; // 일기가 추가되면 메시지 숨김
};

// 현재 주의 시작일(일요일)과 종료일(토요일)을 계산하는 함수
const getWeekRange = (date) => {
  const day = date.getDay();
  const diffToSunday = date.getDate() - day;
  const startOfWeek = new Date(date);
  startOfWeek.setDate(diffToSunday);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  return [startOfWeek, endOfWeek];
};

// 현재 달의 시작일과 종료일을 계산하는 함수
const getMonthRange = (date) => {
  const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return [startOfMonth, endOfMonth];
};

// 필터링 함수
const filterEntries = () => {
  const filterValue = filterDropdown.value; // 필터 드롭다운의 값 가져오기
  const entries = document.querySelectorAll(".entry"); // 모든 일기 항목 가져오기
  const currentDate = new Date(); // 현재 날짜 가져오기

  // 날짜를 YYYY-MM-DD 형식으로 포맷하는 헬퍼 함수
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const currentDateStr = formatDate(currentDate); // 현재 날짜를 YYYY-MM-DD 형식의 문자열로 변환

  // 주간 및 월간 범위 계산
  const [startOfWeek, endOfWeek] = getWeekRange(currentDate);
  const [startOfMonth, endOfMonth] = getMonthRange(currentDate);
  const startOfWeekStr = formatDate(startOfWeek);
  const endOfWeekStr = formatDate(endOfWeek);
  const startOfMonthStr = formatDate(startOfMonth);
  const endOfMonthStr = formatDate(endOfMonth);

  entries.forEach((entry) => {
    const entryDateStr = entry.querySelector(".entry-date").textContent; // 일기 항목의 날짜 가져오기
    const entryDate = new Date(entryDateStr); // 일기 항목의 날짜를 Date 객체로 변환
    const entryDateFormatted = formatDate(entryDate); // 일기 항목의 날짜를 YYYY-MM-DD 형식의 문자열로 변환

    let display = "block"; // 기본적으로 일기 항목을 표시하도록 설정

    if (filterValue === "daily" && entryDateFormatted !== currentDateStr) {
      display = "none"; // Daily 필터: 현재 날짜와 일치하지 않으면 숨김
    } else if (filterValue === "weekly") {
      if (
        entryDateFormatted < startOfWeekStr ||
        entryDateFormatted > endOfWeekStr
      ) {
        display = "none"; // Weekly 필터: 현재 주의 시작일과 종료일 사이가 아니면 숨김
      }
    } else if (filterValue === "monthly") {
      if (
        entryDateFormatted < startOfMonthStr ||
        entryDateFormatted > endOfMonthStr
      ) {
        display = "none"; // Monthly 필터: 현재 달의 시작일과 종료일 사이가 아니면 숨김
      }
    }

    entry.style.display = display; // 필터 결과에 따라 일기 항목의 표시 여부 설정
  });
};

// 추가 버튼 클릭 시 addEntry 함수 실행
addEntryButton.addEventListener("click", addEntry);

// 확인 모달 닫기 버튼 클릭 시 모달 숨김 처리
closeViewButton.addEventListener("click", () => {
  viewModal.style.display = "none";
});

// 수정 모달 닫기 버튼 클릭 시 모달 숨김 처리
closeButton.addEventListener("click", () => {
  modal.style.display = "none";
});

// 일기 추가 모달 닫기 버튼 클릭 시 모달 숨김 처리
closeDiaryButton.addEventListener("click", () => {
  diaryModal.style.display = "none";
});

// 수정 저장 버튼 클릭 시
saveEditButton.addEventListener("click", () => {
  if (currentEditEntry) {
    const entryTitleElem = currentEditEntry.querySelector(".entry-title"); // 현재 수정 중인 일기 항목의 제목 요소
    const entryDateElem = currentEditEntry.querySelector(".entry-date"); // 현재 수정 중인 일기 항목의 날짜 요소
    const entryContentElem = currentEditEntry.querySelector(".entry-content"); // 현재 수정 중인 일기 항목의 내용 요소

    entryTitleElem.textContent = editEntryTitle.value.trim(); // 수정된 제목으로 업데이트
    entryDateElem.textContent = editEntryDate.value; // 수정된 날짜로 업데이트
    entryContentElem.textContent = editEntryTextarea.value.trim(); // 수정된 내용으로 업데이트

    saveEntries(); // 수정된 일기 내용을 로컬 스토리지에 저장
  }
  modal.style.display = "none"; // 모달 숨김 처리
});

// 삭제 확인 모달의 삭제 버튼 클릭 시
confirmDeleteButton.addEventListener("click", () => {
  if (entryToDelete) {
    entriesDiv.removeChild(entryToDelete); // 선택된 일기 항목 삭제
    entryToDelete = null; // 삭제할 항목 초기화
    saveEntries(); // 삭제 후 로컬 스토리지에 저장
  }
  deleteModal.style.display = "none"; // 삭제 확인 모달 숨김 처리
  if (entriesDiv.children.length === 0) {
    noEntriesMessage.style.display = "block"; // 모든 일기가 삭제되면 메시지 표시
  }
});

// 삭제 확인 모달의 취소 버튼 클릭 시 모달 숨김 처리
cancelDeleteButton.addEventListener("click", () => {
  deleteModal.style.display = "none";
});

// 페이지 로드 시 로컬 스토리지에서 일기 목록 불러오기
window.addEventListener("load", loadEntries);

// "추가" 버튼을 클릭하면 일기 추가 모달을 엽니다
document.getElementById("add_button").addEventListener("click", () => {
  document.getElementById("diary-modal").style.display = "block";
});

// 필터 드롭다운 변경 시 필터링 함수 호출
filterDropdown.addEventListener("change", filterEntries);
