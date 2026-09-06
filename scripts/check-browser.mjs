import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';
const origin=process.env.SITE_ORIGIN || 'http://127.0.0.1:4174';
const base=(process.env.SITE_BASE_PATH || '').replace(/\/$/,'');
const paths=['/','/essays/','/films/','/about/','/follow/','/essays/gpt7-will-have-arms/'];
const report=[];
const directory=new URL('../design/reviews/2026-09-launch/',import.meta.url);
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
    await page.goto(origin+base+'/films/');
    assert.equal(await page.locator('iframe').count(),0,'No third-party player loaded before consent to play');
    await page.getByRole('button',{name:'Play The Coming Robotics Revolution'}).click();
    assert.ok((await page.locator('iframe').getAttribute('src')).startsWith('https://www.youtube-nocookie.com/embed/kzvqj4jurW0'),'Film activates');
    if(width<700) {
      await page.getByText('Menu +',{exact:true}).click();
      await page.getByText('Menu +',{exact:true}).press('Escape');
      assert.equal(await page.locator('.mobile-menu').getAttribute('open'),null,'Keyboard menu');
    }
    await page.close();
  }
  const page=await browser.newPage({javaScriptEnabled:false,viewport:{width:390,height:900}});
  await page.goto(origin+base+'/essays/gpt7-will-have-arms/');
  assert.ok((await page.locator('article').innerText()).length>30000,'Full essay readable without JavaScript');
  await page.close();
  await writeFile(new URL('browser-checks.json',directory),JSON.stringify({checks:report,noJavaScriptReading:true,filmActivation:true},null,2)+'\n');
  console.log('Passed 18 page/viewport checks, anchors, images, keyboard navigation, film activation, and reading without JavaScript.');
} finally { await browser.close(); }
