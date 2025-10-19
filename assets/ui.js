// Shared UI: theme toggle, language switcher (SR lat/ćir, EN), and Cyrillic transliteration
// Injects controls into header <nav> and applies preferences across pages using localStorage.

(function () {
  const LS = {
    theme: 'eg_theme',
    lang: 'eg_lang'
  };

  function ensureControls() {
    const nav = document.querySelector('header nav');
    if (!nav) return {};
    let wrapper = nav.querySelector('.header-controls');
    if (!wrapper) {
      wrapper = document.createElement('div');
      wrapper.className = 'header-controls';
      const themeBtn = document.createElement('button');
      themeBtn.id = 'theme-toggle';
      themeBtn.className = 'ctrl';
      themeBtn.title = 'Theme';
      themeBtn.setAttribute('aria-label', 'Toggle theme');
      themeBtn.textContent = '◑';
      const langSel = document.createElement('select');
      langSel.id = 'lang-select';
      langSel.className = 'ctrl';
      langSel.setAttribute('aria-label', 'Language');
      langSel.innerHTML = '<option value="sr-lat">SR (lat)</option>\n<option value="sr-cyrl">SR (ћир)</option>\n<option value="en">EN</option>';
      wrapper.appendChild(themeBtn);
      wrapper.appendChild(langSel);
      nav.appendChild(wrapper);
    }
    return {
      themeBtn: wrapper.querySelector('#theme-toggle'),
      langSel: wrapper.querySelector('#lang-select')
    };
  }

  // Minimal i18n dictionary for key UI strings. Page content without entries remains in SR-lat or is transliterated for ćirilica.
  const i18n = {
    'sr-lat': {
      brand: 'ELECTROGROUP',
      'nav.about': 'Ko smo mi',
      'nav.focus': 'Fokus',
      'nav.team': 'Tim',
      'nav.philosophy': 'Filozofija',
      'nav.gallery': 'Galerija',
      'nav.faq': 'FAQ',
      'nav.contact': 'Kontakt',
      'hero.title': 'ELECTROGROUP',
      'hero.subtitle': 'ITS DOO Sombor',
      'hero.tagline': 'Energija budućnosti',
      'cta.contact': 'Pošalji upit',
      'cta.learn': 'Saznaj više',
      'about.title': 'Ko smo mi',
      'focus.title': 'Naš fokus i šta ne radimo',
      'gallery.title': 'Galerija',
      'faq.title': 'Česta pitanja',
      'footer.copy': '© 2025 ELECTROGROUP ITS DOO Sombor. Sva prava zadržana.'
    },
    en: {
      brand: 'ELECTROGROUP',
      'nav.about': 'About',
      'nav.focus': 'Focus',
      'nav.team': 'Team',
      'nav.philosophy': 'Philosophy',
      'nav.gallery': 'Gallery',
      'nav.faq': 'FAQ',
      'nav.contact': 'Contact',
      'hero.title': 'ELECTROGROUP',
      'hero.subtitle': 'ITS LLC Sombor',
      'hero.tagline': 'Energy of the future',
      'cta.contact': 'Send inquiry',
      'cta.learn': 'Learn more',
      'about.title': 'Who we are',
      'focus.title': 'Our focus and what we do not do',
      'gallery.title': 'Gallery',
      'faq.title': 'Frequently asked questions',
      'footer.copy': '© 2025 ELECTROGROUP ITS LLC Sombor. All rights reserved.'
    }
  };

  // Serbian Latin -> Cyrillic transliteration for text not in dictionary.
  function latinToCyrillic(str) {
    if (!str) return str;
    // Handle digraphs first (upper/lower)
    const map = [
      [/Dž/g, 'Џ'], [/DŽ/g, 'Џ'], [/dž/g, 'џ'],
      [/Lj/g, 'Љ'], [/LJ/g, 'Љ'], [/lj/g, 'љ'],
      [/Nj/g, 'Њ'], [/NJ/g, 'Њ'], [/nj/g, 'њ'],
      [/Dj/g, 'Ђ'], [/DJ/g, 'Ђ'], [/dj/g, 'ђ']
    ];
    const chars = {
      A:'А', a:'а', B:'Б', b:'б', V:'В', v:'в', G:'Г', g:'г', D:'Д', d:'д',
      Đ:'Ђ', đ:'ђ', E:'Е', e:'е', Ž:'Ж', ž:'ж', Z:'З', z:'з', I:'И', i:'и',
      J:'Ј', j:'ј', K:'К', k:'к', L:'Л', l:'л', M:'М', m:'м', N:'Н', n:'н',
      O:'О', o:'о', P:'П', p:'п', R:'Р', r:'р', S:'С', s:'с', T:'Т', t:'т',
      Ć:'Ћ', ć:'ћ', U:'У', u:'у', F:'Ф', f:'ф', H:'Х', h:'х', C:'Ц', c:'ц',
      Č:'Ч', č:'ч', Š:'Ш', š:'ш', Y:'Ы', y:'ы' // Y used rarely; leave as is otherwise
    };
    let out = str;
    map.forEach(([re, val]) => { out = out.replace(re, val); });
    out = out.replace(/[A-Za-zČčĆćŽžŠšĐđ]/g, ch => chars[ch] || ch);
    return out;
  }

  function applyTranslations(lang) {
    const dict = i18n[lang] || i18n['sr-lat'];
    // Elements with data-i18n keys
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) el.textContent = dict[key];
      else if (lang === 'sr-cyrl') el.textContent = latinToCyrillic(el.textContent);
    });
    // Target specific common elements that may not have data-i18n
    const navLinks = document.querySelectorAll('header nav a');
    if (navLinks.length >= 7) {
      const navKeys = ['nav.about','nav.focus','nav.team','nav.philosophy','nav.gallery','nav.faq','nav.contact'];
      navKeys.forEach((k, i) => { if (navLinks[i]) navLinks[i].textContent = dict[k] || navLinks[i].textContent; });
    }
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle && dict['hero.title']) heroTitle.dataset.original = heroTitle.dataset.original || dict['hero.title'];
    const heroSub = document.querySelector('.hero-subtitle');
    const tagline = document.querySelector('.hero-tagline');
    if (heroSub && dict['hero.subtitle']) heroSub.textContent = dict['hero.subtitle'];
    if (tagline) {
      const t = dict['hero.tagline'] || tagline.textContent;
      tagline.textContent = (lang === 'sr-cyrl') ? latinToCyrillic(t) : t;
    }
    // CTA buttons
    const ctas = document.querySelectorAll('.hero-buttons .btn');
    if (ctas[0] && dict['cta.contact']) ctas[0].textContent = dict['cta.contact'];
    if (ctas[1] && dict['cta.learn']) ctas[1].textContent = dict['cta.learn'];
    // Section headings
    const mapKeys = [
      ['#about h2','about.title'],
      ['#focus h2','focus.title'],
      ['#gallery h2','gallery.title'],
      ['#faq h2','faq.title']
    ];
    mapKeys.forEach(([sel,key]) => {
      const el = document.querySelector(sel);
      if (el && dict[key]) el.textContent = dict[key];
      else if (el && lang === 'sr-cyrl') el.textContent = latinToCyrillic(el.textContent);
    });
    // Footer
    const foot = document.querySelector('footer p');
    if (foot && dict['footer.copy']) foot.textContent = dict['footer.copy'];

    // For larger text blocks, transliterate to Cyrillic when selected
    if (lang === 'sr-cyrl') {
      document.querySelectorAll('.section p, .section li').forEach(el => {
        if (!el.closest('header') && !el.closest('footer')) {
          el.textContent = latinToCyrillic(el.textContent);
        }
      });
    }
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem(LS.theme, theme); } catch (e) {}
  }
  function initTheme(btn) {
    const saved = (typeof localStorage !== 'undefined') ? localStorage.getItem(LS.theme) : null;
    const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
    const theme = saved || (prefersLight ? 'light' : 'dark');
    setTheme(theme);
    if (btn) btn.addEventListener('click', () => setTheme(document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light'));
  }

  function initLang(sel) {
    const saved = (typeof localStorage !== 'undefined') ? localStorage.getItem(LS.lang) : null;
    const lang = saved || 'sr-lat';
    if (sel) sel.value = lang;
    applyTranslations(lang);
    if (sel) sel.addEventListener('change', () => {
      const v = sel.value;
      try { localStorage.setItem(LS.lang, v); } catch (e) {}
      // Reload translation (recompute from original text where applicable)
      applyTranslations(v);
    });
  }

  // Initialize once DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    const { themeBtn, langSel } = ensureControls();
    initTheme(themeBtn);
    initLang(langSel);
    // Also translate preloader text if present
    const saved = (typeof localStorage !== 'undefined') ? localStorage.getItem(LS.lang) : 'sr-lat';
    const t = i18n[saved]?.brand || 'ELECTROGROUP';
    const preText = document.querySelector('.preloader-text');
    if (preText) preText.textContent = (saved === 'sr-cyrl') ? latinToCyrillic(t) : t;
  });
})();

