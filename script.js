/*
 * Custom JavaScript for Electrogroup ITS website.
 *
 * Implements scroll-triggered animations, header style changes on scroll
 * and a simple parallax fade effect for the hero content. Intersection
 * Observer is used to reveal elements as they enter the viewport.
 */

import gsap from 'gsap';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './assets/ui.js';

const initPreloaderLightning = () => {
    const container = document.querySelector('.preloader-lightning');
    const canvas = container ? container.querySelector('#preloader-lightning-canvas') : null;
    if (!container || !canvas) {
        return () => {};
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
        return () => {};
    }

    const bolts = [];
    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;
    let frameId = 0;
    let lastTime = performance.now();
    let spawnTimer = 0;

    const resize = () => {
        width = container.clientWidth || window.innerWidth;
        height = container.clientHeight || window.innerHeight;
        const dpr = window.devicePixelRatio || 1;
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    const buildBolt = (startX, startY, depth = 0) => {
        const segments = [];
        const branches = [];
        const segmentCount = depth === 0 ? 20 + Math.floor(Math.random() * 6) : 10 + Math.floor(Math.random() * 6);
        let x = startX;
        let y = startY;
        const lateralJitter = width * (depth === 0 ? 0.12 : 0.08);

        for (let i = 0; i < segmentCount; i++) {
            const drift = (Math.random() - 0.5) * lateralJitter;
            const step = (height / (segmentCount + 2)) * (0.7 + Math.random() * 0.6);
            const nextX = x + drift;
            const nextY = y + step;
            segments.push({ x, y, nx: nextX, ny: nextY });

            if (depth < 2 && i > 3 && Math.random() < (depth === 0 ? 0.35 : 0.25)) {
                branches.push(buildBolt(nextX, nextY, depth + 1));
            }

            x = nextX;
            y = nextY;
            if (y > height + height * 0.18) {
                break;
            }
        }

        return { segments, branches };
    };

    const spawnBolt = () => {
        const startX = width * (0.08 + Math.random() * 0.84);
        const bolt = buildBolt(startX, -height * 0.15);
        bolts.push({
            segments: bolt.segments,
            branches: bolt.branches,
            life: 0,
            maxLife: 320 + Math.random() * 220,
            thickness: 2 + Math.random() * 2.8
        });
        if (bolts.length > 10) {
            bolts.splice(0, bolts.length - 10);
        }
    };

    const drawBolt = (branch, thickness, depth = 0) => {
        if (!branch || !branch.segments.length) {
            return;
        }
        const widthFactor = Math.max(0.6, thickness - depth * 0.7);
        ctx.lineWidth = widthFactor;
        ctx.beginPath();
        branch.segments.forEach(segment => {
            ctx.moveTo(segment.x, segment.y);
            ctx.lineTo(segment.nx, segment.ny);
        });
        ctx.stroke();
        if (branch.branches) {
            branch.branches.forEach(child => drawBolt(child, thickness * 0.7, depth + 1));
        }
    };

    const render = (time) => {
        const delta = time - lastTime;
        lastTime = time;
        spawnTimer += delta;
        if (spawnTimer > 420) {
            spawnBolt();
            if (Math.random() > 0.6) {
                spawnBolt();
            }
            spawnTimer = 0;
        }

        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = 'rgba(0, 10, 24, 0.22)';
        ctx.fillRect(0, 0, width, height);

        ctx.globalCompositeOperation = 'lighter';
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';

        for (let i = bolts.length - 1; i >= 0; i--) {
            const bolt = bolts[i];
            bolt.life += delta;
            const alpha = 1 - bolt.life / bolt.maxLife;
            if (alpha <= 0) {
                bolts.splice(i, 1);
                continue;
            }

            ctx.shadowColor = `rgba(70, 160, 255, ${alpha})`;
            ctx.shadowBlur = 30;
            ctx.strokeStyle = `rgba(186, 236, 255, ${alpha * 0.9})`;
            drawBolt(bolt, bolt.thickness + 1.6, 0);

            ctx.shadowColor = `rgba(40, 120, 255, ${alpha})`;
            ctx.shadowBlur = 12;
            ctx.strokeStyle = `rgba(118, 198, 255, ${alpha * 0.75})`;
            drawBolt(bolt, bolt.thickness, 0);
        }

        frameId = requestAnimationFrame(render);
    };

    // Start with a couple of strikes so the overlay is alive immediately.
    spawnBolt();
    spawnBolt();
    frameId = requestAnimationFrame(render);

    return () => {
        cancelAnimationFrame(frameId);
        window.removeEventListener('resize', resize);
        bolts.length = 0;
        ctx.clearRect(0, 0, width, height);
    };
};

document.addEventListener('DOMContentLoaded', () => {
    const stopLightning = initPreloaderLightning();

    // Hide the preloader after the intro animation finishes (around 4 seconds).
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.style.display = 'none';
            stopLightning();
        }, 4000);
    } else {
        stopLightning();
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

    const initScrollAnimations = () => {
        const revealTargets = document.querySelectorAll('.show-on-scroll');
        if (!revealTargets.length) {
            return;
        }

        const canUseAOS = typeof AOS === 'function' && typeof AOS.init === 'function';
        if (canUseAOS) {
            revealTargets.forEach((el, idx) => {
                if (!el.dataset.aos) {
                    el.dataset.aos = 'fade-up';
                }
                if (!el.dataset.aosDelay) {
                    el.dataset.aosDelay = `${Math.min(idx * 60, 300)}`;
                }
                if (!el.dataset.aosOffset) {
                    el.dataset.aosOffset = '80';
                }
            });

            AOS.init({
                duration: 600,
                once: true,
                offset: 80,
                easing: 'ease-out'
            });
        }

        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('show');
                        obs.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.2 });

            revealTargets.forEach(el => observer.observe(el));
        } else {
            revealTargets.forEach(el => el.classList.add('show'));
        }
    };

    initScrollAnimations();

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
    const animateTitleLine = (element, startDelay = 0, step = 0.1) => {
        if (!element) {
            return startDelay;
        }
        const text = element.textContent.trim();
        element.textContent = '';
        [...text].forEach((char, idx) => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.animationDelay = `${startDelay + idx * step}s`;
            element.appendChild(span);
        });
        return startDelay + text.length * step + 0.6;
    };

    const primaryTitle = document.querySelector('.hero-title');
    const secondaryTitle = document.querySelector('.hero-title-secondary');
    const subtitle = document.querySelector('.hero-subtitle');
    const tagline = document.querySelector('.hero-tagline');

    if (primaryTitle) {
        const primaryEnd = animateTitleLine(primaryTitle, 0, 0.1);
        const secondaryStart = secondaryTitle ? Math.max(0.25, primaryEnd - 0.4) : primaryEnd;
        const secondaryEnd = secondaryTitle ? animateTitleLine(secondaryTitle, secondaryStart, 0.08) : primaryEnd;

        const revealDelay = Math.max(primaryEnd, secondaryEnd);
        setTimeout(() => {
            if (subtitle) subtitle.classList.add('show');
            if (tagline) tagline.classList.add('show');
        }, revealDelay * 1000);

        const heroButtons = document.querySelectorAll('.hero-buttons .btn');
        if (heroButtons.length && typeof gsap === 'object' && typeof gsap.from === 'function') {
            gsap.from(heroButtons, {
                opacity: 0,
                y: 18,
                stagger: 0.18,
                delay: revealDelay + 0.1,
                duration: 0.6,
                ease: 'power2.out'
            });
        }
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
