import site from '../../site.config.mjs';
export const esc = value => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
export const arrow = '<span aria-hidden="true">↗</span>';
// A primary action is the ink pill (.btn); a quiet one is an underlined link.
export const action = (href,label,quiet=false) => `<a class="${quiet ? 'text-link' : 'btn'}" href="${esc(href)}">${label} ${arrow}</a>`;
// [href, label, the paths it is current for]. Essays live in the homepage's reading
// room until there are several (/essays/ redirects there; see vercel.json).
const navItems = [['/films/','Films','/films/'],['/#reading','Essays','/essays/'],['/about/','About','/about/']];
// Follow copy, shared by the homepage and the About page. YouTube and RSS only
// until a verified Substack publication origin is set in site.config.mjs.
export const follow = {
  eyebrow: 'More from Paper Robots',
  title: 'Follow the films. Stay for the ideas.',
  lede: site.substack ? 'Get the complete essays in your inbox. Free to read, at the pace the ideas take.' : 'Follow Paper Robots on YouTube for the films, or add the essays to your feed reader.',
  primary: site.substack ? [site.substack + '/subscribe', 'Read & subscribe on Substack'] : [site.youtube, 'Follow on YouTube'],
};
export const followLinks = () => `<a href="${follow.primary[0]}">${follow.primary[1]} ${arrow}</a>${site.substack ? `<a href="${site.youtube}">Follow on YouTube ${arrow}</a>` : ''}<a href="/feed.xml">Follow by RSS ${arrow}</a>`;
// A removed page: Vercel answers with the redirect in vercel.json before this file is
// reached. This stub keeps the old URL working on the GitHub Pages fallback and locally.
// `base` is the GitHub Pages project prefix, if any.
export const redirectStub = (to, label, base = '') => `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${esc(label)} — Paper Robots</title><link rel="canonical" href="${site.url + to}"><meta http-equiv="refresh" content="0; url=${base + to}"><script>location.replace(${JSON.stringify(base + to)})</script></head><body><p>This page has moved: <a href="${base + to}">${esc(label)}</a>.</p></body></html>`;
// head: page-specific styles, data and scripts. mark: the wordmark's picture
// (the painted robot by default; the homepage draws its head in code).
const paintedMark = '<img src="/assets/identity/paper-robot.webp" alt="" width="46" height="46">';
export function layout({title,description=site.description,path='/',content,canonical,image='/assets/identity/social-cover.jpg',type='website',schema,noindex=false,webAnalytics=false,head='',bodyClass='',mark=paintedMark,after='',themeColor='#f9f3e7'}) {
  // Vercel serves this endpoint; local builds and the Pages fallback omit it.
  const analytics = webAnalytics ? '<script>window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };</script><script defer src="/_vercel/insights/script.js"></script>' : '';
  const links = navItems.map(([href,label,current])=>`<a href="${href}"${path.startsWith(current) ? ' aria-current="page"' : ''}>${label}</a>`).join('');
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><meta name="theme-color" content="${themeColor}"><title>${esc(title)}</title><meta name="description" content="${esc(description)}"><link rel="canonical" href="${canonical || site.url + path}">${noindex ? '<meta name="robots" content="noindex">' : ''}<meta property="og:site_name" content="Paper Robots"><meta property="og:type" content="${type}"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${site.url + path}"><meta property="og:image" content="${site.url + image}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(description)}"><meta name="twitter:image" content="${site.url + image}"><link rel="icon" href="/assets/identity/paper-robot.webp" type="image/webp"><link rel="alternate" type="application/rss+xml" title="Paper Robots" href="/feed.xml"><script>document.documentElement.classList.add('js')</script><link rel="stylesheet" href="/styles/site.css"><script defer src="/scripts/site.js"></script>${head}${schema ? `<script type="application/ld+json">${JSON.stringify(schema).replaceAll('<','\\u003c')}</script>` : ''}${analytics}</head><body class="brand-paper${bodyClass ? ' ' + bodyClass : ''}"><a class="skip" href="#main">Skip to content</a><header class="site-header shell"><a class="wordmark" href="/">${mark}Paper Robots<span class="wordmark-dot">.</span></a><nav class="desktop-nav" aria-label="Main">${links}</nav></header>${content}<footer class="site-footer shell"><div><strong>Paper Robots</strong><p>AI, robots & possible futures.<br>Essays and films by San Kala.</p></div><nav aria-label="Footer"><a href="${site.authorUrl}/">About the author ${arrow}</a><a href="${site.youtube}">YouTube ${arrow}</a>${site.substack ? `<a href="${site.substack}">Substack ${arrow}</a>` : ''}<a href="/feed.xml">RSS ${arrow}</a><a href="mailto:san@sankala.me">Get in touch ${arrow}</a></nav><small>Free to read and watch.</small></footer>${after}</body></html>`;
}
