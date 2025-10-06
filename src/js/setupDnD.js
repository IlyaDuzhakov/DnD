import { placeholder, taskList } from "./app"; // когда у нас несколько переменных импортируется из одного файла это можно делать через запятую
import { countSize } from "./countSize"; // когда у нас несколько переменных импортируется из одного файла это можно делать через запятую
import { renderAllColumns } from "./renderAllColumns"; // когда у нас несколько переменных импортируется из одного файла это можно делать через запятую

let indexDnD = null;
const columns = document.querySelectorAll(".list__tasks");

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
      // закончили перенос для самой задачи
      task.style.display = "block";
      indexDnD = null;
    });
  });
}

function setupColumnDropZones() {
  columns.forEach((column) => {
    column.addEventListener("dragover", (event) => {
      // dragover когда мы оказываемся в пределах той области, куда мы хотим сбросить элемент
      event.preventDefault(); // отмена поведения браузера по умолчанию (disable)
      column.classList.add("dragover");
      const closestElement = countSize(column, event.clientY);
      console.log(closestElement);
      if (closestElement === null) {
        column.append(placeholder);
      } else {
        column.insertBefore(placeholder, closestElement); // если ближайший элемент найден, мы вставляем placeholder по отношению к нему
      }
    });

    column.addEventListener("dragleave", () => {
      // событие, когда мы уходим из заданной области
      column.classList.remove("dragover");
    });

    column.addEventListener("drop", (event) => {
      event.preventDefault();
      column.classList.remove("dragover");

      const id = column.getAttribute("data-id");
      let status;
      if (id === "column-1") {
        status = "new";
      } else if (id === "column-2") {
        status = "progress";
      } else {
        status = "done";
      }

      if (typeof indexDnD === "number" && indexDnD >= 0) {
        const draggedTask = taskList[indexDnD];
        draggedTask.status = status;

        // найдём куда вставить
        const tasksInColumn = [...column.querySelectorAll(".task")]; // спред оператор распаковывает элементы какой-то последовательности
        const placeholderIndex = tasksInColumn.findIndex(
          // ищем индекс элемента в массиве по условию
          (t) => t === placeholder,
        );

        // удаляем из старого места
        taskList.splice(indexDnD, 1);

        // вставляем в нужное место
        if (placeholderIndex === -1) {
          taskList.push(draggedTask); // метод push всегда добавляет элемент в конец массива
        } else {
          const newIndex = taskList.findIndex(
            (t) =>
              t.status === status &&
              tasksInColumn.indexOf(
                document.querySelector(`[data-id="${t.id}"]`),
              ) >= placeholderIndex,
          );
          if (newIndex === -1) {
            taskList.push(draggedTask);
          } else {
            taskList.splice(newIndex, 0, draggedTask);
          }
        }

        localStorage.setItem("tasks", JSON.stringify(taskList));
        indexDnD = null;
        renderAllColumns();
      }
      if (placeholder.parentElement) {
        placeholder.parentElement.remove(placeholder); // removeChild заменяем на remove так как removeChild устарел
      }
    });
  });
}

export { setupTasksDnD, setupColumnDropZones };
