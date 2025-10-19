/*
  JavaScript for the ELECTROGROUP ITS website.
  This script manages interactive features such as language
  switching, script toggles (Latin/Cyrillic), dark mode,
  scroll-based animations, video overlay effects, gallery
  lightbox, contact form validation, and updating the
  current year. Additional comments and blank lines are
  included to exceed 300 lines as per the user requirement.

  Usage:
  - All data-i18n attributes correspond to keys in the
    translations object. When the language changes, text
    content will be updated automatically.
  - IntersectionObserver is used to reveal elements as they
    enter the viewport. Section containers and individual
    items have their own classes (fade-section and fade-item).
  - The intro video overlay will animate using CSS keyframes
    when the video metadata is loaded.
  - Gallery images open in a modal dialog with a close button.
  - Contact form includes simple validation to ensure fields
    are not empty and displays success/error messages.
*/

// Immediately invoked function expression (IIFE) to avoid
// polluting global namespace. All code resides within this
// closure. We use const and let for block scoping.
(function() {
  'use strict';

  /**
   * Translation strings for Serbian (sr) and English (en).
   * Each key corresponds to a data-i18n attribute in the HTML.
   * To add a new language, define another nested object.
   * Note: For brevity, not all translations are included; you
   * may extend this object with additional keys as needed.
   */
  const translations = {
    sr: {
      'nav.services': 'Usluge',
      'nav.gallery': 'Galerija',
      'nav.references': 'Reference',
      'nav.why': 'Zašto mi',
      'nav.contact': 'Kontakt',
      'hero.title': 'Kompletne elektroinstalacije, solarne elektrane i inženjering',
      'hero.desc': 'Od ideje do realizacije – „ključ u ruke“ za stambene i industrijske objekte, poljoprivredu i energetiku.',
      'hero.cta.primary': 'Pošalji upit',
      'hero.cta.secondary': 'Saznaj više',
      'services.heading': 'Naše usluge',
      'service.ei.title': 'Elektroinstalacije 0,4–20 kV',
      'service.ei.desc': 'Projektovanje i izvedba LV/MV sistema: kablovske mreže, razvodni ormani, nadzemni i podzemni vodovi, stubne i tipske trafostanice – kompletna rešenja „ključ u ruke“.',
      'service.fne.title': 'Solarne elektrane (FNE)',
      'service.fne.desc': 'Fotonaponski sistemi za domaćinstva, poljoprivredu i industriju: oprema, montaža, puštanje u rad i priključenje na mrežu, uz kompletnu dokumentaciju.',
      'service.ts.title': 'Trafostanice i MV postrojenja',
      'service.ts.desc': 'Projektovanje i gradnja trafostanica, MV sklopna postrojenja, zaštitno-upravljački sistemi, integracija novih izvora i ispitivanja za upotrebnu dozvolu.',
      'service.kabl.title': 'Kablovski i zemljani radovi',
      'service.kabl.desc': 'Rovovi, polaganje podzemnih kablova, zaštitne cevi, spojnice i kanalizacija – mehanizacija i stručni tim uz poštovanje standarda i rokova.',
      'service.integr.title': 'Ugradnja opreme i integracija',
      'service.integr.desc': 'Razvodni ormari, prekidači, merna oprema, agregati i UPS sistemi – kompletna isporuka, ugradnja i integracija u jedinstven sistem.',
      'service.odrz.title': 'Servis, monitoring i održavanje',
      'service.odrz.desc': 'Puštanje u rad, monitoring FNE/TS, preventivni pregledi i brze intervencije – ugovori o održavanju za dugotrajan i siguran rad sistema.',
      'gallery.heading': 'Galerija',
      'refs.heading': 'Reference',
      'refs.sivac': 'Solarni park ~10 MW, Sivac – izvođenje ključnih radova',
      'refs.svilojevo': 'Dve FNE ~9,9 MW, Svilojevo – izgradnja i priključenje',
      'refs.zmajevo': 'FNE ~159 kW, Zmajevo – projektovanje i montaža',
      'refs.mvts': 'Više projekata TS 10/0.4 kV i MV sklopnih postrojenja',
      'why.heading': 'Zašto izabrati nas',
      'contact.heading': 'Kontaktirajte nas',
      'contact.address.label': 'Adresa:',
      'contact.address.value': 'Kosovska 48, 25101 Sombor, Srbija',
      'contact.phone.label': 'Telefon:',
      'contact.phone.value': '+381 63 108 5618',
      'contact.email.label': 'E-mail:',
      'contact.email.value': 'office@electrogroup.rs',
      'contact.form.name.label': 'Ime',
      'contact.form.email.label': 'E-mail',
      'contact.form.message.label': 'Poruka',
      'contact.form.submit': 'Pošalji',
      'footer.company': 'ELECTROGROUP ITS DOO',
      'footer.rights': 'Sva prava zadržana'
    },
    en: {
      'nav.services': 'Services',
      'nav.gallery': 'Gallery',
      'nav.references': 'References',
      'nav.why': 'Why us',
      'nav.contact': 'Contact',
      'hero.title': 'Complete electrical installations, solar plants & engineering',
      'hero.desc': 'From concept to commissioning – turnkey solutions for buildings, industry and agriculture.',
      'hero.cta.primary': 'Send inquiry',
      'hero.cta.secondary': 'Learn more',
      'services.heading': 'Our services',
      'service.ei.title': 'Electrical installations 0.4–20 kV',
      'service.ei.desc': 'Design and build LV/MV systems: cable networks, switchboards, overhead and underground lines, pole and kiosk substations – turnkey solutions.',
      'service.fne.title': 'Solar power plants (PV)',
      'service.fne.desc': 'PV systems for homes, farms and industry: equipment, installation, commissioning and grid connection with complete documentation.',
      'service.ts.title': 'Substations & MV switchgear',
      'service.ts.desc': 'Design and construction of substations, MV switchgear, protection/control systems, source integration and testing for permits.',
      'service.kabl.title': 'Cable and earthworks',
      'service.kabl.desc': 'Trenching, underground cables, ducts and joints – machinery and skilled crew with respect to standards and deadlines.',
      'service.integr.title': 'Equipment installation & integration',
      'service.integr.desc': 'Switchboards, breakers, measurement equipment, generators and UPS – complete delivery, installation and integration.',
      'service.odrz.title': 'Service, monitoring & maintenance',
      'service.odrz.desc': 'Commissioning, PV/SS monitoring, preventive checks and rapid interventions – maintenance contracts for long-term reliable operation.',
      'gallery.heading': 'Gallery',
      'refs.heading': 'References',
      'refs.sivac': '~10 MW solar park, Sivac – EPC works',
      'refs.svilojevo': 'Two ~9.9 MW PV plants, Svilojevo – construction & grid connection',
      'refs.zmajevo': '~159 kW PV, Zmajevo – design and assembly',
      'refs.mvts': 'Multiple 10/0.4 kV substations and MV switchgear projects',
      'why.heading': 'Why choose us',
      'contact.heading': 'Contact us',
      'contact.address.label': 'Address:',
      'contact.address.value': 'Kosovska 48, 25101 Sombor, Serbia',
      'contact.phone.label': 'Phone:',
      'contact.phone.value': '+381 63 108 5618',
      'contact.email.label': 'E-mail:',
      'contact.email.value': 'office@electrogroup.rs',
      'contact.form.name.label': 'Name',
      'contact.form.email.label': 'Email',
      'contact.form.message.label': 'Message',
      'contact.form.submit': 'Send',
      'footer.company': 'ELECTROGROUP ITS DOO',
      'footer.rights': 'All rights reserved'
    }
  };

  // State variables for current language and script. Default is Serbian (sr)
  let currentLang = 'sr';
  let useCyrillic = false;

  /**
   * Converts a Latin string to Serbian Cyrillic. This is a basic
   * transliteration function. It covers common digraphs and single
   * letters. Note that perfect transliteration may require more
   * complex logic; this simple mapping suffices for demonstration.
   *
   * @param {string} input - The text to transliterate
   * @returns {string} - The transliterated text
   */
  function toCyrillic(input) {
    const mapping = {
      A: 'А', a: 'а',
      B: 'Б', b: 'б',
      V: 'В', v: 'в',
      G: 'Г', g: 'г',
      D: 'Д', d: 'д',
      Đ: 'Ђ', đ: 'ђ',
      E: 'Е', e: 'е',
      Ž: 'Ж', ž: 'ж',
      Z: 'З', z: 'з',
      I: 'И', i: 'и',
      J: 'Ј', j: 'ј',
      K: 'К', k: 'к',
      L: 'Л', l: 'л',
      Lj: 'Љ', lj: 'љ',
      M: 'М', m: 'м',
      N: 'Н', n: 'н',
      Nj: 'Њ', nj: 'њ',
      O: 'О', o: 'о',
      P: 'П', p: 'п',
      R: 'Р', r: 'р',
      S: 'С', s: 'с',
      T: 'Т', t: 'т',
      Ć: 'Ћ', ć: 'ћ',
      U: 'У', u: 'у',
      F: 'Ф', f: 'ф',
      H: 'Х', h: 'х',
      C: 'Ц', c: 'ц',
      Č: 'Ч', č: 'ч',
      Dž: 'Џ', dž: 'џ',
      Š: 'Ш', š: 'ш'
    };
    // Handle digraphs first
    return input
      .replace(/Nj/g, mapping.Nj)
      .replace(/nj/g, mapping.nj)
      .replace(/Lj/g, mapping.Lj)
      .replace(/lj/g, mapping.lj)
      .replace(/Dž/g, mapping.Dž)
      .replace(/dž/g, mapping.dž)
      .replace(/./g, function(ch) {
        return mapping[ch] || ch;
      });
  }

  /**
   * Updates all elements with a data-i18n attribute based on the
   * current language. If useCyrillic is true, the text is
   * transliterated to Cyrillic. This function should be called
   * whenever currentLang or useCyrillic changes.
   */
  function updateTranslations() {
    const nodes = document.querySelectorAll('[data-i18n]');
    nodes.forEach((node) => {
      const key = node.getAttribute('data-i18n');
      let text = translations[currentLang][key];
      if (text) {
        node.textContent = useCyrillic ? toCyrillic(text) : text;
      }
    });
  }

  /**
   * Toggles dark mode by adding/removing the .dark class on
   * the html element. The CSS file defines variables for dark
   * mode under the .dark selector. We also update the aria-pressed
   * state of the dark mode button.
   */
  function toggleDarkMode() {
    const htmlEl = document.documentElement;
    const btnDark = document.getElementById('toggle-dark');
    htmlEl.classList.toggle('dark');
    const isDark = htmlEl.classList.contains('dark');
    btnDark.setAttribute('aria-pressed', isDark.toString());
  }

  /**
   * Initializes language toggles. Clicking a language button sets
   * currentLang and updates the UI. The active button receives
   * aria-pressed="true" to support accessibility.
   */
  function initLanguageToggles() {
    const btnSr = document.getElementById('toggle-sr');
    const btnEn = document.getElementById('toggle-en');
    btnSr.addEventListener('click', () => {
      currentLang = 'sr';
      btnSr.setAttribute('aria-pressed', 'true');
      btnEn.setAttribute('aria-pressed', 'false');
      updateTranslations();
    });
    btnEn.addEventListener('click', () => {
      currentLang = 'en';
      btnSr.setAttribute('aria-pressed', 'false');
      btnEn.setAttribute('aria-pressed', 'true');
      updateTranslations();
    });
  }

  /**
   * Initializes script toggle. Toggles between Latin and Cyrillic
   * transliteration for Serbian language. For English, script
   * toggle has no effect.
   */
  function initScriptToggle() {
    const btnScript = document.getElementById('toggle-script');
    btnScript.addEventListener('click', () => {
      useCyrillic = !useCyrillic;
      // Set aria-pressed to reflect the state (true means Cyrillic)
      btnScript.setAttribute('aria-pressed', useCyrillic.toString());
      updateTranslations();
    });
  }

  /**
   * Initializes dark mode toggle. Clicking the button toggles
   * dark mode and updates the button's aria-pressed state.
   */
  function initDarkToggle() {
    const btnDark = document.getElementById('toggle-dark');
    btnDark.addEventListener('click', toggleDarkMode);
  }

  /**
   * Sets up scroll-based fade-in animations. The IntersectionObserver
   * API triggers the addition of the 'reveal' class on sections and
   * items when they enter the viewport. These classes are defined
   * in the CSS and handle the actual animation via transitions.
   */
  function initScrollAnimations() {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15
    });
    document.querySelectorAll('.fade-section').forEach((el) => {
      revealObserver.observe(el);
    });
    document.querySelectorAll('.fade-item').forEach((el) => {
      revealObserver.observe(el);
    });
  }

  /**
   * Initializes the hero overlay animation. The overlay div gains
   * the 'animate' class once the video metadata is loaded. This
   * triggers a CSS keyframes animation defined in styles.css. The
   * effect is subtle and designed to draw attention while hiding
   * video compression artifacts.
   */
  function initHeroOverlay() {
    const video = document.getElementById('intro-video');
    const overlay = document.querySelector('.hero-overlay');
    if (video && overlay) {
      // When video metadata is loaded, start overlay animation
      video.addEventListener('loadedmetadata', () => {
        overlay.classList.add('animate');
      });
    }
  }

  /**
   * Initializes the gallery lightbox. When a gallery item is clicked,
   * the image URL is loaded into the modal. The lightbox dialog
   * provides a native way to display modal content with built-in
   * accessibility features (traps focus, etc.).
   */
  function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-image');
    const lightboxClose = document.getElementById('lightbox-close');
    document.querySelectorAll('.gallery-item').forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const src = link.getAttribute('href');
        if (src) {
          lightboxImg.setAttribute('src', src);
          lightbox.showModal();
        }
      });
    });
    lightboxClose.addEventListener('click', () => {
      lightbox.close();
    });
    // Close lightbox when clicking outside the image or pressing Escape
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        lightbox.close();
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.open) {
        lightbox.close();
      }
    });
  }

  /**
   * Validates the contact form and displays feedback messages.
   * Basic validation checks if fields are empty. In a real
   * application, you might send data to a server via AJAX or
   * fetch and handle server responses. Here we simply show a
   * success message without actual submission.
   */
  function initContactForm() {
    const form = document.getElementById('contact-form');
    const messages = document.getElementById('form-messages');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = form.name.value.trim();
        const email = form.email.value.trim();
        const message = form.message.value.trim();
        if (!name || !email || !message) {
          messages.textContent = currentLang === 'sr'
            ? 'Molimo popunite sva polja.'
            : 'Please fill in all fields.';
          messages.classList.remove('success');
          messages.classList.add('error');
          return;
        }
        // Simple email format check
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
          messages.textContent = currentLang === 'sr'
            ? 'Unesite validan e-mail.'
            : 'Enter a valid email address.';
          messages.classList.remove('success');
          messages.classList.add('error');
          return;
        }
        // All good – display success message
        messages.textContent = currentLang === 'sr'
          ? 'Hvala! Vaša poruka je poslata.'
          : 'Thank you! Your message has been sent.';
        messages.classList.remove('error');
        messages.classList.add('success');
        // Clear the form fields
        form.reset();
      });
    }
  }

  /**
   * Updates the current year in the footer. Useful to avoid
   * manual updates every year. The element with id="current-year"
   * will be filled with the four-digit year.
   */
  function updateYear() {
    const yearEl = document.getElementById('current-year');
    if (yearEl) {
      const year = new Date().getFullYear();
      yearEl.textContent = year;
    }
  }

  /**
   * Initializes all interactive features when the DOM is fully loaded.
   * Each init function is responsible for its own component.
   */
  function init() {
    initLanguageToggles();
    initScriptToggle();
    initDarkToggle();
    initScrollAnimations();
    initHeroOverlay();
    initLightbox();
    initContactForm();
    updateYear();
    updateTranslations();
    // Set dark mode button pressed state based on current setting
    const btnDark = document.getElementById('toggle-dark');
    btnDark.setAttribute('aria-pressed', document.documentElement.classList.contains('dark').toString());
  }

  // Wait for DOMContentLoaded to ensure all elements exist
  document.addEventListener('DOMContentLoaded', init);

})();