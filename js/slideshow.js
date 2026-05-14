/* ============================================================
   SLIDESHOW.JS — Auto-advancing image carousel with touch support
   ============================================================ */

(function () {
  const slides    = document.querySelectorAll('.slideshow .slide');
  const dots      = document.querySelectorAll('.slide-dots .dot');
  const btnPrev   = document.getElementById('slide-prev');
  const btnNext   = document.getElementById('slide-next');

  if (!slides.length) return;

  let current   = 0;
  let autoTimer = null;
  let isPaused  = false;
  let touchStartX = 0;

  // ── Go to specific slide ───────────────────────────────
  function goTo(index) {
    slides[current].classList.remove('active');
    if (dots[current]) dots[current].classList.remove('active');

    current = (index + slides.length) % slides.length;

    slides[current].classList.add('active');
    if (dots[current]) dots[current].classList.add('active');
  }

  // ── Auto-advance ───────────────────────────────────────
  function startAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => {
      if (!isPaused) goTo(current + 1);
    }, 4500);
  }

  function resetTimer() {
    startAuto();
  }

  // ── Button events ──────────────────────────────────────
  if (btnPrev) {
    btnPrev.addEventListener('click', () => { goTo(current - 1); resetTimer(); });
  }

  if (btnNext) {
    btnNext.addEventListener('click', () => { goTo(current + 1); resetTimer(); });
  }

  // ── Dot clicks ────────────────────────────────────────
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.dataset.index, 10);
      if (!isNaN(idx)) { goTo(idx); resetTimer(); }
    });
  });

  // ── Keyboard navigation ────────────────────────────────
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft')  { goTo(current - 1); resetTimer(); }
    if (e.key === 'ArrowRight') { goTo(current + 1); resetTimer(); }
  });

  // ── Touch / swipe ─────────────────────────────────────
  const slideshow = document.getElementById('slideshow');
  if (slideshow) {
    slideshow.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });

    slideshow.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) {
        if (diff > 0) goTo(current + 1);
        else          goTo(current - 1);
        resetTimer();
      }
    }, { passive: true });
  }

  // ── Pause on hover ────────────────────────────────────
  const hero = document.querySelector('.hero');
  if (hero) {
    hero.addEventListener('mouseenter', () => { isPaused = true; });
    hero.addEventListener('mouseleave', () => { isPaused = false; });
  }

  // ── Start ─────────────────────────────────────────────
  startAuto();
})();
