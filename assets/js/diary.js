const addEntryButton = document.getElementById("add-entry"); // 추가 버튼
const diaryTitleInput = document.getElementById("diary-title"); // 일기 제목 입력 input
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

// 로컬 스토리지에 일기 목록 저장
const saveEntries = () => {
  const entries = []; // 모든 일기 항목을 저장할 배열 생성
  document.querySelectorAll(".entry").forEach((entryDiv) => {
    const entryTitle = entryDiv.querySelector(".entry-title").textContent; // 일기 제목
    const entryContent = entryDiv.querySelector(".entry-content").textContent; // 일기 내용
    const entryDate = entryDiv.querySelector(".entry-date").textContent; // 일기 작성 날짜
    entries.push({ title: entryTitle, content: entryContent, date: entryDate }); // 배열에 일기 객체 추가
  });
  localStorage.setItem("diaryEntries", JSON.stringify(entries)); // 배열을 JSON 문자열로 변환하여 로컬 스토리지에 저장
};

// 로컬 스토리지에서 일기 목록 불러오기
const loadEntries = () => {
  const entries = JSON.parse(localStorage.getItem("diaryEntries")) || []; // 로컬 스토리지에서 일기 목록을 불러오거나 빈 배열 생성
  entries.forEach((entry) => {
    const entryDiv = document.createElement("div"); // 새로운 일기 항목 div 생성
    entryDiv.classList.add("entry");

    const entryTitle = document.createElement("h3"); // 일기 제목을 표시할 h3 요소 생성
    entryTitle.textContent = entry.title;
    entryTitle.classList.add("entry-title");

    const entryDate = document.createElement("span"); // 일기 작성 날짜를 표시할 span 요소 생성
    entryDate.textContent = entry.date;
    entryDate.classList.add("entry-date");

    const entryContent = document.createElement("p"); // 일기 내용을 표시할 p 요소 생성
    entryContent.textContent = entry.content;
    entryContent.classList.add("entry-content");

    const buttonBox = document.createElement("div"); // 버튼을 감싸는 div 요소 생성
    buttonBox.classList.add("button-box");

    const editButton = document.createElement("button"); // 수정 버튼 생성
    editButton.innerHTML = '<i class="fa-regular fa-pen-to-square"></i>';
    editButton.classList.add("edit-entry");

    const deleteButton = document.createElement("button"); // 삭제 버튼 생성
    deleteButton.innerHTML = '<i class="fa-regular fa-trash-can"></i>';
    deleteButton.classList.add("delete-entry");

    // 생성한 요소들을 entryDiv에 추가
    entryDiv.appendChild(entryTitle); // 일기 제목 추가
    entryDiv.appendChild(entryDate); // 일기 작성 날짜 추가
    entryDiv.appendChild(entryContent); // 일기 내용 추가
    entryDiv.appendChild(buttonBox); // 버튼을 감싸는 div 추가

    buttonBox.appendChild(editButton); // 수정 버튼을 buttonBox에 추가
    buttonBox.appendChild(deleteButton); // 삭제 버튼을 buttonBox에 추가

    entriesDiv.prepend(entryDiv); // entryDiv를 entriesDiv의 맨 앞에 추가

    // 삭제 버튼 클릭 시 삭제 확인 모달 표시
    deleteButton.addEventListener("click", () => {
      entryToDelete = entryDiv; // 삭제할 일기 항목 설정
      deleteModal.style.display = "block"; // 삭제 확인 모달 표시
    });

    // 수정 버튼 클릭 시 수정 모달 표시
    editButton.addEventListener("click", () => {
      currentEditEntry = entryContent; // 현재 수정 중인 일기 항목 설정
      editEntryTextarea.value = entryContent.textContent; // 수정 textarea에 일기 내용 설정
      modal.style.display = "block"; // 수정 모달 표시
    });

    // 일기 내용 클릭 시 확인 모달 표시
    entryContent.addEventListener("click", () => {
      viewEntryContent.textContent = entryContent.textContent; // 확인 모달에 일기 내용 설정
      viewModal.style.display = "block"; // 확인 모달 표시

      // 추가된 일기 항목에 애니메이션 클래스 적용
      setTimeout(() => {
        entryDiv.classList.add("show");
      }, 100);
    });
  });
};

