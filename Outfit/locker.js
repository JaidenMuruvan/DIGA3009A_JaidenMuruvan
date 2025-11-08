const tl = gsap.timeline({ defaults: { ease: "power2.out", duration: 0.8 } });

  tl.from(".heading-container h1", { opacity: 0, y: -40 })
    //.from(".shop-grid", { opacity: 0, y: 20 }, "-=0.4")
    //.from(".filter-bar", { opacity: 0, y: 30, stagger: 0.15 }, "-=0.3")
    .from(".locker-items", { opacity: 0, y: 40, duration: 1 }, "-=0.1")
    .from(".footer-content", { opacity: 0, y: 30, duration: 1 }, "-=0.2");

document.addEventListener("DOMContentLoaded", () => {
    const lockerContainer = document.getElementById("locker-items");

    function loadLocker(){
        const locker = JSON.parse(localStorage.getItem("locker")) || [];
        lockerContainer.innerHTML = "";

        if (locker.length === 0) {
            lockerContainer.innerHTML = "<p>Your locker is empty!</p>"
            return;
        }

        locker.forEach(item => {
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
        locker = locker.filter(i => i.id !== itemId);
        localStorage.setItem("locker", JSON.stringify(locker));
        loadLocker();
    }

    loadLocker();
});