// -----------------------------
//SECTION SWITCHING LOGIC
// -----------------------------
document.addEventListener("DOMContentLoaded", () => {
  const allCosmeticsSection = document.getElementById("all-cosmetics-section");
  const lockerSection = document.getElementById("locker-section");
  const randomizerSection = document.getElementById("randomizer-section");

  const showAllCosmeticsBtn = document.getElementById("showAllCosmetics");
  const showLockerBtn = document.getElementById("showLocker");
  const showRandomizerBtn = document.getElementById("showRandomizer");

  function showSection(section) {
    // Hide all sections
    allCosmeticsSection.classList.add("hidden");
    lockerSection.classList.add("hidden");
    randomizerSection.classList.add("hidden");

    // Show the chosen one
    section.classList.remove("hidden");
  }

  showAllCosmeticsBtn.addEventListener("click", (e) => {
    e.preventDefault();
    showSection(allCosmeticsSection);
  });

  showLockerBtn.addEventListener("click", (e) => {
    e.preventDefault();
    showSection(lockerSection);
    loadLocker(); // refresh locker each time you open it
  });

  showRandomizerBtn.addEventListener("click", (e) => {
    e.preventDefault();
    showSection(randomizerSection);
  });

  // -----------------------------
  //COSMETICS FETCH + SEARCH
  // -----------------------------
  const container = document.getElementById("cosmetic-container");
  const searchInput = document.getElementById("searchInput");

  async function loadCosmetics() {
    try {
      const response = await fetch("https://fortnite-api.com/v2/cosmetics/br");
      const data = await response.json();
      const cosmetics = data.data;

      displayCosmetics(cosmetics);

      // Search filter
      searchInput.addEventListener("keyup", () => {
        const search = searchInput.value.toLowerCase();
        const filtered = cosmetics.filter((item) =>
          item.name.toLowerCase().includes(search)
        );
        displayCosmetics(filtered);
      });
    } catch (err) {
      console.error("Error loading cosmetics:", err);
      container.innerHTML = "<p>Failed to load cosmetics.</p>";
    }
  }

  function displayCosmetics(cosmetics) {
    container.innerHTML = "";

    cosmetics.forEach((cosmetic) => {
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

  // -----------------------------
  //LOCKER LOGIC
  // -----------------------------
  const lockerContainer = document.getElementById("locker-items");

  function addToLocker(cosmetic) {
    let locker = JSON.parse(localStorage.getItem("locker")) || [];

    if (locker.some((item) => item.id === cosmetic.id)) {
      alert(`${cosmetic.name} is already in your locker!`);
      return;
    }

    locker.push({
      id: cosmetic.id,
      name: cosmetic.name,
      type: cosmetic.type.displayValue,
      image: cosmetic.images?.icon || "../Images/PlaceHolderImage.png",
    });

    localStorage.setItem("locker", JSON.stringify(locker));
    alert(`${cosmetic.name} added to your locker!`);
  }

  function loadLocker() {
    const locker = JSON.parse(localStorage.getItem("locker")) || [];
    lockerContainer.innerHTML = "";

    if (locker.length === 0) {
      lockerContainer.innerHTML = "<p>Your locker is empty!</p>";
      return;
    }

    locker.forEach((item) => {
      const div = document.createElement("div");
      div.classList.add("locker-item");

      const imageSrc = item.image || "../Images/PlaceHolderImage.png";

      div.innerHTML = `
        <img src="${imageSrc}" alt="${item.name}">
        <h3>${item.name}</h3>
        <p>${item.type}</p>
        <button class="remove-button">Remove</button>
      `;

      div.querySelector(".remove-button").addEventListener("click", () => {
        removeFromLocker(item.id);
      });

      lockerContainer.appendChild(div);
    });
  }

  function removeFromLocker(itemId) {
    let locker = JSON.parse(localStorage.getItem("locker")) || [];
    locker = locker.filter((i) => i.id !== itemId);
    localStorage.setItem("locker", JSON.stringify(locker));
    loadLocker();
  }

  // -----------------------------
  //RANDOMIZER FEATURE
  // -----------------------------
  const randomizeButton = document.getElementById("randomizeButton");
  const randomDisplay = document.getElementById("randomized-outfit");

  randomizeButton.addEventListener("click", () => {
    const locker = JSON.parse(localStorage.getItem("locker")) || [];

    if (locker.length === 0) {
      randomDisplay.innerHTML = "<p>Your locker is empty! Add items first.</p>";
      return;
    }

    const randomItem = locker[Math.floor(Math.random() * locker.length)];

    randomDisplay.innerHTML = `
      <h3>${randomItem.name}</h3>
      <img src="${randomItem.image}" alt="${randomItem.name}">
      <p>${randomItem.type}</p>
    `;
  });

  // -----------------------------
  //INITIALIZE EVERYTHING
  // -----------------------------
  loadCosmetics();
});
