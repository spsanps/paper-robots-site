// Silent local previews; the full external player is loaded only on request.
(() => {
  const hero = document.querySelector('[data-cinema]');
  if (!hero) return;
  const scenes = [...hero.querySelectorAll('[data-scene]')];
  const features = [...hero.querySelectorAll('[data-feature]')];
  const selectors = [...hero.querySelectorAll('[data-select-scene]')];
  const motion = hero.querySelector('[data-motion]');
  const screen = document.querySelector('.cinema-screen');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let active = 0;
  let paused = reduced.matches || Boolean(navigator.connection?.saveData);
  let visible = true;
  function update() {
    motion.textContent = paused ? 'Play motion ▷' : 'Pause motion Ⅱ';
    motion.setAttribute('aria-label', paused ? 'Play background preview' : 'Pause background preview');
    scenes.forEach((scene, index) => {
      const video = scene.querySelector('video');
      if (index !== active || paused || !visible || document.hidden || screen.open) { video.pause(); return; }
      if (!video.src) video.src = video.dataset.preview;
      video.play().catch(error => { if (error.name === 'AbortError') return; if (index === active) { paused = true; update(); } });
    });
  }
  scenes.forEach(scene => scene.querySelector('video').addEventListener('playing', event => event.target.classList.add('is-ready')));
  selectors.forEach((button, index) => button.addEventListener('click', () => {
    active = index;
    scenes.forEach((scene, i) => { scene.classList.toggle('is-current', i === active); scene.setAttribute('aria-hidden', String(i !== active)); });
    features.forEach((feature, i) => { feature.hidden = i !== active; });
    selectors.forEach((selector, i) => selector.setAttribute('aria-pressed', String(i === active)));
    update();
  }));
  hero.querySelector('.cinema-selector').hidden = false;
  motion.hidden = false;
  motion.addEventListener('click', () => { paused = !paused; update(); });
  reduced.addEventListener('change', event => { if (event.matches) { paused = true; update(); } });
  new IntersectionObserver(entries => { visible = entries[0].isIntersecting; update(); }).observe(hero);
  document.addEventListener('visibilitychange', update);
  hero.querySelectorAll('[data-cinema-play]').forEach(link => link.addEventListener('click', event => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || typeof screen.showModal !== 'function') return;
    const feature = link.closest('[data-feature]');
    const id = feature.dataset.filmId;
    if (!/^[\w-]{11}$/.test(id)) return;
    event.preventDefault();
    screen.querySelector('[data-screen-title]').textContent = feature.dataset.filmTitle;
    screen.querySelector('[data-screen-youtube]').href = `https://www.youtube.com/watch?v=${id}`;
    const player = document.createElement('iframe');
    player.title = feature.dataset.filmTitle;
    player.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
    player.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    player.allowFullscreen = true;
    player.referrerPolicy = 'strict-origin-when-cross-origin';
    screen.querySelector('.cinema-screen-player').replaceChildren(player);
    screen.showModal();
    update();
  }));
  screen.querySelector('[data-close-screen]').addEventListener('click', () => screen.close());
  screen.addEventListener('close', () => { screen.querySelector('.cinema-screen-player').replaceChildren(); update(); });
  update();
})();
