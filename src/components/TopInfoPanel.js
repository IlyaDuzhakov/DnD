export function createTopInfoPanel() {
  const panel = document.createElement("div");
  panel.classList.add("top-info-panel");

  panel.innerHTML = `
    <div class="top-panel-container">
    
      <div class="time-block">
        <div>Москва: <span class="tz" data-tz="Europe/Moscow">--:--:--</span></div>
        <div>Центр. Европа: <span class="tz" data-tz="Europe/Berlin">--:--:--</span></div>
        <div>Лондон: <span class="tz" data-tz="Europe/London">--:--:--</span></div>
        <div>Нью-Йорк: <span class="tz" data-tz="America/New_York">--:--:--</span></div>
        <div>Казахстан: <span class="tz" data-tz="Asia/Almaty">--:--:--</span></div>
        <div>Аргентина: <span class="tz" data-tz="America/Argentina/Buenos_Aires">--:--:--</span></div>
        <div>Австралия (Сидней): <span class="tz" data-tz="Australia/Sydney">--:--:--</span></div>
        <div>Токио: <span class="tz" data-tz="Asia/Tokyo">--:--:--</span></div>

        <div>UTC: <span class="tz" data-tz="UTC">--:--:--</span></div>
      </div>

      <div class="urgent-block">
        <h3>🔥 Срочные задачи</h3>
        <p>Здесь будут отображаться задачи, привязанные к дате</p>
      </div>

     <div class="calendar-block">
      <div class="calendar-widget" id="calendar-trigger">
        <div class="calendar-month" id="calendar-month">ОКТ.</div>
        <div class="calendar-day" id="calendar-day">17</div>
        <input id="calendar" type="text" hidden />
      </div>
    </div>
      `;

  return panel;
}

// <label for="task-date-picker">📅 Выбери дату:</label>
function updateTimezones() {
  const spans = document.querySelectorAll(".tz");
  spans.forEach((span) => {
    const zone = span.dataset.tz;
    const now = new Date().toLocaleTimeString("ru-RU", { timeZone: zone });
    span.textContent = now;
  });
}
setInterval(updateTimezones, 1000);
