// The homepage's screening room: "Watch the film" opens the film in place.
// The YouTube player is created only when someone chooses to watch, and removed
// on close. Without JavaScript (or with a modifier key) the link opens the film page.
(() => {
  const screen = document.querySelector('[data-screening]');
  if (!screen || typeof screen.showModal !== 'function') return;
  const slot = screen.querySelector('[data-screen-player]');
  const say = open => document.dispatchEvent(new CustomEvent('pr:screening', { detail: { open } }));
  document.addEventListener('click', event => {
    const link = event.target.closest('[data-screen-film]');
    if (!link || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button) return;
    const id = link.dataset.screenFilm, title = link.dataset.filmTitle || 'Paper Robots';
    if (!/^[\w-]{11}$/.test(id)) return;
    event.preventDefault();
    screen.querySelector('[data-screen-title]').textContent = title;
    screen.querySelector('[data-screen-youtube]').href = `https://www.youtube.com/watch?v=${id}`;
    const player = document.createElement('iframe');
    player.title = title;
    player.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
    player.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    player.allowFullscreen = true;
    player.referrerPolicy = 'strict-origin-when-cross-origin';
    slot.replaceChildren(player);
    screen.showModal();
    say(true);
  });
  screen.querySelector('[data-close-screen]').addEventListener('click', () => screen.close());
  screen.addEventListener('close', () => { slot.replaceChildren(); say(false); });
})();
