import "./css/style.css";
import "./js/app.js"; 

import { renderDayOverview } from "./js/dayOverview";
import createHeader from "./components/Header.js";
import createFooter from "./components/Footer.js";
import { createTopInfoPanel } from "./components/TopInfoPanel.js";
import { initFlatpickr } from './js/initFlatpickr.js';
import "flatpickr/dist/themes/material_blue.css";

const root = document.getElementById("app");

const header = createHeader();
const topInfoPanel = createTopInfoPanel();
const footer = createFooter();

root.prepend(header);
root.insertBefore(topInfoPanel, root.children[1]);
root.append(footer);

document.addEventListener("DOMContentLoaded", () => {
  initFlatpickr();
  renderDayOverview();
});
