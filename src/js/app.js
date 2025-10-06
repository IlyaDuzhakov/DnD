import { renderAllColumns } from "./renderAllColumns";
import { setupColumnDropZones } from "./setupDnD";

const taskList = JSON.parse(localStorage.getItem("tasks")) || [];
// список задач taskList это то, что мы получаем из localStorage по ключу tasks или если в localStorage еще ничего нет, это будет []
// localStorage хранит данные только в формате строки
// JSON.parse строки преобразует обратно в объекты, массивы
// JSON.stringify объекты и массивы преобразует в строки
// console.log(taskList);

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
  localStorage.setItem("tasks", JSON.stringify(taskList)); // записываем в localStorage актуальный массив задач
  renderAllColumns();
});

// колонки: dragover / dragleave / drop — навесим один раз

const placeholder = document.createElement("div");
placeholder.classList.add("placeholder"); // вынесли placeholder чтобы был к нему доступ

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

    let status;
    if (id === "column-1") {
      status = "new";
    } else if (id === "column-2") {
      status = "progress";
    } else {
      status = "done";
    }

    btnAdd.addEventListener("click", () => {
      const text = textarea.value.trim();
      if (!text) {
        alert("Заполни текст");
        return;
      }
      taskList.push({ text: text, id: Date.now(), status: status });
      localStorage.setItem("tasks", JSON.stringify(taskList));
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

export { taskList, placeholder };
