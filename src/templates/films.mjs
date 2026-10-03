import site from '../../site.config.mjs';
import { esc, arrow } from './layout.mjs';
import { filmArtData } from '../data/films.mjs';

// The film's second link: its essay if it has one, otherwise its story and sources.
export const filmMore = (film, long = false) => film.essay
  ? { href: film.essay, label: 'Read the essay' }
  : { href: film.page + '#story', label: long ? 'The story, script & sources' : 'Story & sources' };
export const filmMeta = film => `${film.duration} · ${film.date} · By ${site.author}`;

// The page's film data for the code-drawn art: lettering and tape stamps only.
export const filmArtIsland = () => `<script type="application/json" id="paper-robots-films">${JSON.stringify(filmArtData(site.name)).replaceAll('<', '\\u003c')}</script>`;
export const filmArtScripts = '<script defer src="/scripts/film-art.js"></script>';

// A code-drawn canvas; without JavaScript, the film's painted still stands in.
function art(film, fmt, alt, { fallback = film.cardImage || film.image, lazy = true } = {}) {
  return `<canvas data-art="${film.art.renderer}" data-fmt="${fmt}" role="img" aria-label="${esc(alt)}"></canvas><noscript><img src="${fallback}" alt="${esc(alt)}" width="1440" height="810"${lazy ? ' loading="lazy"' : ''}></noscript>`;
}

// The in-page player. Its face is the film's thumbnail, drawn in code; the YouTube
// player loads only when someone presses play (src/scripts/site.js).
export function player(film) {
  return `<div class="film-player"><button type="button" data-play-film="${film.id}" data-film-title="${esc(film.title)}" aria-label="Play ${esc(film.title)}">${art(film, 'thumb', film.art.alts.thumb, { fallback: film.image, lazy: false })}<span class="play"><b aria-hidden="true">▶</b>Play film · ${film.duration}</span></button></div>`;
}

// One film as a tape: its code-drawn poster beside its title, line and links.
// `from`: the page it sits on, so a row never links back to that page (the essay
// page shows its film without a "Read the essay" link).
export function tapeRow(film, { heading = 'h3', from = '' } = {}) {
  const more = filmMore(film);
  const id = `tape-${film.slug}`;
  return `<article class="tape-row" data-film-entry aria-labelledby="${id}"><figure class="tape-poster"><a href="${film.page}" tabindex="-1" aria-hidden="true">${art(film, 'poster', film.art.alts.poster)}</a></figure><div class="tape-copy"><span class="eyebrow">Tape ${film.number} · ${film.genre}</span><${heading} id="${id}"><a href="${film.page}">${film.title}</a></${heading}><p class="line">${film.line}</p><p>${film.description}</p><p class="meta">${filmMeta(film)}</p><div class="actions"><a class="btn" href="${film.page}">Watch the film ${arrow}</a>${more.href === from ? '' : `<a href="${more.href}">${more.label} ${arrow}</a>`}</div><small class="process">Poster: ${film.art.process}, drawn in code.</small></div></article>`;
}

// The About page: the same robot in each film's hand, oldest film first, each linking
// to its film. Without JavaScript the row is hidden (there is nothing to draw with).
export function robotHands(films) {
  return `<div class="robot-hands">${[...films].reverse().map(film => `<a href="${film.page}"><canvas data-art="${film.art.cast.art}" role="img" aria-label="${esc(film.art.cast.alt)}"></canvas><span><b>Tape ${film.number}</b> · ${film.art.process}</span></a>`).join('')}</div>`;
}

// "Made, not generated": the formats around a film, all from its one renderer.
export function madeSection(film) {
  const r = film.art.renderer, a = film.art.alts;
  const fig = (cls, fmt, alt, caption, artKey = r) => `<figure class="${cls}"><canvas data-art="${artKey}"${fmt ? ` data-fmt="${fmt}"` : ''} role="img" aria-label="${esc(alt)}"></canvas><figcaption>${caption}</figcaption></figure>`;
  return `<section class="made" aria-labelledby="made-title"><div><span class="eyebrow">Made, not generated</span><h2 id="made-title">Everything around the film is drawn in code.</h2><p>${film.art.made}</p></div><div class="kit">${fig('poster', 'poster', a.poster, '<b>Poster</b> · 2:3 · 2000 × 3000')}<div class="stack">${fig('wide', 'title', a.title, '<b>Title card</b> · 16:9 · 1920 × 1080 · animated')}${fig('wide', '', film.art.cast.alt, `<b>The robot</b> · ${film.art.cast.caption}`, film.art.cast.art)}</div>${fig('tall', 'short', a.short, '<b>Shorts</b> · 9:16 · 1080 × 1920 · 8 s loop')}</div></section>`;
}
