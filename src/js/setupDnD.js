import { placeholder, taskList } from "./app";
import { countSize } from "./countSize";
import { renderAllColumns } from "./renderAllColumns";
import { renderDayOverview } from "./dayOverview";
import { showSuccessModal } from "./successModal";
import { addTaskToArchive } from "./archiveService";

let indexDnD = null;
let draggedTaskId = null;

function setupBoardTrashDropZone() {
  const trashZone = document.querySelector("#trash");

  console.log("1. setupBoardTrashDropZone вызвана");
  console.log("2. trashZone:", trashZone);

  if (!trashZone) {
    console.log("3. Корзина НЕ найдена");
    return;
  }

trashZone.addEventListener("dragover", (event) => {
  event.preventDefault();

  console.log("4. Карточка НАД корзиной");

  trashZone.classList.add("trash-active");
});

trashZone.addEventListener("dragleave", () => {
  trashZone.classList.remove("trash-active");
});

trashZone.addEventListener("drop", (event) => {
  event.preventDefault();

  console.log("5. DROP В КОРЗИНУ СРАБОТАЛ");

  const taskId = event.dataTransfer.getData("text/plain");

  console.log("6. taskId из dataTransfer:", taskId);

  const taskIndex = taskList.findIndex(
    (task) => String(task.id) === String(taskId),
  );

  console.log("8. taskIndex:", taskIndex);

  if (taskIndex === -1) {
    console.log("9. Задача НЕ найдена в taskList");
    return;
  }

  taskList.splice(taskIndex, 1);

  localStorage.setItem("tasks", JSON.stringify(taskList));

  trashZone.classList.remove("trash-active");

  if (placeholder.parentElement) {
    placeholder.remove();
  }

  renderAllColumns();
  renderDayOverview();
});

  trashZone.addEventListener("drop", (event) => {
    event.preventDefault();

    console.log("5. DROP В КОРЗИНУ СРАБОТАЛ");

    const taskId = event.dataTransfer.getData("text/plain");
    console.log("6. taskId из dataTransfer:", taskId);

    console.log("7. taskList до удаления:", taskList);

    const taskIndex = taskList.findIndex(
      (task) => String(task.id) === String(taskId),
    );

    console.log("8. taskIndex:", taskIndex);

    if (taskIndex === -1) {
      console.log("9. Задача НЕ найдена в taskList");
      return;
    }

    taskList.splice(taskIndex, 1);

    console.log("10. taskList после удаления:", taskList);

    localStorage.setItem("tasks", JSON.stringify(taskList));

    renderAllColumns();
    renderDayOverview();
  });
}
// DnD для самих задач
function setupTasksDnD() {
  const tasks = document.querySelectorAll(".task");

  tasks.forEach((task) => {
    task.draggable = true;

    task.addEventListener("dragstart", (event) => {
      const id = task.getAttribute("data-id");

      draggedTaskId = id;
      indexDnD = taskList.findIndex((task) => String(task.id) === String(id));

      event.dataTransfer.setData("text/plain", id);

      const rect = task.getBoundingClientRect();

      placeholder.style.height = `${rect.height}px`;
      placeholder.style.width = `${rect.width}px`;
      placeholder.style.margin = getComputedStyle(task).margin;

      setTimeout(() => {
        task.classList.add("dragging-task");
      }, 0);
    });

    task.addEventListener("dragend", () => {
      if (placeholder.parentElement) {
        placeholder.remove();
      }

      task.classList.remove("dragging-task");

      indexDnD = null;
      draggedTaskId = null;
    });
  });
}

// Drop-зоны для колонок и корзины
function setupColumnDropZones() {
  const columns = document.querySelectorAll(".column");

  columns.forEach((column) => {
    const taskListContainer = column.querySelector(".list__tasks");

    if (!taskListContainer) return;

    column.addEventListener("dragover", (event) => {
      event.preventDefault();

      column.classList.add("dragover");

      const closestElement = countSize(taskListContainer, event.clientY);

      if (closestElement === null) {
        taskListContainer.append(placeholder);
      } else {
        taskListContainer.insertBefore(placeholder, closestElement);
      }
    });

    column.addEventListener("dragleave", () => {
      column.classList.remove("dragover");
    });

    column.addEventListener("drop", (event) => {
      event.preventDefault();

      column.classList.remove("dragover");

      const columnId = taskListContainer.getAttribute("data-id");

      if (!draggedTaskId) return;

      // УДАЛЕНИЕ В КОРЗИНУ
      if (columnId === "trash") {
        const taskIndex = taskList.findIndex(
          (task) => String(task.id) === String(draggedTaskId),
        );

        if (taskIndex !== -1) {
          taskList.splice(taskIndex, 1);
          localStorage.setItem("tasks", JSON.stringify(taskList));
        }

        column.classList.remove("dragover");

        if (placeholder.parentElement) {
          placeholder.remove();
        }

        indexDnD = null;
        draggedTaskId = null;

        renderAllColumns();
        renderDayOverview();

        return;
      }
      let status;

      if (columnId === "column-1") {
        status = "new";
      } else if (columnId === "column-2") {
        status = "progress";
      } else if (columnId === "column-3") {
        status = "priority";
      } else if (columnId === "column-4") {
        status = "done";
      }

      if (!status) return;

      const draggedTaskIndex = taskList.findIndex(
        (task) => String(task.id) === String(draggedTaskId),
      );

      if (draggedTaskIndex === -1) return;

      const draggedTask = taskList[draggedTaskIndex];

      draggedTask.status = status;

      if (status === "done") {
        addTaskToArchive(draggedTask);
        showSuccessModal();
      }

      taskList.splice(draggedTaskIndex, 1);

      const placeholderIndex = Array.from(taskListContainer.children).indexOf(
        placeholder,
      );

      let insertIndex = taskList.length;

      if (placeholderIndex !== -1) {
        const nextTaskEl = taskListContainer.children[placeholderIndex + 1];

        if (nextTaskEl && nextTaskEl.classList.contains("task")) {
          const nextTaskId = nextTaskEl.getAttribute("data-id");

          const nextTaskIndex = taskList.findIndex(
            (task) => String(task.id) === String(nextTaskId),
          );

          if (nextTaskIndex !== -1) {
            insertIndex = nextTaskIndex;
          }
        }
      }

      if (status !== "done") {
        taskList.splice(insertIndex, 0, draggedTask);
      }

      localStorage.setItem("tasks", JSON.stringify(taskList));

      if (placeholder.parentElement) {
        placeholder.remove();
      }

      indexDnD = null;
      draggedTaskId = null;

      renderAllColumns();
      renderDayOverview();
    });
  });
}

export { setupTasksDnD, setupColumnDropZones, setupBoardTrashDropZone };
