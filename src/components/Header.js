import sapcanIcon from "../img/sapcan.png";

export default function createHeader() {
  const header = document.createElement("header");
  header.classList.add("app-header");

header.innerHTML = `
  <div class="logo-container">
    <img src="${sapcanIcon}" alt="SwiftBoard Logo" class="logo" />
    <h1 class="header-title">SwiftBoard</h1>
  </div>
`;

  return header;
}