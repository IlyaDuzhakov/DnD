// src/components/Footer.js

export default function createFooter() {
  const footer = document.createElement("footer");
  footer.classList.add("footer");

  footer.innerHTML = `
    <div class="footer-left">
      <div class="trash-wrapper" id="trash">
        <svg class="trash-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9 3V4H4V6H5V20C5 21.1 5.9 22 7 22H17C18.1 22 19 21.1 19 20V6H20V4H15V3H9ZM7 6H17V20H7V6ZM9 8V18H11V8H9ZM13 8V18H15V8H13Z"/>
        </svg>
        <span class="trash-label">Корзина</span>
      </div>
    </div>
    
    <div class="footer-center made">Made by Ilya Duzhakov</div>
    <div class="footer-right time">© 2025 SwiftBoard</div>
  `;

  return footer;
}
