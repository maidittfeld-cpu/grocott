// ── HEADER: Gør headeren transparent over hero, hvid når man scroller ──

const header = document.querySelector('.site-header');
const hasHero = document.querySelector('.hero') !== null;

function opdaterHeader() {
  const scrollet = window.scrollY > 50;
  const heroPasseret = hasHero && window.scrollY > window.innerHeight - 80;

  header.classList.toggle('header-scrolled', scrollet);

  if (hasHero) {
    header.classList.toggle('header-on-hero', !heroPasseret);
  }
}

if (header) {
  opdaterHeader();
  window.addEventListener('scroll', opdaterHeader, { passive: true });
}


// ── MOBILMENU: Åbn og luk hamburger-menuen ──

const menuKnap = document.querySelector('.menu-toggle');
const mobilMenu = document.querySelector('.mobile-menu');

function åbnMenu() {
  menuKnap.classList.add('is-open');
  mobilMenu.classList.add('is-open');
  menuKnap.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

function lukMenu() {
  menuKnap.classList.remove('is-open');
  mobilMenu.classList.remove('is-open');
  menuKnap.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

if (menuKnap && mobilMenu) {

  // Åbn/luk ved klik på hamburger
  menuKnap.addEventListener('click', () => {
    if (menuKnap.classList.contains('is-open')) {
      lukMenu();
    } else {
      åbnMenu();
    }
  });

  // Luk menuen når man klikker på et link
  mobilMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', lukMenu);
  });

  // Luk menuen med Escape-tasten
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') lukMenu();
  });
}