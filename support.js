// JavaScript for the dedicated support/FAQ page.
// Provides interactive toggling for categories and subquestions.

// Ensure shared UI (theme + language) is loaded
(function loadSharedUI(){
    if (document.getElementById('eg-ui-js')) return;
    const s = document.createElement('script');
    s.src = 'assets/ui.js';
    s.id = 'eg-ui-js';
    document.head.appendChild(s);
})();

document.addEventListener('DOMContentLoaded', () => {
    // Hide the preloader after the intro animation has played
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 4000);
    }

    const header = document.querySelector('header');
    const updateHeader = () => {
        if (!header) return;
        if (window.scrollY > 80) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', updateHeader, { passive: true });
    updateHeader();

    const siteNav = document.getElementById('site-nav');
    const navToggle = document.querySelector('.nav-toggle');
    if (siteNav && navToggle) {
        const closeNav = () => {
            siteNav.classList.remove('open');
            document.body.classList.remove('nav-open');
            navToggle.setAttribute('aria-expanded', 'false');
        };
        navToggle.addEventListener('click', () => {
            const isOpen = !siteNav.classList.contains('open');
            siteNav.classList.toggle('open', isOpen);
            document.body.classList.toggle('nav-open', isOpen);
            navToggle.setAttribute('aria-expanded', String(isOpen));
        });
        siteNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeNav);
        });
        document.addEventListener('keyup', (evt) => {
            if (evt.key === 'Escape') {
                closeNav();
            }
        });
        window.addEventListener('resize', () => {
            if (window.innerWidth > 960) {
                closeNav();
            }
        });
    }

    // Toggle display of subquestion groups when category headings are clicked
    document.querySelectorAll('.support-category').forEach(category => {
        const sectionHeader = category.querySelector('h2');
        sectionHeader.addEventListener('click', () => {
            category.classList.toggle('open');
        });
        // Toggle individual answers when subquestions are clicked
        category.querySelectorAll('.subquestion').forEach(item => {
            const question = item.querySelector('h3');
            question.addEventListener('click', () => {
                item.classList.toggle('open');
            });
        });
    });
});
