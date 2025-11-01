const container = document.getElementById("cosmetic-container");
const searchInput = document.getElementById("searchInput");

async function loadCosmetics() {
  try {
    const response = await fetch("https://fortnite-api.com/v2/cosmetics/br");
    const data = await response.json();
    const cosmetics = data.data;

    displayCosmetics(cosmetics);

    // Search functionality
    searchInput.addEventListener("keyup", () => {
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

function displayCosmetics(cosmetics) {
  container.innerHTML = "";
  if (!cosmetics || cosmetics.length === 0) {
    container.innerHTML = "<p>No items found.</p>";
    return;
  }

  cosmetics.forEach(item => {
    const div = document.createElement("div");
    div.classList.add("cosmetic-item");

    const imageSrc = item.images?.icon || item.images?.smallIcon || "placeholder.png";

    div.innerHTML = `
      <img src="${imageSrc}" alt="${item.name}">
      <h4>${item.name}</h4>
      <p>${item.type.displayValue}</p>
    `;

    container.appendChild(div);
  });
}

loadCosmetics();
