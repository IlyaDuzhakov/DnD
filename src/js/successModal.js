export function showSuccessModal() {
  const modal = document.createElement("div");
  modal.id = "success-modal";
  modal.className = "modal hidden";

  modal.innerHTML = `
    <div class="modal-content">
      <h2>Поздравляем! 🎉</h2>
      <p>Вы успешно выполнили задачу.</p>
      <button id="close-success-modal">Закрыть</button>
    </div>
  `;

  document.body.appendChild(modal);

  modal.querySelector("#close-success-modal").addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  // Показываем окно
  setTimeout(() => {
    modal.classList.remove("hidden");
  }, 50);
}
