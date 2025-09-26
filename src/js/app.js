const columns = document.querySelectorAll(".list__tasks");
const btnAdd = document.querySelector(".btn-add");

const taskList = [];
let indexDnD;

const DnD = () => {
  const tasks = document.querySelectorAll(".task");
  let dragTask = null;
  for (let i = 0; i < tasks.length; i++) {
    tasks[i].draggable = true; // возможность переноса элемента
    tasks[i].addEventListener("dragstart", () => {
      // начало переноса
      const id = tasks[i].getAttribute("data-id");
      // console.log(id) получили текущий id
      indexDnD = taskList.findIndex((el) => {
        //{ text: textarea.value, id: Date.now(), status: status }
        return el.id == id;
      });
      dragTask = tasks[i];
      setTimeout(() => {
        tasks[i].style.display = "none";
      }, 0);
    });
    tasks[i].addEventListener("dragend", () => {
      // конец переноса
      // console.log(tasks[i]) текущая задача с data-id
      // console.log(index);
      tasks[i].style.display = "block";
      tasks[i].style.backgroundColor = "yellow";
      dragTask = null;
    });
  }
  columns.forEach((column) => {
    column.addEventListener("dragover", (event) => {
      // когда курсор оказывается в пределах выбранного элемента
      event.preventDefault();
      column.classList.add("dragover");
    });
    column.addEventListener("dragleave", () => {
      // курсор уводим с выбранного элемента
      column.classList.remove("dragover");
    });
    column.addEventListener("drop", () => {
      // когда какой-то элемент мы отпускаем в пределах выбранной области
      // console.log(column);
      let status;
      const id = column.getAttribute("data-id");
      if (id === "column-1") {
        status = "new";
      } else if (id === "column-2") {
        status = "progress";
      } else {
        status = "done";
      }
      // console.log(indexDnD);
      if (indexDnD || indexDnD === 0) {
        taskList[indexDnD].status = status; // status текущее значение
      }
      console.log(taskList, 'событие DROP');
      column.classList.remove("dragover");
      if (dragTask) {
        column.append(dragTask); // append позволяет добавить один html элемент внутрь другого тэга
      }
    });
  });
  {
    /* <span class="priority-dot">🚀</span> */
  }
};

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
  // function attachAddCard(cardsEl) {
  cardsEl.addEventListener("click", (e) => {
    const trigger = e.target.closest(".add-card");
    if (!trigger) return; // клик не по "+ Add another card"
    trigger.classList.add("hidden");

    trigger.insertAdjacentHTML("afterend", html);
    const parent = trigger.parentElement;
    // console.log(parent)
    const btnClose = parent.querySelector(".btn-close");
    // console.log(btnClose);
    btnClose.addEventListener("click", () => {
      // console.log("работает");
      const form = parent.querySelector(".new__task");
      // console.log(trigger, parent, form);
      form.classList.add("hidden");
      trigger.classList.remove("hidden");
    });
    const btnAdd = parent.querySelector(".btn-add");
    // console.log(btnAdd)
    const textarea = parent.querySelector("#textarea");
    const grandParent = parent.parentElement;
    // console.log(grandParent)
    const currentColumn = grandParent.querySelector(".list__tasks");
    let status;
    const id = currentColumn.getAttribute("data-id");
    if (id === "column-1") {
      status = "new";
    } else if (id === "column-2") {
      status = "progress";
    } else {
      status = "done";
    }
    // console.log(currentColumn.getAttribute('data-id'))
    btnAdd.addEventListener("click", () => {
      const newTask = { text: textarea.value, id: Date.now(), status: status };
      if (newTask.text === "") {
        alert(`Заполни текст`);
        return;
      }
      // console.log(newTask)
      taskList.push(newTask);
      textarea.value = ""; // очищаем textarea.value
      // console.log(taskList);
      // console.log(parent)
      randerTasks(currentColumn, status); // передаю
    });
  });
  // }
}

const randerTasks = function (column, status) {
  //принимаю
  // отрисовка
  // console.log(status)
  column.innerHTML = "";
  const filterTasks = taskList.filter((el) => {
    return el.status === status;
  });
  for (let task of filterTasks) {
    // только отрисовываем задачи с нужным статусом
    const taskHtml = `
    <div class="task" data-id = ${task.id}>${task.text} 
    <button class="btn-delete">&times</button>
    <div class="btn-edit">&#9998</div>
    </div>`;
    // ${task.id}>${task.text}  добираемся до свойств текущей задачи
    column.insertAdjacentHTML("beforeend", taskHtml);
  }
  deleteTask();
  DnD();
};

const deleteTask = () => {
  const btnsDelete = document.querySelectorAll(".btn-delete");
  for (let btn of btnsDelete) {
    const column = btn.parentElement.parentElement;
    let status;
    const idColumn = column.getAttribute("data-id");
    if (idColumn === "column-1") {
      status = "new";
    } else if (idColumn === "column-2") {
      status = "progress";
    } else {
      status = "done";
    }
    btn.addEventListener("click", () => {
      // console.log(btn.parentElement) // получаем доступ к родительскому элементу в html разметке btn.parentElement
      const id = btn.parentElement.getAttribute("data-id");
      // console.log(id)
      const index = taskList.findIndex((el) => {
        return el.id == id;
      });
      console.log(index)
      taskList.splice(index, 1);
      console.log(taskList, 'удаление')
      // randerTasks(column, status);
      // console.log(taskList)
    });
  }
};
