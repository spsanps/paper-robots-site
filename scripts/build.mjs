import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import site from '../site.config.mjs';
import { layout, action, arrow, esc, followSection } from '../src/templates/layout.mjs';

const root = fileURLToPath(new URL('../',import.meta.url));
const dist = resolve(root,'dist');
const base = (process.env.SITE_BASE_PATH || '').replace(/\/$/,'');
if(base && !/^\/[a-zA-Z0-9_-]+$/.test(base)) throw new Error('Invalid SITE_BASE_PATH');
if(site.substack && !/^https:\/\/[a-z0-9-]+\.substack\.com$/.test(site.substack)) throw new Error('Use the verified Substack publication origin without a trailing slash.');
await rm(dist,{recursive:true,force:true});
await cp(resolve(root,'public'),dist,{recursive:true});
await cp(resolve(root,'src/styles'),resolve(dist,'styles'),{recursive:true});
await cp(resolve(root,'src/scripts'),resolve(dist,'scripts'),{recursive:true});
if(base) {
  for(const file of ['site.css','publication.css']) {
    const path=resolve(dist,'styles',file);
    const css=await readFile(path,'utf8');
    await writeFile(path,css.replace(/url\((['"]?)\//g,`url($1${base}/`));
  }
}
const paths=[];
async function page(path,title,content,extra={}) {
  const document=layout({path,title,content,...extra,noindex:extra.noindex || Boolean(base)}).replace(/((?:href|src)=['"])\/(?!\/)/g,`$1${base}/`);
  const output=resolve(dist,path === '/404.html' ? '404.html' : '.'+path,'index.html');
  const target=path === '/404.html' ? resolve(dist,'404.html') : output;
  await mkdir(dirname(target),{recursive:true});
  await writeFile(target,document);
  if(!extra.noindex) paths.push(path);
}
const readSource = file => readFile(resolve(root,'src/pages',file),'utf8');
const follow=followSection();
await page('/','Paper Robots — AI, robots & possible futures',(await readSource('home.html')).replace('{{FOLLOW_SECTION}}',follow),{
  schema: {'@context':'https://schema.org','@type':'WebSite',name:site.name,url:site.url,description:site.description,publisher:{'@type':'Person',name:site.author,url:site.authorUrl}},
});
await page('/about/','About — Paper Robots',await readSource('about.html'));
const essayCard=`<article class="published-essay"><a class="film-art" href="/essays/gpt7-will-have-arms/"><img src="/assets/identity/many-arms-film.webp" width="960" height="540" alt="GPT-7 Will Have Arms: a robot in a screen reaches into the world with many arms."></a><div><span class="eyebrow">01 / AI & robotics · Essay + film</span><h3>GPT-7 Will<br>Have Arms</h3><p>A forecast about foundation models and robotics: one model, many bodies, and the changes that might follow.</p><div class="actions">${action('/essays/gpt7-will-have-arms/','Read the essay')}${action('/films/','Watch the film',true)}</div><small>Essay: December 2025 · Film: September 2026</small></div></article>`;
await page('/essays/','Essays — Paper Robots',`<main id="main" class="shell"><header class="page-heading"><span class="eyebrow">The reading room</span><h1>Follow<br><em>an idea.</em></h1><p>Arguments, imagined futures, and the sources behind them. Start with the first essay.</p></header><div class="edition-list">${essayCard}</div></main>`);
const filmPlayer=`<div class="film-player"><button type="button" data-play-film aria-label="Play The Coming Robotics Revolution"><img src="/assets/identity/many-arms-film.webp" alt="" width="1280" height="720"><span>▶ Play film · 7:29</span></button></div>`;
await page('/films/','The Coming Robotics Revolution — Paper Robots',`<main id="main" class="shell"><header class="page-heading"><span class="eyebrow">Paper Robots / Film 01</span><h1>The Coming<br><em>Robotics Revolution.</em></h1><p>The first animated essay. What happens when foundation models get bodies?</p></header>${filmPlayer}<div class="film-description publication-prose"><p>Based on <a href="/essays/gpt7-will-have-arms/">GPT-7 Will Have Arms</a>, written by San Kala in December 2025. Film published September 6, 2026.</p><p>Read the complete essay for the argument, sources, and original forecast. The film is another way into the same idea.</p><div class="actions">${action(site.filmUrl,'Open on YouTube')}${action('/essays/gpt7-will-have-arms/','Read the essay',true)}</div></div></main>`);
await page('/follow/','Follow — Paper Robots',`<main id="main"><header class="page-heading shell"><span class="eyebrow">Stay curious</span><h1>Keep a<br><em>thread open.</em></h1><p>Essays to read, films to watch, and the next idea when it’s ready.</p></header>${follow}</main>`);
const article=(await readFile(resolve(root,'content/essays/gpt7-will-have-arms/article.html'),'utf8')).trim();
const source=JSON.parse(await readFile(resolve(root,'content/essays/gpt7-will-have-arms/source.json'),'utf8'));
const sections=[...article.matchAll(/<section id="([^"]+)">\s*<h2>([\s\S]*?)<\/h2>/g)].map(m=>({id:m[1],title:m[2].replace(/<[^>]+>/g,'')}));
const toc=`<aside class="reading-toc"><details open><summary>In this essay</summary><nav aria-label="Essay contents"><ol>${sections.map(s=>`<li><a href="#${s.id}">${s.title}</a></li>`).join('')}</ol></nav></details></aside>`;
const reading=`<main id="main" class="shell"><header class="reading-heading"><span class="eyebrow">Paper Robots / Essay 01 · AI & robotics</span><h1>GPT-7 Will<br><em>Have Arms.</em></h1><p>The Coming Convergence of Foundation Models and Robotics</p><div class="edition-byline"><img src="/assets/identity/san-kala.webp" width="40" height="48" alt=""><span>By <a href="${site.authorUrl}">San Kala</a><br>December 2025 · 28 min read</span></div><div class="reading-links"><a href="/films/">Watch the film ${arrow}</a><a href="${source.canonical}">Open the interactive edition ${arrow}</a><a href="/essays/gpt7-will-have-arms/manuscript.md">Markdown ${arrow}</a></div></header><aside class="edition-note">This essay was written in December 2025. “GPT-7 Will Have Arms” is a forecast about where foundation models and robotics could go. The film adaptation followed in September 2026. The <a href="${source.canonical}">original interactive edition</a> remains on San’s site.</aside><div class="reader-layout">${toc}<article class="publication-prose">${article}<footer class="reading-end"><p>Written by <a href="${site.authorUrl}">San Kala</a>. Corrections or questions? <a href="mailto:san@sankala.me">Get in touch.</a></p>${action('/follow/','Follow Paper Robots')}</footer></article></div></main>`;
await page('/essays/gpt7-will-have-arms/','GPT-7 Will Have Arms — Paper Robots',reading,{canonical:source.canonical,type:'article',image:'/assets/identity/many-arms-film.webp',description:'The coming convergence of foundation models and robotics. An essay by San Kala, written in December 2025 and adapted into the first Paper Robots film.',schema:{'@context':'https://schema.org','@type':'Article',headline:source.title,author:{'@type':'Person',name:site.author,url:site.authorUrl},datePublished:'2025-12',mainEntityOfPage:source.canonical,image:site.url+'/assets/identity/many-arms-film.webp'}});
await cp(resolve(root,'content/essays/gpt7-will-have-arms/manuscript.md'),resolve(dist,'essays/gpt7-will-have-arms/manuscript.md'));
await page('/404.html','Page not found — Paper Robots',`<main id="main" class="shell"><header class="page-heading"><span class="eyebrow">404 / A loose page</span><h1>Something<br><em>went astray.</em></h1><p>Try the reading room, or return to the beginning.</p><div class="actions">${action('/essays/','Browse the essays')}${action('/','Back home',true)}</div></header></main>`,{noindex:true});
await writeFile(resolve(dist,'sitemap.xml'),`<?xml version="1.0" encoding="utf-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.filter(p=>p !== '/essays/gpt7-will-have-arms/').map(p=>`<url><loc>${site.url+p}</loc></url>`).join('')}</urlset>`);
await writeFile(resolve(dist,'robots.txt'),`User-agent: *\n${base ? 'Disallow: /' : 'Allow: /'}\nSitemap: ${site.url}/sitemap.xml\n`);
await writeFile(resolve(dist,'feed.xml'),`<?xml version="1.0" encoding="utf-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>Paper Robots</title><link>${site.url}/</link><description>${esc(site.description)}</description><language>en</language><atom:link href="${site.url}/feed.xml" rel="self" type="application/rss+xml"/><item><title>GPT-7 Will Have Arms</title><link>${site.url}/essays/gpt7-will-have-arms/</link><guid isPermaLink="false">paper-robots:gpt7-will-have-arms</guid><description>The coming convergence of foundation models and robotics. Essay: December 2025. Film: September 2026.</description></item></channel></rss>`);
await writeFile(resolve(dist,'llms.txt'),`# Paper Robots\n\n${site.description}\n\n- [GPT-7 Will Have Arms](${site.url}/essays/gpt7-will-have-arms/): Complete reading edition. Original essay December 2025.\n- [Manuscript](${site.url}/essays/gpt7-will-have-arms/manuscript.md)\n- [Film](${site.filmUrl}): The Coming Robotics Revolution, September 2026.\n- [Author](${site.authorUrl}/)\n`);
const substackDir=resolve(root,'publishing/substack/gpt7-will-have-arms');
await mkdir(substackDir,{recursive:true});
const exportArticle=article.replace(/src="\//g,`src="${site.url}/`);
await writeFile(resolve(substackDir,'reading-edition.html'),`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex"><title>GPT-7 Will Have Arms — Substack reading edition</title><style>body{max-width:740px;margin:50px auto;padding:0 24px;font:19px/1.8 Georgia,serif;color:#253e35}img{max-width:100%;height:auto}table{display:block;overflow:auto;font-size:14px}td,th{padding:10px;border:1px solid #ccc}a{color:#1e557b}h1,h2,h3{line-height:1.2}h2{margin-top:48px}</style></head><body><h1>GPT-7 Will Have Arms</h1><p><strong>The Coming Convergence of Foundation Models and Robotics</strong></p><p>By San Kala · Originally published December 2025.</p><p>This is the first Paper Robots essay, now adapted into an animated film. <a href="${site.filmUrl}">Watch The Coming Robotics Revolution</a>, or read the full argument below. The <a href="${source.canonical}">interactive edition</a> has the charts and sidebars.</p>${exportArticle}<hr><p>Written by <a href="${site.authorUrl}">San Kala</a>. Read and watch more at <a href="${site.url}">Paper Robots</a>.</p></body></html>`);
await cp(resolve(root,'content/essays/gpt7-will-have-arms/manuscript.md'),resolve(substackDir,'manuscript.md'));
await cp(resolve(root,'public/assets/essays/gpt7'),resolve(substackDir,'images'),{recursive:true});
console.log(`Built ${paths.length} publication pages, 404, RSS, sitemap, and the full Substack reading edition${base ? ' (preview path '+base+')' : ''}.`);
