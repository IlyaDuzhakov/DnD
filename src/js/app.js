const tasks = document.querySelectorAll(".task");
const columns = document.querySelectorAll(".list__tasks");
const column1 = document.querySelector("#column-1");
const btnAdd = document.querySelector(".btn-add");

const taskList = [];

let dragTask = null;
for (let i = 0; i < tasks.length; i++) {
  tasks[i].draggable = true; // возможность переноса элемента
  tasks[i].addEventListener("dragstart", () => {
    dragTask = tasks[i];
    setTimeout(() => {
      tasks[i].style.display = "none";
    }, 0);
  });
  tasks[i].addEventListener("dragend", () => {
    tasks[i].style.display = "block";
    tasks[i].style.backgroundColor = "yellow";
    dragTask = null;
  });
}
columns.forEach((column) => {
  column.addEventListener("dragover", (event) => {
    event.preventDefault();
    column.classList.add("dragover");
  });
  column.addEventListener("dragleave", () => {
    column.classList.remove("dragover");
  });
  column.addEventListener("drop", () => {
    column.classList.remove("dragover");
    if (dragTask) {
      column.append(dragTask); // append позволяет добавить один html элемент внутрь другого тэга
    }
  });
});
{
  /* <span class="priority-dot">🚀</span> */
}

const html = `
    <div class="new__task">
    <div class="textarea__wrapper">
        <textarea placeholder="Введите название или вставьте ссылку" id="textarea"></textarea>
        <button class="btn-check" title="Отметить как выполненное">✔</button>
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
    btnAdd.addEventListener("click", () => {
      const newTask = { text: textarea.value, id: Date.now() };
      if (newTask.text === '') {
        alert(`Заполни текст`)
        return
      }
      // console.log(newTask)
      taskList.push(newTask);
      // console.log(taskList);
      randerTasks()
    });
  });
  // }
}

const randerTasks = function () { // отрисовка
  column1.innerHTML = ''
  for (let task of taskList) {
    const taskHtml = `
    <div class="task">${task.text}
    <button class="btn-delete">&times</button>
    </div>`;
    column1.insertAdjacentHTML("afterbegin", taskHtml);
  }
};
