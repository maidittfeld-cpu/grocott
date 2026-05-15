// ── BEHANDLINGSFILTER: Filtrer behandlinger efter kategori ──

const filterKnapper = document.querySelectorAll('.beh-tab');
const behandlinger = document.querySelectorAll('.beh-item');

filterKnapper.forEach(function(knap) {
  knap.addEventListener('click', function() {

    // Marker den valgte knap som aktiv
    filterKnapper.forEach(function(k) {
      k.classList.remove('is-active');
    });
    knap.classList.add('is-active');

    const valgtFilter = knap.dataset.filter;

    // Vis eller skjul behandlinger baseret på filter
    behandlinger.forEach(function(item) {
      const kategorier = item.dataset.cats || '';
      const visAlt = valgtFilter === 'all';
      const harKategori = kategorier.includes(valgtFilter);

      if (visAlt || harKategori) {
        item.style.display = '';
      } else {
        item.style.display = 'none';
      }
    });

  });
});