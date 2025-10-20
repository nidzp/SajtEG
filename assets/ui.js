// Shared UI: theme toggle and language switcher (SR Latin, SR Cyrillic, EN)
// Injects controls into header <nav> and applies preferences via localStorage across pages.

(function () {
  const LS = { theme: 'eg_theme', lang: 'eg_lang' };

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
      themeBtn.title = 'Tema';
      themeBtn.setAttribute('aria-label', 'Promeni temu');
      themeBtn.textContent = '☾';

      const langSel = document.createElement('select');
      langSel.id = 'lang-select';
      langSel.className = 'ctrl';
      langSel.setAttribute('aria-label', 'Jezik');
      langSel.innerHTML = (
        '<option value="sr-lat">SR (lat)</option>' +
        '<option value="sr-cyrl">SR (ћир)</option>' +
        '<option value="en">EN</option>'
      );

      wrapper.appendChild(themeBtn);
      wrapper.appendChild(langSel);
      nav.appendChild(wrapper);
    }
    return {
      themeBtn: wrapper.querySelector('#theme-toggle'),
      langSel: wrapper.querySelector('#lang-select')
    };
  }

  // Minimal i18n dictionary for common navigation/footer and support page highlights
  const i18n = {
    'sr-lat': {
      brand: 'ELECTROGROUP',
      'nav.about': 'Ko smo mi',
      'nav.focus': 'Fokus',
      'nav.team': 'Tim',
      'nav.gallery': 'Galerija',
      'nav.faq': 'FAQ',
      'nav.contact': 'Kontakt',
      'footer.copy': '© 2025 ELECTROGROUP ITS DOO Sombor. Sva prava zadržana.',

      // Support page (kontakt.html) – hero
      'support.eyebrow': 'Podrška i saradnja',
      'support.title': 'Partner za sigurne elektro sisteme',
      'support.intro': 'Electrogroup ITS preuzima odgovornost za kompletan elektroenergetski ciklus – od ideje do 24/7 održavanja. Ova strana prikuplja sve kontakt kanale, prikazuje reference i daje jasne smernice kako da pokrenete projekat sa našim timom.',
      'support.cta.consult': 'Zatraži konsultacije',
      'support.cta.call': 'Pozovi +381 63 108 5618',
      'support.hl.1': 'Licencirani inženjeri i elektromonteri za srednji i visoki napon',
      'support.hl.2': 'Specijalizovane ekipe za rad na visini i u kriznim uslovima',
      'support.hl.3': 'Brze intervencije na trafostanicama, spojnicama i industrijskim postrojenjima',
      'support.figcaption': 'Mobilne radionice i vozila sa dizalicama omogućavaju brze intervencije širom regiona.',

      // Contact form essentials
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
    },
    en: {
      brand: 'ELECTROGROUP',
      'nav.about': 'About',
      'nav.focus': 'Focus',
      'nav.team': 'Team',
      'nav.gallery': 'Gallery',
      'nav.faq': 'FAQ',
      'nav.contact': 'Contact',
      'footer.copy': '© 2025 ELECTROGROUP ITS LLC Sombor. All rights reserved.',

      // Support page – hero
      'support.eyebrow': 'Support and cooperation',
      'support.title': 'Partner for reliable electrical systems',
      'support.intro': 'Electrogroup ITS takes responsibility for the entire power cycle – from concept to 24/7 maintenance. This page collects all contact channels, shows references, and gives clear guidance to start a project with our team.',
      'support.cta.consult': 'Request consultation',
      'support.cta.call': 'Call +381 63 108 5618',
      'support.hl.1': 'Licensed engineers and electricians for MV and HV',
      'support.hl.2': 'Specialized crews for heights and demanding conditions',
      'support.hl.3': 'Rapid interventions at substations, joints, and industrial plants',
      'support.figcaption': 'Mobile workshops and lift-equipped vehicles enable quick interventions across the region.',

      // Contact form essentials
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
    }
  };

  // Serbian Latin → Cyrillic transliteration (handles nj, lj, dž digraphs and diacritics)
  function latinToCyrillic(str) {
    if (!str) return str;
    let out = str;
    // Digraphs first
    out = out
      .replace(/NJ/g, 'Њ').replace(/Nj/g, 'Њ').replace(/nj/g, 'њ')
      .replace(/LJ/g, 'Љ').replace(/Lj/g, 'Љ').replace(/lj/g, 'љ')
      .replace(/DŽ/g, 'Џ').replace(/Dž/g, 'Џ').replace(/dž/g, 'џ');
    // Single letters
    const map = {
      A:'А', a:'а', B:'Б', b:'б', V:'В', v:'в', G:'Г', g:'г', D:'Д', d:'д',
      Đ:'Ђ', đ:'ђ', E:'Е', e:'е', Ž:'Ж', ž:'ж', Z:'З', z:'з', I:'И', i:'и',
      J:'Ј', j:'ј', K:'К', k:'к', L:'Л', l:'л', M:'М', m:'м', N:'Н', n:'н',
      O:'О', o:'о', P:'П', p:'п', R:'Р', r:'р', S:'С', s:'с', T:'Т', t:'т',
      Ć:'Ћ', ć:'ћ', Č:'Ч', č:'ч', U:'У', u:'у', F:'Ф', f:'ф', H:'Х', h:'х',
      C:'Ц', c:'ц', Š:'Ш', š:'ш', Y:'y', y:'y', W:'w', w:'w', X:'x', x:'x', Q:'q', q:'q'
    };
    out = out.replace(/[A-Za-zÀ-ž]/g, ch => map[ch] || ch);
    return out;
  }

  function setLangAttrs(lang) {
    const [code, script] = lang === 'en' ? ['en', 'latn'] : (lang === 'sr-cyrl' ? ['sr', 'cyrl'] : ['sr', 'latn']);
    document.documentElement.lang = code;
    document.documentElement.setAttribute('data-script', script);
  }

  function applyTranslations(lang) {
    setLangAttrs(lang);
    const dict = i18n[lang] || i18n['sr-lat'];

    // data-i18n targeted elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const val = dict[key];
      if (val) el.textContent = val;
      else if (lang === 'sr-cyrl') el.textContent = latinToCyrillic(el.textContent);
    });

    // Header nav links (first 6-7 links expected)
    const navLinks = document.querySelectorAll('header nav a');
    if (navLinks.length) {
      const navKeys = ['nav.about','nav.focus','nav.team','nav.gallery','nav.faq','nav.contact'];
      navKeys.forEach((k, i) => { if (navLinks[i]) navLinks[i].textContent = dict[k] || navLinks[i].textContent; });
    }

    // Footer
    const foot = document.querySelector('footer p');
    if (foot && dict['footer.copy']) foot.textContent = dict['footer.copy'];

    // Cyrillic fallback: transliterate general text blocks not explicitly keyed
    if (lang === 'sr-cyrl') {
      document.querySelectorAll('.section p, .section li, .section h1, .section h2, .section h3, .btn').forEach(el => {
        if (!el.closest('[data-i18n]')) {
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
      applyTranslations(v);
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    const { themeBtn, langSel } = ensureControls();
    initTheme(themeBtn);
    initLang(langSel);
    // Preloader brand
    const saved = (typeof localStorage !== 'undefined') ? localStorage.getItem(LS.lang) : 'sr-lat';
    const t = i18n[saved]?.brand || 'ELECTROGROUP';
    const preText = document.querySelector('.preloader-text');
    if (preText) preText.textContent = (saved === 'sr-cyrl') ? latinToCyrillic(t) : t;
  });
})();

