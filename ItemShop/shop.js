const shopContainer = document.getElementById("shop-items");
const searchInput = document.getElementById("searchInput");
const timer = document.getElementById("timer");
const dateDisplay = document.getElementById("date");

//Displays current date
dateDisplay.textContent = `Date: ${new Date().toLocaleDateString()}`;

//Countdown timer for shop refresh
function updateCountdown() {
    const now = new Date();
    const nextRefresh = new Date();
    nextRefresh.setUTCHours(0, 0, 0, 0);
    nextRefresh.setUTCDate(now.getUTCDate() + 1);

    const diff= nextRefresh - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    timer.textContent = `Shop refreshes in: ${hours}h ${minutes}m ${seconds}s`;
}
setInterval(updateCountdown, 1000);

//Item shop data
async function loadShop() {
    try {
        const response = await fetch("https://fortnite-api.com/v2/shop");
        const data = await response.json();
        const items = data.data.entries;

        displayItems(items);

        // Filter items
        searchInput.addEventListener("keyup", () => {
            const search = searchInput.value.toLowerCase();
            const filtered = items.filter(item =>
                item.devName.toLowerCase().includes(search)
            );
            displayItems(filtered);
        });
    } catch (err) {
        console.error("Error loading shop:", err);
        shopContainer.innerHTML = "<p>Failed to load shop data.</p>";
    }
}

//Displays items dynamically
function displayItems(items) {
    shopContainer.innerHTML = "";

    if (!items || items.length === 0) {
        shopContainer.innerHTML = "<p>No items found.</p>";
        return;
    }

    items.forEach(item => {
        const div = document.createElement("div");
        div.classList.add("shop-item");

        const imageSrc = item.images?.icon || "../Images/PlaceHolderImage.png";

        // Clean name and detect bundles
        let cleanName = item.devName || item.name || "";
        cleanName = cleanName.replace(/\[VIRTUAL\] ?\d+ x /g, ""); // remove [VIRTUAL] 1 x
        cleanName = cleanName.replace(/ for -?\d+ MtxCurrency$/, ""); // remove price at end

        // If it has multiple items, mark as bundle
        if (cleanName.includes(",")) {
            const firstItem = cleanName.split(",")[0].trim();
            cleanName = `${firstItem} Bundle`;
        }

        div.innerHTML = `
            <img src="${imageSrc}" alt="${cleanName}">
            <h3>${cleanName}</h3>
            <p class="price-container">
                <img src="../Images/vbuck.png" class="vbuck-icon">
                <span>${item.finalPrice}</span>
            </p>
        `;

        shopContainer.appendChild(div);
    });
}


loadShop();
