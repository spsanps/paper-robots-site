/* ═══════════════════════════════════════════════════════════════════════════
   scheduler.js — one scheduler for every code-drawn canvas on a page
   (posters, thumbnails, title cards, Shorts loops, the wordmark head).
   - Canvases declare data-art (renderer) and data-fmt (format).
   - Builds are generators, sliced across frames; nearest canvases build first.
     On the homepage they wait for the opening's own title card (or 6 s).
   - Only canvases on screen animate, and only for a while: after a play budget
     each settles on its composed still (at the same phase, so there is no
     jump) and stops. Scrolling away and back plays it again.
   - The opening's Pause motion (event pr:motion) pauses them too.
   - Reduced motion: every canvas shows its composed still.
   - The frame loop sleeps when there is nothing to build or animate.
   - Review hook: ?t=<s> freezes every canvas at that moment and sets
     window.__ready once all are drawn.
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  const ART = {};
  if (typeof FILM1 !== 'undefined') ART.film1 = FILM1;
  if (typeof FILM2 !== 'undefined') ART.film2 = FILM2;
  if (typeof STRIP !== 'undefined') Object.assign(ART, STRIP);
  const q = new URLSearchParams(location.search);
  const fixedT = q.has('t') ? parseFloat(q.get('t')) || 0 : null;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const DPR = Math.min(2, window.devicePixelRatio || 1);
  const items = [];
  const t0 = performance.now();
  let userPaused = false, raf = 0;

  const stillTime = R => (R.still !== undefined ? R.still : 3.2);
  const loopOf = R => R.loop || 8;
  // seconds of on-screen motion before a canvas settles on its still
  const budgetOf = it => (it.fmt === 'title' || it.fmt === 'short' ? 16 : 8);
  const clock = it => (fixedT !== null ? fixedT : reduced.matches || it.settled ? stillTime(it.R) : (performance.now() - t0) / 1000);

  function setup(el) {
    const R = ART[el.dataset.art];
    if (!R) return;
    const it = { el, R, fmt: el.dataset.fmt || '', near: false, visible: false, state: null, gen: null, drawnOnce: false, last: -1, size: [0, 0], played: 0, settling: false, settled: false, lastPhase: null };
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
  const byEl = el => items.find(i => i.el === el);
  const io = new IntersectionObserver(entries => {
    for (const e of entries) { const it = byEl(e.target); if (it) it.near = e.isIntersecting; }
    wake();
  }, { rootMargin: '700px 0px' });
  const vo = new IntersectionObserver(entries => {
    for (const e of entries) {
      const it = byEl(e.target); if (!it) continue;
      // coming back into view plays the loop again
      if (e.isIntersecting && !it.visible && it.settled) { it.settled = false; it.settling = false; it.played = 0; it.lastPhase = null; }
      it.visible = e.isIntersecting;
    }
    wake();
  });

  // on the homepage, the opening's card builds first
  const hasOpening = Boolean(document.querySelector('[data-opening]'));
  let openingDone = !hasOpening || fixedT !== null;
  if (!openingDone) {
    const waitOpening = () => { if (window.OPENING_READY) window.OPENING_READY.then(() => { openingDone = true; wake(); }); else setTimeout(waitOpening, 50); };
    waitOpening();
    setTimeout(() => { openingDone = true; wake(); }, 6000);
  }
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
      if (r.done) { it.state = r.value; it.gen = null; draw(it); }
    }
  }
  function draw(it, t = clock(it)) {
    it.R.draw(it.state, it.el.getContext('2d'), t);
    it.drawnOnce = true; it.last = performance.now();
  }
  const animates = it => it.state && it.visible && it.R.animated && !it.settled && !userPaused && !reduced.matches && fixedT === null;

  function frame() {
    raf = 0;
    if (document.hidden) return;
    buildSlice(fixedT !== null ? 40 : 12);
    const now = performance.now();
    for (const it of items) {
      if (!animates(it)) continue;
      const fps = (typeof it.R.fps === 'function' ? it.R.fps(it.fmt) : it.R.fps) || 24;
      const step = 1000 / fps;
      if (now - it.last < step - 2) continue;
      if (it.last > 0) it.played += Math.min(now - it.last, 250) / 1000;
      const t = (now - t0) / 1000;
      if (it.played >= budgetOf(it)) {
        // settle exactly on the still's phase of the loop, so the picture doesn't jump
        const L = loopOf(it.R), ph = (((t - stillTime(it.R)) % L) + L) % L;
        if (it.lastPhase !== null && ph < it.lastPhase) { it.settled = true; draw(it, stillTime(it.R)); continue; }
        it.lastPhase = ph;
      }
      draw(it, t);
    }
    if (fixedT !== null && !window.__ready && items.length && items.every(i => i.drawnOnce) && window.__openingReady !== false) {
      window.__ready = true; document.documentElement.dataset.ready = '1';
    }
    if (items.some(i => i.gen) || nextToBuild() || items.some(animates) || (fixedT !== null && !window.__ready)) wake();
  }
  function wake() { if (!raf && !document.hidden) raf = requestAnimationFrame(frame); }

  function stillAll() { for (const it of items) if (it.state) draw(it); }
  async function start() {
    try {
      await Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 2500))]);
      await Promise.all([document.fonts.load('700 40px Fraunces'), document.fonts.load('600 40px Fraunces'), document.fonts.load('500 20px "DM Sans"')]);
    } catch (e) { /* fonts fall back */ }
    for (const el of document.querySelectorAll('canvas[data-art]')) setup(el);
    for (const it of items) { io.observe(it.el); vo.observe(it.el); }
    document.addEventListener('visibilitychange', wake);
    document.addEventListener('pr:motion', e => { userPaused = Boolean(e.detail && e.detail.paused); wake(); });
    reduced.addEventListener?.('change', () => { stillAll(); wake(); });
    let rt = 0;
    addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { for (const it of items) size(it); wake(); }, 250); });
    if (!items.length && fixedT !== null) {
      const waitReady = () => { if (window.__openingReady !== false) window.__ready = true; else setTimeout(waitReady, 50); };
      waitReady();
    }
    wake();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
