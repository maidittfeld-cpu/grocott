// ── RYG-QUIZ: Guide brugeren til den rette behandling ──

const quiz = document.getElementById('rygQuiz');
if (!quiz) return;

const trin = quiz.querySelectorAll('.quiz-step');
const resultat = document.getElementById('quizResult');
const genstartKnap = document.getElementById('quizRestart');
const smerteSlider = document.getElementById('painSlider');

let svar = {};

// Vis et bestemt trin
function visTrin(nummer) {
  trin.forEach(t => t.hidden = true);
  const aktivtTrin = quiz.querySelector(`[data-step="${nummer}"]`);
  if (aktivtTrin) aktivtTrin.hidden = false;

  // Opdater progress bar
  const procent = Math.max(8, ((nummer - 1) / trin.length) * 100);
  const fill = document.getElementById('quizProgressFill');
  if (fill) fill.style.width = procent + '%';

  // Opdater smerteslider hvis vi er på trin 2
  if (nummer === 2 && smerteSlider) opdaterSlider(smerteSlider.value);
}

// Opdater smerteskala visning
function opdaterSlider(værdi) {
  const display = document.getElementById('painValue');
  const label = document.getElementById('painLabel');
  if (display) display.textContent = værdi;

  const labels = ['', 'Meget mild', 'Mild', 'Let', 'Moderat', 'Mærkbar',
                  'Stærk', 'Intens', 'Meget intens', 'Svær', 'Uudholdelig'];
  if (label) label.textContent = labels[værdi] || '';
  svar.q2 = parseInt(værdi);
}

if (smerteSlider) {
  smerteSlider.addEventListener('input', (e) => opdaterSlider(e.target.value));
}

// Lyt på radio-valg og gå til næste trin
quiz.addEventListener('change', (e) => {
  if (!e.target.matches('input[type="radio"]')) return;

  const navn = e.target.name;
  svar[navn] = e.target.value;

  setTimeout(() => {
    if (navn === 'q1') visTrin(2);
    else if (navn === 'q3') visTrin(4);
    else if (navn === 'q4') {
      document.getElementById('quizProgressFill').style.width = '100%';
      setTimeout(() => visResultat(beregnAnbefaling(svar)), 300);
    }
  }, 280);
});

// Beregn anbefaling baseret på svar
function beregnAnbefaling(svar) {
  const erFørste = svar.q1 === 'first';
  const erKronisk = svar.q3 === 'maaneder';
  const erDage = svar.q3 === 'dage';
  const smerte = svar.q2 || 5;

  if (erFørste) {
    return {
      titel: 'Førstegangsundersøgelse anbefales',
      beskrivelse: 'Da det er dit første besøg anbefaler vi en grundig 90-minutters undersøgelse med komplet vurdering, anamnese og første behandling.',
      varighed: '90 min',
      pris: '800 kr.',
      akut: false
    };
  }

  if (erKronisk) {
    return {
      titel: 'Standardbehandling eller udvidet',
      beskrivelse: 'Ved kroniske smerter arbejder vi med årsagerne over tid. 45 min passer til de fleste, 60 min hvis du har mange smerteområder.',
      varighed: '45–60 min',
      pris: '475–625 kr.',
      akut: false
    };
  }

  if (erDage && smerte >= 6) {
    return {
      titel: 'Akut opfølgning anbefales',
      beskrivelse: 'Akutte smerter kræver hurtig handling. Ring direkte på 60 86 67 70.',
      varighed: '30 min',
      pris: '375 kr.',
      akut: true
    };
  }

  return {
    titel: 'Standardbehandling',
    beskrivelse: 'En standardbehandling på 45 min er normalt det rigtige — vi kender allerede din problematik.',
    varighed: '45 min',
    pris: '475 kr.',
    akut: false
  };
}

// Vis resultatet
function visResultat(anbefaling) {
  trin.forEach(t => t.hidden = true);
  document.getElementById('quizProgress').style.display = 'none';

  document.getElementById('quizResultTitle').textContent = anbefaling.titel;
  document.getElementById('quizResultDesc').textContent = anbefaling.beskrivelse;
  document.getElementById('quizResultDuration').textContent = anbefaling.varighed;
  document.getElementById('quizResultPrice').textContent = anbefaling.pris;

  if (resultat) resultat.hidden = false;
}

// Genstart quizzen
if (genstartKnap) {
  genstartKnap.addEventListener('click', () => {
    svar = {};
    if (resultat) resultat.hidden = true;
    document.getElementById('quizProgress').style.display = '';
    quiz.querySelectorAll('input[type="radio"]').forEach(r => r.checked = false);
    if (smerteSlider) { smerteSlider.value = 5; opdaterSlider(5); }
    visTrin(1);
  });
}

visTrin(1);