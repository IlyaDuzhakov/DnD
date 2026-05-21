import "./css/style.css";
import "./js/app.js";

import createHeader from "./components/Header.js";
import createFooter from "./components/Footer.js";
import { createTopInfoPanel } from "./components/TopInfoPanel.js";
import { initFlatpickr } from "./js/initFlatpickr.js";
import "flatpickr/dist/themes/material_blue.css";
import { ensureContainersExist, renderDayOverview } from "./js/dayOverview";

const root = document.getElementById("app");

// === создаём элементы ===
const header = createHeader();
const topInfoPanel = createTopInfoPanel();
topInfoPanel.id = "day-overview"; // здесь и будут часы + календарь + статистика
const footer = createFooter();

// === вставляем в нужном порядке ===
root.prepend(header);
root.insertBefore(topInfoPanel, root.children[1]);
root.append(footer);

// === инициализация ===
document.addEventListener("DOMContentLoaded", () => {
  initFlatpickr();
  ensureContainersExist(); 
  renderDayOverview();    
});
