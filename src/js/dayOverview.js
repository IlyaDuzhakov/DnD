// dayOverview.js
import { taskList } from "./app";
import { isToday } from "./utils/date";


function getTodayStats() {
  const todayTasks = taskList.filter((task) => isToday(task.createdAt));

  const all = todayTasks.filter(t => t.status === "new").length;
  const done = todayTasks.filter(t => t.status === "done").length;
  const inProgress = todayTasks.filter(t => t.status === "progress").length;
  const priority = todayTasks.filter(t => t.status === "priority").length;

  const total = all + done + inProgress + priority;

  const percentDone = total ? Math.round((done / total) * 100) : 0;
  const percentPostponed = total ? Math.round((inProgress / total) * 100) : 0;
  const percentPriority = total ? Math.round((priority / total) * 100) : 0;

  return {
    all, // только "new"
    done,
    inProgress,
    priority,
    percentDone,
    percentPostponed,
    percentPriority,
    tasks: todayTasks.filter(t => t.status === "new"), // только "new"
  };
}


function renderDayOverview() {
  const stats = getTodayStats();
  const container = document.querySelector("#day-overview");
  if (!container) return;

  const isNight = new Date().getHours() < 7 || new Date().getHours() > 20;
    // Добавляем тему в зависимости от времени суток
  container.classList.add(isNight ? "night-theme" : "day-theme");
  console.log("Сегодняшние задачи:", stats.tasks);

  container.innerHTML = `
  <div class="day-overview-header">

  <div class="sky-icons">
    ${isNight ? `
      <svg class="moon-icon" viewBox="0 0 24 24" width="32" height="32" fill="#f0f0f0">
        <path d="M21 12.79A9 9 0 0111.21 3 7 7 0 1012 21a9 9 0 009-8.21z"/>
      </svg>
      <div class="stars-row">
        ${[...Array(15)].map(() => `
          <svg class="star-icon" viewBox="0 0 24 24" width="12" height="12" fill="#fffacd">
            <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9"/>
          </svg>
        `).join('')}
      </div>
    ` : `
      <svg class="sun-icon" viewBox="0 0 24 24" width="32" height="32" fill="#FFD700">
        <circle cx="12" cy="12" r="5"/>
        <g stroke="#FFD700" stroke-width="2">
          <line x1="12" y1="1" x2="12" y2="4"/>
          <line x1="12" y1="20" x2="12" y2="23"/>
          <line x1="1" y1="12" x2="4" y2="12"/>
          <line x1="20" y1="12" x2="23" y2="12"/>
          <line x1="4.2" y1="4.2" x2="6.3" y2="6.3"/>
          <line x1="17.7" y1="17.7" x2="19.8" y2="19.8"/>
          <line x1="4.2" y1="19.8" x2="6.3" y2="17.7"/>
          <line x1="17.7" y1="6.3" x2="19.8" y2="4.2"/>
        </g>
      </svg>
    `}
  </div>

  <h2 class="title_text">DAY OVERVIEW</h2>
</div>


<div class="today-tasks">
  ${stats.tasks.map((task, index) => `
    <div class="task-row">
      <div class="task-index">${index + 1}.</div>
      <textarea class="day-task-input" readonly>${task.title}</textarea>
    </div>
  `).join("")}
</div>



<div class="day-overview-indicators">

<div class="indicator">
<div class="label">all deal</div>
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
`;

if (isNight) {
  const container = document.querySelector(".sky-icons");
  const stars = container.querySelectorAll(".star-icon");

  stars.forEach(star => {
    const x = Math.random() * 90; // %
    const y = Math.random() * 60; // px height
    const scale = 0.7 + Math.random() * 0.6;

    star.style.left = `${x}%`;
    star.style.top = `${y}px`;
    star.style.transform = `scale(${scale})`;
    star.style.animationDuration = `${2 + Math.random()*3}s`;
  });
}

}




export { renderDayOverview };
