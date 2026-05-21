import { taskList } from "./app";
import { isToday } from "./utils/date";
import { getTodayQuote } from "./utils/getTodayQuote";
import { loadArchive } from "./archiveService";
import { moveTodayCompletedToHistory } from "./historyService";

// === Подсчёт статистики за сегодня ===
function getTodayStats() {
  const archiveList = loadArchive();

  // Активные задачи на доске
  const activeTodayTasks = taskList.filter((t) => isToday(t.createdAt));

  // Выполненные задачи из архива
  const todayCompletedTasks = archiveList.filter((t) => isToday(t.completedAt));

  // Количество активных задач
  const newTasks = activeTodayTasks.filter((t) => t.status === "new").length;

  const inProgress = activeTodayTasks.filter(
    (t) => t.status === "progress",
  ).length;

  const priority = activeTodayTasks.filter(
    (t) => t.status === "priority",
  ).length;

  // DONE теперь считается из архива
  const done = todayCompletedTasks.length;

  // ОБЩЕЕ количество задач за день
  const all = newTasks + inProgress + priority + done;

  // Проценты
  const percentDone = all ? Math.round((done / all) * 100) : 0;

  const percentPostponed = all ? Math.round((inProgress / all) * 100) : 0;

  const percentPriority = all ? Math.round((priority / all) * 100) : 0;

  return {
    all,
    done,
    inProgress,
    priority,
    percentDone,
    percentPostponed,
    percentPriority,

    // В DAY OVERVIEW показываем только новые задачи
    tasks: activeTodayTasks.filter((t) => t.status === "new"),
  };
}
// === Обеспечиваем наличие блока для цитаты ===
function ensureContainersExist() {
  const app = document.querySelector("#app");
  if (!app) return;

  const topPanel = document.querySelector(".top-info-panel"); // белая панель
  if (!topPanel) return;

  // если цитаты ещё нет — создаём
  let quoteDiv = document.getElementById("quote-of-the-day");
  if (!quoteDiv) {
    quoteDiv = document.createElement("div");
    quoteDiv.id = "quote-of-the-day";
    quoteDiv.className = "quote-box";
  }

  // ищем контейнер 4 колонок (поддерживаем разные названия)
  const boardCandidates = [
    ".board",
    ".columns",
    ".container",
    ".wrapper",
    "#board",
  ]
    .map((sel) => document.querySelector(sel))
    .filter(Boolean);

  // функция: вставить элемент ПЕРЕД указанным узлом
  const insertBeforeNode = (node) => {
    node.parentNode.insertBefore(quoteDiv, node);
  };

  // 1) если нашли контейнер доски — вставляем ПЕРЕД ним
  if (boardCandidates.length) {
    // выберем тот, который действительно идёт после topPanel в DOM
    const afterTop =
      boardCandidates.find((node) => {
        return !!(
          node.compareDocumentPosition(topPanel) &
          Node.DOCUMENT_POSITION_FOLLOWING
        );
      }) || boardCandidates[0];
    insertBeforeNode(afterTop);
    return;
  }

  // 2) иначе — вставляем СРАЗУ ПОСЛЕ topPanel, у того же родителя
  if (topPanel.parentNode) {
    topPanel.parentNode.insertBefore(quoteDiv, topPanel.nextSibling);
    return;
  }

  // 3) запасной вариант
  app.appendChild(quoteDiv);
}

// === Рендер цитаты (поддерживаем {quote} и {text}) ===
function renderQuote() {
  const node = document.getElementById("quote-of-the-day");
  if (!node) return;

  const payload = getTodayQuote();
  const quote = (payload && (payload.quote || payload.text)) || "";
  const author = (payload && payload.author) || "";

  node.innerHTML = `
    <div class="quote-text">"${quote}"</div>
    <div class="quote-author">— ${author}</div>
  `;
}

