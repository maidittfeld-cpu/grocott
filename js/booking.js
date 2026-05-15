// ── BOOKING TRIN 1: Vælg behandling, dato og tidspunkt ──

// Find alle elementer på siden
const kalenderKrop = document.querySelector('[data-cal-body]');
const månedLabel = document.querySelector('[data-cal-month]');
const forrigeBtn = document.querySelector('[data-cal-prev]');
const næsteBtn = document.querySelector('[data-cal-next]');
const tiderSektion = document.querySelector('[data-times-section]');
const tiderGrid = document.querySelector('[data-time-grid]');
const tiderLede = document.querySelector('[data-times-lede]');
const videreBtn = document.querySelector('[data-next-btn]');
const behandlingKort = document.querySelectorAll('[data-treatment]');

// Stop hvis elementerne ikke findes
if (!kalenderKrop || !månedLabel || !videreBtn) {
  console.error('Booking elementer mangler');
}

const MÅNEDER = ['Januar','Februar','Marts','April','Maj','Juni',
                 'Juli','August','September','Oktober','November','December'];

// Gem brugerens valg
const valg = { behandling: null, dato: null, tid: null };

// Hvilken måned vises i kalenderen
let visningsMåned = new Date();
visningsMåned.setDate(1);


// ── BEHANDLINGSVALG ──

behandlingKort.forEach(kort => {
  kort.addEventListener('click', () => {
    // Fjern aktiv fra alle og marker det valgte
    behandlingKort.forEach(k => k.classList.remove('is-selected'));
    kort.classList.add('is-selected');

    valg.behandling = {
      navn: kort.dataset.treatment,
      varighed: kort.dataset.duration,
      pris: kort.dataset.price
    };

    opdaterSummary();
    valider();
  });
});


// ── KALENDER ──

function erFortid(dato) {
  const iDag = new Date();
  iDag.setHours(0, 0, 0, 0);
  return dato < iDag;
}

function erWeekend(dato) {
  return dato.getDay() === 0 || dato.getDay() === 6;
}

function tilISO(dato) {
  return `${dato.getFullYear()}-${String(dato.getMonth()+1).padStart(2,'0')}-${String(dato.getDate()).padStart(2,'0')}`;
}

function tilDansk(dato) {
  return `${dato.getDate()}. ${MÅNEDER[dato.getMonth()].toLowerCase()} ${dato.getFullYear()}`;
}

function tegneKalender() {
  const år = visningsMåned.getFullYear();
  const måned = visningsMåned.getMonth();
  månedLabel.textContent = `${MÅNEDER[måned]} ${år}`;

  const førsteDag = new Date(år, måned, 1);
  let startOffset = førsteDag.getDay() - 1;
  if (startOffset < 0) startOffset = 6;

  const dageIMåned = new Date(år, måned + 1, 0).getDate();
  let html = '';
  let celleIndex = 0;
  let dagNummer = 1;

  for (let uge = 0; uge < 6; uge++) {
    html += '<tr>';
    for (let kolonne = 0; kolonne < 7; kolonne++) {
      if (celleIndex < startOffset || dagNummer > dageIMåned) {
        html += '<td class="cal-cell is-empty"></td>';
      } else {
        const dato = new Date(år, måned, dagNummer);
        const iso = tilISO(dato);
        const fortid = erFortid(dato);
        const weekend = erWeekend(dato);

        let klasse = 'cal-cell';
        let klikbar = true;

        if (fortid || weekend) { klasse += ' is-disabled'; klikbar = false; }
        else { klasse += ' is-free'; }

        const iDag = new Date(); iDag.setHours(0,0,0,0);
        if (dato.getTime() === iDag.getTime()) klasse += ' is-today';
        if (valg.dato === iso) klasse += ' is-picked';

        html += `<td class="${klasse}" data-date="${iso}" ${!klikbar ? 'aria-disabled="true"' : ''}>
                   <span class="cal-day">${dagNummer}</span>
                 </td>`;
        dagNummer++;
      }
      celleIndex++;
    }
    html += '</tr>';
    if (dagNummer > dageIMåned) break;
  }

  kalenderKrop.innerHTML = html;

  // Tilføj klik-events til ledige dage
  kalenderKrop.querySelectorAll('.cal-cell.is-free').forEach(td => {
    td.addEventListener('click', () => vælgDato(td.dataset.date));
  });
}

