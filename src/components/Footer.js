import { showArchiveModal } from "../js/archiveModal.js";
import {showHistoryModal} from "../js/historyModal.js";

import archiveIcon from '../img/archive.svg';
import historyIcon from '../img/history.svg';

export default function createFooter() {
  const footer = document.createElement("footer");
  footer.classList.add("footer");

  footer.innerHTML = `
  <div class="footer-left">

   

    <button class="footer-action archive-wrapper">
      <span class="footer-icon">
        <img class="footer-svg" src="${archiveIcon}" alt="Архив">
      </span>
      <span>Архив</span>
    </button>

    <button class="footer-action history-wrapper">
      <span class="footer-icon">
        <img class="footer-svg" src="${historyIcon}" alt="История">
      </span>
      <span>История</span>
    </button>

  </div>
  <div class="footer-wrapper">
  <div class="footer-center made">
    Made by Ilya Duzhakov
  </div>

  <div class="footer-right time">
    © 2025 SwiftBoard
  </div>
  </div>
`;

  const archiveBtn = footer.querySelector(".archive-wrapper");

  archiveBtn.addEventListener("click", () => {
    showArchiveModal();
  });

  const historyBtn = footer.querySelector(".history-wrapper");

  historyBtn.addEventListener("click", () => {
    showHistoryModal();
  });

  return footer;
}
