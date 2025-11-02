const randomizeBtn = document.getElementById("randomize-btn");
const randomOutfitContainer = document.getElementById("random-outfit-container");

function randomizeOutfit() {
    const locker = JSON.parse(localStorage.getItem("locker")) || [];
    if (locker.length === 0) {
        randomOutfitContainer.innerHTML = "<p>Your locker is empty!</p>";
        return;
    }

    // Group items by type
    const types = {};
    locker.forEach(item => {
        if (!types[item.type]) types[item.type] = [];
        types[item.type].push(item);
    });

    // Pick one random item per type
    const outfit = Object.keys(types).map(type => {
        const itemsOfType = types[type];
        return itemsOfType[Math.floor(Math.random() * itemsOfType.length)];
    });

    // Display outfit
    randomOutfitContainer.innerHTML = "";
    outfit.forEach(item => {
        const div = document.createElement("div");
        div.classList.add("outfit-item");
        div.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <h3>${item.name}</h3>
            <p>${item.type}</p>
        `;
        randomOutfitContainer.appendChild(div);
    });
}

randomizeBtn.addEventListener("click", randomizeOutfit);