function vælgDato(iso) {
  valg.dato = iso;
  valg.tid = null;
  tegneKalender();
  visTider(iso);
  opdaterSummary();
  valider();
}

// Forrige og næste måned
forrigeBtn.addEventListener('click', () => {
  const iDag = new Date();
  const nyMåned = new Date(visningsMåned);
  nyMåned.setMonth(nyMåned.getMonth() - 1);
  if (nyMåned < new Date(iDag.getFullYear(), iDag.getMonth(), 1)) return;
  visningsMåned = nyMåned;
  tegneKalender();
});

næsteBtn.addEventListener('click', () => {
  visningsMåned.setMonth(visningsMåned.getMonth() + 1);
  tegneKalender();
});


// ── TIDSSLOTS ──

function visTider(iso) {
  const dato = new Date(iso + 'T00:00:00');
  const dag = dato.getDay();

  // Åbningstider per ugedag
  let start = 8, slut = 14;
  if (dag === 2) { start = 9; slut = 21; }
  else if (dag === 3) { start = 8; slut = 15; }
  else if (dag === 4) { start = 10; slut = 21; }
  else if (dag === 5) { start = 7.25; slut = 15; }

  // Generer slots hvert halvt time
  const slots = [];
  for (let t = start; t < slut; t += 0.5) {
    const timer = Math.floor(t);
    const minutter = (t % 1) === 0.5 ? '30' : '00';
    slots.push(`${String(timer).padStart(2,'0')}:${minutter}`);
  }

  // Simulér et par optagne tider
  const optagne = new Set();
  const frø = dato.getDate();
  for (let i = 0; i < 3; i++) {
    optagne.add(slots[(frø * (i+1) * 3) % slots.length]);
  }

  let html = '';
  slots.forEach(tid => {
    const optaget = optagne.has(tid);
    const klasse = 'time-cell' + (optaget ? ' is-full' : ' is-free');
    html += `<button type="button" class="${klasse}" data-time="${tid}" ${optaget ? 'disabled' : ''}>${tid}</button>`;
  });

  tiderGrid.innerHTML = html;
  tiderLede.textContent = `Ledige tider ${tilDansk(dato)}`;
  tiderSektion.hidden = false;

  tiderGrid.querySelectorAll('.time-cell.is-free').forEach(knap => {
    knap.addEventListener('click', () => {
      valg.tid = knap.dataset.time;
      tiderGrid.querySelectorAll('.time-cell').forEach(k => k.classList.remove('is-picked'));
      knap.classList.add('is-picked');
      opdaterSummary();
      valider();
    });
  });
}


// ── SUMMARY (sidepanel) ──

function opdaterSummary() {
  const sætAlle = (selector, tekst) => {
    document.querySelectorAll(selector).forEach(el => el.textContent = tekst);
  };

  sætAlle('[data-sum-treatment]', valg.behandling ? valg.behandling.navn : 'Ikke valgt');
  sætAlle('[data-sum-duration]',  valg.behandling ? valg.behandling.varighed : '-');
  sætAlle('[data-sum-date]',      valg.dato ? tilDansk(new Date(valg.dato + 'T00:00:00')) : '-');
  sætAlle('[data-sum-time]',      valg.tid || '-');
  sætAlle('[data-sum-total]',     valg.behandling ? `${valg.behandling.pris} kr.` : '0 kr.');
}


// ── VALIDERING & VIDERE ──

function valider() {
  const klar = valg.behandling && valg.dato && valg.tid;
  videreBtn.disabled = !klar;
  videreBtn.style.opacity = klar ? '1' : '0.5';
}

videreBtn.addEventListener('click', (e) => {
  if (videreBtn.disabled) { e.preventDefault(); return; }

  // Send valg videre som URL-parametre til bekræft-siden
  const parametre = new URLSearchParams({
    t:    valg.behandling.navn,
    dur:  valg.behandling.varighed,
    p:    valg.behandling.pris,
    d:    valg.dato,
    time: valg.tid
  });

  window.location.href = `bekraeft.html?${parametre.toString()}`;
});


// ── START ──

tegneKalender();
opdaterSummary();
valider();