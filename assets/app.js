// Language + script + dark mode
const qs = s => document.querySelector(s);
const i18n = {
  sr: {
    "hero.h":"Kompletne elektroinstalacije, solarne elektrane i inženjering",
    "hero.p":"Od ideje do realizacije – „ključ u ruke“ za objekte, industriju i energiju.",
    "cta.quote":"Zatraži ponudu", "cta.more":"Pogledaj usluge",
    "services.title":"Usluge", "gallery.title":"Galerija",
    "refs.title":"Reference", "why.title":"Zašto izabrati nas",
    "contact.title":"Kontakt",
    "s.ei.h":"Elektroinstalacije 0,4–20 kV",
    "s.ei.p":"Projektovanje i izvedba LV/MV sistema: kablovske mreže, razvodni ormani, nadzemni/podzemni vodovi, stubne i tipske TS – kompletna rešenja „ključ u ruke“.",
    "s.fne.h":"Solarne elektrane (FNE)",
    "s.fne.p":"Fotonaponski sistemi za domaćinstva, poljoprivredu i industriju: oprema, montaža, puštanje u rad i priključenje na mrežu, uz kompletnu dokumentaciju.",
    "s.ts.h":"Trafostanice i MV postrojenja",
    "s.ts.p":"Projektovanje i gradnja TS, MV sklopna postrojenja, zaštitno-upravljački sistemi, integracija novih izvora i ispitivanja za upotrebnu dozvolu.",
    "s.kabl.h":"Kablovski & zemljani radovi",
    "s.kabl.p":"Rovovi, polaganje podzemnih kablova, zaštitne cevi, spojnice i kanalizacija – mehanizacija i stručni tim uz poštovanje standarda i rokova.",
    "s.integr.h":"Ugradnja opreme & integracija",
    "s.integr.p":"Razvodni ormari, prekidači, merna oprema, agregati i UPS – kompletna isporuka, ugradnja i integracija u jedinstven sistem.",
    "s.odrz.h":"Servis, monitoring & održavanje",
    "s.odrz.p":"Puštanje u rad, monitoring FNE/TS, preventivni pregledi i brze intervencije – ugovori o održavanju za dugotrajan i siguran rad sistema.",
    "refs.sivac":"Solarni park ~10 MW, Sivac – izvođenje ključnih radova",
    "refs.svilojevo":"Dve FNE ~9,9 MW, Svilojevo – izgradnja i priključenje",
    "refs.zmajevo":"FNE ~159 kW, Zmajevo – projektovanje i montaža",
    "refs.mvts":"Više projekata TS 10/0.4 kV i MV sklopnih postrojenja"
  },
  en: {
    "hero.h":"Complete electrical installations, solar plants & engineering",
    "hero.p":"From concept to commissioning – turnkey solutions for buildings, industry and energy.",
    "cta.quote":"Request a quote", "cta.more":"View services",
    "services.title":"Services", "gallery.title":"Gallery",
    "refs.title":"References", "why.title":"Why choose us",
    "contact.title":"Contact",
    "s.ei.h":"Electrical installations 0.4–20 kV",
    "s.ei.p":"Design & build LV/MV systems: cable networks, distribution boards, O/H & U/G lines, pole and kiosk substations – turnkey.",
    "s.fne.h":"Solar power plants (PV)",
    "s.fne.p":"PV systems for homes, farms and industry: equipment, installation, commissioning & grid connection with full documentation.",
    "s.ts.h":"Substations & MV switchgear",
    "s.ts.p":"Design & construction of substations, MV switchgear, protection/control systems, source integration and testing for permits.",
    "s.kabl.h":"Cable & earthworks",
    "s.kabl.p":"Trenching, underground cables, conduits, joints and ducts – machinery + skilled crew, on standards and on time.",
    "s.integr.h":"Equipment installation & integration",
    "s.integr.p":"Switchboards, breakers, measurement, gensets & UPS – supply, install and integrate into a cohesive system.",
    "s.odrz.h":"Service, monitoring & O&M",
    "s.odrz.p":"Commissioning, PV/SS monitoring, preventive checks and rapid interventions – O&M contracts for reliable long-term operation.",
    "refs.sivac":"~10 MW solar park, Sivac – EPC works",
    "refs.svilojevo":"Two ~9.9 MW PV plants, Svilojevo – build & grid connection",
    "refs.zmajevo":"~159 kW PV in Zmajevo – design and assembly",
    "refs.mvts":"Multiple 10/0.4 kV SS & MV switchgear projects"
  }
};

let lang='sr', cyrillic=false;
const setText=()=>document.querySelectorAll('[data-i18n]').forEach(n=>n.textContent=i18n[lang][n.dataset.i18n]);
qs('#btn-sr').onclick=()=>{lang='sr';setText()};
qs('#btn-en').onclick=()=>{lang='en';setText()};
qs('#btn-script').onclick=()=>{cyrillic=!cyrillic; document.documentElement.classList.toggle('cyr',cyrillic)};
qs('#btn-dark').onclick=()=>document.documentElement.classList.toggle('dark');

// Scroll fade reveal
const io=new IntersectionObserver((ents)=>ents.forEach(e=>e.isIntersecting&&e.target.classList.add('reveal')), {threshold:.18});
document.querySelectorAll('.fade').forEach(el=>io.observe(el));

// Lightbox
const dlg = document.getElementById('lightbox');
document.querySelectorAll('.gitem').forEach(a=>{
  a.addEventListener('click', e=>{
    e.preventDefault(); dlg.querySelector('img').src=a.href; dlg.showModal();
  });
});
dlg.querySelector('.close').onclick=()=>dlg.close();

// Year
document.getElementById('yr').textContent=new Date().getFullYear();

// Init texts
setText();
