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

        //SAFELY get the image source
        const imageSrc =
            item.newDisplayAsset?.materialInstances?.[0]?.images?.Icon ||
            item.images?.icon ||
            "https://fortnite-api.com/images/placeholder.png"; // fallback if no image

        //Use the safe imageSrc in your HTML
        div.innerHTML = `
            <img src="${imageSrc}" alt="${item.devName}">
            <h3>${item.devName}</h3>
            <p>Price: ${item.finalPrice} <img src="https://fortnite-api.com/images/vbuck.png" class="vbuck-icon"></p>
        `;

        shopContainer.appendChild(div);
    });
}


loadShop();
