import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import site from '../site.config.mjs';
const root=fileURLToPath(new URL('../dist/',import.meta.url));
const paths=['/','/essays/','/films/','/about/','/follow/','/essays/gpt7-will-have-arms/','/films/capricious-god/','/films/robotics-revolution/'];
for(const path of paths) {
  const html=await readFile(resolve(root,'.'+path,'index.html'),'utf8');
  assert.equal((html.match(/<h1\b/g)||[]).length,1,'One clear heading: '+path);
  assert.ok(html.includes('rel="canonical"') && html.includes('og:image'),'Sharing metadata: '+path);
  assert.ok(!/Design study|publication has not been created|\{\{/.test(html),'No prototype copy: '+path);
  for(const [,url] of html.matchAll(/(?:src|href)="(\/[^"#?]*)[^\"]*"/g)) {
    // Deployment under a Pages project prefix is covered by the browser check.
    if(process.env.SITE_BASE_PATH) continue;
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
