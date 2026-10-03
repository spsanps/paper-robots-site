import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import site from '../site.config.mjs';
const root=fileURLToPath(new URL('../dist/',import.meta.url));
const expectsAnalytics=process.env.VERCEL === '1' && !(process.env.SITE_BASE_PATH || '').replace(/\/$/,'');
const paths=['/','/essays/','/films/','/about/','/follow/','/essays/gpt7-will-have-arms/','/films/capricious-god/','/films/robotics-revolution/'];
for(const path of paths) {
  const html=await readFile(resolve(root,'.'+path,'index.html'),'utf8');
  assert.equal((html.match(/<h1\b/g)||[]).length,1,'One clear heading: '+path);
  assert.ok(html.includes('rel="canonical"') && html.includes('og:image'),'Sharing metadata: '+path);
  assert.equal((html.match(/<script defer src="\/_vercel\/insights\/script\.js"><\/script>/g)||[]).length,expectsAnalytics ? 1 : 0,'Correct analytics integration for this deployment: '+path);
  assert.ok(!/Design study|publication has not been created|\{\{/.test(html),'No prototype copy: '+path);
  for(const [,url] of html.matchAll(/(?:src|href)="(\/[^"#?]*)[^\"]*"/g)) {
    // Deployment under a Pages project prefix is covered by the browser check.
    if(process.env.SITE_BASE_PATH) continue;
    if(url === '/_vercel/insights/script.js') continue; // Managed by Vercel, not a repository asset.
    const filename=url.endsWith('/') ? url+'index.html' : url;
    await readFile(resolve(root,'.'+decodeURIComponent(filename)));
  }
}
const reading=await readFile(resolve(root,'essays/gpt7-will-have-arms/index.html'),'utf8');
const article=(await readFile(new URL('../content/essays/gpt7-will-have-arms/article.html',import.meta.url),'utf8')).trim();
const normalizedReading=process.env.SITE_BASE_PATH ? reading.replaceAll('src="'+process.env.SITE_BASE_PATH+'/', 'src="/') : reading;
assert.ok(normalizedReading.includes(article),'The full source article must survive publication');
assert.ok(reading.includes('December 2025') && reading.includes('September 2026'),'Original and adaptation dates');
const exportHtml=await readFile(new URL('../publishing/substack/gpt7-will-have-arms/reading-edition.html',import.meta.url),'utf8');
assert.ok(exportHtml.includes(article.replace(/src="\//g,`src="${site.url}/`)),'Substack edition is complete');
console.log('Passed: eight pages, public links/assets, metadata, full article, and full Substack export.');

const latest=await readFile(resolve(root,'films/capricious-god/index.html'),'utf8');
const script=await readFile(new URL('../content/films/capricious-god/script.md',import.meta.url),'utf8');
for(const paragraph of script.trim().split(/\n\s*\n/).slice(1)) assert.ok(latest.includes(paragraph),'Complete film script');
assert.ok(latest.includes('wswbqJNMFBw') && latest.includes('agent-intrusion-technical-timeline'),'Latest film and sources');

// ── The homepage opening and the films as tapes (October 2026) ──────────────
// Everything the homepage shows comes from src/data; the code-drawn art may only
// say what the data says. (Interaction, overflow and the player: check-browser.mjs.)
const { films, filmArtData } = await import('../src/data/films.mjs');
const { essays } = await import('../src/data/essays.mjs');
const { Script } = await import('node:vm');
const home=await readFile(resolve(root,'index.html'),'utf8');
const B=(process.env.SITE_BASE_PATH || '').replace(/\/$/,''); // GitHub Pages project prefix, if any
const strip=html=>html.replace(/<[^>]+>/g,'').replace(/&amp;/g,'&').replace(/\s+/g,' ').trim();
assert.ok(/<section class="opening" data-opening[^>]*>/.test(home) && home.includes('<canvas id="opening-canvas"'),'The opening mounts on the homepage');
for(const file of ['scripts/film-art.js','scripts/opening.js','scripts/screening.js']) {
  assert.ok(home.includes(`src="${B}/${file}"`),'Homepage loads '+file);
  new Script(await readFile(resolve(root,file),'utf8'),{filename:file}); // throws on a syntax error
}
const island=JSON.parse(home.match(/<script type="application\/json" id="paper-robots-films">([\s\S]*?)<\/script>/)[1].replaceAll('\\u003c','<'));
assert.deepEqual(island,filmArtData(site.name),'The art reads the film data the build published');
assert.deepEqual(island.order,films.map(f=>f.number),'Newest film first: the opening locks onto films[0]');
const sameWords=(a,b)=>a.toLowerCase().replace(/\s+/g,' ').trim()===b.toLowerCase().replace(/\s+/g,' ').trim();
const script02=await readFile(new URL('../content/films/capricious-god/script.md',import.meta.url),'utf8');
for(const film of films) {
  const L=film.art.lettering;
  assert.ok(sameWords(L.poster.join(' '),film.title) && sameWords(L.title.join(' '),film.title),'Poster and title card spell the title: '+film.slug);
  if(film.essay) {
    assert.ok(sameWords(L.short.join(' '),film.line),'The Short says the film line: '+film.slug);
    assert.ok(sameWords(L.thumb.join(' '),JSON.parse(await readFile(new URL('../content/essays/gpt7-will-have-arms/source.json',import.meta.url),'utf8')).title),'The thumbnail says the essay title: '+film.slug);
  } else {
    assert.ok(film.line.toLowerCase().includes(L.thumb.join(' ').toLowerCase()),'The thumbnail quotes the film line: '+film.slug);
    assert.ok(script02.toLowerCase().replace(/\s+/g,' ').includes(L.short.join(' ').toLowerCase()),'The Short quotes the script: '+film.slug);
  }
  assert.ok(/^\d{4}-\d{2}-\d{2}$/.test(film.published) && new Date(film.published+'T12:00Z').toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric',timeZone:'UTC'})===film.date,'Release date and its stamp agree: '+film.slug);
  // the opening's details for this tape, and its Watch button opening the screening room
  const copy=home.match(new RegExp(`<article class="opening-film" data-tape-copy="${film.number}"[^>]*>([\\s\\S]*?)</article>`));
  assert.ok(copy,'Opening details for tape '+film.number);
  for(const text of [film.title,film.line,film.duration,film.date]) assert.ok(strip(copy[1]).includes(strip(text)),`Opening shows ${text} for ${film.slug}`);
  assert.ok(copy[1].includes(`href="${B}${film.page}" data-screen-film="${film.id}"`),'Watch opens this film in place, or its page: '+film.slug);
  assert.ok(home.includes(`<button type="button" data-tape="${film.number}"`),'Tape button: '+film.slug);
  // its row in the films section
  const row=home.match(new RegExp(`<article class="tape-row" data-film-entry aria-labelledby="tape-${film.slug}">([\\s\\S]*?)</article>`));
  assert.ok(row,'Film row: '+film.slug);
  assert.ok(row[1].includes(`<a href="${B}${film.page}">${film.title}</a>`) && row[1].includes(`data-art="${film.art.renderer}" data-fmt="poster"`),'Row links to the film page beside its poster: '+film.slug);
  for(const text of [film.line,film.description,film.duration,film.date]) assert.ok(strip(row[1]).includes(strip(text)),`Row shows ${text} for ${film.slug}`);
  // the film page: in-page player, its code-drawn face, and how it was made
  const filmPage=await readFile(resolve(root,'.'+film.page,'index.html'),'utf8');
  assert.ok(filmPage.includes(`data-play-film="${film.id}"`) && filmPage.includes(`data-art="${film.art.renderer}" data-fmt="thumb"`),'Film page player: '+film.slug);
  assert.ok(filmPage.includes('Made, not generated') && ['poster','title','short'].every(fmt=>filmPage.includes(`data-art="${film.art.renderer}" data-fmt="${fmt}"`)) && filmPage.includes(`data-art="${film.art.cast.art}"`),'Film page shows how it was made: '+film.slug);
  assert.ok(filmPage.includes(`src="${B}/scripts/film-art.js"`) && filmPage.includes('id="paper-robots-films"'),'Film page loads the art and its data: '+film.slug);
}
assert.equal((home.match(/<article class="tape-row"/g)||[]).length,films.length,'One row per film');
assert.equal((home.match(/<article class="opening-film"/g)||[]).length,films.length,'One opening block per film');
assert.ok(home.includes('<dialog class="screening" data-screening'),'The screening room is on the homepage');
for(const essay of essays) assert.ok(home.includes(`<a href="${B}${essay.page}">${essay.title}</a>`),'Reading room row: '+essay.slug);
assert.ok(home.includes(`href="${site.youtube}"`) && home.includes(`href="${B}/feed.xml"`),'Follow: YouTube and RSS');
for(const path of paths) {
  const html=await readFile(resolve(root,'.'+path,'index.html'),'utf8');
  if(!site.substack) assert.ok(!/substack\.com/i.test(html),'No Substack link before a verified publication exists: '+path);
  assert.ok(!/patreon|ko-fi|buymeacoffee|paypal\.me|\/join\b/i.test(html),'Nonmonetized: '+path);
}
console.log(`Passed: the opening, ${films.length} film rows and pages, their code-drawn art data, the screening room, and the nonmonetized follow links.`);
