import "./css/style.css";
import "./js/app";

import createHeader from "./components/Header.js";
import createFooter from "./components/Footer.js";
import { createTopInfoPanel } from "./components/TopInfoPanel.js";
import { initFlatpickr } from "./utils/initFlatpickr.js";
import "flatpickr/dist/themes/material_blue.css";

const root = document.getElementById("app");

const header = createHeader();
const topInfoPanel = createTopInfoPanel();
const footer = createFooter();

root.prepend(header);
root.insertBefore(topInfoPanel, root.children[1]);
root.append(footer);

// вызывем flatpickr, когда DOM загружен
document.addEventListener("DOMContentLoaded", () => {
  initFlatpickr();
});
