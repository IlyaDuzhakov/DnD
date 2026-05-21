import { loadArchive } from "./archiveService";

export function showArchiveModal() {
  const archiveList = loadArchive();

  const modal = document.createElement("div");
  modal.className = "modal archive-modal";

  const tasksHtml = archiveList.length
    ? archiveList
        .map(
          (task) => `
            <li class="archive-item">
              <span class="archive-title">✓ ${task.title}</span>
              <span class="archive-date">
                ${new Date(task.completedAt).toLocaleDateString("ru-RU")}
              </span>
            </li>
          `,
        )
        .join("")
    : `<p class="archive-empty">Архив пока пуст</p>`;

  modal.innerHTML = `
    <div class="modal-content archive-content">
      <h2>Архив выполненных задач</h2>

      <ul class="archive-list">
        ${tasksHtml}
      </ul>

      <div class="archive-buttons">
  <button class="archive-clear">
    Очистить архив
  </button>

  <button class="archive-close">
    Закрыть
  </button>
</div>
    </div>
  `;

  document.body.append(modal);

  const closeBtn = modal.querySelector(".archive-close");
  const clearBtn = modal.querySelector(".archive-clear");

  clearBtn.addEventListener("click", () => {
    localStorage.removeItem("completedTasks");

    modal.remove();

    showArchiveModal();
  });

  closeBtn.addEventListener("click", () => {
    modal.remove();
  });

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.remove();
    }
  });
}
