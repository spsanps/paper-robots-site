// A player is created only when someone chooses to watch or selects a chapter.
function playFilm(container, id, title, start = 0) {
  if (!/^[a-zA-Z0-9_-]{11}$/.test(id)) return;
  let frame = container.querySelector('iframe');
  if (!frame) {
    frame = document.createElement('iframe');
    frame.title = title + ' — Paper Robots';
    frame.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    frame.allowFullscreen = true;
    frame.tabIndex = 0;
    container.querySelector('button').replaceWith(frame);
  }
  container.classList.add('is-playing');
  frame.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&start=${start}`;
  frame.focus();
}
document.querySelectorAll('[data-play-film]').forEach(button => {
  const container = button.closest('.film-player');
  container.dataset.filmId = button.dataset.playFilm;
  container.dataset.filmTitle = button.dataset.filmTitle;
  button.addEventListener('click', () => playFilm(container, button.dataset.playFilm, button.dataset.filmTitle));
});
document.querySelectorAll('[data-film-chapter]').forEach(link => link.addEventListener('click', event => {
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const container = document.querySelector('.film-detail .film-player');
  if (!container) return;
  event.preventDefault();
  playFilm(container, container.dataset.filmId, container.dataset.filmTitle, Number(link.dataset.filmChapter));
  container.scrollIntoView({ block: 'center', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
}));
document.querySelector('[data-open-script]')?.addEventListener('click', () => { document.getElementById('script').open = true; });
if (location.hash === '#script') document.getElementById('script')?.setAttribute('open', '');
const menu = document.querySelector('.mobile-menu');
menu?.addEventListener('keydown', event => { if(event.key === 'Escape') { menu.open = false; menu.querySelector('summary').focus(); } });
