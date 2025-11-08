// Navigate on card click
document.querySelectorAll(".card").forEach(card => {
  card.addEventListener("click", () => {
    const link = card.dataset.link;
    window.location.href = link;
  });
});

// GSAP Animations
// Hero load-in
gsap.from(".hero-title", { opacity: 0, y: 50, duration: 1, ease: "power2.out" });
gsap.from(".hero-subtitle", { opacity: 0, y: 50, duration: 1, delay: 0.3, ease: "power2.out" });

// Cards load-in with stagger
gsap.from(".card", {
  opacity: 0,
  y: 30,
  scale: 0.9,
  duration: 0.8,
  stagger: 0.2,
  ease: "power2.out"
});