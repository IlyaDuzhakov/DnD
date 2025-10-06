import { taskList } from "./app";

// рендер одной колонки (только DOM)
const randerTasks = function (column, status) {
  column.innerHTML = ""; // чтобы не дублировались задачи
  const filterTasks = taskList.filter((el) => {
    return el.status === status;
  });
  for (let task of filterTasks) {
    const taskHtml = `
      <div class="task" data-id="${task.id}">
        <div class="task-text">${task.text}</div>
        <button class="btn-delete" aria-label="delete">&times;</button>
        <div class="btn-edit" title="edit">&#9998;</div>
      </div>`;
    column.insertAdjacentHTML("beforeend", taskHtml); // происходит отрисовка
  }
};

export { randerTasks };
