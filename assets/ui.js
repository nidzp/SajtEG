/**
 * Shared UI helpers for theme and language toggles (Serbian / English).
 * Injects controls into the header, persists preferences, and applies translations.
 */
(function () {
  'use strict';

  const LS = { theme: 'eg_theme', lang: 'eg_lang' };

  function ensureControls() {
    const nav = document.querySelector('header nav');
    if (!nav) {
      return {};
    }

    let wrapper = nav.querySelector('.header-controls');
    if (!wrapper) {
      wrapper = document.createElement('div');
      wrapper.className = 'header-controls';

      const themeBtn = document.createElement('button');
      themeBtn.id = 'theme-toggle';
      themeBtn.className = 'ctrl';
      themeBtn.type = 'button';
      themeBtn.title = 'Promeni temu';
      themeBtn.setAttribute('aria-label', 'Promeni temu');
      themeBtn.textContent = '\u2600';

      const langSel = document.createElement('select');
      langSel.id = 'lang-select';
      langSel.className = 'ctrl';
      langSel.setAttribute('aria-label', 'Jezik');
      langSel.innerHTML = [
        '<option value="sr">SR</option>',
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

  const sr = {
    brand: 'ELECTROGROUP',
    'nav.why': 'Za\u0161to ELECTROGROUP?',
    'nav.about': 'Ko smo mi',
    'nav.focus': 'Fokus',
    'nav.trafo': 'Trafostanice',
    'nav.team': 'Tim',
    'nav.gallery': 'Galerija',
    'nav.faq': 'FAQ',
    'nav.contact': 'Kontakt',
    'footer.copy': '\u00A9 2025 ELECTROGROUP ITS DOO Sombor. Sva prava zadr\u017eana.',

    'support.eyebrow': 'Podr\u0161ka i saradnja',
    'support.title': 'Partner za sigurne elektro sisteme',
    'support.intro': 'Electrogroup ITS preuzima odgovornost za kompletan elektroenergetski ciklus - od ideje do 24/7 odr\u017eavanja. Ova strana prikuplja sve kontakt kanale, prikazuje reference i daje jasne smernice kako da pokrenete projekat sa na\u0161im timom.',
    'support.cta.consult': 'Zatra\u017ei konsultacije',
    'support.cta.call': 'Pozovi +381 63 108 5618',
    'support.hl.1': 'Licencirani in\u017eenjeri i elektromonteri za srednji i visoki napon',
    'support.hl.2': 'Specijalizovane ekipe za rad na visini i u kriznim uslovima',
    'support.hl.3': 'Brze intervencije na trafostanicama, spojnicama i industrijskim postrojenjima',
    'support.figcaption': 'Mobilne radionice i vozila sa dizalicama omogu\u0107avaju brze intervencije \u0161irom regiona.',

    'contact.form.title': 'Onlajn upit',
    'contact.form.intro': 'Popunite formu kako bismo vas povezali sa odgovornim in\u017eenjerom. Obavezna polja ozna\u010dena su sa *.',
    'contact.form.name': 'Ime i prezime *',
    'contact.form.company': 'Kompanija',
    'contact.form.email': 'Email *',
    'contact.form.phone': 'Telefon *',
    'contact.form.type': 'Vrsta projekta *',
    'contact.form.type.choose': 'Izaberite',
    'contact.form.type.joints': 'Spojnice i priklju\u010denja',
    'contact.form.type.trafo': 'Trafostanica',
    'contact.form.type.solar': 'Solarni ili hibridni sistem',
    'contact.form.type.modern': 'Modernizacija postoje\u0107ih postrojenja',
    'contact.form.type.other': 'Drugo',
    'contact.form.desc': 'Opis projekta *',
    'contact.form.consent': 'Saglasan/saglasna sam da ElectroGroup ITS obra\u0111uje moje podatke radi pripreme ponude.',
    'contact.form.submit': 'Po\u0161alji poruku',
    'contact.form.note': 'Ne \u0161aljemo newsletter. Va\u0161e podatke \u010duvamo isklju\u010divo za komunikaciju u vezi sa projektom.'
  };

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
    'contact.form.consent': 'I agree that ElectroGroup ITS processes my data to prepare an offer.',
    'contact.form.submit': 'Send message',
    'contact.form.note': 'We do not send newsletters. We store your data solely to communicate about the project.'
  };

  const i18n = { sr, en };

  function setLangAttrs(lang) {
    if (lang === 'en') {
      document.documentElement.lang = 'en';
      document.documentElement.setAttribute('data-script', 'latn');
    } else {
      document.documentElement.lang = 'sr';
      document.documentElement.setAttribute('data-script', 'latn');
    }
  }

  function applyTranslations(lang) {
    const dict = i18n[lang] || sr;
    setLangAttrs(lang);

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (!el.dataset.i18nOriginal) {
        el.dataset.i18nOriginal = el.textContent;
      }

      const text = dict[key];
      if (typeof text === 'string') {
        el.textContent = text;
      } else if (el.dataset.i18nOriginal) {
        el.textContent = el.dataset.i18nOriginal;
      }
    });
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(LS.theme, theme);
    } catch (err) {
      // noop
    }
  }

  function updateThemeIcon(button, theme) {
    if (!button) {
      return;
    }
    button.textContent = theme === 'light' ? '\u2600' : '\u263D';
    button.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
  }

  function initTheme(button) {
    const saved = (typeof localStorage !== 'undefined') ? localStorage.getItem(LS.theme) : null;
    const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
    const theme = saved || (prefersLight ? 'light' : 'dark');
    setTheme(theme);
    updateThemeIcon(button, theme);

    if (!button) {
      return;
    }

    button.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      const next = current === 'light' ? 'dark' : 'light';
      setTheme(next);
      updateThemeIcon(button, next);
    });
  }

  function normalizeLang(value) {
    if (value === 'sr-lat' || value === 'sr-cyrl') {
      return 'sr';
    }
    return i18n[value] ? value : 'sr';
  }

  function initLang(select) {
    const saved = (typeof localStorage !== 'undefined') ? localStorage.getItem(LS.lang) : null;
    const lang = normalizeLang(saved);
    if (select) {
      select.value = lang;
    }
    applyTranslations(lang);

    if (!select) {
      return;
    }

    select.addEventListener('change', () => {
      const next = normalizeLang(select.value);
      try {
        localStorage.setItem(LS.lang, next);
      } catch (err) {
        // noop
      }
      applyTranslations(next);
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    const { themeBtn, langSel } = ensureControls();
    initTheme(themeBtn);
    initLang(langSel);
  });
})();

