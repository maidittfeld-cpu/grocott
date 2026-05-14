// ── KARRUSEL: Frem og tilbage knapper + swipe på mobil ──

const karrusel = document.querySelector('[data-carousel]');

if (karrusel) {
    const track = karrusel.querySelector('.carousel-track');
  const kort = track.querySelectorAll('.carousel-card');
  const forrigeKnap = karrusel.querySelector('[data-carousel-prev]');
  const næsteKnap = karrusel.querySelector('[data-carousel-next]');

  let aktivIndex = 0;

   // Beregn hvor mange kort der vises på en gang
  function synligeKort() {
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 768) return 2;
    return 1;
    }

    // Maks index man kan scrolle til
    function maksIndex() {
        return Math.max(0, kort.length - synligeKort());
    }

    // Flyt karrusellen til det aktive kort
    function opdater() {
        const gap = parseInt(getComputedStyle(track).gap) || 24;
    const kortBredde = kort[0].getBoundingClientRect().width + gap;
    track.style.transform = `translateX(-${aktivIndex * kortBredde}px)`;
    forrigeKnap.disabled = aktivIndex <= 0;
    næsteKnap.disabled = aktivIndex >= maksIndex();
    }

    // Knap: forrige
    forrigeKnap.addEventListener('click', () => {
        if (aktivIndex > 0) {
      aktivIndex--;
      opdater();
    }
    });

    // Knap: næste
     næsteKnap.addEventListener('click', () => {
          if (aktivIndex < maksIndex()) {
      aktivIndex++;
      opdater();
    }
    });

     // Swipe på mobil
      let startX = 0;
  track.addEventListener('touchstart', (e) => {
    startX = e.changedTouches[0].screenX;
  }, { passive: true });

   track.addEventListener('touchend', (e) => {
    const forskel = startX - e.changedTouches[0].screenX;
    if (Math.abs(forskel) < 50) return; // Ikke nok swipe
    if (forskel > 0 && aktivIndex < maksIndex()) aktivIndex++;
    if (forskel < 0 && aktivIndex > 0) aktivIndex--;
    opdater();
  }, { passive: true });

    // Tilpas ved vindue-resize
 window.addEventListener('resize', () => {
    aktivIndex = Math.min(aktivIndex, maksIndex());
    opdater();
  });

  opdater();
}