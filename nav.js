document.addEventListener("DOMContentLoaded", () => {
  const navHTML = `
    <nav class="main-nav">
      <div class="nav-container">
        <a href="../index.html" class="logo">Fortnite Companion</a>

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

  // Mobile toggle
  const menuToggle = document.getElementById("menu-toggle");
  const navMenu = document.getElementById("nav-menu");
  menuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("show-menu");
  });

  // Highlight active page
  const currentPage = window.location.pathname.split("/").pop();
  document.querySelectorAll(".navigation-menu a").forEach(link => {
    if (link.getAttribute("href").endsWith(currentPage)) {
      link.classList.add("active");
    }
  });
});
