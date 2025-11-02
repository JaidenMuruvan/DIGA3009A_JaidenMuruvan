const container = document.getElementById("cosmetic-container");
const searchInput = document.getElementById("searchInput");

let cosmetics = [];
let displayedCount = 0;
const batchSize = 100; //number of cosmetics per scroll load

async function loadCosmetics() {
  try {
    const response = await fetch("https://fortnite-api.com/v2/cosmetics/br");
    const json = await response.json();

    console.log("Fortnite API response:", json); 

    if (Array.isArray(json.data)) {
      cosmetics = json.data;
    } else {
      console.error("Unexpected structure:", json);
      container.innerHTML = "<p>Could not find cosmetics data.</p>";
      return;
    }

    displayNextBatch();
    setupInfiniteScroll(); 

    //Search filter
    searchInput.addEventListener("input", () => {
      const search = searchInput.value.toLowerCase();
      const filtered = cosmetics.filter(item =>
        item.name.toLowerCase().includes(search)
      );
      displayCosmetics(filtered);
    });

  } catch (err) {
    console.error("Error loading cosmetics:", err);
    container.innerHTML = "<p>Failed to load cosmetics.</p>";
  }
}

function displayNextBatch() {
  const nextBatch = cosmetics.slice(displayedCount, displayedCount + batchSize);
  displayCosmetics(nextBatch, true);
  displayedCount += nextBatch.length;
}

function displayCosmetics(cosmeticsToShow, append = false) {
  if (!append) container.innerHTML = "";

  cosmeticsToShow.forEach(cosmetic => {
    const div = document.createElement("div");
    div.classList.add("cosmetic-item");

    const imageSrc = cosmetic.images?.icon || "../Images/PlaceHolderImage.png";

    div.innerHTML = `
      <img src="${imageSrc}" alt="${cosmetic.name}">
      <h3>${cosmetic.name}</h3>
      <p>${cosmetic.type.displayValue}</p>
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
