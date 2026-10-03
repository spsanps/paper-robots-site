/* ═══════════════════════════════════════════════════════════════════════════
   main.js — one scheduler for every canvas on the page (copied from the
   sankala.me film-kit study; it now waits for the opening's first card).
   - Canvases declare data-art (renderer) and data-fmt (format).
   - Builds are generators, sliced across frames; nearest canvases build first.
   - Only canvases on screen animate. ?t=<s> freezes every canvas at that
     moment and sets window.__ready once all are drawn.
   - Reduced motion: every canvas shows a composed still.
   ═══════════════════════════════════════════════════════════════════════════ */
'use strict';
(function () {
  const ART = {};
  if (typeof FILM1 !== 'undefined') ART.film1 = FILM1;
  if (typeof FILM2 !== 'undefined') ART.film2 = FILM2;
  if (typeof STRIP !== 'undefined') Object.assign(ART, STRIP);
  const q = new URLSearchParams(location.search);
  const fixedT = q.has('t') ? parseFloat(q.get('t')) || 0 : null;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const DPR = Math.min(2, window.devicePixelRatio || 1);
  const items = [];
  const t0 = performance.now();
  let paused = document.hidden;

  function stillTime(R) { return R.still !== undefined ? R.still : 3.2; }
  function clock(R) {
    if (fixedT !== null) return fixedT;
    if (reduced) return stillTime(R);
    return (performance.now() - t0) / 1000;
  }

  function setup(el) {
    const R = ART[el.dataset.art];
    if (!R) return;
    const it = { el, R, fmt: el.dataset.fmt || '', near: false, visible: false, state: null, gen: null, drawnOnce: false, last: -1, size: [0, 0] };
    items.push(it);
    size(it);
  }
  function size(it) {
    const r = it.el.getBoundingClientRect();
    const W = Math.max(2, Math.round(r.width * DPR)), H = Math.max(2, Math.round(r.height * DPR));
    if (W === it.size[0] && H === it.size[1]) return false;
    it.size = [W, H]; it.el.width = W; it.el.height = H;
    it.state = null; it.gen = null; it.drawnOnce = false;
    return true;
  }

  // visibility
  const io = new IntersectionObserver(entries => {
    for (const e of entries) { const it = items.find(i => i.el === e.target); if (it) it.near = e.isIntersecting; }
  }, { rootMargin: '700px 0px' });
  const vo = new IntersectionObserver(entries => {
    for (const e of entries) { const it = items.find(i => i.el === e.target); if (it) it.visible = e.isIntersecting; }
  }, { rootMargin: '0px' });

  // the opening's own card builds first; everything but the wordmark waits for it (or 6 s)
  let openingDone = !window.OPENING_READY || fixedT !== null;
  if (!openingDone) { window.OPENING_READY.then(() => { openingDone = true; }); setTimeout(() => { openingDone = true; }, 6000); }
  function nextToBuild() {
    let best = null, bestD = Infinity;
    const vh = innerHeight;
    for (const it of items) {
      if (it.state) continue;
      if (!openingDone && it.el.dataset.art !== 'icon') continue;
      if (fixedT === null && !it.near) continue;
      const r = it.el.getBoundingClientRect(), d = Math.abs(r.top + r.height / 2 - vh / 2);
      if (d < bestD) { bestD = d; best = it; }
    }
    return best;
  }
  function buildSlice(budgetMs) {
    const until = performance.now() + budgetMs;
    while (performance.now() < until) {
      const it = items.find(i => i.gen) || nextToBuild();
      if (!it) return;
      if (!it.gen) it.gen = it.R.build(it.fmt, it.size[0], it.size[1]);
      const r = it.gen.next();
      if (r.done) { it.state = r.value; it.gen = null; draw(it, true); }
    }
  }
  function draw(it, force) {
    const t = clock(it.R);
    const ctx = it.el.getContext('2d');
    it.R.draw(it.state, ctx, t);
    it.drawnOnce = true; it.last = performance.now();
    if (it.el.id) for (const m of document.querySelectorAll(`canvas[data-mirror="${it.el.id}"]`)) mirror(m, it.el);
    void force;
  }
  function mirror(m, src) {
    const r = m.getBoundingClientRect(), W = Math.round(r.width * DPR), H = Math.round(r.height * DPR);
    if (m.width !== W || m.height !== H) { m.width = W; m.height = H; }
    const c = m.getContext('2d'); c.imageSmoothingQuality = 'high'; c.drawImage(src, 0, 0, W, H);
  }

  function frame() {
    if (!paused) {
      buildSlice(fixedT !== null ? 40 : 12);
      if (fixedT === null && !reduced) {
        const now = performance.now();
        for (const it of items) {
          if (!it.state || !it.visible || !it.R.animated) continue;
          const fps = (typeof it.R.fps === 'function' ? it.R.fps(it.fmt) : it.R.fps) || 24;
          if (now - it.last >= 1000 / fps - 2) draw(it);
        }
      }
      if (fixedT !== null && !window.__ready && items.length && items.every(i => i.drawnOnce) && (window.__openingReady !== false)) {
        window.__ready = true; document.documentElement.dataset.ready = '1';
      }
    }
    requestAnimationFrame(frame);
  }

  // saving a real-size PNG (works from a local file; hidden when framed)
  function setupSave(btn) {
    if (window.top !== window) { btn.hidden = true; return; }
    btn.addEventListener('click', () => {
      const [art, fmt, wh] = btn.dataset.save.split(':'), [W, H] = wh.split('x').map(Number), R = ART[art];
      const label = btn.textContent; btn.textContent = 'Rendering…'; btn.disabled = true;
      setTimeout(() => {
        const c = document.createElement('canvas'); c.width = W; c.height = H;
        const g = R.build(fmt, W, H); let r; do { r = g.next(); } while (!r.done);
        R.draw(r.value, c.getContext('2d'), stillTime(R));
        c.toBlob(b => {
          const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = `paper-robots-${art}-${fmt}-${W}x${H}.png`;
          document.body.appendChild(a); a.click(); a.remove();
          setTimeout(() => URL.revokeObjectURL(a.href), 4000);
          btn.textContent = label; btn.disabled = false;
        }, 'image/png');
      }, 30);
    });
  }

  async function start() {
    try { await Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 2500))]); await Promise.all([document.fonts.load('900 40px Fraunces'), document.fonts.load('600 40px Fraunces'), document.fonts.load('500 20px "DM Sans"')]); } catch (e) { /* fonts fall back */ }
    for (const el of document.querySelectorAll('canvas[data-art]')) setup(el);
    for (const it of items) { io.observe(it.el); vo.observe(it.el); }
    for (const b of document.querySelectorAll('[data-save]')) setupSave(b);
    document.addEventListener('visibilitychange', () => { paused = document.hidden; });
    let rt = 0;
    addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { for (const it of items) size(it); }, 250); });
    if (!items.length) {
      const wait = () => { if (window.__openingReady !== false) window.__ready = true; else setTimeout(wait, 50); };
      wait();
    }
    requestAnimationFrame(frame);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
