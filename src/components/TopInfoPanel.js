function generateStars(n = 20) {
  return [...Array(n)]
    .map(() => {
      const left = Math.floor(Math.random() * 95); // процент от ширины
      const top = Math.floor(Math.random() * 70); // процент от высоты
      const size = Math.random() * 8 + 6; // размер 6–14px
      return `
      <svg class="star-icon" style="left: ${left}%; top: ${top}%; width: ${size}px; height: ${size}px;" viewBox="0 0 24 24" fill="#fffacd">
        <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9"/>
      </svg>
    `;
    })
    .join("");
}

export function createTopInfoPanel() {
  const panel = document.createElement("div");
  panel.classList.add("top-info-panel");

  panel.innerHTML = `
  <div class="top-dashboard-row">

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

   <div class="calendar-block">
  <input id="calendar" type="text" />
</div>

  </div>

  <div class="urgent-block">
    <div id="day-overview"></div>
  </div>
`;

  return panel;
}


function updateTimezones() {
  const spans = document.querySelectorAll(".tz");
  spans.forEach((span) => {
    const zone = span.dataset.tz;
    const now = new Date().toLocaleTimeString("ru-RU", { timeZone: zone });
    span.textContent = now;
  });
}
setInterval(updateTimezones, 1000);
