import birdIcon from "../img/bird.svg";

export default function createHeader() {
  const header = document.createElement("header");
  header.classList.add("app-header");

  header.innerHTML = `
  <div class="logo-container">
    <img src="${birdIcon}" alt="SwiftBoard Logo" class="logo" />
    <div class="brand-text">
    <h1 class="header-title">SwiftBoard</h1>
    <p class="header-subtitle">Focus. Move. Done.</p>
  </div>
  </div>
`;

  return header;
}
