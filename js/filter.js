// ── BEHANDLINGSFILTER: Filtrer behandlinger efter kategori ──

const filterKnapper = document.querySelectorAll('.beh-tab');
const behandlinger = document.querySelectorAll('.beh-item');

filterKnapper.forEach(knap => {
  knap.addEventListener('click', () => {

      // Marker den valgte knap som aktiv
    filterKnapper.forEach(k => k.classList.remove('is-active'));
    knap.classList.add('is-active');

     const valgtFilter = knap.dataset.filter;

      // Vis eller skjul behandlinger baseret på filter
    behandlinger.forEach(item => {
        const kategorier = item.dataset.cats  '';
      const visAlt = valgtFilter === 'all';
      const harKategori = kategorier.includes(valgtFilter);

       item.style.display = (visAlt  harKategori) ? '' : 'none';
    });
  });
});