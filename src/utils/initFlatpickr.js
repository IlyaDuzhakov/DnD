import flatpickr from "flatpickr";
import "flatpickr/dist/themes/material_blue.css";
import { Russian } from "flatpickr/dist/l10n/ru.js";

export function initFlatpickr() {
  const monthEl = document.getElementById("calendar-month");
  const dayEl = document.getElementById("calendar-day");
  const input = document.getElementById("calendar");
  const trigger = document.getElementById("calendar-trigger");

  if (!input || !trigger || !monthEl || !dayEl) {
    console.warn("⚠️ Элементы календаря не найдены!");
    return;
  }

  // === текущая дата ===
  const now = new Date();
  const months = [
    "ЯНВ.",
    "ФЕВР.",
    "МАРТ.",
    "АПР.",
    "МАЙ",
    "ИЮНЬ",
    "ИЮЛЬ",
    "АВГ.",
    "СЕНТ.",
    "ОКТ.",
    "НОЯБ.",
    "ДЕК.",
  ];
  monthEl.textContent = months[now.getMonth()];
  dayEl.textContent = now.getDate();

  // === flatpickr ===
  const picker = flatpickr(input, {
    locale: Russian,
    dateFormat: "d.m.Y",
    defaultDate: now,
    // 📍 Ключевые изменения
    positionElement: trigger, // <- говорит Flatpickr позиционировать относительно этого блока
    static: false, // <- разрешает свободное позиционирование
    onChange: (selectedDates) => {
      const selected = selectedDates[0];
      monthEl.textContent = months[selected.getMonth()];
      dayEl.textContent = selected.getDate();
    },
  });

  trigger.addEventListener("click", () => {
    picker.open();
  });
}
