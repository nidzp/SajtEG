/*
 * Custom JavaScript for Electrogroup ITS website.
 *
 * Implements scroll‑triggered animations, header style changes on scroll
 * and a simple parallax fade effect for the hero content. Intersection
 * Observer is used to reveal elements as they enter the viewport.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Add / remove 'scrolled' class to header when user scrolls
    const header = document.querySelector('header');
    const heroSection = document.getElementById('hero');
    const heroContent = heroSection.querySelector('.hero-content');

    const onScroll = () => {
        // Toggle header background
        if (window.scrollY > 80) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        // Parallax fade effect on hero content as the user scrolls away from the hero
        const heroHeight = heroSection.offsetHeight;
        const scrollY = Math.min(window.scrollY, heroHeight);
        const ratio = scrollY / heroHeight;
        // Reduce opacity and translate downwards
        heroContent.style.opacity = 1 - ratio;
        heroContent.style.transform = `translateY(${ratio * 50}px)`;
    };
    window.addEventListener('scroll', onScroll);

    // IntersectionObserver to reveal elements when they are near the viewport
    const observerOptions = {
        threshold: 0.2
    };
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                obs.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all elements with 'show-on-scroll' class
    document.querySelectorAll('.show-on-scroll').forEach(el => {
        observer.observe(el);
    });
    // Observe gallery grid, reference list and reasons separately
    const gallery = document.querySelector('.gallery-grid');
    const refs = document.querySelector('.reference-list');
    const reasons = document.querySelector('.reasons');
    [gallery, refs, reasons].forEach(el => {
        if (el) {
            observer.observe(el);
        }
    });
});