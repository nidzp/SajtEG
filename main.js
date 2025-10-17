console.log("SajtEG: init");

// 1) HERO animacije sa GSAP (naslov i podnaslov)
document.addEventListener("DOMContentLoaded", () => {
  const tl = gsap.timeline({ defaults: { duration: 0.7, ease: "power2.out" } });
  tl.to("#heroTitle", { opacity: 1, y: 0 })
    .to("#heroSubtitle", { opacity: 1, y: 0 }, "-=0.4");
});

// 2) Scroll animacije sa AOS (kartice dole)
AOS.init({
  duration: 600,     // trajanje animacije u ms
  once: true,        // animiraj samo prvi put
  offset: 80,        // offset u px pre nego što se trigguje
  easing: "ease-out" // osećaj animacije
});
