// ── BOOKING TRIN 2: Udfyld oplysninger og bekræft booking ──

// Hent URL-parametre fra trin 1
const parametre = new URLSearchParams(window.location.search);

const booking = {
  behandling: parametre.get('t')    || 'Standardbehandling',
  varighed:   parametre.get('dur')  || '45 min',
  pris:       parametre.get('p')    || '500',
  dato:       parametre.get('d')    || '',
  tid:        parametre.get('time') || ''
};

// Formatér dato til dansk
function tilDansk(datoStr) {
  if (!datoStr) return '-';
  const dato = new Date(datoStr + 'T00:00:00');
  const formateret = dato.toLocaleDateString('da-DK', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });
  return formateret.charAt(0).toUpperCase() + formateret.slice(1);
}

// Vis booking-detaljer i sidepanelet
function sætAlle(selector, tekst) {
  document.querySelectorAll(selector).forEach(el => el.textContent = tekst);
}

sætAlle('[data-sum-treatment]', booking.behandling);
sætAlle('[data-sum-duration]',  booking.varighed);
sætAlle('[data-sum-date]',      tilDansk(booking.dato));
sætAlle('[data-sum-time]',      booking.tid || '-');
sætAlle('[data-sum-total]',     parseInt(booking.pris).toLocaleString('da-DK') + ' kr.');

// ── FORMVALIDERING ──

const form = document.querySelector('[data-booking-form]');
const bekræftKnap = document.querySelector('[data-submit-btn]');
const bekræftSkærm = document.getElementById('bkConfirmScreen');
const formTitel = document.querySelector('.booking-section-title');
const formLede = document.querySelector('.booking-section-lede');
const hovedIndhold = document.querySelector('.booking-main');

if (!form || !bekræftKnap) throw new Error('Formular ikke fundet');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const TELEFON_REGEX = /^(\+?45)?[\s-]?(\d[\s-]?){8}$/;

function visError(felt, besked) {
  felt.classList.add('is-error');
  const fejlEl = felt.closest('.form-group')?.querySelector('.form-error');
  if (fejlEl) { fejlEl.textContent = besked; fejlEl.hidden = false; }
}

function fjernError(felt) {
  felt.classList.remove('is-error');
  const fejlEl = felt.closest('.form-group')?.querySelector('.form-error');
  if (fejlEl) { fejlEl.textContent = ''; fejlEl.hidden = true; }
}

// Fjern fejl når brugeren retter
form.querySelectorAll('input, textarea').forEach(felt => {
  const event = felt.type === 'checkbox' ? 'change' : 'input';
  felt.addEventListener(event, () => fjernError(felt));
});

form.querySelectorAll('[name="sygeforsikring"]').forEach(radio => {
  radio.addEventListener('change', () => {
    const fejlEl = radio.closest('.form-group')?.querySelector('.form-error');
    if (fejlEl) { fejlEl.textContent = ''; fejlEl.hidden = true; }
  });
});

function validerForm() {
  let gyldig = true;

  const navn = form.querySelector('[name="name"]');
  if (!navn.value.trim() || navn.value.trim().length < 2) {
    visError(navn, 'Indtast venligst dit fulde navn.');
    gyldig = false;
  }

    const email = form.querySelector('[name="email"]');
  if (!EMAIL_REGEX.test(email.value.trim())) {
    visError(email, 'Indtast en gyldig email-adresse.');
    gyldig = false;
  }

    const telefon = form.querySelector('[name="phone"]');
  if (!TELEFON_REGEX.test(telefon.value.trim())) {
    visError(telefon, 'Indtast et gyldigt dansk telefonnummer.');
    gyldig = false;
  }

    const gdpr = form.querySelector('[name="gdpr"]');
  if (!gdpr.checked) {
    visError(gdpr, 'Du skal acceptere privatlivspolitikken.');
    gyldig = false;
  }

   const syg = form.querySelector('[name="sygeforsikring"]:checked');
  if (!syg) {
    const sygGruppe = form.querySelector('[name="sygeforsikring"]')?.closest('.form-group');
    const fejlEl = sygGruppe?.querySelector('.form-error');
    if (fejlEl) { fejlEl.textContent = 'Vælg venligst ja eller nej.'; fejlEl.hidden = false; }
    gyldig = false;
  }

    return gyldig;
}

// ── BEKRÆFT BOOKING ──

bekræftKnap.addEventListener('click', (e) => {
  e.preventDefault();

  if (!validerForm()) {
    // Scroll til første fejl
    const førsteFejl = form.querySelector('.is-error');
    if (førsteFejl) førsteFejl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

   // Vis loader
  bekræftKnap.disabled = true;
  bekræftKnap.innerHTML = '<span class="spinner" aria-hidden="true"></span> Bekræfter...';

  // Simulér afsendelse og vis bekræftelse
  setTimeout(visBekræftelse, 1500);
});

function visBekræftelse() {
  // Opdater trin-indikatoren til trin 3
  const trin = document.querySelectorAll('.booking-step');
  if (trin.length === 3) {
    trin[0].classList.add('is-done');
    trin[1].classList.remove('is-active');
    trin[1].classList.add('is-done');
    trin[2].classList.add('is-active');
  }

   // Udfyld bekræftelseskortet
  const sæt = (id, tekst) => {
    const el = document.getElementById(id);
    if (el) el.textContent = tekst || '-';
  };
  
   sæt('bkConfTreatment', booking.behandling);
  sæt('bkConfDuration',  booking.varighed);
  sæt('bkConfDate',      tilDansk(booking.dato));
  sæt('bkConfTime',      booking.tid || '-');

  const sygValg = form.querySelector('[name="sygeforsikring"]:checked');
  sæt('bkConfSyg', sygValg?.value === 'ja' ? 'Ja' : 'Nej');
  
   // Opdater hero-tekst
  const heroTitel = document.getElementById('bk2HeroTitle');
  const heroLede = document.getElementById('bk2HeroLede');
  if (heroTitel) heroTitel.innerHTML = 'Din tid er <em>booket</em><em>!</em>';
  if (heroLede) heroLede.textContent = 'Vi ses til den aftalte tid. Du modtager en bekræftelse på mail med alle detaljer.';

   // Skjul formularen og vis bekræftelse
  form.hidden = true;
  if (formTitel) formTitel.hidden = true;
  if (formLede) formLede.hidden = true;
  if (bekræftSkærm) bekræftSkærm.hidden = false;
  
   // Skjul sidepanel og centrer indholdet
  const sidepanel = document.querySelector('.booking-aside');
  const layout = document.querySelector('.booking-layout');
  if (sidepanel) sidepanel.style.display = 'none';
  if (layout) {
    layout.style.gridTemplateColumns = '1fr';
    layout.style.maxWidth = '680px';
    layout.style.margin = '0 auto';
  }
  
   if (hovedIndhold) hoofdIndhold.scrollIntoView({ behavior: 'smooth', block: 'start' });
} 