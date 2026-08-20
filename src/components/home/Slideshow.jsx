import { useCallback, useEffect, useRef, useState } from 'react';

const AUTO_ADVANCE_MS = 4500;
const SWIPE_THRESHOLD_PX = 40;

/**
 * Auto-advancing hero carousel — ported from slideshow.js (setInterval + dots +
 * prev/next + keyboard + touch swipe) into a self-contained functional component.
 *
 * `pausedRef` is a plain mutable ref (not state) shared with the parent `.hero`
 * section's onMouseEnter/onMouseLeave, exactly like the original's closure
 * variable `isPaused` — pausing doesn't need to trigger a re-render, only the
 * next tick needs to read the latest value.
 */
export default function Slideshow({ slides, pausedRef }) {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);
  const touchStartX = useRef(0);

  const goTo = useCallback(
    (index) => {
      setCurrent((index + slides.length) % slides.length);
    },
    [slides.length],
  );

  const startAuto = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      if (!pausedRef.current) {
        setCurrent((c) => (c + 1) % slides.length);
      }
    }, AUTO_ADVANCE_MS);
  }, [slides.length, pausedRef]);

  const navigate = useCallback(
    (index) => {
      goTo(index);
      startAuto();
    },
    [goTo, startAuto],
  );

  useEffect(() => {
    startAuto();
    return () => clearInterval(timerRef.current);
  }, [startAuto]);

  useEffect(() => {
    function handleKeydown(e) {
      if (e.key === 'ArrowLeft') navigate(current - 1);
      if (e.key === 'ArrowRight') navigate(current + 1);
    }
    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  }, [current, navigate]);

  function handleTouchStart(e) {
    touchStartX.current = e.changedTouches[0].clientX;
  }

  function handleTouchEnd(e) {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > SWIPE_THRESHOLD_PX) {
      navigate(diff > 0 ? current + 1 : current - 1);
    }
  }

  return (
    <>
      <div
        className="slideshow"
        aria-hidden="true"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`slide slide-${index + 1}${index === current ? ' active' : ''}`}
          >
            <div className="slide-visual">
              <div className="slide-visual-screen">
                <div className="slide-visual-img-placeholder">
                  <img src={slide.image} alt={slide.alt} />
                </div>
                <span>{slide.status}</span>
                <div className="slide-visual-bar">
                  <div className="slide-visual-bar-fill" style={{ width: `${slide.barWidth}%` }} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="slide-controls" role="group" aria-label="Controles do slideshow">
        <button className="slide-btn" aria-label="Slide anterior" onClick={() => navigate(current - 1)}>
          &#8249;
        </button>
        <div className="slide-dots">
          {slides.map((slide, index) => (
            <span
              key={slide.id}
              className={`dot${index === current ? ' active' : ''}`}
              role="button"
              tabIndex={0}
              aria-label={`Slide ${index + 1}`}
              onClick={() => navigate(index)}
              onKeyDown={(e) => { if (e.key === 'Enter') navigate(index); }}
            />
          ))}
        </div>
        <button className="slide-btn" aria-label="Próximo slide" onClick={() => navigate(current + 1)}>
          &#8250;
        </button>
      </div>
    </>
  );
}
