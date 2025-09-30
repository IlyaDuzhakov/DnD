const columns = document.querySelectorAll(".list__tasks");
const taskList = JSON.parse(localStorage.getItem('tasks')) || [];
// список задач taskList это то, что мы получаем из localStorage по ключу tasks или если в localStorage еще ничего нет, это будет []
// localStorage хранит данные только в формате строки
// JSON.parse строки преобразует обратно в объекты, массивы
// JSON.stringify объекты и массивы преобразует в строки 
console.log(taskList)
let indexDnD = null;

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

// делегирование удаления (навесили один раз)
document.addEventListener("click", (e) => {
  const btn = e.target.closest(".btn-delete"); // closest добираемся до ближайшего дочернего элемента с заданным селектором
  if (!btn) return;
  const taskEl = btn.closest(".task");
  if (!taskEl) return;

  const id = taskEl.getAttribute("data-id"); // у текущей задачи получаем data-id
  const index = taskList.findIndex((el) => el.id == id);
  if (index === -1) return; // защита — если нет такого таска, ничего не делаем

  taskList.splice(index, 1); // splice() - принимает index с которого начать изменения и количество удаляемых элементов
  localStorage.setItem('tasks', JSON.stringify(taskList)) // записываем в localStorage актуальный массив задач
  renderAllColumns();
});

// колонки: dragover / dragleave / drop — навесим один раз
function setupColumnDropZones() {
  columns.forEach((column) => {
    column.addEventListener("dragover", (event) => {
      // dragover когда мы оказываемся в пределах той области, куда мы хотим сбросить элемент
      event.preventDefault(); // отмена поведения браузера по умолчанию (disable)
      column.classList.add("dragover");
    });

    column.addEventListener("dragleave", () => {
      // событие, когда мы уходим из заданной области
      column.classList.remove("dragover");
    });

    column.addEventListener("drop", (event) => {
      // сам сброс
      event.preventDefault();
      column.classList.remove("dragover");

      const id = column.getAttribute("data-id");
      // const status =
      //   id === "column-1" ? "new" : id === "column-2" ? "progress" : "done"; тернарные операторы 

      let status;
      if (id === "column-1") {
        status = "new";
      } else if (id === "column-2") {
        status = "progress";
      } else {
        status = "done";
      }

      if (typeof indexDnD === "number" && indexDnD >= 0) {
        taskList[indexDnD].status = status;
        localStorage.setItem('tasks', JSON.stringify(taskList))
        indexDnD = null;
        renderAllColumns(); // перерендерим всё по новому статусу
      }
    });
  });
}

//drag для самих задач (вызвать после рендера)
function setupTasksDnD() {
  const tasks = document.querySelectorAll(".task");
  tasks.forEach((task) => {
    task.draggable = true; // активируем способность к перетаскиванию

    task.addEventListener("dragstart", () => {
      const id = task.getAttribute("data-id");
      indexDnD = taskList.findIndex((el) => el.id == id);
      // скрываем элемент пока тянем (чтобы не было дубля)
      setTimeout(() => (task.style.display = "none"), 0); // скрываем элемент, чтобы он не отображался в двух местах
    });

    task.addEventListener("dragend", () => { // закончили перенос для самой задачи
      task.style.display = "block";
      indexDnD = null;
    });
  });
}

// добавление карточки
const html = `
  <div class="new__task">
    <div class="textarea__wrapper">
      <textarea placeholder="Введите название или вставьте ссылку" id="textarea"></textarea>
      <div class="button-wrapper">
        <button class="btn-add">Add card</button>
        <button class="btn-close">&times</button>
        <span class="point">...</span>
      </div>
    </div>
  </div>`;

const allCards = document.querySelectorAll(".cards");
for (let cardsEl of allCards) {
  cardsEl.addEventListener("click", (e) => {
    const trigger = e.target.closest(".add-card");
    if (!trigger) return;
    trigger.classList.add("hidden");

    trigger.insertAdjacentHTML("afterend", html);
    const parent = trigger.parentElement;
    const btnClose = parent.querySelector(".btn-close");

    btnClose.addEventListener("click", () => {
      const form = parent.querySelector(".new__task");
      if (form) form.remove();
      trigger.classList.remove("hidden");
    });

    const btnAdd = parent.querySelector(".btn-add");
    const textarea = parent.querySelector("#textarea");
    const grandParent = parent.parentElement;
    const currentColumn = grandParent.querySelector(".list__tasks");
    const id = currentColumn.getAttribute("data-id");
    // let status =
    //   id === "column-1" ? "new" : id === "column-2" ? "progress" : "done";

    let status
    if (id === "column-1") {
      status = "new"
    }
    else if (id === "column-2") {
      status = "progress"
    }
    else {
      status = "done"
    }

    btnAdd.addEventListener("click", () => {
      const text = textarea.value.trim();
      if (!text) {
        alert("Заполни текст");
        return;
      }
      taskList.push({ text:text, id: Date.now(), status:status });
      localStorage.setItem('tasks', JSON.stringify(taskList))
      // убираем форму и показываем триггер снова
      const form = parent.querySelector(".new__task");
      if (form) form.remove();
      trigger.classList.remove("hidden");
      renderAllColumns();
    });
  });
}

//  инициализация (навесить drop-зоны и начальный рендер)

setupColumnDropZones();
renderAllColumns();
