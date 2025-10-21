// Shared UI helpers: theme toggle + language switcher (SR Latin, SR Cyrillic, EN).
// Injects controls into the header nav, persists preferences, and updates inline copy.

(function () {
  const LS = { theme: 'eg_theme', lang: 'eg_lang' };
  const FALLBACK_SELECTOR = '.section p, .section li, .section h1, .section h2, .section h3, .btn';

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
      themeBtn.type = 'button';
      themeBtn.title = 'Tema';
      themeBtn.setAttribute('aria-label', 'Promeni temu');
      themeBtn.textContent = '☾';

      const langSel = document.createElement('select');
      langSel.id = 'lang-select';
      langSel.className = 'ctrl';
      langSel.setAttribute('aria-label', 'Jezik');
      langSel.innerHTML = [
        '<option value="sr-lat">SR (lat)</option>',
        '<option value="sr-cyrl">SR (ћир)</option>',
        '<option value="en">EN</option>'
      ].join('');

      wrapper.appendChild(themeBtn);
      wrapper.appendChild(langSel);
      nav.appendChild(wrapper);
    }

    return {
      themeBtn: wrapper.querySelector('#theme-toggle'),
      langSel: wrapper.querySelector('#lang-select')
    };
  }

  function latinToCyrillic(str) {
    if (!str) return str;
    let out = str;

    const digraphs = [
      [/NJ/g, 'Њ'],
      [/Nj/g, 'Њ'],
      [/nj/g, 'њ'],
      [/LJ/g, 'Љ'],
      [/Lj/g, 'Љ'],
      [/lj/g, 'љ'],
      [/DŽ/g, 'Џ'],
      [/Dž/g, 'Џ'],
      [/dž/g, 'џ']
    ];
    digraphs.forEach(([pattern, replacement]) => {
      out = out.replace(pattern, replacement);
    });

    const map = {
      A: 'А', a: 'а',
      B: 'Б', b: 'б',
      C: 'Ц', c: 'ц',
      Č: 'Ч', č: 'ч',
      Ć: 'Ћ', ć: 'ћ',
      D: 'Д', d: 'д',
      Đ: 'Ђ', đ: 'ђ',
      E: 'Е', e: 'е',
      F: 'Ф', f: 'ф',
      G: 'Г', g: 'г',
      H: 'Х', h: 'х',
      I: 'И', i: 'и',
      J: 'Ј', j: 'ј',
      K: 'К', k: 'к',
      L: 'Л', l: 'л',
      M: 'М', m: 'м',
      N: 'Н', n: 'н',
      O: 'О', o: 'о',
      P: 'П', p: 'п',
      R: 'Р', r: 'р',
      S: 'С', s: 'с',
      Š: 'Ш', š: 'ш',
      T: 'Т', t: 'т',
      U: 'У', u: 'у',
      V: 'В', v: 'в',
      Z: 'З', z: 'з',
      Ž: 'Ж', ž: 'ж'
    };

    out = Array.from(out).map(ch => map[ch] || ch).join('');
    return out;
  }

  const srLat = {
    brand: 'ELECTROGROUP',
    'nav.why': 'Za\u0161to ELECTROGROUP?',
    'nav.about': 'Ko smo mi',
    'nav.focus': 'Fokus',
    'nav.trafo': 'Trafostanice',
    'nav.team': 'Tim',
    'nav.gallery': 'Galerija',
    'nav.faq': 'FAQ',
    'nav.contact': 'Kontakt',
    'footer.copy': '© 2025 ELECTROGROUP ITS DOO Sombor. Sva prava zadržana.',

    'support.eyebrow': 'Podrška i saradnja',
    'support.title': 'Partner za sigurne elektro sisteme',
    'support.intro': 'Electrogroup ITS preuzima odgovornost za kompletan elektroenergetski ciklus – od ideje do 24/7 održavanja. Ova strana prikuplja sve kontakt kanale, prikazuje reference i daje jasne smernice kako da pokrenete projekat sa našim timom.',
    'support.cta.consult': 'Zatraži konsultacije',
    'support.cta.call': 'Pozovi +381 63 108 5618',
    'support.hl.1': 'Licencirani inženjeri i elektromonteri za srednji i visoki napon',
    'support.hl.2': 'Specijalizovane ekipe za rad na visini i u kriznim uslovima',
    'support.hl.3': 'Brze intervencije na trafostanicama, spojnicama i industrijskim postrojenjima',
    'support.figcaption': 'Mobilne radionice i vozila sa dizalicama omogućavaju brze intervencije širom regiona.',

    'contact.form.title': 'Onlajn upit',
    'contact.form.intro': 'Popunite formu kako bismo vas povezali sa odgovornim inženjerom. Obavezna polja označena su sa *.',
    'contact.form.name': 'Ime i prezime *',
    'contact.form.company': 'Kompanija',
    'contact.form.email': 'Email *',
    'contact.form.phone': 'Telefon *',
    'contact.form.type': 'Vrsta projekta *',
    'contact.form.type.choose': 'Izaberite',
    'contact.form.type.joints': 'Spojnice i priključenja',
    'contact.form.type.trafo': 'Trafostanica',
    'contact.form.type.solar': 'Solarni ili hibridni sistem',
    'contact.form.type.modern': 'Modernizacija postojećih postrojenja',
    'contact.form.type.other': 'Drugo',
    'contact.form.desc': 'Opis projekta *',
    'contact.form.consent': 'Saglasan/saglasna sam da Electrogroup ITS obrađuje moje podatke radi pripreme ponude.',
    'contact.form.submit': 'Pošalji poruku',
    'contact.form.note': 'Ne šaljemo newsletter. Vaše podatke čuvamo isključivo za komunikaciju u vezi sa projektom.'
  };

  const srCyr = Object.fromEntries(
    Object.entries(srLat).map(([key, value]) => [key, latinToCyrillic(value)])
  );
  srCyr.brand = srLat.brand; // zadržati brend u latiničnoj formi
  const en = {
    brand: 'ELECTROGROUP',
    'nav.why': 'Why ELECTROGROUP?',
    'nav.about': 'About',
    'nav.focus': 'Focus',
    'nav.trafo': 'Substations',
    'nav.team': 'Team',
    'nav.gallery': 'Gallery',
    'nav.faq': 'FAQ',
    'nav.contact': 'Contact',
    'footer.copy': '\u00A9 2025 ELECTROGROUP ITS LLC Sombor. All rights reserved.',

    'support.eyebrow': 'Support and cooperation',
    'support.title': 'Partner for reliable electrical systems',
    'support.intro': 'Electrogroup ITS takes responsibility for the entire power cycle - from concept to 24/7 maintenance. This page collects all contact channels, shows references, and gives clear guidance to start a project with our team.',
    'support.cta.consult': 'Request consultation',
    'support.cta.call': 'Call +381 63 108 5618',
    'support.hl.1': 'Licensed engineers and electricians for MV and HV',
    'support.hl.2': 'Specialized crews for heights and demanding conditions',
    'support.hl.3': 'Rapid interventions at substations, joints, and industrial plants',
    'support.figcaption': 'Mobile workshops and lift-equipped vehicles enable quick interventions across the region.',

    'contact.form.title': 'Online inquiry',
    'contact.form.intro': 'Fill in the form to connect with a responsible engineer. Required fields are marked with *.',
    'contact.form.name': 'Full name *',
    'contact.form.company': 'Company',
    'contact.form.email': 'Email *',
    'contact.form.phone': 'Phone *',
    'contact.form.type': 'Project type *',
    'contact.form.type.choose': 'Choose',
    'contact.form.type.joints': 'Cable joints and connections',
    'contact.form.type.trafo': 'Substation',
    'contact.form.type.solar': 'Solar or hybrid system',
    'contact.form.type.modern': 'Modernization of existing plants',
    'contact.form.type.other': 'Other',
    'contact.form.desc': 'Project description *',
    'contact.form.consent': 'I agree that Electrogroup ITS processes my data to prepare an offer.',
    'contact.form.submit': 'Send message',
    'contact.form.note': 'We do not send newsletters. We store your data solely to communicate about the project.'
  };

  const i18n = {
    'sr-lat': srLat,
    'sr-cyrl': srCyr,
    en
  };

  function setLangAttrs(lang) {
    if (lang === 'en') {
      document.documentElement.lang = 'en';
      document.documentElement.setAttribute('data-script', 'latn');
    } else if (lang === 'sr-cyrl') {
      document.documentElement.lang = 'sr';
      document.documentElement.setAttribute('data-script', 'cyrl');
    } else {
      document.documentElement.lang = 'sr';
      document.documentElement.setAttribute('data-script', 'latn');
    }
  }

  function applyTranslations(lang) {
    setLangAttrs(lang);
    const dict = i18n[lang] || srLat;

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (!el.dataset.i18nOriginal) {
        el.dataset.i18nOriginal = el.textContent;
      }

      const text = dict[key];
      if (typeof text === 'string') {
        el.textContent = text;
      } else if (lang === 'sr-cyrl') {
        el.textContent = latinToCyrillic(el.dataset.i18nOriginal || el.textContent);
      } else if (el.dataset.i18nOriginal) {
        el.textContent = el.dataset.i18nOriginal;
      }
    });

    document.querySelectorAll(FALLBACK_SELECTOR).forEach(el => {
      if (el.hasAttribute('data-i18n')) return;
      if (!el.dataset.i18nOriginal) {
        el.dataset.i18nOriginal = el.textContent;
      }

      let text = el.dataset.i18nOriginal;
      if (lang === 'sr-cyrl') {
        text = latinToCyrillic(text);
      }
      el.textContent = text;
    });

    const preText = document.querySelector('.preloader-text');
    if (preText) {
      if (!preText.dataset.i18nOriginal) {
        preText.dataset.i18nOriginal = srLat.brand;
      }
      const branded = (lang === 'sr-cyrl') ? srCyr.brand : (dict.brand || srLat.brand);
      preText.textContent = branded;
    }
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(LS.theme, theme);
    } catch (err) {
      /* noop */
    }
  }

  function updateThemeIcon(button, theme) {
    if (!button) return;
    button.textContent = theme === 'light' ? '☀' : '☾';
  }

  function initTheme(button) {
    const saved = (typeof localStorage !== 'undefined') ? localStorage.getItem(LS.theme) : null;
    const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
    const theme = saved || (prefersLight ? 'light' : 'dark');
    setTheme(theme);
    updateThemeIcon(button, theme);

    if (!button) return;
    button.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      const next = current === 'light' ? 'dark' : 'light';
      setTheme(next);
      updateThemeIcon(button, next);
    });
  }

  function initLang(select) {
    const saved = (typeof localStorage !== 'undefined') ? localStorage.getItem(LS.lang) : null;
    const lang = i18n[saved] ? saved : 'sr-lat';
    if (select) {
      select.value = lang;
    }
    applyTranslations(lang);

    if (!select) return;
    select.addEventListener('change', () => {
      const value = select.value;
      try {
        localStorage.setItem(LS.lang, value);
      } catch (err) {
        /* noop */
      }
      applyTranslations(value);
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    const { themeBtn, langSel } = ensureControls();
    initTheme(themeBtn);
    initLang(langSel);
  });
})();



