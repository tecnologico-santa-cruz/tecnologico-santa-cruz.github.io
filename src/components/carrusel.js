import { element, setLink } from '../utils/dom.js?v=20261101';
import { safeUrl } from '../utils/urls.js?v=20261101';

/** Galería de tamaño variable: genera diapositivas e indicadores desde los datos. */
export function initCarrusel(galeria, opciones = {}) {
  const carousel = document.querySelector('.carousel');
  if (!carousel) return;
  const track = carousel.querySelector('.carousel-track');
  const dotList = carousel.querySelector('.carousel-dots');
  const controls = carousel.querySelector('.carousel-controls');
  const pause = carousel.querySelector('.carousel-pause');
  const status = carousel.querySelector('.carousel-status');
  if (!track || !dotList || !controls || !pause || !status) return;

  const items = galeria.filter(item => safeUrl(item.imagen, true));
  const section = carousel.closest('.gallery-section');
  if (!items.length) {
    if (section) section.hidden = true;
    return;
  }
  if (section) section.hidden = false;
  track.replaceChildren();
  dotList.replaceChildren();
  const slides = [];
  const dots = [];

  items.forEach((item, position) => {
    const slide = element('figure', 'carousel-slide');
    slide.setAttribute('role', 'group');
    slide.setAttribute('aria-roledescription', 'diapositiva');
    slide.setAttribute('aria-label', `${position + 1} de ${items.length}`);
    const anchor = element('a');
    setLink(anchor, item.imagen, true);
    const image = element('img');
    image.src = item.imagen;
    image.alt = item.alt || item.titulo;
    if (item.ancho) image.width = item.ancho;
    if (item.alto) image.height = item.alto;
    anchor.append(image);
    slide.append(anchor, element('figcaption', '', item.titulo));
    track.append(slide);
    slides.push(slide);

    const dot = element('button');
    dot.type = 'button';
    dot.dataset.slideIndex = String(position);
    dot.setAttribute('aria-label', `Ver ${item.titulo}`);
    dot.addEventListener('click', () => {
      show(position);
      schedule();
    });
    dotList.append(dot);
    dots.push(dot);
  });

  // Con una imagen no hay controles ni temporizador. Nunca dividir entre cero.
  controls.hidden = items.length < 2;
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const interval = Number.isFinite(opciones.intervaloMs)
    ? Math.max(1000, opciones.intervaloMs) : 6000;
  let index = 0;
  let paused = motion.matches;
  let hovered = false;
  let focused = false;
  let touching = false;
  let timer = null;
  let start = null;

  function schedule() {
    clearInterval(timer);
    timer = null;
    if (!paused && !hovered && !focused && !touching && !document.hidden && slides.length > 1) {
      timer = setInterval(() => show(index + 1), interval);
    }
  }

  function show(next) {
    index = (next + slides.length) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;
    slides.forEach((slide, position) => {
      const active = position === index;
      slide.setAttribute('aria-hidden', String(!active));
      slide.inert = !active;
      slide.querySelector('a').tabIndex = active ? 0 : -1;
      dots[position].setAttribute('aria-pressed', String(active));
    });
    status.textContent = `${index + 1} / ${slides.length}`;
  }

  function setPaused(value) {
    paused = value;
    pause.textContent = paused ? 'Reanudar' : 'Pausar';
    pause.setAttribute('aria-pressed', String(paused));
    schedule();
  }

  function step(direction) {
    show(index + direction);
    schedule();
  }

  carousel.querySelector('[data-slide="prev"]')?.addEventListener('click', () => step(-1));
  carousel.querySelector('[data-slide="next"]')?.addEventListener('click', () => step(1));
  pause.addEventListener('click', () => setPaused(!paused));
  carousel.addEventListener('mouseenter', () => { hovered = true; schedule(); });
  carousel.addEventListener('mouseleave', () => { hovered = false; schedule(); });
  carousel.addEventListener('focusin', () => { focused = true; schedule(); });
  carousel.addEventListener('focusout', () => queueMicrotask(() => {
    focused = carousel.contains(document.activeElement);
    schedule();
  }));
  carousel.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      step(event.key === 'ArrowRight' ? 1 : -1);
    }
  });
  carousel.addEventListener('touchstart', event => {
    const touch = event.changedTouches[0];
    start = { x: touch.clientX, y: touch.clientY };
    touching = true;
    schedule();
  }, { passive: true });
  carousel.addEventListener('touchend', event => {
    const touch = event.changedTouches[0];
    if (start) {
      const dx = touch.clientX - start.x;
      const dy = touch.clientY - start.y;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) show(index + (dx < 0 ? 1 : -1));
    }
    start = null;
    touching = false;
    schedule();
  }, { passive: true });
  carousel.addEventListener('touchcancel', () => {
    start = null;
    touching = false;
    schedule();
  }, { passive: true });
  document.addEventListener('visibilitychange', schedule);
  motion.addEventListener('change', () => setPaused(motion.matches));
  show(0);
  setPaused(paused);
}
