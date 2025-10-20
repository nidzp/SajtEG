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

    const categories = Array.from(document.querySelectorAll('.support-category'));
    categories.forEach(category => {
        const toggle = category.querySelector('.category-toggle');
        const body = category.querySelector('.category-body');
        if (toggle && body) {
            toggle.setAttribute('aria-expanded', 'false');
            body.dataset.state = 'collapsed';
            toggle.addEventListener('click', () => {
                const willOpen = !category.classList.contains('open');
                categories.forEach(other => {
                    if (other === category) return;
                    const otherToggle = other.querySelector('.category-toggle');
                    const otherBody = other.querySelector('.category-body');
                    if (otherBody) {
                        otherBody.dataset.state = 'collapsed';
                    }
                    other.classList.remove('open');
                    if (otherToggle) {
                        otherToggle.setAttribute('aria-expanded', 'false');
                    }
                });
                category.classList.toggle('open', willOpen);
                toggle.setAttribute('aria-expanded', String(willOpen));
                body.dataset.state = willOpen ? 'expanded' : 'collapsed';
            });
        }

        category.querySelectorAll('.subquestion').forEach(item => {
            const subToggle = item.querySelector('.subquestion-toggle');
            const answer = item.querySelector('.answer');
            if (!subToggle || !answer) return;
            subToggle.setAttribute('aria-expanded', 'false');
            answer.dataset.state = 'collapsed';
            subToggle.addEventListener('click', () => {
                const willOpen = !item.classList.contains('open');
                item.classList.toggle('open', willOpen);
                subToggle.setAttribute('aria-expanded', String(willOpen));
                answer.dataset.state = willOpen ? 'expanded' : 'collapsed';
            });
        });
    });
});
