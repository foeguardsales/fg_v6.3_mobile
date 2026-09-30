import React, { useRef } from 'react';

/**
 * FoeGuard standard brand containers (reusable, global).
 *
 * These are additive to the existing smaller containers (recipes / protein).
 * Styling lives in App.css under "Brand reusable containers" so all radius,
 * spacing and typography come from shared tokens rather than inline values.
 *
 *  - CardCarousel  : responsive row — 3-up (fills width) on desktop,
 *                    horizontal swipe that STARTS AT THE LEFT card on mobile.
 *  - CinematicCard : Container 1 — one full-bleed image + one button whose
 *                    label IS the title (nothing else). Cinematic collection card.
 *  - FeatureCard   : Container 2 — rounded image with title + description
 *                    UNDERNEATH (Apple-style). No checkmark icons.
 */

export function CardCarousel({ children, className = '', bleed, testId }) {
  const style = bleed != null ? { '--brand-bleed': `${bleed}px` } : undefined;
  return (
    <div className={`brand-carousel ${className}`.trim()} data-testid={testId} style={style}>
      {children}
    </div>
  );
}

export function CinematicCard({ image, label, onClick, testId }) {
  // Tap-vs-drag guard: only fire onClick for a deliberate tap. If the pointer
  // moved past a small threshold (a swipe or vertical scroll), suppress the
  // click so users don't navigate by accident while scrolling the carousel.
  const startRef = useRef(null);
  const draggedRef = useRef(false);

  const onPointerDown = (e) => {
    startRef.current = { x: e.clientX, y: e.clientY };
    draggedRef.current = false;
  };
  const onPointerMove = (e) => {
    if (!startRef.current) return;
    const dx = Math.abs(e.clientX - startRef.current.x);
    const dy = Math.abs(e.clientY - startRef.current.y);
    if (dx > 8 || dy > 8) draggedRef.current = true;
  };
  const handleClick = (e) => {
    if (draggedRef.current) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    onClick && onClick(e);
  };

  return (
    <button
      type="button"
      className="brand-cinematic"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onClick={handleClick}
      data-testid={testId}
      aria-label={label}
    >
      <span
        className="brand-cinematic__img"
        style={{ backgroundImage: image ? `url(${image})` : 'none' }}
        aria-hidden="true"
      />
      <span className="brand-cinematic__scrim" aria-hidden="true" />
      <span className="brand-cinematic__label">
        {label}
        <span className="brand-cinematic__arrow" aria-hidden="true">&rarr;</span>
      </span>
    </button>
  );
}

export function FeatureCard({ image, title, lead, body, tone, wide, testId }) {
  const cls = ['brand-feature'];
  if (tone === 'dark') cls.push('brand-feature--on-dark');
  if (wide) cls.push('brand-feature--wide');
  return (
    <article className={cls.join(' ')} data-testid={testId}>
      {image && (
        <div
          className="brand-feature__img"
          role="img"
          aria-label={title || ''}
          style={{ backgroundImage: `url(${image})` }}
        />
      )}
      <div className="brand-feature__body">
        {title && <h3 className="brand-feature__title">{title}</h3>}
        {(lead || body) && (
          <p className="brand-feature__text">
            {lead && <strong className="brand-feature__lead">{lead} </strong>}
            {body}
          </p>
        )}
      </div>
    </article>
  );
}

export default { CardCarousel, CinematicCard, FeatureCard };
