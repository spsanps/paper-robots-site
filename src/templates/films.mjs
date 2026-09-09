import { esc, action } from './layout.mjs';
export function player(film) {
  return `<div class="film-player"><button type="button" data-play-film="${film.id}" data-film-title="${esc(film.title)}" aria-label="Play ${esc(film.title)}"><img src="${film.image}" alt="${esc(film.alt)}" width="1440" height="810"><span>▶ Play film · ${film.duration}</span></button></div>`;
}
export function filmCard(film) {
  return `<article class="film-index-entry" data-film-entry><div class="film-index-number">${film.number}</div><a class="film-index-image" href="${film.page}"><img src="${film.cardImage || film.image}" alt="${esc(film.cardAlt || film.alt)}" width="1440" height="810" loading="lazy"><span>Watch · ${film.duration} ↗</span></a><div class="film-index-copy"><span class="eyebrow">Animated film / ${film.subject}</span><h2><a href="${film.page}">${film.title}</a></h2><p>${film.description}</p><div class="actions">${action(film.page,'Watch the film')}${film.essay ? action(film.essay,'Read the essay',true) : action(film.page+'#story','Story & sources',true)}</div><small>${film.date} · By San Kala</small></div></article>`;
}
