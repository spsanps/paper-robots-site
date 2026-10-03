import { esc, arrow } from './layout.mjs';
import { filmMore, filmMeta } from './films.mjs';

// The homepage's opening (src/pages/home.html): the film details beside the shot,
// one block per film (newest first, the others hidden until their tape is chosen),
// and the tape buttons. "Watch the film" opens the screening room in place; it is
// a plain link to the film page without JavaScript.
export function openingFilms(films) {
  return `<div class="opening-now" aria-live="polite">${films.map((film, i) => {
    const more = filmMore(film, true);
    return `<article class="opening-film" data-tape-copy="${film.number}"${i ? ' hidden' : ''}><span class="tape-label">Now showing · Tape ${film.number} · ${film.genre.split(' · ')[0]}</span><h2>${film.title}</h2><p class="film-line">${film.line}</p><p class="film-meta">${filmMeta(film)}</p><div class="opening-actions"><a class="btn-play" href="${film.page}" data-screen-film="${film.id}" data-film-title="${esc(film.title)}"><b aria-hidden="true">▶</b>Watch the film</a><a href="${more.href}">${more.label} ${arrow}</a></div></article>`;
  }).join('')}</div><div class="opening-tapes" role="group" aria-label="Choose a film" hidden>${films.map((film, i) => `<button type="button" data-tape="${film.number}" aria-pressed="${i === 0}"><span>${film.number}</span>${film.short}</button>`).join('')}</div>`;
}

// Without JavaScript the shot can't be drawn: the newest film's painted still stands in.
export const openingStill = film => `<noscript><img class="opening-still" src="${film.image}" alt="${esc(film.alt)}" width="1440" height="810"></noscript>`;

export function screeningRoom(film) {
  return `<dialog class="screening" data-screening aria-label="Watch a Paper Robots film"><div class="screening-bar"><span data-screen-title></span><button type="button" data-close-screen>Close film ×</button></div><div class="screening-player" data-screen-player></div><a data-screen-youtube href="https://www.youtube.com/watch?v=${film.id}">Open on YouTube ${arrow}</a></dialog>`;
}
