const searchInput = document.getElementById("username");
const platformButtons = document.querySelectorAll(".platform-btn");
const modeFilter = document.getElementById("modeFilter");
const statsContainer = document.getElementById("stats-container");

let selectedPlatform = "epic"; //default platform
let lastSearchedUser = ""; //stores the last searched username

//GSAP Page Intro Animations
window.addEventListener("load", () => {
  gsap.from(".heading-container h1", {
    opacity: 0,
    y: -30,
    duration: 0.8,
    ease: "power2.out"
  });

  gsap.from(".platform-buttons button", {
    opacity: 0,
    y: 20,
    stagger: 0.15,
    duration: 0.6,
    delay: 0.3,
    ease: "power2.out"
  });

  gsap.from([".mode-filter", ".search-container"], {
    opacity: 0,
    y: 30,
    duration: 0.8,
    delay: 0.8,
    stagger: 0.2,
    ease: "power2.out"
  });

  gsap.from(".footer-content", {
    opacity: 0,
    y: 20,
    duration: 1,
    delay: 1.5,
    ease: "power2.out"
  });
});

platformButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    platformButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    selectedPlatform = btn.dataset.platform; 

    //If user was already searched, refresh stats automatically
    if (lastSearchedUser) fetchStats(lastSearchedUser);
  });
});


async function fetchStats(forcedUsername = null) {
  const username = forcedUsername || searchInput.value.trim();
  if (!username) {
    alert("Please enter a Fortnite username");
    return;
  }

  lastSearchedUser = username; 
  const selectedMode = modeFilter?.value || "overall";

  statsContainer.innerHTML = "<p>Loading stats...</p>";

  try {
    const response = await fetch(
      `https://fortnite-api.com/v2/stats/br/v2?name=${encodeURIComponent(username)}&accountType=${selectedPlatform}`,
      {
        headers: { "x-api-key": "912e9ecd-017d-47ac-8801-b56d4d2ca858" }
      }
    );

    const data = await response.json();

    if (!data?.data) {
      statsContainer.innerHTML = "<p>Player not found or no stats available.</p>";
      return;
    }

    const level = data.data.battlePass?.level ?? "N/A";
    const allStats = data.data.stats?.all || {};
    const modeStats = allStats[selectedMode] || {};

    const kills = modeStats.kills ?? 0;
    const wins = modeStats.wins ?? 0;
    const matches = modeStats.matches ?? 0;
    const kd = modeStats.kd ? modeStats.kd.toFixed(2) : "0.00";
    const winRate = modeStats.winRate ? modeStats.winRate.toFixed(2) : "0.00";
    const minutesPlayed = modeStats.minutesPlayed || 0;
    const hoursPlayed = (minutesPlayed / 60).toFixed(1);

    displayStats({ level, kills, wins, matches, kd, winRate, hoursPlayed, mode: selectedMode });
  } catch (err) {
    console.error("Error fetching stats:", err);
    statsContainer.innerHTML = "<p>Failed to load player stats.</p>";
  }
}

//Display stats
function displayStats({ level, kills, wins, matches, kd, winRate, hoursPlayed, mode }) {

    // Reset animation
    statsContainer.style.animation = "none";
    void statsContainer.offsetWidth; //forces reflow
    statsContainer.style.animation = "fadeIn 0.6s ease-in-out";

    const randomSkin = `skins/${Math.floor(Math.random() * 10) + 1}.png`;

  statsContainer.innerHTML = `
    <div class="skin-display">
        <img src="${randomSkin}" alt="Player Skin">
    </div>

    <div class="stats-details"
    <h2>${mode.charAt(0).toUpperCase() + mode.slice(1)} Stats</h2>
    
    <div class="stat-item">
    <img src="../Images/level.png" class="stat-icon" alt="Level Icon">
    <p><strong>Battle Pass Level:</strong> ${level}</p>
    </div>

    <div class="stat-item">
    <img src="../Images/kills.png" class="stat-icon" alt="Kills Icon">
    <p><strong>Kills:</strong> ${kills}</p>
    </div>

    <div class="stat-item">
    <img src="../Images/wins.png" class="stat-icon wins-icon" alt="Wins Icon">
    <p><strong>Wins:</strong> ${wins}</p>
    </div>

    <div class="stat-item">
    <img src="../Images/matches.png" class="stat-icon matches-icon" alt="Match Icon">
    <p><strong>Matches:</strong> ${matches}</p>
    </div>

    <div class="stat-item">
    <img src="../Images/kd.png" class="stat-icon" alt="Kill to Death ratio Icon">
    <p><strong>K/D:</strong> ${kd}</p>
    </div>

    <div class="stat-item">
    <img src="../Images/winrate.png" class="stat-icon" alt="Win rate Icon">
    <p><strong>Win Rate:</strong> ${winRate}%</p>
    </div>

    <div class="stat-item">
    <img src="../Images/hours.png" class="stat-icon" alt="Hours played Icon">
    <p><strong>Hours Played: </strong>${hoursPlayed}h</p>
    </div>
   </div>
  `;
}

//Auto refresh when dropdown changes
modeFilter.addEventListener("change", () => {
  if (lastSearchedUser) fetchStats(lastSearchedUser);
});

document.addEventListener("DOMContentLoaded", () => {
  const searchBtn = document.getElementById("searchBtn");
  if (searchBtn) searchBtn.addEventListener("click", () => fetchStats());
});
