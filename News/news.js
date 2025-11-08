// --- FETCH FORTNITE NEWS ---
async function fetchFortniteNews() {
  const newsContainer = document.getElementById("news-container");
  try {
    const response = await fetch("https://fortnite-api.com/v2/news");
    const data = await response.json();

    const brNews = data?.data?.br?.motds || [];

    if (!brNews.length) {
      newsContainer.innerHTML = "<p>No recent Fortnite news found.</p>";
      return;
    }

    newsContainer.innerHTML = brNews.slice(0, 4).map(item => `
      <div class="news-card">
        <img src="${item.image}" alt="${item.title}">
        <h3>${item.title}</h3>
        <p>${item.body}</p>
      </div>
    `).join("");

    // Animate news cards
    gsap.from(".news-card", {
      scrollTrigger: {
        trigger: ".news-section",
        start: "top 85%",
      },
      opacity: 0,
      y: 50,
      stagger: 0.2,
      duration: 0.8,
      ease: "power2.out",
    });

  } catch (err) {
    newsContainer.innerHTML = "<p>Failed to load Fortnite news.</p>";
    console.error("Error fetching Fortnite news:", err);
  }
}

fetchFortniteNews();


// --- BUG REPORT FORM VALIDATION ---
const bugForm = document.getElementById("bugForm");
const formMessage = document.getElementById("form-message");

const validateField = (input, condition, message) => {
  const errorElement = input.parentElement.querySelector(".error-message");
  if (!condition) {
    input.classList.add("error");
    input.classList.remove("success");
    errorElement.textContent = message;
    return false;
  } else {
    input.classList.remove("error");
    input.classList.add("success");
    errorElement.textContent = "";
    return true;
  }
};

["input", "change", "keyup"].forEach(evt => {
  bugForm.addEventListener(evt, (e) => {
    if (e.target.id === "name") validateField(e.target, e.target.value.trim() !== "", "Name is required");
    if (e.target.id === "email") validateField(e.target, /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e.target.value), "Invalid email address");
    if (e.target.id === "platform") validateField(e.target, e.target.value !== "", "Select a platform");
    if (e.target.id === "description") validateField(e.target, e.target.value.trim().length >= 10, "Description must be at least 10 characters");
  });
});

bugForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const nameValid = validateField(bugForm.name, bugForm.name.value.trim() !== "", "Name is required");
  const emailValid = validateField(bugForm.email, /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(bugForm.email.value), "Invalid email address");
  const platformValid = validateField(bugForm.platform, bugForm.platform.value !== "", "Select a platform");
  const descriptionValid = validateField(bugForm.description, bugForm.description.value.trim().length >= 10, "Description too short");

  if (!(nameValid && emailValid && platformValid && descriptionValid)) return;

  // Save report in localStorage
  const bugReports = JSON.parse(localStorage.getItem("bugReports")) || [];
  bugReports.push({
    name: bugForm.name.value.trim(),
    email: bugForm.email.value.trim(),
    platform: bugForm.platform.value,
    description: bugForm.description.value.trim(),
    date: new Date().toLocaleString()
  });
  localStorage.setItem("bugReports", JSON.stringify(bugReports));

  bugForm.reset();
  formMessage.style.color = "#4caf50";
  formMessage.textContent = "Bug reported successfully!";
  gsap.fromTo(formMessage, { opacity: 0 }, { opacity: 1, duration: 0.8 });

  // Reset validation styling
  bugForm.querySelectorAll("input, select, textarea").forEach(el => el.classList.remove("success"));
});

// Animate form section on scroll
gsap.from(".bug-report-section", {
  scrollTrigger: {
    trigger: ".bug-report-section",
    start: "top 85%",
  },
  opacity: 0,
  y: 50,
  duration: 1,
  ease: "power2.out",
});
