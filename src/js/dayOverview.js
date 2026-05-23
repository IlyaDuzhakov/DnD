import { taskList } from "./app";
import { isToday } from "./utils/date";
import { getTodayQuote } from "./utils/getTodayQuote";
import { loadArchive } from "./archiveService";
import { moveTodayCompletedToHistory } from "./historyService";

// Подсчёт статистики за сегодня
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
// Обеспечиваем наличие блока для цитаты
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

//  Рендер цитаты (поддерживаем {quote} и {text})
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

// Основной рендер блока статистики
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
      <div class="theme-badge ${isNight ? "theme-badge-night" : "theme-badge-day"}">
  ${isNight ? "Night mode" : "Day mode"}
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

  renderQuote();
}

export { renderDayOverview, ensureContainersExist };
