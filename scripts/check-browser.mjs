import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';
const origin=process.env.SITE_ORIGIN || 'http://127.0.0.1:4174';
const base=(process.env.SITE_BASE_PATH || '').replace(/\/$/,'');
const paths=['/','/essays/','/films/','/about/','/follow/','/essays/gpt7-will-have-arms/','/films/capricious-god/','/films/robotics-revolution/'];
const report=[];
const directory=new URL('../design/reviews/2026-09-09-cinema/',import.meta.url);
await mkdir(directory,{recursive:true});
const browser=await chromium.launch();
try {
  for(const width of [1440,390,320]) {
    const page=await browser.newPage({viewport:{width,height:1000}});
    await page.route('**/*',route=>new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    for(const path of paths) {
      const response=await page.goto(origin+base+path,{waitUntil:'networkidle'});
      assert.equal(response.status(),200,path);
      assert.equal(await page.locator('h1').count(),1,path);
      assert.deepEqual(errors,[],path);
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Overflow: '+path+' at '+width);
      const images=await page.locator('img').evaluateAll(imgs=>imgs.filter(i=>i.complete && !i.naturalWidth).map(i=>i.src));
      assert.deepEqual(images,[],'Images: '+path);
      const anchors=await page.locator('a[href^="#"]').evaluateAll(links=>links.filter(a=>a.hash.length>1 && !document.getElementById(decodeURIComponent(a.hash.slice(1)))).map(a=>a.hash));
      assert.deepEqual(anchors,[],'Anchors: '+path);
      report.push({path,width,title:await page.title()});
      if(path === '/' || (path === '/essays/gpt7-will-have-arms/' && width !== 320)) await page.screenshot({path:new URL((path === '/'?'homepage':'reading-edition')+'-'+width+'.png',directory).pathname,fullPage:path === '/'});
    }
    await page.goto(origin+base+'/');
    assert.equal(await page.locator('iframe').count(),0,'Homepage waits for the viewer before loading YouTube');
    await page.getByRole('button',{name:'Pause background preview'}).click();
    assert.ok(await page.locator('.cinema-scene.is-current video').evaluate(video=>video.paused),'Preview can pause');
    await page.locator('[data-select-scene="1"]').click();
    assert.equal(await page.locator('[data-feature]:not([hidden])').getAttribute('data-film-id'),'kzvqj4jurW0','Film switch changes the story and playback target');
    await page.locator('[data-feature]:not([hidden]) [data-cinema-play]').click();
    assert.ok(await page.getByRole('dialog').isVisible(),'Screening opens in place');
    assert.ok((await page.locator('.cinema-screen iframe').getAttribute('src')).includes('/kzvqj4jurW0?'),'Screening plays the selected film');
    await page.keyboard.press('Escape');
    await page.waitForFunction(()=>!document.querySelector('.cinema-screen iframe'));
    assert.equal(await page.locator('dialog[open]').count(),0,'Escape closes the screening and removes the player');
    await page.goto(origin+base+'/films/');
    assert.equal(await page.locator('[data-film-entry]').count(),2,'Both films discoverable');
    for(const [slug,title,id] of [['robotics-revolution','The Coming Robotics Revolution','kzvqj4jurW0'],['capricious-god','How to Please a Capricious God','wswbqJNMFBw']]) {
      await page.goto(origin+base+'/films/'+slug+'/');
      assert.equal(await page.locator('iframe').count(),0,'No unsolicited YouTube load');
      await page.getByRole('button',{name:'Play '+title,exact:true}).click();
      assert.ok((await page.locator('iframe').getAttribute('src')).startsWith('https://www.youtube-nocookie.com/embed/'+id),'Correct film activates');
    }
    await page.getByRole('link',{name:'Read the script',exact:false}).click();
    assert.ok(await page.locator('.film-script').isVisible(),'Script opens');
    await page.locator('[data-film-chapter="195"]').click();
    assert.ok((await page.locator('iframe').getAttribute('src')).includes('start=195'),'Chapter seeks in the correct film');
    for(const label of ['Films','Essays','About','Follow']) assert.ok(await page.getByRole('navigation',{name:'Main',exact:true}).getByRole('link',{name:label,exact:true}).isVisible(),'Visible mobile navigation');
    await page.close();
  }
  const quiet=await browser.newPage({reducedMotion:'reduce'});
  await quiet.goto(origin+base+'/',{waitUntil:'networkidle'});
  assert.equal(await quiet.locator('video[src]').count(),0,'Reduced motion starts with still artwork and no preview download');
  await quiet.close();
  const page=await browser.newPage({javaScriptEnabled:false,viewport:{width:390,height:900}});
  await page.goto(origin+base+'/');
  assert.equal(await page.locator('.cinema-posters [data-film-entry]').count(),2,'Both films remain linked without JavaScript');
  assert.ok(await page.locator('[data-feature="0"] [data-cinema-play]').isVisible(),'First film has a normal link without JavaScript');
  await page.goto(origin+base+'/essays/gpt7-will-have-arms/');
  assert.ok((await page.locator('article').innerText()).length>30000,'Full essay readable without JavaScript');
  await page.close();
  await writeFile(new URL('browser-checks.json',directory),JSON.stringify({checks:report,noJavaScriptReading:true,filmActivation:true},null,2)+'\n');
  console.log('Passed 24 page/viewport checks, anchors, images, keyboard navigation, film activation, and reading without JavaScript.');
} finally { await browser.close(); }
