let pendCount = 0;
let compCount = 0;

let dashPendCount = document.getElementById("dash-pend-count");
let dashCompCount = document.getElementById("dash-comp-count");

document.addEventListener("DOMContentLoaded", () => {
    const pendingTasks = JSON.parse(localStorage.getItem("pendingTasks")) || [];
    const completedTasks = JSON.parse(localStorage.getItem("completedTasks")) || [];

    pendCount = pendingTasks.length;
    compCount = completedTasks.length;
    dashCompCount.textContent = compCount;
    dashPendCount.textContent = pendCount;
    console.log("건수 : ", pendCount, compCount);
    renderDashPendingTasks();
    renderDashCompletedTasks();
});

function renderDashPendingTasks() {
    const taskDashCardBox = document.getElementById("task-dash-cardBox");
    const pendingTasks = JSON.parse(localStorage.getItem("pendingTasks")) || [];

    // 최근 2개의 pending 태스크 가져오기
    const recentTasks = pendingTasks.slice(-2).reverse(); // 마지막 2개 태스크, 최신 순

    // 기존 태스크 카드 제거
    taskDashCardBox.querySelectorAll(".card-contentBox").forEach((el) => el.remove());

    if (recentTasks.length > 0) {
        // 최근 태스크를 대시보드에 추가
        recentTasks.forEach((task) => {
            const cardContentBox = document.createElement("div");
            cardContentBox.className = "card-contentBox cardColor-gray";
            cardContentBox.innerHTML = `
            <div class="cardContents">
                <span class="contentsTitle">${task.text}</span>
                <p class="contentsSub">(${task.category})</p>
                <span class="contentsDeadline">Deadline: ${moment(task.deadline).format("MMM D, YYYY")}</span>
            </div>
            <div class="cardIcon-box">
                ${task.favorite ? '<i class="fa-solid fa-heart"></i>' : '<i class="fa-regular fa-heart"></i>'}
            </div>
        `;
            taskDashCardBox.appendChild(cardContentBox);
        });
    } else {
        document.getElementById("noPendingData").style.display = "table-row";
    }
}

function renderDashCompletedTasks() {
    const taskDashCardBox = document.getElementById("task-dash-cardBox-completed");
    const completedTasks = JSON.parse(localStorage.getItem("completedTasks")) || [];

    const recentTasks = completedTasks.slice(-2).reverse();
    console.log("recentTasks :", recentTasks.length);
    taskDashCardBox.querySelectorAll(".card-contentBox").forEach((el) => el.remove());

    if (recentTasks.length > 0) {
        recentTasks.forEach((task) => {
            const cardContentBox = document.createElement("div");
            cardContentBox.className = "card-contentBox cardColor-green";
            cardContentBox.innerHTML = `
                    <div class="cardContents">
                        <span class="contentsTitle">${task.text}</span>
                        <p class="contentsSub">(${task.category})</p>
                        <span class="contentsDeadline">Deadline: ${moment(task.deadline).format("MMM D, YYYY")}</span>
                    </div>
                    <div class="cardIcon-box">
                        ${task.favorite ? '<i class="fa-solid fa-heart"></i>' : '<i class="fa-regular fa-heart"></i>'}
                    </div>
                `;
            taskDashCardBox.appendChild(cardContentBox);
        });
    } else {
        document.getElementById("noCompletedData").style.display = "table-row";
    }
}
