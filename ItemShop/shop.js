const shopContainer = document.getElementById("shop-items");
const searchInput = document.getElementById("searchInput");
const timer = document.getElementById("timer");
const dateDisplay = document.getElementById("date");

// Display current date
dateDisplay.textContent = `Date: ${new Date().toLocaleDateString()}`;

// Countdown timer for shop refresh
function updateCountdown() {
    const now = new Date();
    const nextRefresh = new Date();
    nextRefresh.setUTCHours(0, 0, 0, 0);
    nextRefresh.setUTCDate(now.getUTCDate() + 1);

    const diff = nextRefresh - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    timer.textContent = `Shop refreshes in: ${hours}h ${minutes}m ${seconds}s`;
}
setInterval(updateCountdown, 1000);

// Fetch and display the item shop
async function loadShop() {
    try {
        const response = await fetch("https://fnbr.co/api/shop", {
            headers: { "x-api-key": "a62f062d-02d6-4296-9a15-8a98f123cf3b" }
        });

        const data = await response.json();
        console.log("FNBR API Response:", data);

        if (!data.data) throw new Error("Invalid FNBR API response");

        // Combine all shop sections into one array
        const shopSections = Object.values(data.data).flat();

        displayItems(shopSections);

        // Search filter
        searchInput.addEventListener("input", () => {
            const search = searchInput.value.toLowerCase();
            const filtered = shopSections.filter(item => {
                // Use optional chaining and default to empty string
                return item.name?.toLowerCase().includes(search);
            });
            displayItems(filtered);
        });

    } catch (err) {
        console.error("Error loading shop:", err);
        shopContainer.innerHTML = "<p>Failed to load shop data.</p>";
    }
}

// Display items dynamically
function displayItems(items) {
    shopContainer.innerHTML = "";

    if (!items || items.length === 0) {
        shopContainer.innerHTML = "<p>No items found.</p>";
        return;
    }

    items.forEach(item => {
        const div = document.createElement("div");
        div.classList.add("shop-item");

        const imageSrc = item.images?.icon || item.images?.featured || "../Images/PlaceHolderImage.png";
        const name = item.name || "Unknown Item";
        const price = item.price || item.priceIcon || item.vbucks || item.cost || "N/A";

        div.innerHTML = `
            <img src="${imageSrc}" alt="${name}">
            <h3>${name}</h3>
            <p class="price-container">
                <img src="../Images/vbuck.png" class="vbuck-icon">
                <span>${price}</span>
            </p>
        `;

        shopContainer.appendChild(div);
    });
}

loadShop();
