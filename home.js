//Navigate on card click
document.querySelectorAll(".card").forEach(card => {
  card.addEventListener("click", () => {
    const link = card.dataset.link;
    window.location.href = link;
  });
});

//GSAP Timeline for hero
const heroTimeline = gsap.timeline();
heroTimeline
  .from(".hero-title", { opacity: 0, y: 50, duration: 1, ease: "power2.out" })
  .from(".hero-subtitle", { opacity: 0, y: 30, duration: 1, ease: "power2.out" }, "-=0.5")
  .from(".cards-container", { opacity: 0, y: 50, duration: 1, stagger: 0.1, ease: "power2.out" }, "-=0.5");

//Cards hover animation with GSAP
document.querySelectorAll(".card").forEach(card => {
  card.addEventListener("mouseenter", () => {
    gsap.to(card, { scale: 1.08, y: -8, duration: 0.2, ease: "power2.out" });
  });
  card.addEventListener("mouseleave", () => {
    gsap.to(card, { scale: 1, y: 0, duration: 0.2, ease: "power2.inOut" });
  });
});
