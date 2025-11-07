const searchInput = document.getElementById("username");
const platformButtons = document.querySelectorAll(".platform-btn");
const modeFilter = document.getElementById("modeFilter");
const statsContainer = document.getElementById("stats-container");

let selectedPlatform = "epic"; // default

// Platform button click
platformButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    platformButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    selectedPlatform = btn.dataset.platform; // e.g. epic, psn, xbl
  });
});

// Fetch player stats
async function fetchStats() {
  const username = searchInput.value.trim();
  if (!username) {
    alert("Please enter a Fortnite username");
    return;
  }

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

    // ✅ Correct path for Battle Pass Level
    const level = data.data.battlePass?.level ?? "N/A";

    // ✅ Access stats properly
    const allStats = data.data.stats?.all || {};
    const modeStats = allStats[selectedMode] || {};

    // Extract values safely
    const kills = modeStats.kills ?? 0;
    const wins = modeStats.wins ?? 0;
    const matches = modeStats.matches ?? 0;
    const kd = modeStats.kd ? modeStats.kd.toFixed(2) : "0.00";
    const winRate = modeStats.winRate ? modeStats.winRate.toFixed(2) : "0.00";

    displayStats({ level, kills, wins, matches, kd, winRate, mode: selectedMode });
  } catch (err) {
    console.error("Error fetching stats:", err);
    statsContainer.innerHTML = "<p>Failed to load player stats.</p>";
  }
}

// Display stats
function displayStats({ level, kills, wins, matches, kd, winRate, mode }) {
  statsContainer.innerHTML = `
    <h2>${mode.charAt(0).toUpperCase() + mode.slice(1)} Mode</h2>
    <p><strong>Battle Pass Level:</strong> ${level}</p>
    <p><strong>Kills:</strong> ${kills}</p>
    <p><strong>Wins:</strong> ${wins}</p>
    <p><strong>Matches:</strong> ${matches}</p>
    <p><strong>K/D:</strong> ${kd}</p>
    <p><strong>Win Rate:</strong> ${winRate}%</p>
  `;
}

// Event listener
document.addEventListener("DOMContentLoaded", () => {
  const searchBtn = document.getElementById("searchBtn");
  if (searchBtn) searchBtn.addEventListener("click", fetchStats);
});
