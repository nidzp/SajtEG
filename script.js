/*
 * Custom JavaScript for Electrogroup ITS website.
 *
 * Implements scroll-triggered animations, header style changes on scroll
 * and a simple parallax fade effect for the hero content. Intersection
 * Observer is used to reveal elements as they enter the viewport.
 */

import './assets/ui.js';

document.addEventListener('DOMContentLoaded', () => {
    // Hide the preloader after the intro animation finishes (around 4 seconds).
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 4000);
    }
    // Add / remove 'scrolled' class to header when user scrolls
    const header = document.querySelector('header');
    const heroSection = document.getElementById('hero');
    const heroContent = heroSection ? heroSection.querySelector('.hero-content') : null;

    const onScroll = () => {
        if (header) {
            if (window.scrollY > 80) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
        if (heroSection && heroContent) {
            if (window.innerWidth > 768) {
                const heroHeight = heroSection.offsetHeight || 1;
                const scrollY = Math.min(window.scrollY, heroHeight);
                const ratio = scrollY / heroHeight;
                heroContent.style.opacity = `${1 - ratio}`;
                heroContent.style.transform = `translateY(${ratio * 50}px)`;
            } else {
                heroContent.style.opacity = '1';
                heroContent.style.transform = 'translateY(0)';
            }
        }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Mobile navigation toggle
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
            if (isOpen) {
                siteNav.classList.add('open');
                document.body.classList.add('nav-open');
            } else {
                siteNav.classList.remove('open');
                document.body.classList.remove('nav-open');
            }
            navToggle.setAttribute('aria-expanded', String(isOpen));
        });
        siteNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => closeNav());
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
    // Observe gallery grid separately
    const gallery = document.querySelector('.gallery-grid');
    if (gallery) {
        observer.observe(gallery);
    }

    // Sequentially reveal transformer cards once the section enters the viewport
    const trafoGrid = document.querySelector('.trafo-grid');
    if (trafoGrid) {
        const trafoCards = trafoGrid.querySelectorAll('.trafo-card');
        const trafoObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    trafoCards.forEach((card, idx) => {
                        setTimeout(() => card.classList.add('revealed'), idx * 140);
                    });
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.35 });
        trafoObserver.observe(trafoGrid);
    }

    /*
     * Letter-by-letter animation for the hero title.
     * The script splits the text content of the element with class
     * `.hero-title` into individual span elements.  Each span has a
     * sequential animation delay applied inline.  After all letters
     * have appeared, the subtitle and tagline are revealed by
     * toggling the `.show` class on those elements.
     */
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const text = heroTitle.textContent.trim();
        heroTitle.textContent = '';
        [...text].forEach((char, idx) => {
            const span = document.createElement('span');
            span.textContent = char;
            // Apply incremental delay so letters appear one after another
            span.style.animationDelay = `${idx * 0.1}s`;
            heroTitle.appendChild(span);
        });
        // After the title animation ends, reveal subtitle and tagline
        const subtitle = document.querySelector('.hero-subtitle');
        const tagline = document.querySelector('.hero-tagline');
        const totalDuration = text.length * 0.1 + 0.6; // seconds
        setTimeout(() => {
            if (subtitle) subtitle.classList.add('show');
            if (tagline) tagline.classList.add('show');
        }, totalDuration * 1000);
    }

    /*
     * Hero background video rotation.
     * Two <video> elements are stacked in .hero-video-wrapper. We preload
     * the next clip on the hidden element, then cross-fade whenever the
     * active clip finishes. The next clip is always chosen randomly from
     * the available intros, avoiding immediate repeats.
     */
    const heroVideoWrapper = document.querySelector('.hero-video-wrapper');
    if (heroVideoWrapper) {
        const primaryVideo = heroVideoWrapper.querySelector('.hero-video');
        if (primaryVideo) {
            const introClip = 'assets/intro/intro.mp4';

            const startPlayback = () => {
                const attemptPlay = () => {
                    const maybePromise = primaryVideo.play();
                    if (maybePromise && typeof maybePromise.catch === 'function') {
                        maybePromise.catch(() => {});
                    }
                };

                if (primaryVideo.readyState >= 2) {
                    attemptPlay();
                } else {
                    primaryVideo.addEventListener('loadeddata', attemptPlay, { once: true });
                }
            };

            if (primaryVideo.src !== introClip) {
                primaryVideo.src = introClip;
                primaryVideo.load();
            }
            primaryVideo.loop = true;
            primaryVideo.classList.add('is-active');
            startPlayback();
        }
    }

    /* Lightbox functionality for gallery images */
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = lightbox ? lightbox.querySelector('.lightbox-img') : null;
    const lightboxClose = lightbox ? lightbox.querySelector('.lightbox-close') : null;
    if (lightbox && lightboxImg) {
        document.querySelectorAll('.gallery-grid img').forEach(img => {
            img.addEventListener('click', () => {
                lightboxImg.src = img.src;
                lightbox.classList.add('show');
            });
        });
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target === lightboxClose) {
                lightbox.classList.remove('show');
            }
        });
    }

    /* Simple AI chatbox interactions using keywords */
    // FAQ accordion toggle functionality
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentElement;
            item.classList.toggle('open');
        });
    });

    // Chat widget interactions
    const chatToggle = document.getElementById('chat-toggle');
    const chatBox = document.getElementById('chatbox');
    const chatClose = document.getElementById('chat-close');
    const chatOptions = document.querySelectorAll('.chat-options li');
    const chatResponse = document.querySelector('.chat-response');
    const responseText = document.querySelector('.response-text');
    const contactBtn = document.querySelector('.contact-btn');

    if (chatToggle && chatBox && chatClose) {
        const responses = {
            prikljucak: 'Priključak zavisi od snage i namene vašeg objekta. Pošaljite nam informacije o objektu i naši inženjeri će preporučiti optimalan tip.',
            bezbednost: 'Bezbednost je naš prioritet. Naš tim ima sertifikate za rad u posebnim uslovima i uvek se prilagođavamo vašim zahtevima.',
            lokacija: 'Radimo projekte širom zemlje, uključujući udaljene i ruralne lokacije. Pružićemo vam rešenje bez obzira na lokaciju.',
            napon: 'Naponske karakteristike određuju se prema vašim potrebama i opterećenju. Naši inženjeri će analizirati i predložiti adekvatno rešenje.'
        };
        chatToggle.addEventListener('click', () => {
            chatBox.classList.toggle('open');
        });
        chatClose.addEventListener('click', () => {
            chatBox.classList.remove('open');
            if (chatResponse) chatResponse.classList.add('hidden');
        });
        chatOptions.forEach(option => {
            option.addEventListener('click', () => {
                const key = option.dataset.answer;
                if (responseText) {
                    responseText.textContent = responses[key] || '';
                }
                if (chatResponse) chatResponse.classList.remove('hidden');
            });
        });
        if (contactBtn) {
            contactBtn.addEventListener('click', () => {
                chatBox.classList.remove('open');
                if (chatResponse) chatResponse.classList.add('hidden');
                // Navigate to dedicated contact/support page
                window.location.href = 'kontakt.html';
            });
        }
    }
});
