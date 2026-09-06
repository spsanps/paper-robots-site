const menu = document.querySelector('.mobile-menu');
menu?.addEventListener('keydown', event => {
  if(event.key === 'Escape') { menu.open = false; menu.querySelector('summary').focus(); }
});
menu?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => { menu.open = false; }));

// YouTube is loaded only after a reader chooses to play the film.
document.querySelectorAll('[data-play-film]').forEach(button => button.addEventListener('click', () => {
  const frame = document.createElement('iframe');
  frame.src = 'https://www.youtube-nocookie.com/embed/kzvqj4jurW0?autoplay=1&rel=0';
  frame.title = 'The Coming Robotics Revolution — Paper Robots';
  frame.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
  frame.allowFullscreen = true;
  button.replaceWith(frame);
  frame.focus();
}));
