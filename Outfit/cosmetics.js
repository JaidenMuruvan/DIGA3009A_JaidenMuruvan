const container = document.getElementById("cosmetic-container");
const searchInput = document.getElementById("searchInput");
const typeFilter = document.getElementById("typeFilter");
const sortFilter = document.getElementById("sortFilter");
const seasonFilter = document.getElementById("seasonFilter");

let cosmetics = [];
let filteredCosmetics = [];
let displayedCount = 0;
const batchSize = 60; //number of cosmetics per scroll load

async function loadCosmetics() {
  try {
    const response = await fetch("https://fortnite-api.com/v2/cosmetics/br");
    const json = await response.json();

    console.log("Fortnite API response:", json); 

    if (Array.isArray(json.data)) {
      cosmetics = json.data.filter(c => {
        const hasValidName = c.name && c.name !== "TBD";
        const hasIcon = c.images?.icon;
        const hasType = c.type && c.type.displayValue;
        const hasIntro = c.introduction && c.introduction.text && !c.introduction.text.includes("Unknown");

        return hasValidName && hasIcon && hasType && hasIntro;
});

      filteredCosmetics = [...cosmetics]; //starts as unfiltered

      populateSeasonFilter();
    } else {
      console.error("Unexpected structure:", json);
      container.innerHTML = "<p>Could not find cosmetics data.</p>";
      return;
    }

    displayNextBatch();
    setupInfiniteScroll(); 

   //search and filter
   searchInput.addEventListener("input", applyFilters);
   typeFilter.addEventListener("change", applyFilters);
   sortFilter.addEventListener("change", applyFilters);
   seasonFilter.addEventListener("change", applyFilters);

  } catch (err) {
    console.error("Error loading cosmetics:", err);
    container.innerHTML = "<p>Failed to load cosmetics.</p>";
  }
}

function populateSeasonFilter() {
    const seasonSet = new Set();

    cosmetics.forEach(item => {
        if (item.introduction && item.introduction.chapter && item.introduction.season) {
            const chapter = item.introduction.chapter;
            const season = item.introduction.season;
            seasonSet.add(`Chapter ${chapter} Season ${season}`);
        }
    });

    const sorrtedSeasons = Array.from(seasonSet).sort((a, b) => {
        const [ca, sa] = a.match(/\d+/g).map(Number);
        const [cb, sb] = b.match(/\d+/g).map(Number);
        if (ca !== cb) return ca - cb;
        return sa - sb;
    });

    sorrtedSeasons.forEach(season => {
        const option = document.createElement("option");
        option.value = season;
        option.textContent = season;
        seasonFilter.appendChild(option);
    });
}

function applyFilters() {
    const search = searchInput.value.toLowerCase();
    const selectedType = typeFilter.value;
    const selectedSort = sortFilter.value;
    const selectedSeason = seasonFilter.value;

    filteredCosmetics = cosmetics.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(search);
        const matchesType =
            selectedType === "all" || item.type.displayValue === selectedType;

        let matchesSeason = true;
        if (selectedSeason !== "all" && item.introduction) {
            const seasonString = `Chapter ${item.introduction.chapter} Season ${item.introduction.season}`;
            matchesSeason = seasonString === selectedSeason;
        }

        return matchesSearch && matchesType && matchesSeason;
        
    });

    //sorting part
    switch (selectedSort) {
        case "az":
            filteredCosmetics.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case "za":
            filteredCosmetics.sort((a, b) => b.name.localeCompare(a.name));
            break;
        case "newest":
            filteredCosmetics.sort((a, b) => new Date(b.added || 0) - new Date(a.added || 0));
            break;
        case "oldest":
            filteredCosmetics.sort((a, b) => new Date(a.added || 0) - new Date(b.added || 0));
            break;
    }

    displayedCount = 0;
    container.innerHTML = "";
    displayNextBatch();
}

function displayNextBatch() {
  const nextBatch = filteredCosmetics.slice(displayedCount, displayedCount + batchSize);
  displayCosmetics(nextBatch, true);
  displayedCount += nextBatch.length;
}

function displayCosmetics(cosmeticsToShow, append = false) {
  if (!append) container.innerHTML = "";

  cosmeticsToShow.forEach(cosmetic => {
    const div = document.createElement("div");
    div.classList.add("cosmetic-item");

    const imageSrc = cosmetic.images?.icon || "../Images/PlaceHolderImage.png";
    const intro = cosmetic.introduction
      ? `Chapter ${cosmetic.introduction.chapter} Season ${cosmetic.introduction.season}`
      : "Unknown";

    div.innerHTML = `
      <img src="${imageSrc}" alt="${cosmetic.name}">
      <h3>${cosmetic.name}</h3>
      <p>${cosmetic.type.displayValue}</p>
      <p class="season-info">${intro}</p>
      <button class="add-to-locker">Add to Locker</button>
    `;

    div.querySelector(".add-to-locker").addEventListener("click", () => {
      addToLocker(cosmetic);
    });

    container.appendChild(div);
  });
}


function setupInfiniteScroll() {
  window.addEventListener("scroll", () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
      displayNextBatch();
    }
  });
}

function addToLocker(cosmetic) {
  let locker = JSON.parse(localStorage.getItem("locker")) || [];

  if (locker.some(item => item.id === cosmetic.id)) {
    alert(`${cosmetic.name} is already in your locker!`);
    return;
  }

  locker.push({
    id: cosmetic.id,
    name: cosmetic.name,
    type: cosmetic.type.displayValue,
    image: cosmetic.images?.icon || "../Images/PlaceHolderImage.png"
  });

  localStorage.setItem("locker", JSON.stringify(locker));
  alert(`${cosmetic.name} added to your locker!`);
}

loadCosmetics();
