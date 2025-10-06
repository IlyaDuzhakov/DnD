import { randerTasks } from "./randerTasks";
import { setupTasksDnD } from "./setupDnD";

//рендер всех колонок + после этого инициализация DnD
function renderAllColumns() {
  const map = {
    "column-1": "new",
    "column-2": "progress",
    "column-3": "done",
  };

  Object.entries(map).forEach(([id, status]) => {
    // Object.entries проходится по объекту и возвращает массив массивов
    const column = document.querySelector(`[data-id="${id}"]`); // добираемся до каждой колонки по текущему data-id
    if (column) randerTasks(column, status);
  });

  // после обновления DOM — навешиваем drag события на задачи
  setupTasksDnD();
}

export { renderAllColumns };