// === Основной рендер блока статистики ===
function renderDayOverview() {
  ensureContainersExist();

  const stats = getTodayStats();
  const urgentBlock = document.querySelector(".urgent-block");
  if (!urgentBlock) return;

  // создаём или находим панель статистики внутри белого блока
  let statsBlock = urgentBlock.querySelector(".overview-stats");
  if (!statsBlock) {
    statsBlock = document.createElement("div");
    statsBlock.className = "overview-stats";
    urgentBlock.appendChild(statsBlock);
  }

  const hour = new Date().getHours();
  const isNight = hour < 7 || hour > 20;

  statsBlock.classList.remove("night-theme", "day-theme");
  statsBlock.classList.add(isNight ? "night-theme" : "day-theme");

  const tasksHTML = stats.tasks
    .map(
      (t, i) => `
    <div class="task-row">
      <div class="task-index">${i + 1}.</div>
      <textarea class="day-task-input" readonly>${t.title}</textarea>
    </div>
  `,
    )
    .join("");

  statsBlock.innerHTML = `
    <div class="day-overview-header">
      <div class="sky-icons">
        ${
          isNight
            ? `
          <svg class="moon-icon" viewBox="0 0 24 24" width="32" height="32" fill="#f0f0f0">
            <path d="M21 12.79A9 9 0 0111.21 3 7 7 0 1012 21a9 9 0 009-8.21z"/>
          </svg>
          <div class="stars-row">
            ${Array.from({ length: 15 })
              .map(
                () => `
              <svg class="star-icon" viewBox="0 0 24 24" width="12" height="12" fill="#fffacd">
                <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9"/>
              </svg>
            `,
              )
              .join("")}
          </div>
        `
            : `
          <svg class="sun-icon" viewBox="0 0 24 24" width="32" height="32" fill="#FFD700">
            <circle cx="12" cy="12" r="5"></circle>
            <g stroke="#FFD700" stroke-width="2">
              <line x1="12" y1="1" x2="12" y2="4"></line>
              <line x1="12" y1="20" x2="12" y2="23"></line>
              <line x1="1" y1="12" x2="4" y2="12"></line>
              <line x1="20" y1="12" x2="23" y2="12"></line>
              <line x1="4.2" y1="4.2" x2="6.3" y2="6.3"></line>
              <line x1="17.7" y1="17.7" x2="19.8" y2="19.8"></line>
              <line x1="4.2" y1="19.8" x2="6.3" y2="17.7"></line>
              <line x1="17.7" y1="6.3" x2="19.8" y2="4.2"></line>
            </g>
          </svg>
        `
        }
      </div>
      <h2 class="title_text">DAY OVERVIEW</h2>
    </div>
    <div class="today-tasks">
    ${tasksHTML || '<div class="empty-today">Сегодня новых задач нет</div>'}
  </div>


    <div class="day-overview-indicators">
      <div class="indicator">
        <div class="label">all</div>
        <div class="value">${stats.all}</div>
      </div>

      <div class="indicator">
        <div class="label">in progress</div>
        <div class="progress-bar">
          <div class="fill fill-inprogress" style="width: ${stats.percentPostponed}%"></div>
        </div>
        <div class="value">${stats.percentPostponed}%</div>
      </div>

      <div class="indicator">
        <div class="label">priority</div>
        <div class="progress-bar">
          <div class="fill fill-priority" style="width: ${stats.percentPriority}%"></div>
        </div>
        <div class="value">${stats.percentPriority}%</div>
      </div>

      <div class="indicator">
        <div class="label">done</div>
        <div class="progress-bar">
          <div class="fill fill-done" style="width: ${stats.percentDone}%"></div>
        </div>
        <div class="value">${stats.percentDone}%</div>
      </div>
    </div>
    <button class="end-day-btn">Завершить день</button>
  `;

  const endDayBtn = statsBlock.querySelector(".end-day-btn");

  endDayBtn.addEventListener("click", () => {
    moveTodayCompletedToHistory();
    renderDayOverview();
  });
  // расставляем звёзды случайно при ночной теме
  if (isNight) {
    const stars = statsBlock.querySelectorAll(".star-icon");
    stars.forEach((star) => {
      const x = Math.random() * 90;
      const y = Math.random() * 60;
      const scale = 0.7 + Math.random() * 0.6;
      star.style.position = "relative";
      star.style.left = `${x}%`;
      star.style.top = `${y}px`;
      star.style.transform = `scale(${scale})`;
      star.style.animationDuration = `${2 + Math.random() * 3}s`;
    });
  }

  renderQuote();
}

export { renderDayOverview, ensureContainersExist };
