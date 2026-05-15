// ── FAQ: Åbn og luk spørgsmål ved klik ──

const faqSpørgsmål = document.querySelectorAll('.faq-question');

faqSpørgsmål.forEach(knap => {
  knap.addEventListener('click', () => {
    const faqItem = knap.closest('.faq-item');
    const svar = faqItem.querySelector('.faq-answer');
    const erÅben = faqItem.classList.contains('is-open');

    // Luk alle andre åbne spørgsmål
    document.querySelectorAll('.faq-item.is-open').forEach(åbentItem => {
      åbentItem.classList.remove('is-open');
      åbentItem.querySelector('.faq-answer').style.maxHeight = '0';
    });

    // Åbn dette spørgsmål hvis det ikke allerede var åbent
    if (!erÅben) {
      faqItem.classList.add('is-open');
      svar.style.maxHeight = svar.scrollHeight + 'px';
    }
  });
});