import { loadHistory } from "./historyService";

export function showHistoryModal() {
  const history = loadHistory();

  const dates = Object.keys(history).sort((a, b) => {
    return new Date(b) - new Date(a);
  });

  const historyHtml = dates.length
    ? dates
        .map((date) => {
          const tasks = history[date];

          const tasksHtml = tasks
            .map(
              (task) => `
                <li class="history-task">
                  ✓ ${task.title}
                </li>
              `,
            )
            .join("");

          return `
            <div class="history-day">
              <h3>${new Date(date).toLocaleDateString("ru-RU")}</h3>
              <ul class="history-task-list">
                ${tasksHtml}
              </ul>
            </div>
          `;
        })
        .join("")
    : `<p class="history-empty">История пока пустая</p>`;

  const modal = document.createElement("div");
  modal.className = "modal history-modal";

  modal.innerHTML = `
    <div class="modal-content history-content">
      <h2>История задач</h2>

      <div class="history-list">
        ${historyHtml}
      </div>

      <button class="history-close">Закрыть</button>
    </div>
  `;

  document.body.append(modal);

  const closeBtn = modal.querySelector(".history-close");

  closeBtn.addEventListener("click", () => {
    modal.remove();
  });

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.remove();
    }
  });
}

