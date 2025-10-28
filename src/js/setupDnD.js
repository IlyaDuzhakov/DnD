import { placeholder, taskList } from "./app"; // когда у нас несколько переменных импортируется из одного файла это можно делать через запятую
import { countSize } from "./countSize"; // когда у нас несколько переменных импортируется из одного файла это можно делать через запятую
import { renderAllColumns } from "./renderAllColumns"; // когда у нас несколько переменных импортируется из одного файла это можно делать через запятую
import { renderDayOverview } from "./dayOverview";
import { showSuccessModal } from "./successModal";

 // когда у нас несколько переменных импортируется из одного файла это можно делать через запятую

let indexDnD = null;
const columns = document.querySelectorAll(".column");

//drag для самих задач (вызвать после рендера)
function setupTasksDnD() {
  const tasks = document.querySelectorAll(".task");
  tasks.forEach((task) => {
    task.draggable = true; // активируем способность к перетаскиванию

    task.addEventListener("dragstart", () => {
      const id = task.getAttribute("data-id");
      indexDnD = taskList.findIndex((el) => el.id == id);
      const rect = task.getBoundingClientRect();

      //Задаем плейсхолдеру размеры
      placeholder.style.height = rect.height + "px";
      placeholder.style.width = rect.width + "px";
      placeholder.style.margin = getComputedStyle(task).margin;
      setTimeout(() => (task.style.display = "none"), 0); // скрываем элемент, чтобы он не отображался в двух местах
      // без setTimeout не будет работать логика с переносом, так как элемент будет исчезать
    });

    // task.addEventListener('drag', (event) => {
    //   console.log(event.target.closest('.task'))

    // })

    task.addEventListener("dragend", () => {
      placeholder.remove();
      // закончили перенос для самой задачи
      task.style.display = "block";
      indexDnD = null;
    });
  });
}

function setupColumnDropZones() {
  columns.forEach((column) => {
    const taskListContainer = column.querySelector(".list__tasks");

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

      const id = taskListContainer.getAttribute("data-id");
      let status;
      if (id === "column-1") {
        status = "new";
      } else if (id === "column-2") {
        status = "progress";
      } else if (id === "column-3") {
        status = "priority";
      } else if (id === "column-4") {
        status = "done";
        // Показываем модальное окно, если задача попала в DONE
        showSuccessModal();
      }

      if (typeof indexDnD === "number" && indexDnD >= 0) {
        const draggedTask = taskList[indexDnD];
        draggedTask.status = status;

        taskList.splice(indexDnD, 1);

        const tasksInColumn = Array.from(
          taskListContainer.querySelectorAll(".task"),
        );
        const placeholderIndex = Array.from(taskListContainer.children).indexOf(
          placeholder,
        );

        let insertIndex = taskList.length;
        if (placeholderIndex !== -1 && tasksInColumn.length > 0) {
          const nextTaskEl = taskListContainer.children[placeholderIndex + 1];
          if (nextTaskEl && nextTaskEl.classList.contains("task")) {
            const nextTaskId = nextTaskEl.getAttribute("data-id");
            const nextTaskIndex = taskList.findIndex((t) => t.id == nextTaskId);
            if (nextTaskIndex !== -1) {
              insertIndex = nextTaskIndex;
            }
          }
        }

        taskList.splice(insertIndex, 0, draggedTask);

        localStorage.setItem("tasks", JSON.stringify(taskList));
        indexDnD = null;
        renderAllColumns();
        renderDayOverview();

      }

      if (placeholder.parentElement) {
        placeholder.remove();
      }
    });
  });
}

export { setupTasksDnD, setupColumnDropZones };

// column.addEventListener("drop", (event) => {
//   event.preventDefault();
//   column.classList.remove("dragover");

//   const id = column.getAttribute("data-id");
//   let status;
//   if (id === "column-1") {
//     status = "new";
//   } else if (id === "column-2") {
//     status = "progress";
//   } else {
//     status = "done";
//   }

//   if (typeof indexDnD === "number" && indexDnD >= 0) {
//     const draggedTask = taskList[indexDnD];
//     draggedTask.status = status;

//     // найдём куда вставить
//     const tasksInColumn = [...column.querySelectorAll(".task")]; // спред оператор распаковывает элементы какой-то последовательности
//     const placeholderIndex = tasksInColumn.findIndex(
//       // ищем индекс элемента в массиве по условию
//       (t) => t === placeholder,
//     );

//     // удаляем из старого места
//     taskList.splice(indexDnD, 1);

//     // вставляем в нужное место
//     if (placeholderIndex === -1) {
//       taskList.push(draggedTask); // метод push всегда добавляет элемент в конец массива
//     } else {
//       const newIndex = taskList.findIndex(
//         (t) =>
//           t.status === status &&
//           tasksInColumn.indexOf(
//             document.querySelector(`[data-id="${t.id}"]`),
//           ) >= placeholderIndex,
//       );
//       if (newIndex === -1) {
//         taskList.push(draggedTask);
//       } else {
//         taskList.splice(newIndex, 0, draggedTask);
//       }
//     }

//     localStorage.setItem("tasks", JSON.stringify(taskList));
//     indexDnD = null;
//     renderAllColumns();
//   }
//   if (placeholder.parentElement) {
//     placeholder.parentElement.remove(placeholder); // removeChild заменяем на remove так как removeChild устарел
//   }
// });
