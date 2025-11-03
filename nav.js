document.addEventListener("DOMContentLoaded", () => {
  // Detect if we're in a subfolder (like Stats/, ItemShop/, etc.)
  const isInSubfolder = window.location.pathname.split("/").length > 2;
  const basePath = isInSubfolder ? "../" : "";

  const navHTML = `
    <nav class="main-nav">
      <div class="nav-container">
        <a href="${basePath}index.html" class="logo">Fortnite Hub</a>

        <button class="menu-toggle" id="menu-toggle" aria-label="Toggle Menu">
          ☰
        </button>

        <ul class="navigation-menu" id="nav-menu">
          <li><a href="${basePath}index.html">Home</a></li>
          <li><a href="${basePath}Stats/stats.html">Stats</a></li>
          <li><a href="${basePath}ItemShop/itemShop.html">Item Shop</a></li>
          <li><a href="${basePath}GameModes/gameModes.html">Game Modes</a></li>
          <li class="dropdown">
            <a href="#">Cosmetics ▼</a>
            <ul class="dropdown-menu">
              <li><a href="${basePath}../Outfit/cosmetics.html">All Cosmetics</a></li>
              <li><a href="${basePath}../Outfit/locker.html">Your Locker</a></li>
              <li><a href="${basePath}../Outfit/outfit.html">Outfit Randomizer</a></li>
            </ul>
          </li>
        </ul>
      </div>
    </nav>
  `;

  // Insert navigation
  document.body.insertAdjacentHTML("afterbegin", navHTML);

  // Mobile toggle functionality
  const menuToggle = document.getElementById("menu-toggle");
  const navMenu = document.getElementById("nav-menu");
  menuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("show-menu");
  });

  // Highlight current active page
  const currentPage = window.location.pathname.split("/").pop();
  document.querySelectorAll(".navigation-menu a").forEach(link => {
    if (link.getAttribute("href").includes(currentPage) && currentPage !== "") {
      link.classList.add("active");
    }
  });
});
