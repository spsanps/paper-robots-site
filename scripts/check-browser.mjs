// Browser checks for the built site: every page at seven viewport sizes (errors,
// overflow, images, anchors, navigation), then the homepage opening, the films as tapes,
// the screening room, the film-page player, the About page's drawings, the essay's film,
// the folded pages' old URLs, reduced motion, repeat visits and no-JS reading.
// Usage: npm run build && npm run check:browser
// (or SITE_ORIGIN=http://127.0.0.1:4174 node scripts/check-browser.mjs against a running server)
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { films } from '../src/data/films.mjs';
import { removed } from '../src/data/redirects.mjs';

const base=(process.env.SITE_BASE_PATH || '').replace(/\/$/,'');
let server=null, origin=process.env.SITE_ORIGIN;
if(!origin) {
  const port=process.env.PORT || '4179';
  server=spawn(process.execPath,[fileURLToPath(new URL('./serve.mjs',import.meta.url))],{env:{...process.env,PORT:port},stdio:'ignore'});
  origin=`http://127.0.0.1:${port}`;
  for(let i=0;;i++) { try { await fetch(origin+'/'); break; } catch { if(i>50) throw new Error('Local server did not start'); await new Promise(r=>setTimeout(r,100)); } }
}
const paths=['/','/films/','/about/','/essays/gpt7-will-have-arms/','/films/capricious-god/','/films/robotics-revolution/','/404.html'];
const sizes=[[1920,1080],[1440,900],[1280,720],[768,1024],[390,844],[360,740],[320,640]];
const report=[];
const directory=new URL('../design/reviews/2026-10-03-subpages/',import.meta.url);
await mkdir(directory,{recursive:true});
const browser=await chromium.launch();
const watchErrors=page=>{ const errors=[]; page.on('pageerror',e=>errors.push(e.message)); page.on('console',m=>{ if(m.type()==='error') errors.push(m.text()); }); return errors; };
const localOnly=page=>page.route('**/*',route=>new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
const opening=page=>page.waitForFunction(()=>window.OPENING && window.OPENING.state().renders>0,null,{timeout:30000});
const drawn=(page,selector)=>page.waitForFunction(sel=>[...document.querySelectorAll(sel)].every(c=>{ if(!c.width) return false; const d=c.getContext('2d').getImageData(0,0,c.width,c.height).data; for(let i=3;i<d.length;i+=4*97) if(d[i]) return true; return false; }),selector,{timeout:60000});
try {
  for(const [width,height] of sizes) {
    const page=await browser.newPage({viewport:{width,height}});
    await localOnly(page);
    const errors=watchErrors(page);
    for(const path of paths) {
      const response=await page.goto(origin+base+path,{waitUntil:'load'});
      assert.equal(response.status(),200,path);
      if(path === '/') await opening(page);
      assert.equal(await page.locator('h1').count(),1,path);
      assert.deepEqual(errors,[],path+' at '+width);
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Overflow: '+path+' at '+width);
      const images=await page.locator('img').evaluateAll(imgs=>imgs.filter(i=>i.complete && !i.naturalWidth).map(i=>i.src));
      assert.deepEqual(images,[],'Images: '+path);
      const anchors=await page.locator('a[href^="#"]').evaluateAll(links=>links.filter(a=>a.hash.length>1 && !document.getElementById(decodeURIComponent(a.hash.slice(1)))).map(a=>a.hash));
      assert.deepEqual(anchors,[],'Anchors: '+path);
      for(const label of ['Films','Essays','About']) assert.ok(await page.getByRole('navigation',{name:'Main',exact:true}).getByRole('link',{name:label,exact:true}).isVisible(),'Visible navigation: '+path+' at '+width);
      report.push({path,width,height,title:await page.title()});
    }
    await page.close();
  }

  // The opening: it mounts and draws, Skip locks onto the newest film, the tapes switch
  // film, Watch opens the screening room in place, Pause stops the camera.
  for(const [width,height] of [[1440,900],[390,844]]) {
    const page=await browser.newPage({viewport:{width,height}});
    await localOnly(page);
    const errors=watchErrors(page);
    await page.goto(origin+base+'/',{waitUntil:'load'});
    await opening(page);
    assert.ok(await page.locator('#opening-canvas').evaluate(c=>c.width>0 && c.height>0 && c.getBoundingClientRect().height>=innerHeight*0.6),'The opening fills the first screen');
    assert.equal(await page.locator('iframe').count(),0,'Homepage waits for the viewer before loading YouTube');
    assert.equal(await page.locator('[data-tape]').count(),films.length,'One tape button per film');
    await page.getByRole('button',{name:'Skip intro'}).click();
    await page.waitForFunction(()=>document.querySelector('[data-opening]').classList.contains('is-locked'));
    assert.equal(await page.locator('[data-skip]').textContent(),'Replay intro','Skip becomes Replay');
    const visibleCopy=()=>page.locator('[data-tape-copy]:not([hidden])');
    assert.equal(await visibleCopy().getAttribute('data-tape-copy'),films[0].number,'The opening locks onto the newest film');
    assert.ok((await visibleCopy().innerText()).includes(films[0].title),'Newest film title beside the shot');
    for(const film of [...films.slice(1),films[0]]) {
      await page.locator(`[data-tape="${film.number}"]`).click();
      assert.equal(await visibleCopy().getAttribute('data-tape-copy'),film.number,'Tape switch shows '+film.slug);
      assert.equal(await page.locator(`[data-tape="${film.number}"]`).getAttribute('aria-pressed'),'true','Tape pressed: '+film.slug);
      assert.ok((await visibleCopy().innerText()).includes(film.line),'Film line follows the tape: '+film.slug);
      assert.equal(await page.evaluate(()=>window.OPENING.state().tape),film.number,'The camera plays tape '+film.number);
    }
    await page.locator(`[data-tape="${films[1].number}"]`).click();
    await visibleCopy().getByRole('link',{name:'Watch the film'}).click();
    assert.ok(await page.getByRole('dialog').isVisible(),'Screening opens in place');
    assert.ok((await page.locator('.screening iframe').getAttribute('src')).includes(`/${films[1].id}?`),'Screening plays the chosen film');
    await page.keyboard.press('Escape');
    await page.waitForFunction(()=>!document.querySelector('.screening iframe'));
    assert.equal(await page.locator('dialog[open]').count(),0,'Escape closes the screening and removes the player');
    await page.getByRole('button',{name:'Pause motion'}).click();
    assert.equal(await page.evaluate(()=>window.OPENING.state().paused),'user','Pause stops the camera');
    const stopped=await page.evaluate(()=>window.OPENING.state().renders);
    await page.waitForTimeout(600);
    assert.equal(await page.evaluate(()=>window.OPENING.state().renders),stopped,'Nothing draws while paused');
    await page.getByRole('button',{name:'Play motion'}).click();
    assert.equal(await page.evaluate(()=>window.OPENING.state().paused),null,'Play starts it again');
    // the films as tapes: each row's poster is drawn, and its title opens the film page
    assert.equal(await page.locator('#films [data-film-entry]').count(),films.length,'Every film has a row');
    await page.locator('#films').scrollIntoViewIfNeeded();
    await drawn(page,'#films canvas[data-fmt="poster"]');
    for(const film of films) assert.equal(await page.locator(`#tape-${film.slug} a`).getAttribute('href'),base+film.page,'Row links to '+film.slug);
    await page.locator(`#tape-${films[0].slug} a`).click();
    await page.waitForURL('**'+films[0].page);
    assert.deepEqual(errors,[],'No errors while using the opening at '+width);
    // coming back to the homepage in the same visit lands on the held shot
    await page.goto(origin+base+'/',{waitUntil:'load'});
    await opening(page);
    assert.ok(await page.evaluate(()=>document.documentElement.classList.contains('opening-seen') && window.OPENING.state().t>=5.5),'Returning in the same visit lands on the hold');
    await page.close();
  }

  // Film pages: the in-page player (its face drawn in code), chapters, script, how it's made.
  const page=await browser.newPage({viewport:{width:1280,height:900}});
  await localOnly(page);
  for(const film of films) {
    await page.goto(origin+base+film.page,{waitUntil:'load'});
    assert.equal(await page.locator('iframe').count(),0,'No unsolicited YouTube load');
    await drawn(page,'.film-player canvas');
    await page.locator('.made').scrollIntoViewIfNeeded();
    await drawn(page,'.made canvas');
    await page.getByRole('button',{name:'Play '+film.title,exact:true}).click();
    assert.ok((await page.locator('iframe').getAttribute('src')).startsWith('https://www.youtube-nocookie.com/embed/'+film.id),'Correct film activates: '+film.slug);
  }
  await page.goto(origin+base+'/films/capricious-god/',{waitUntil:'load'});
  await page.getByRole('link',{name:'Read the script',exact:false}).click();
  assert.ok(await page.locator('.film-script').isVisible(),'Script opens');
  await page.locator('[data-film-chapter="195"]').click();
  assert.ok((await page.locator('iframe').getAttribute('src')).includes('start=195'),'Chapter seeks in the correct film');
  await page.close();

  // The pages around the homepage: About's robot drawn in code (and in each film's hand),
  // the essay ending on its film, and the folded pages' old URLs landing where they went.
  const around=await browser.newPage({viewport:{width:1440,height:900}});
  await localOnly(around);
  const aroundErrors=watchErrors(around);
  await around.goto(origin+base+'/about/',{waitUntil:'load'});
  await drawn(around,'.about-robot canvas');
  await around.locator('.robot-hands').scrollIntoViewIfNeeded();
  await drawn(around,'.robot-hands canvas');
  assert.equal(await around.locator('.robot-hands a').count(),films.length,'About: the robot in each film\'s hand');
  assert.ok(await around.locator('#follow').getByRole('link',{name:'Follow on YouTube'}).isVisible(),'About carries Follow');
  await around.goto(origin+base+'/essays/gpt7-will-have-arms/',{waitUntil:'load'});
  await around.locator('.reading-film').scrollIntoViewIfNeeded();
  await drawn(around,'.reading-film canvas');
  for(const {from,to} of removed) {
    await around.goto(origin+base+from,{waitUntil:'load'});
    await around.waitForURL(url=>url.pathname+url.hash===base+to,{timeout:10000});
    const hash=to.split('#')[1];
    await around.waitForFunction(id=>{ const r=document.getElementById(id).getBoundingClientRect(); return r.top<innerHeight && r.bottom>0; },hash,{timeout:10000});
  }
  assert.deepEqual(aroundErrors,[],'No errors on About, the essay and the old URLs');
  await around.close();

  // Reduced motion: the held shot as a still, the details visible, motion offered, not forced.
  const quiet=await browser.newPage({reducedMotion:'reduce',viewport:{width:1440,height:900}});
  await localOnly(quiet);
  await quiet.goto(origin+base+'/',{waitUntil:'load'});
  await opening(quiet);
  assert.equal(await quiet.evaluate(()=>window.OPENING.state().paused),'reduced','Reduced motion shows a still');
  assert.equal(await quiet.locator('[data-motion]').textContent(),'Play motion','Motion is offered, not forced');
  await quiet.waitForFunction(()=>getComputedStyle(document.querySelector('.opening-films')).opacity==='1');
  await quiet.close();

  // Without JavaScript: the newest film's details, every film and the full essay stay readable.
  const plain=await browser.newPage({javaScriptEnabled:false,viewport:{width:390,height:900}});
  await plain.goto(origin+base+'/');
  assert.equal(await plain.locator('#films [data-film-entry]').count(),films.length,'Every film linked without JavaScript');
  assert.ok(await plain.locator(`[data-tape-copy="${films[0].number}"] a.btn-play`).isVisible(),'Watch is a plain link without JavaScript');
  assert.equal(await plain.locator(`[data-tape-copy="${films[0].number}"] a.btn-play`).getAttribute('href'),base+films[0].page,'Watch falls back to the film page');
  await plain.goto(origin+base+'/essays/gpt7-will-have-arms/');
  assert.ok((await plain.locator('article.publication-prose').innerText()).length>30000,'Full essay readable without JavaScript');
  await plain.goto(origin+base+'/about/');
  assert.ok(await plain.locator('#follow').isVisible() && !(await plain.locator('.about-robot').isVisible()),'About reads without JavaScript (the drawings step aside)');
  await plain.goto(origin+base+'/follow/');
  await plain.waitForURL(url=>url.pathname+url.hash===base+'/about/#follow',{timeout:10000}); // the stub's meta refresh
  await plain.close();

  await writeFile(new URL('browser-checks.json',directory),JSON.stringify({checks:report,sizes:sizes.map(s=>s.join('x')),opening:true,tapes:true,screening:true,filmPlayer:true,about:true,essayFilm:true,redirects:removed.map(r=>r.from+' -> '+r.to),reducedMotion:true,repeatVisit:true,noJavaScriptReading:true},null,2)+'\n');
  console.log(`Passed ${report.length} page/viewport checks (errors, overflow, images, anchors, navigation), the opening, tapes, screening room, film players, About's drawings, the essay's film, ${removed.length} old URLs, reduced motion, repeat visits, and reading without JavaScript.`);
} finally { await browser.close(); server?.kill(); }
