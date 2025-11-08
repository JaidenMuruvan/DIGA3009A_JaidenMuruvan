document.addEventListener("DOMContentLoaded", () => {
  const navHTML = `
    <nav class="main-nav">
      <div class="nav-container">
        <a href="../index.html" class="logo">
          <svg id="rarity-icon" xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 512 512">
            <circle cx="256" cy="256" r="200" fill="none" stroke="#00aaff" stroke-width="10"/>
            <path d="M256 100 L300 220 L420 220 L320 280 L360 400 L256 320 L152 400 L192 280 L92 220 L212 220 Z"
              fill="none"
              stroke="#00aaff"
              stroke-width="8"
              stroke-linejoin="round"
              stroke-linecap="round"/>
          </svg>
          <span>Fortnite Companion</span>
        </a>

        <button class="menu-toggle" id="menu-toggle" aria-label="Toggle Menu">
          ☰
        </button>

        <ul class="navigation-menu" id="nav-menu">
          <li><a href="../index.html">Home</a></li>
          <li><a href="../Stats/stats.html">Stats</a></li>
          <li><a href="../ItemShop/itemShop.html">Item Shop</a></li>
          <li><a href="../News/news.html">News</a></li>
          <li class="dropdown">
            <a href="#">Cosmetics ▼</a>
            <ul class="dropdown-menu">
              <li><a href="../Outfit/cosmetics.html">All Cosmetics</a></li>
              <li><a href="../Outfit/locker.html">Your Locker</a></li>
              <li><a href="../Outfit/outfit.html">Outfit Randomizer</a></li>
            </ul>
          </li>
        </ul>
      </div>
    </nav>
  `;

  document.body.insertAdjacentHTML("afterbegin", navHTML);

  //Mobile toggle
  const menuToggle = document.getElementById("menu-toggle");
  const navMenu = document.getElementById("nav-menu");
  menuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("show-menu");
  });

  //Highlights active page
  const currentPage = window.location.pathname.split("/").pop();
  document.querySelectorAll(".navigation-menu a").forEach(link => {
    if (link.getAttribute("href").endsWith(currentPage)) {
      link.classList.add("active");
    }
  });

  //GSAP Animation for SVG icon
  gsap.to("#rarity-icon", {
    scale: 1.1,
    repeat: -1,
    yoyo: true,
    duration: 1.5,
    ease: "power1.inOut"
  });

  gsap.to("#rarity-icon circle", {
    stroke: "#00ffff",
    repeat: -1,
    yoyo: true,
    duration: 1.5,
    ease: "sine.inOut"
  });
});