// 일기를 추가하는 함수 정의
const addEntry = () => {
  const entryTitle = diaryTitleInput.value.trim(); // 일기 제목을 input에서 가져오고 공백 제거
  const entryText = diaryEntryTextarea.value.trim(); // 일기 내용을 textarea에서 가져오고 공백 제거

  if (entryTitle === "" || entryText === "") {
    alert("제목과 일기 내용을 입력하세요!"); // 일기 내용이 비어있으면 알림창 띄우고 함수 종료
    return;
  }

  const currentDate = new Date(); // 현재 날짜 객체 생성
  const formatDate = (date) => {
    // 날짜 포맷팅 함수 정의 (YYYY.MM.DD)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}.${month}.${day}`;
  };

  let formattedDate = formatDate(currentDate); // 현재 날짜 포맷팅

  const entryDiv = document.createElement("div"); // 새로운 일기 항목 div 생성
  entryDiv.classList.add("entry");

  const entryTitleElem = document.createElement("h3"); // 일기 제목을 표시할 h3 요소 생성
  entryTitleElem.textContent = entryTitle;
  entryTitleElem.classList.add("entry-title");

  const entryDate = document.createElement("span"); // 일기 작성 날짜를 표시할 span 요소 생성
  entryDate.textContent = formattedDate;
  entryDate.classList.add("entry-date");

  const entryContent = document.createElement("p"); // 일기 내용을 표시할 p 요소 생성
  entryContent.textContent = entryText;
  entryContent.classList.add("entry-content");

  const buttonBox = document.createElement("div"); // 버튼을 감싸는 div 요소 생성
  buttonBox.classList.add("button-box");

  const editButton = document.createElement("button"); // 수정 버튼 생성
  editButton.innerHTML = '<i class="fa-regular fa-pen-to-square"></i>';
  editButton.classList.add("edit-entry");

  const deleteButton = document.createElement("button"); // 삭제 버튼 생성
  deleteButton.innerHTML = '<i class="fa-regular fa-trash-can"></i>';
  deleteButton.classList.add("delete-entry");

  // 생성한 요소들을 entryDiv에 추가
  entryDiv.appendChild(entryTitleElem); // 일기 제목 추가
  entryDiv.appendChild(entryDate); // 일기 작성 날짜 추가
  entryDiv.appendChild(entryContent); // 일기 내용 추가
  entryDiv.appendChild(buttonBox); // 버튼을 감싸는 div 추가

  buttonBox.appendChild(editButton); // 수정 버튼을 buttonBox에 추가
  buttonBox.appendChild(deleteButton); // 삭제 버튼을 buttonBox에 추가

  entriesDiv.prepend(entryDiv); // entryDiv를 entriesDiv의 맨 앞에 추가

  diaryTitleInput.value = ""; // 제목 input 초기화
  diaryEntryTextarea.value = ""; // textarea 초기화

  // 삭제 버튼 클릭 시 삭제 확인 모달 표시
  deleteButton.addEventListener("click", () => {
    entryToDelete = entryDiv; // 삭제할 일기 항목 설정
    deleteModal.style.display = "block"; // 삭제 확인 모달 표시
  });

  // 수정 버튼 클릭 시 수정 모달 표시
  editButton.addEventListener("click", () => {
    currentEditEntry = entryContent; // 현재 수정 중인 일기 항목 설정
    editEntryTextarea.value = entryContent.textContent; // 수정 textarea에 일기 내용 설정
    modal.style.display = "block"; // 수정 모달 표시
  });

  // 확인 버튼 클릭 시 확인 모달 표시
  entryContent.addEventListener("click", () => {
    viewEntryContent.textContent = entryContent.textContent; // 확인 모달에 일기 내용 설정
    viewModal.style.display = "block"; // 확인 모달 표시
  });

  // 추가된 일기 항목에 애니메이션 클래스 적용
  setTimeout(() => {
    entryDiv.classList.add("show");
  }, 100);

  saveEntries(); // 일기 추가 후 로컬 스토리지에 저장
};

addEntryButton.addEventListener("click", () => {
  addEntry();
  window.location.hash = "#list"; // 라우팅 변경
});

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

// 수정 저장 버튼 클릭 시
saveEditButton.addEventListener("click", () => {
  if (currentEditEntry) {
    currentEditEntry.textContent = editEntryTextarea.value.trim(); // 수정된 일기 내용으로 업데이트
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
});

// 삭제 확인 모달의 취소 버튼 클릭 시 모달 숨김 처리
cancelDeleteButton.addEventListener("click", () => {
  deleteModal.style.display = "none";
});

// 페이지 로드 시 로컬 스토리지에서 일기 목록 불러오기
const showDiaryEntryPage = () => {
  document.querySelector("article").style.display = "block";
  document.querySelector("textarea#diary-entry").style.display = "block";
  document.querySelector("#add-entry").style.display = "block";
  entriesDiv.style.display = "none";
};

const showDiaryListPage = () => {
  document.querySelector("article").style.display = "none";
  document.querySelector("textarea#diary-entry").style.display = "none";
  document.querySelector("#add-entry").style.display = "none";
  entriesDiv.style.display = "block";
  loadEntries();
};

window.addEventListener("load", () => {
  if (window.location.hash === "#list") {
    showDiaryListPage();
  } else {
    showDiaryEntryPage();
  }
});

window.addEventListener("hashchange", () => {
  if (window.location.hash === "#list") {
    showDiaryListPage();
  } else {
    showDiaryEntryPage();
  }
});
