/* ═══════════════════════════════════════════════════════════════════════════
   tempera.js — FILM 02 · How to Please a Capricious God
   Process: egg tempera and water-gilded gold leaf on a gessoed panel.
     gold      #7b5717 → #c09238 → #efd48a   leaf squares, burnished, wrinkled
     bole      #9a3b22   red clay under the leaf; shows where the leaf tore
     cinnabar  #c8381f / lake #7d1b16          the eye
     azurite   #2b4a9a / deep #172659           frame fillets, spandrels, bands
     terre verte #6f7a4a / dark #3b4528         rocks; ochre #b8892f lights
     agent     #6b7a3c / light #a9b46f / shadow #39441f
     lead white #f1e8d2 · bone brown #2a1d18 (never black)
   Why: the film is about agents trying to please a god who watches. Gold-ground
   panel painting is the hand that was made for exactly that: the god is the gold,
   and here the eye opens *in* the gold. The agents are painted small, as donors
   at the foot of an altarpiece.
   Rules: paint is laid flat and modelled with fine hatching (tempera cannot
   blend); gold is never a gradient — light moves across burnished leaf; tooling
   is punched and incised; cracks run through paint and, faintly, the gold.
   Refuses: gradients standing in for gold, airbrush shading, pure black.
   ═══════════════════════════════════════════════════════════════════════════ */
'use strict';
const TEMP = {
  goldD: '#6f4c13', goldM: '#bf9237', goldL: '#f0d68c', bole: '#9a3b22',
  cin: '#c8381f', cinL: '#e5633d', lake: '#7d1b16', azur: '#2b4a9a', azurD: '#172659', azurL: '#5c7cc4',
  verte: '#6f7a4a', verteD: '#3b4528', ochre: '#b8892f', ochreL: '#d9b465',
  agent: '#6b7a3c', agentL: '#adb872', agentD: '#39441f',
  white: '#f1e8d2', brown: '#2a1d18', gesso: '#efe6d1',
};
const LIGHT = [-0.55, -0.83];

// ── layouts ───────────────────────────────────────────────────────────────────
function film2Layout(fmt, W, H) {
  const u = Math.min(W, H) / 600, L = { fmt, W, H, u };
  const D = filmData('film2'), T = D.lettering, credit = FILM_DATA.name + '  ·  FILM ' + D.number;
  if (fmt === 'poster') {
    const x0 = W * 0.075, x1 = W * 0.925, w = x1 - x0, ys = H * 0.375, r = w * 0.56;
    const arch = [];
    const cl = [x0 + r, ys], cr = [x1 - r, ys], xm = (x0 + x1) / 2;
    // left arc: from springline (angle π) up to the apex; right arc mirrored
    const apexAngL = Math.atan2(-Math.sqrt(r * r - (xm - cl[0]) ** 2), xm - cl[0]);
    for (let i = 0; i <= 40; i++) { const a = lerp(Math.PI, Math.PI * 2 + apexAngL, i / 40); arch.push([cl[0] + Math.cos(a) * r, cl[1] + Math.sin(a) * r]); }
    const apexAngR = Math.atan2(-Math.sqrt(r * r - (xm - cr[0]) ** 2), xm - cr[0]);
    for (let i = 0; i <= 40; i++) { const a = lerp(apexAngR, 0, i / 40); arch.push([cr[0] + Math.cos(a) * r, cr[1] + Math.sin(a) * r]); }
    const fieldBottom = H * 0.79;
    L.field = [...arch, [x1, fieldBottom], [x0, fieldBottom]];
    L.goldClip = L.field;
    L.eye = { cx: W / 2, cy: H * 0.315, w: W * 0.33 };
    L.rays = { cx: W / 2, cy: H * 0.315, r0: W * 0.4, n: 64 };
    L.rocks = { y0: H * 0.6, y1: fieldBottom, x0, x1 };
    L.agents = [
      { x: W * 0.4, y: H * 0.705, h: H * 0.105, lead: true, look: [0.35, -0.9] },
      { x: W * 0.62, y: H * 0.69, h: H * 0.08, look: [-0.3, -0.95], flip: true },
      { x: W * 0.235, y: H * 0.735, h: H * 0.07, look: [0.6, -0.8] },
      { x: W * 0.77, y: H * 0.742, h: H * 0.062, look: [-0.5, -0.85], flip: true },
    ];
    L.band = { x0, x1, y0: H * 0.807, y1: H * 0.957 };
    L.texts = [
      { str: T.poster[0], cx: W / 2, base: H * 0.857, maxW: w * 0.62, maxPx: H * 0.046, track: 0.14, gold: true },
      { str: T.poster[1], cx: W / 2, base: H * 0.912, maxW: w * 0.8, maxPx: H * 0.05, track: 0.12, gold: true },
      { str: credit + '  ·  ' + D.duration, cx: W / 2, base: H * 0.943, maxW: w * 0.52, maxPx: H * 0.015, track: 0.2, weight: 600, paint: TEMP.ochreL },
    ];
    L.frame = { outer: [[0, 0], [W, 0], [W, H], [0, H]], fw: W * 0.035, spandrels: true, arch, x0, x1, ys, fieldBottom };
    L.agentEyeOpen = 1;
  } else if (fmt === 'thumb') {
    const split = W * 0.39;
    L.field = [[split, 0], [W, 0], [W, H], [split, H]];
    L.goldClip = L.field;
    L.eye = { cx: W * 0.695, cy: H * 0.43, w: W * 0.28 };
    L.rays = { cx: W * 0.695, cy: H * 0.43, r0: W * 0.33, n: 56 };
    L.rocks = { y0: H * 0.84, y1: H, x0: split, x1: split + W * 0.25, small: true };
    L.agents = [{ x: split + W * 0.085, y: H * 0.93, h: H * 0.34, lead: true, look: [0.7, -0.7] }];
    L.dark = [[0, 0], [split, 0], [split, H], [0, H]];
    L.texts = [
      { str: T.thumb[0], cx: split / 2, base: H * 0.46, maxW: split * 0.84, maxPx: H * 0.26, track: 0.02, gold: true, weight: 900 },
      { str: T.thumb[1], cx: split / 2, base: H * 0.74, maxW: split * 0.84, maxPx: H * 0.26, track: 0.02, gold: true, weight: 900 },
    ];
    L.divider = split; L.frame = { thin: true, fw: H * 0.014 };
    L.agentEyeOpen = 1;
  } else if (fmt === 'short') {
    const fb = H * 0.8;
    L.field = [[0, 0], [W, 0], [W, fb], [0, fb]];
    L.goldClip = L.field;
    L.eye = { cx: W / 2, cy: H * 0.33, w: W * 0.42 };
    L.rays = { cx: W / 2, cy: H * 0.33, r0: W * 0.48, n: 52 };
    L.rocks = { y0: H * 0.645, y1: fb, x0: 0, x1: W };
    L.agents = [{ x: W * 0.5, y: H * 0.73, h: H * 0.13, lead: true, look: [0, -1], shortAgent: true }];
    L.band = { x0: 0, x1: W, y0: fb, y1: H };
    L.texts = [
      { str: T.short[0], cx: W / 2, base: H * 0.857, maxW: W * 0.78, maxPx: H * 0.036, track: 0.12, gold: true, weight: 600, appear: 1.9 },
      { str: T.short[1], cx: W / 2, base: H * 0.913, maxW: W * 0.86, maxPx: H * 0.03, track: 0.1, gold: true, weight: 600, appear: 4.5 },
      { str: T.short[2], cx: W / 2, base: H * 0.952, maxW: W * 0.6, maxPx: H * 0.03, track: 0.1, gold: true, weight: 600, appear: 4.5 },
    ];
    L.frame = { thin: true, fw: W * 0.022 };
    L.story = true;
  } else { // title card
    L.field = [[0, 0], [W, 0], [W, H], [0, H]];
    L.goldClip = L.field;
    L.eye = { cx: W / 2, cy: H * 0.4, w: W * 0.2 };
    L.rays = { cx: W / 2, cy: H * 0.4, r0: W * 0.235, n: 60 };
    L.agents = [];
    L.texts = [
      { str: T.title[0], cx: W / 2, base: H * 0.815, maxW: W * 0.78, maxPx: H * 0.08, track: 0.08, paint: '#5c140f', weight: 900 },
      { str: credit, cx: W / 2, base: H * 0.875, maxW: W * 0.3, maxPx: H * 0.026, track: 0.24, paint: TEMP.brown, weight: 600 },
    ];
    L.frame = { thin: true, fw: H * 0.016 };
    L.gilding = true;
  }
  return L;
}

// ── gold leaf: squares laid in rows, burnished unevenly, wrinkled, torn ──────
function* makeGoldLeaf(W, H, u, seed = 3, q = null) {
  q = q || Math.max(30, 78 * u);
  const c = makeCanvas(W, H), ctx = ctxOf(c), img = ctx.createImageData(W, H), d = img.data;
  const g = makeCanvas(W, H), gctx = ctxOf(g), gimg = gctx.createImageData(W, H), gd = gimg.data;
  // burnished gold is a mirror: its value comes from what it reflects
  const ramp = [[0, hexRGB('#3f2806')], [0.3, hexRGB('#80561a')], [0.55, hexRGB('#c39339')], [0.8, hexRGB('#ecd084')], [1, hexRGB('#fff1c4')]];
  const rampAt = v => { v = clamp(v); for (let i = 1; i < ramp.length; i++) if (v <= ramp[i][0]) return mixRGB(ramp[i - 1][1], ramp[i][1], (v - ramp[i - 1][0]) / (ramp[i][0] - ramp[i - 1][0])); return ramp[ramp.length - 1][1]; };
  const B = hexRGB(TEMP.bole);
  const rows = Math.ceil(H / q) + 2, offs = [];
  for (let r = 0; r < rows; r++) offs.push(hash2(r, 1, seed) * q);
  const tilt = 0.012;
  yield* pixelRows(H, y => {
    for (let x = 0; x < W; x++) {
      const yy = y + x * tilt, row = Math.floor(yy / q), fy = yy - row * q;
      const xx = x + offs[(row + rows * 4) % rows] - y * tilt, col = Math.floor(xx / q), fx = xx - col * q;
      const id = hash2(col, row, seed + 1), ang = (hash2(col, row, seed + 2) - 0.5) * 1.2;
      const ca = Math.cos(ang), sa = Math.sin(ang), ax = x * ca + y * sa, ay = -x * sa + y * ca;
      const broad = Math.sin((x * 0.62 + y * 0.78) / (230 * u) + fbm(x / (300 * u), y / (300 * u), 2, seed + 7) * 4) * 0.16;
      let b = 0.56 + (id - 0.5) * 0.15 + (fbm(x / (150 * u), y / (150 * u), 3, seed + 3) - 0.5) * 0.42 + broad;
      const scr = vnoise(ax / (30 * u), ay / (0.8 * u), seed + 4);
      b += (scr - 0.5) * 0.16;
      const rn = 1 - Math.abs(2 * fbm(x / (24 * u), y / (24 * u), 3, seed + 5) - 1);
      const wr = smooth(0.965, 0.995, rn) * smooth(0.45, 0.7, vnoise(x / (90 * u), y / (90 * u), seed + 8));
      b -= wr * 0.2;
      const seam = Math.min(fx, fy);
      if (seam < 0.8 * u) b -= 0.22 * (1 - seam / (0.8 * u));
      else if (seam < 3.2 * u) b += 0.06;
      const tear = seam < 5 * u && vnoise(x / (6 * u), y / (6 * u), seed + 6) > 0.87;
      b = Math.min(b, 0.9 - 0.04 * hash2(col, row, seed + 9));
      const col3 = tear ? mixRGB(B, hexRGB('#5e2a14'), 0.3) : rampAt(b);
      const i = (y * W + x) * 4;
      d[i] = col3[0]; d[i + 1] = col3[1]; d[i + 2] = col3[2]; d[i + 3] = 255;
      const spec = tear ? 0 : smooth(0.5, 0.9, b) * (1 - wr) * (seam < 0.8 * u ? 0.2 : 1);
      gd[i] = 255; gd[i + 1] = 247; gd[i + 2] = 212; gd[i + 3] = spec * 255;
    }
  });
  ctx.putImageData(img, 0, 0); gctx.putImageData(gimg, 0, 0);
  const leaves = [];
  for (let r = -1; r < rows; r++) for (let cI = -1; cI < Math.ceil(W / q) + 2; cI++) {
    const off = offs[(r + rows * 4) % rows], x0 = cI * q - off, y0 = r * q;
    leaves.push({ r, c: cI, poly: [[x0, y0], [x0 + q, y0], [x0 + q, y0 + q], [x0, y0 + q]].map(([px, py]) => [px + py * tilt, py - px * tilt]) });
  }
  return { gold: c, glint: g, leaves, q };
}

// ── craquelure: a Voronoi crack network with warped coordinates ─────────────
function* makeCracks(W, H, u, seed = 9, cell = 22) {
  const c = makeCanvas(W, H), ctx = ctxOf(c), img = ctx.createImageData(W, H), d = img.data;
  const cs = cell * u;
  const seedPt = (gx, gy) => [(gx + 0.15 + 0.7 * hash2(gx, gy, seed)) * cs, (gy + 0.15 + 0.7 * hash2(gx, gy, seed + 1)) * cs];
  yield* pixelRows(H, y => {
    for (let x = 0; x < W; x++) {
      const wx = x + (fbm(x / (30 * u), y / (30 * u), 2, seed + 2) - 0.5) * 9 * u, wy = y + (fbm(x / (30 * u), y / (30 * u), 2, seed + 3) - 0.5) * 9 * u;
      const gx = Math.floor(wx / cs), gy = Math.floor(wy / cs);
      let d1 = 1e9, d2 = 1e9;
      for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) {
        const p = seedPt(gx + i, gy + j), dd = Math.hypot(wx - p[0], wy - p[1]);
        if (dd < d1) { d2 = d1; d1 = dd; } else if (dd < d2) d2 = dd;
      }
      const e = d2 - d1, wv = (0.32 + vnoise(x / (14 * u), y / (14 * u), seed + 4) * 0.5) * u;
      const a = smooth(wv * 1.4, wv * 0.3, e) * (0.55 + 0.45 * vnoise(x / (40 * u), y / (40 * u), seed + 5));
      const i4 = (y * W + x) * 4;
      d[i4] = 40; d[i4 + 1] = 26; d[i4 + 2] = 16; d[i4 + 3] = a * 255;
    }
  });
  ctx.putImageData(img, 0, 0);
  return c;
}

// ── tempera painting: lay flat, then model with hatching ─────────────────────
function shadeSphere(cx, cy, R, lx = LIGHT[0], ly = LIGHT[1]) {
  return (x, y) => { const nx = (x - cx) / R, ny = (y - cy) / R, r2 = nx * nx + ny * ny; return clamp((nx * lx + ny * ly) * 0.95 - r2 * 0.35 + 0.12, -1, 1); };
}
function paintForm(ctx, poly, o, rnd, u) {
  const { base, light, dark, shade = () => 0, dir = null, density = 1, len = [5, 12], width = [0.7, 1.15], outline = TEMP.brown, outlineW = 1.3, outlineA = 0.75, flatNoise = 0.06 } = o;
  const bb = bboxOf(poly);
  ctx.save(); ctx.beginPath(); polyPath(ctx, poly); ctx.clip();
  ctx.fillStyle = base; ctx.fillRect(bb.x0 - 2, bb.y0 - 2, bb.w + 4, bb.h + 4);
  // flat-laid paint is never perfectly even: soft mottling in small dabs
  const bcol = hexRGB(base), nd = Math.round(bb.w * bb.h / (90 * u * u) * 0.6);
  for (let i = 0; i < nd; i++) {
    const x = bb.x0 + rnd() * bb.w, y = bb.y0 + rnd() * bb.h, r = (4 + rnd() * 10) * u;
    ctx.fillStyle = rgba(shadeRGB(bcol, (rnd() - 0.5) * flatNoise * 2), 0.35); ctx.beginPath(); ctx.ellipse(x, y, r, r * 0.6, rnd() * TAU, 0, TAU); ctx.fill();
  }
  // hatching: short fine strokes that follow the form, denser where it turns
  const Lc = hexRGB(light), Dc = hexRGB(dark);
  const n = Math.round(bb.w * bb.h / (16 * u * u) * density);
  ctx.lineCap = 'round';
  for (let i = 0; i < n; i++) {
    const x = bb.x0 + rnd() * bb.w, y = bb.y0 + rnd() * bb.h, s = shade(x, y);
    const pLight = s > 0 ? Math.pow(s, 0.9) : 0, pDark = s < 0 ? Math.pow(-s, 0.85) : 0, r = rnd();
    let col = null, a = 0;
    if (r < pLight) { col = mixRGB(Lc, [255, 250, 235], rnd() * 0.25 * s); a = 0.35 + 0.45 * s; }
    else if (r < pLight + pDark * 0.9) { col = Dc; a = 0.3 + 0.45 * (-s); }
    if (!col) continue;
    const ang = (dir ? dir(x, y) : 0) + (rnd() - 0.5) * 0.35, l = (len[0] + rnd() * (len[1] - len[0])) * u;
    const ca = Math.cos(ang), sa = Math.sin(ang), bow = (rnd() - 0.5) * l * 0.25;
    ctx.beginPath(); ctx.moveTo(x - ca * l / 2, y - sa * l / 2); ctx.quadraticCurveTo(x - sa * bow, y + ca * bow, x + ca * l / 2, y + sa * l / 2);
    ctx.strokeStyle = rgba(col, a); ctx.lineWidth = (width[0] + rnd() * (width[1] - width[0])) * u; ctx.stroke();
  }
  ctx.restore();
  if (outline) { ctx.save(); ctx.lineJoin = 'round'; ctx.beginPath(); polyPath(ctx, wobble(poly, 6 * u, 0.7 * u, rnd)); ctx.strokeStyle = rgba(hexRGB(outline), outlineA); ctx.lineWidth = outlineW * u; ctx.stroke(); ctx.restore(); }
}
// a punched dimple in gold: dark upper-left wall, bright lower-right wall
function punch(ctx, x, y, r, u, kind = 'ring') {
  ctx.save();
  ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fillStyle = 'rgba(60,36,8,0.32)'; ctx.fill();
  ctx.beginPath(); ctx.arc(x, y, r * 0.92, Math.PI * 0.95, Math.PI * 1.75); ctx.strokeStyle = 'rgba(52,30,6,0.85)'; ctx.lineWidth = Math.max(0.8, r * 0.38); ctx.stroke();
  ctx.beginPath(); ctx.arc(x, y, r * 0.92, Math.PI * -0.05, Math.PI * 0.75); ctx.strokeStyle = 'rgba(255,240,190,0.85)'; ctx.lineWidth = Math.max(0.7, r * 0.3); ctx.stroke();
  if (kind === 'rosette') for (let k = 0; k < 6; k++) { const a = k / 6 * TAU; ctx.beginPath(); ctx.arc(x + Math.cos(a) * r * 1.6, y + Math.sin(a) * r * 1.6, r * 0.42, 0, TAU); ctx.fillStyle = 'rgba(58,34,8,0.6)'; ctx.fill(); }
  ctx.restore();
  void u;
}
// an incised line in gold: a dark groove with a bright lip below-right
function incise(ctx, pl, u, w = 1) {
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); polyPath(ctx, pl, false); ctx.strokeStyle = 'rgba(255,236,180,0.7)'; ctx.lineWidth = 1.1 * w * u; ctx.translate(0.8 * u, 0.9 * u); ctx.stroke();
  ctx.restore();
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); polyPath(ctx, pl, false); ctx.strokeStyle = 'rgba(58,34,8,0.85)'; ctx.lineWidth = 1.0 * w * u; ctx.stroke();
  ctx.restore();
}

// ── the eye ─────────────────────────────────────────────────────────────────
// eye-local units: corners at x = ±1; open = 0 … 1
function eyeLids(open, k = 1) {
  const up = [], lo = [], n = 40;
  for (let i = 0; i <= n; i++) {
    const x = -1 + 2 * i / n, s = Math.max(0, 1 - x * x);
    up.push([x, -0.5 * open * Math.pow(s, 0.72) * (1 + 0.1 * x) * k]);
    lo.push([x, 0.3 * open * Math.pow(s, 0.9) * (1 - 0.12 * x) * k + 0.02 * open * s]);
  }
  return { up, lo };
}
function* buildEye(E, u, rnd) {
  // E = half-width in px. Sprites are 2.4E × 1.4E, centred.
  const w = Math.ceil(E * 2.4), h = Math.ceil(E * 1.5), cx = w / 2, cy = h / 2;
  const sclera = makeCanvas(w, h), sc = ctxOf(sclera);
  const full = eyeLids(1.0);
  const aper = [...full.up.map(([x, y]) => [cx + x * E, cy + y * E]), ...full.lo.slice().reverse().map(([x, y]) => [cx + x * E, cy + y * E])];
  paintForm(sc, aper, { base: '#e8dcc0', light: '#fcf5e3', dark: '#9c8461', shade: (x, y) => { const nx = (x - cx) / E; return 0.15 - Math.pow(Math.abs(nx), 2.4) * 0.9 - Math.max(0, (cy - y) / E - 0.15) * 1.1; }, dir: (x) => 0.1 + (x - cx) / E * 0.35, density: 2.6, len: [5, 11], width: [0.8, 1.3], outline: null }, rnd, u);
  // the caruncle (inner corner), pink
  sc.fillStyle = 'rgba(196,96,80,0.55)'; sc.beginPath(); sc.ellipse(cx - E * 0.9, cy + E * 0.02, E * 0.08, E * 0.06, 0, 0, TAU); sc.fill();
  sc.save(); sc.beginPath(); polyPath(sc, aper); sc.clip();
  for (let i = 0; i < 9; i++) { // fine veins from the corners
    const side = i % 2 ? 1 : -1; let x = cx + side * E * (0.95 - rnd() * 0.1), y = cy + (rnd() - 0.5) * E * 0.25;
    sc.beginPath(); sc.moveTo(x, y);
    for (let k = 0; k < 6; k++) { x -= side * E * (0.04 + rnd() * 0.04); y += (rnd() - 0.5) * E * 0.05; sc.lineTo(x, y); }
    sc.strokeStyle = 'rgba(160,60,50,0.35)'; sc.lineWidth = 0.7 * u; sc.stroke();
  }
  sc.restore();
  yield;
  // iris: radial strokes of cinnabar and lake, a dark limbal ring, the pupil
  const R = E * 0.4, iw = Math.ceil(R * 2.4), iris = makeCanvas(iw, iw), ic = ctxOf(iris), ix = iw / 2;
  ic.fillStyle = TEMP.cin; ic.beginPath(); ic.arc(ix, ix, R, 0, TAU); ic.fill();
  ic.save(); ic.beginPath(); ic.arc(ix, ix, R, 0, TAU); ic.clip();
  const nIris = Math.round(Math.max(420, R * R / (u * u) * 0.1));
  for (let i = 0; i < nIris; i++) {
    const a = rnd() * TAU, r0 = R * (0.32 + rnd() * 0.15), r1 = R * (0.62 + rnd() * 0.4), bend = (rnd() - 0.5) * 0.18;
    const light = rnd() < 0.5;
    ic.beginPath(); ic.moveTo(ix + Math.cos(a) * r0, ix + Math.sin(a) * r0);
    ic.quadraticCurveTo(ix + Math.cos(a + bend) * (r0 + r1) / 2, ix + Math.sin(a + bend) * (r0 + r1) / 2, ix + Math.cos(a + bend * 1.6) * r1, ix + Math.sin(a + bend * 1.6) * r1);
    ic.strokeStyle = light ? rgba(hexRGB(TEMP.cinL), 0.5 + rnd() * 0.4) : rgba(hexRGB(TEMP.lake), 0.35 + rnd() * 0.4);
    ic.lineWidth = (0.6 + rnd() * 1.1) * u; ic.stroke();
  }
  // shadow cast by the upper lid across the top of the iris (hatched)
  for (let i = 0; i < 260; i++) {
    const x = ix + (rnd() - 0.5) * R * 2, y = ix - R + rnd() * R * 0.7, l = (4 + rnd() * 7) * u;
    ic.beginPath(); ic.moveTo(x - l / 2, y); ic.lineTo(x + l / 2, y + (rnd() - 0.5) * 2 * u); ic.strokeStyle = rgba(hexRGB(TEMP.lake), 0.25 + rnd() * 0.3); ic.lineWidth = 0.9 * u; ic.stroke();
  }
  ic.restore();
  ic.beginPath(); ic.arc(ix, ix, R * 0.97, 0, TAU); ic.strokeStyle = rgba(hexRGB(TEMP.lake), 0.95); ic.lineWidth = R * 0.09; ic.stroke();
  ic.beginPath(); ic.arc(ix, ix, R * 0.5, 0, TAU); ic.strokeStyle = rgba(hexRGB(TEMP.cinL), 0.55); ic.lineWidth = R * 0.05; ic.stroke();
  ic.fillStyle = TEMP.brown; ic.beginPath(); polyPath(ic, wobble(ellipsePts(ix, ix, R * 0.4, R * 0.4, 40), 3 * u, 0.8 * u, rnd)); ic.fill();
  // window highlights, painted in lead white
  ic.fillStyle = 'rgba(250,244,228,0.92)'; ic.beginPath(); ic.ellipse(ix - R * 0.32, ix - R * 0.34, R * 0.12, R * 0.09, -0.5, 0, TAU); ic.fill();
  ic.fillStyle = 'rgba(250,244,228,0.6)'; ic.beginPath(); ic.ellipse(ix + R * 0.22, ix + R * 0.3, R * 0.05, R * 0.04, -0.5, 0, TAU); ic.fill();
  yield;
  return { sclera, iris, w, h, E, R, iw };
}
// draw the eye at state (open, look) — lids are the gold itself
function drawEye(ctx, eye, cx, cy, open, look, u, rnd) {
  const E = eye.E;
  const lids = eyeLids(Math.max(0.0001, open));
  const toPx = ([x, y]) => [cx + x * E, cy + y * E];
  const up = lids.up.map(toPx), lo = lids.lo.map(toPx);
  if (open > 0.02) {
    ctx.save();
    ctx.beginPath(); polyPath(ctx, [...up, ...lo.slice().reverse()]); ctx.clip();
    ctx.drawImage(eye.sclera, cx - eye.w / 2, cy - eye.h / 2);
    const lx = clamp(look[0], -1, 1) * E * 0.36, ly = clamp(look[1], -1, 1) * E * 0.12 + E * 0.02 * (1 - open);
    ctx.drawImage(eye.iris, cx + lx - eye.iw / 2, cy + ly - eye.iw / 2 - E * 0.02);
    // the upper lid's shadow on the eyeball
    ctx.beginPath(); polyPath(ctx, [...up, ...up.slice().reverse().map(([x, y]) => [x, y + E * 0.11 * open])]); ctx.fillStyle = 'rgba(70,30,14,0.32)'; ctx.fill();
    ctx.restore();
  }
  // lid crease above, incised into the gold
  const crease = lids.up.map(([x, y]) => [cx + x * E * 1.04, cy + (y * 1.18 - 0.16 * Math.max(0, 1 - x * x)) * E - E * 0.06 * open]);
  incise(ctx, crease.slice(4, -4), u, 1.2);
  // lid rims painted in lake and brown; lashes in fine strokes
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); polyPath(ctx, up, false); ctx.strokeStyle = rgba(hexRGB('#4a1c12'), 0.92); ctx.lineWidth = 2.6 * u * (E / (120 * u)) ** 0.5; ctx.stroke();
  ctx.beginPath(); polyPath(ctx, lo, false); ctx.strokeStyle = rgba(hexRGB(TEMP.lake), 0.85); ctx.lineWidth = 1.6 * u * (E / (120 * u)) ** 0.5; ctx.stroke();
  const rl = mulberry32(777);
  for (let i = 3; i < up.length - 3; i += 2) {
    const [x, y] = up[i], a = -Math.PI / 2 + (i / up.length - 0.5) * 1.5 + (rl() - 0.5) * 0.2, l = E * (0.08 + 0.05 * Math.sin(i / up.length * Math.PI)) * (0.5 + 0.5 * open);
    const ex = x + Math.cos(a) * l, ey = y + Math.sin(a) * l * (open > 0.2 ? 1 : -0.6);
    ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + Math.cos(a) * l * 0.5, y + Math.sin(a) * l * 0.2, ex, ey);
    ctx.strokeStyle = rgba(hexRGB(TEMP.brown), 0.8); ctx.lineWidth = 1.0 * u; ctx.stroke();
  }
  ctx.restore();
  void rnd;
}

// ── the agent ───────────────────────────────────────────────────────────────
function agentGeom(a, raise = 0) {
  const h = a.h, f = a.flip ? -1 : 1, X = (x, y) => [a.x + x * h * f, a.y + y * h];
  const body = AGENT.body(0).map(([x, y]) => X(x, y));
  const eye = { cx: a.x + AGENT.eye.cx * h * f, cy: a.y + AGENT.eye.cy * h, r: AGENT.eye.r * h };
  // the lead agent points up at the god; others hold their arms close
  const arms = [];
  const sh = AGENT.shoulderR, sl = AGENT.shoulderL;
  if (a.lead) {
    const ang = lerp(-0.35, -1.38, raise), l = 0.5;
    const e = [sh[0] + Math.cos(ang) * l * 0.55, sh[1] + Math.sin(ang) * l * 0.55], w = [e[0] + Math.cos(ang - 0.1) * l * 0.5, e[1] + Math.sin(ang - 0.1) * l * 0.5];
    arms.push({ pl: [X(...sh), X(...e), X(...w)], hand: X(...w), point: true });
    arms.push({ pl: [X(...sl), X(sl[0] - 0.06, sl[1] + 0.2), X(sl[0] - 0.02, sl[1] + 0.34)], hand: X(sl[0] - 0.02, sl[1] + 0.34) });
  } else {
    arms.push({ pl: [X(...sh), X(sh[0] + 0.08, sh[1] + 0.18), X(sh[0] + 0.03, sh[1] + 0.32)], hand: X(sh[0] + 0.03, sh[1] + 0.32) });
    arms.push({ pl: [X(...sl), X(sl[0] - 0.06, sl[1] + 0.2), X(sl[0] - 0.02, sl[1] + 0.33)], hand: X(sl[0] - 0.02, sl[1] + 0.33) });
  }
  const feet = AGENT.feet.map(([x, y, rx, ry]) => ({ c: X(x, y), rx: rx * h, ry: ry * h }));
  return { body, eye, arms, feet, h };
}
function paintAgent(ctx, a, u, rnd, raise = 1) {
  const G = agentGeom(a, raise), h = G.h;
  const bb = bboxOf(G.body), sh = shadeSphere((bb.x0 + bb.x1) / 2 - h * 0.05, bb.y0 + bb.h * 0.45, h * 0.42);
  // cast shadow on the rock
  ctx.save(); ctx.fillStyle = 'rgba(40,30,15,0.28)'; ctx.beginPath(); ctx.ellipse(a.x + h * 0.08, a.y + h * 0.02, h * 0.3, h * 0.055, 0, 0, TAU); ctx.fill(); ctx.restore();
  for (const ft of G.feet) { ctx.fillStyle = TEMP.agentD; ctx.beginPath(); ctx.ellipse(ft.c[0], ft.c[1], ft.rx, ft.ry, 0, 0, TAU); ctx.fill(); }
  const armW = h * 0.075;
  for (const arm of G.arms) { if (!arm.point) drawAgentArm(ctx, arm, armW, u, rnd); }
  paintForm(ctx, G.body, { base: TEMP.agent, light: TEMP.agentL, dark: TEMP.agentD, shade: sh, dir: (x, y) => Math.atan2(y - (bb.y0 + bb.h * 0.5), x - (bb.x0 + bb.x1) / 2) + Math.PI / 2, density: 1.5, len: [3, 7], width: [0.6, 1.0], outline: TEMP.agentD, outlineW: 1.2, outlineA: 0.9 }, rnd, u);
  for (const arm of G.arms) { if (arm.point) drawAgentArm(ctx, arm, armW, u, rnd); }
  return G;
}
function drawAgentArm(ctx, arm, w, u, rnd) {
  const pl = quadPts(arm.pl[0], arm.pl[1], arm.pl[2], 14), poly = tubePoly(pl, t => w * (1 - t * 0.25));
  paintForm(ctx, poly, { base: TEMP.agent, light: TEMP.agentL, dark: TEMP.agentD, shade: (x, y) => clamp(((x - pl[0][0]) * LIGHT[0] + (y - pl[0][1]) * LIGHT[1]) / (w * 4) + 0.1, -1, 1), dir: () => 0.6, density: 1.2, len: [2, 4], outline: TEMP.agentD, outlineW: 1.1, outlineA: 0.9 }, rnd, u);
  const [hx, hy] = arm.hand;
  ctx.fillStyle = TEMP.agent; ctx.beginPath(); ctx.arc(hx, hy, w * 0.62, 0, TAU); ctx.fill();
  ctx.strokeStyle = TEMP.agentD; ctx.lineWidth = 1.1 * u; ctx.stroke();
  if (arm.point) { // one finger up
    const a = Math.atan2(arm.pl[2][1] - arm.pl[1][1], arm.pl[2][0] - arm.pl[1][0]);
    const fx = hx + Math.cos(a) * w * 1.1, fy = hy + Math.sin(a) * w * 1.1;
    ctx.beginPath(); polyPath(ctx, capsulePts([hx, hy], [fx, fy], w * 0.42, 6)); ctx.fillStyle = TEMP.agent; ctx.fill(); ctx.strokeStyle = TEMP.agentD; ctx.stroke();
  }
}
function drawAgentEye(ctx, G, look, open, u) {
  const { cx, cy, r } = G.eye;
  ctx.save();
  ctx.beginPath(); ctx.ellipse(cx, cy, r, r * Math.max(0.06, open), 0, 0, TAU); ctx.fillStyle = TEMP.white; ctx.fill();
  if (open > 0.15) {
    ctx.clip();
    const px = cx + look[0] * r * 0.38, py = cy + look[1] * r * 0.38;
    ctx.fillStyle = TEMP.brown; ctx.beginPath(); ctx.arc(px, py, r * 0.48, 0, TAU); ctx.fill();
    ctx.fillStyle = 'rgba(250,244,228,0.95)'; ctx.beginPath(); ctx.arc(px - r * 0.16, py - r * 0.17, r * 0.13, 0, TAU); ctx.fill();
  }
  ctx.restore();
  ctx.beginPath(); ctx.ellipse(cx, cy, r, r * Math.max(0.06, open), 0, 0, TAU); ctx.strokeStyle = TEMP.agentD; ctx.lineWidth = 1.4 * u; ctx.stroke();
  if (open < 0.6) { ctx.beginPath(); ctx.moveTo(cx - r, cy); ctx.quadraticCurveTo(cx, cy + r * 0.25 * (1 - open), cx + r, cy); ctx.strokeStyle = TEMP.agentD; ctx.lineWidth = 1.6 * u; ctx.stroke(); }
}

// ── rocks: Sienese stepped outcrops, flat tops lit from the upper left ─────────
function rockShapes(R, rnd) {
  // each outcrop is a stack of blocks: flat tops, sheer faces, stepped back
  const out = [], span = R.x1 - R.x0, n = R.small ? 2 : 5;
  for (let i = 0; i < n; i++) {
    const cx = R.x0 + span * (i + 0.5) / n + (rnd() - 0.5) * span * 0.1;
    const wdt = span / n * (1.1 + rnd() * 0.5), bot = R.y1 + 6;
    const tiers = R.small ? 2 : 2 + (rnd() * 2 | 0);
    const peak = lerp(R.y0, R.y1, (R.small ? 0.05 : 0.0) + rnd() * 0.35);
    const blocks = [];
    for (let k = 0; k < tiers; k++) {
      const f = k / tiers, w = wdt * (1 - f * 0.38), top = lerp(bot, peak, (k + 1) / tiers);
      const x0 = cx - w / 2 + (rnd() - 0.5) * wdt * 0.12, x1 = x0 + w;
      const ch = Math.min(10, (bot - top) * 0.12);
      blocks.push({ x0, x1, top, bot: k === 0 ? bot : lerp(bot, peak, k / tiers) + 4, ch });
    }
    out.push({ cx, wdt, blocks, top: peak });
  }
  out.sort((a, b) => a.top - b.top);
  return out;
}
function paintRocks(ctx, R, u, rnd) {
  for (const r of rockShapes(R, rnd)) {
    for (const bk of r.blocks) {
      const lip = (bk.bot - bk.top) * 0.16 + 3 * u, sl = (bk.x1 - bk.x0) * 0.06;
      const j = () => (rnd() - 0.5) * (bk.x1 - bk.x0) * 0.08, tilt = (rnd() - 0.5) * lip * 0.9;
      const face = wobble([[bk.x0 + j(), bk.bot], [bk.x0 + sl * 0.3 + j(), bk.top + lip - tilt], [lerp(bk.x0, bk.x1, 0.45 + rnd() * 0.2), bk.top + lip + (rnd() - 0.5) * lip * 0.6], [bk.x1 - sl * 0.3 + j(), bk.top + lip + tilt], [bk.x1 + j(), bk.bot]], 9 * u, 2.2 * u, rnd);
      const top = wobble([[bk.x0 + sl * 0.3, bk.top + lip - tilt], [bk.x0 + sl + j(), bk.top - tilt * 0.5], [bk.x1 - sl * 1.2 + j(), bk.top + tilt * 0.5], [bk.x1 - sl * 0.3, bk.top + lip + tilt]], 9 * u, 1.6 * u, rnd);
      const fb = bboxOf(face);
      paintForm(ctx, face, { base: TEMP.verte, light: '#9aa16a', dark: TEMP.verteD,
        shade: (x, y) => clamp(0.2 - (y - fb.y0) / fb.h * 0.9 + (x < fb.x0 + fb.w * 0.3 ? 0.35 : 0) - (x > fb.x0 + fb.w * 0.78 ? 0.45 : 0), -1, 1),
        dir: () => Math.PI / 2 + 0.12, density: 1.5, len: [6, 14], outline: TEMP.verteD, outlineW: 1.1, outlineA: 0.85 }, rnd, u);
      paintForm(ctx, top, { base: '#a9a46b', light: TEMP.ochreL, dark: '#7b7a48', shade: x => clamp(0.6 - (x - bk.x0) / (bk.x1 - bk.x0) * 0.8, -1, 1), dir: () => 0.02, density: 1.6, len: [6, 14], outline: TEMP.verteD, outlineW: 1.0, outlineA: 0.7 }, rnd, u);
    }
    // grass tufts on the topmost ledge
    const tb = r.blocks[r.blocks.length - 1];
    for (let k = 0; k < (R.small ? 3 : 5); k++) {
      const x = lerp(tb.x0, tb.x1, 0.15 + rnd() * 0.7), y = tb.top + 1.5 * u;
      for (let j = 0; j < 5; j++) { ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + (j - 2) * 1.2 * u, y - 4 * u, x + (j - 2) * 2.4 * u, y - (6 + rnd() * 4) * u); ctx.strokeStyle = rgba(hexRGB(TEMP.verteD), 0.85); ctx.lineWidth = 0.9 * u; ctx.stroke(); }
    }
  }
}

// ── gold letters (mordant gilding) or painted letters ─────────────────────────
function* letterMask(L, T) {
  const W = L.W, H = L.H, c = makeCanvas(W, H), x = ctxOf(c);
  x.fillStyle = '#000'; x.textBaseline = 'alphabetic';
  const px = fitText(x, T.str, T.maxW, T.maxPx, T.weight || 600, FONT_DISPLAY, T.track);
  setFont(x, px, T.weight || 600, FONT_DISPLAY);
  drawTracked(x, T.str, T.cx, T.base, px, T.track, 'center');
  yield* roughenMask(c, L.u, 0.1, 31 + T.base | 0, 0.4);
  return c;
}

// ── build ───────────────────────────────────────────────────────────────────
function* buildFilm2(fmt, W, H) {
  const L = film2Layout(fmt, W, H), u = L.u, S = { L };
  const rnd = mulberry32(2202 + W);
  const G = yield* makeGoldLeaf(W, H, u, 13);
  S.G = G;
  const cracks = yield* makeCracks(W, H, u, 17, 9);
  // the eye sprites
  S.eye = yield* buildEye(L.eye.w, u, mulberry32(808));
  const base = makeCanvas(W, H), b = ctxOf(base);
  // gesso + bole (only visible in the gilding reveal and at tears)
  b.fillStyle = TEMP.bole; b.fillRect(0, 0, W, H);
  if (L.frame && L.frame.spandrels) {
    const around = [[0, 0], [W, 0], [W, H], [0, H]];
    paintForm(b, around, { base: TEMP.azur, light: TEMP.azurL, dark: TEMP.azurD, shade: (x, y) => (fbm(x / (70 * u), y / (70 * u), 3, 8) - 0.5) * 1.4, dir: () => 0.4, density: 0.9, outline: null }, rnd, u);
  }
  // gold field
  b.save(); b.beginPath(); polyPath(b, L.goldClip); b.clip(); b.drawImage(G.gold, 0, 0);
  // tooling: rays incised from the eye; punch rows on alternate rays; a punched ring
  const Rr = L.rays, E = L.eye.w;
  const rt = mulberry32(99);
  for (let i = 0; i < Rr.n; i++) {
    const a = i / Rr.n * TAU, r0 = E * 1.16, r1 = Math.hypot(W, H);
    const pl = [[Rr.cx + Math.cos(a) * r0 * 1.05, Rr.cy + Math.sin(a) * r0 * 0.62], [Rr.cx + Math.cos(a) * r1, Rr.cy + Math.sin(a) * r1]];
    incise(b, pl, u, i % 2 ? 0.8 : 1.3);
    if (i % 2 === 0) {
      for (let k = 0; k < 40; k++) {
        const rr = E * 1.32 + k * 7.5 * u * (1 + k * 0.025); if (rr > E * 2.6) break;
        const x = Rr.cx + Math.cos(a + TAU / Rr.n / 2) * rr, y = Rr.cy + Math.sin(a + TAU / Rr.n / 2) * rr * (0.62 + 0.38 * Math.min(1, (rr - E) / (E * 1.6)));
        punch(b, x, y, (1.5 + (k % 3 === 0 ? 0.6 : 0)) * u, u);
      }
    }
  }
  // the mandorla: two incised ovals and a ring of rosettes round the eye
  for (const k of [1.12, 1.24]) incise(b, ellipsePts(Rr.cx, Rr.cy, E * k, E * k * 0.6, 120).concat([[Rr.cx + E * k, Rr.cy]]), u, 1.2);
  for (let i = 0; i < 46; i++) { const a = i / 46 * TAU; punch(b, Rr.cx + Math.cos(a) * E * 1.18, Rr.cy + Math.sin(a) * E * 1.18 * 0.6, 2.2 * u, u, i % 2 ? 'ring' : 'rosette'); }
  b.restore();
  yield;
  // glint map: only where there is gold, plus the punches sparkle
  const glint = makeCanvas(W, H), gl = ctxOf(glint);
  gl.save(); gl.beginPath(); polyPath(gl, L.goldClip); gl.clip(); gl.drawImage(G.glint, 0, 0); gl.restore();
  S.glint = glint;
  // dark fields (thumb text side) and bands
  const azPoly = L.dark || (L.band ? [[L.band.x0, L.band.y0], [L.band.x1, L.band.y0], [L.band.x1, L.band.y1], [L.band.x0, L.band.y1]] : null);
  if (azPoly) {
    paintForm(b, azPoly, { base: L.dark ? TEMP.azurD : '#1d1714', light: L.dark ? TEMP.azur : '#3a2a22', dark: '#0f0c14', shade: (x, y) => (fbm(x / (90 * u), y / (90 * u), 3, 4) - 0.5) * 1.6, dir: () => 0.0, density: 0.9, len: [8, 18], width: [0.8, 1.4], outline: null }, rnd, u);
  }
  // rocks and agents
  if (L.rocks) { b.save(); b.beginPath(); polyPath(b, L.goldClip); b.clip(); paintRocks(b, L.rocks, u, rnd); b.restore(); }
  yield;
  S.agentGeoms = [];
  for (const a of L.agents) S.agentGeoms.push({ a, G: paintAgent(b, a, u, rnd, 1) });
  yield;
  // frame
  if (L.frame) paintFrame(b, L, G, u, rnd);
  // letters
  S.letters = [];
  for (const T of L.texts) {
    const m = yield* letterMask(L, T);
    const layer = makeCanvas(W, H), lc = ctxOf(layer);
    lc.drawImage(m, 0, 0); lc.globalCompositeOperation = 'source-in';
    if (T.gold) lc.drawImage(G.gold, 0, 0); else { lc.fillStyle = T.paint; lc.fillRect(0, 0, W, H); }
    lc.globalCompositeOperation = 'source-over';
    // mordant gilding has a thin raised edge; painted letters sit in the gold with a soft halo
    const edge = makeCanvas(W, H), ec = ctxOf(edge);
    ec.filter = `blur(${0.8 * u}px)`; ec.drawImage(m, 0, 0); ec.filter = 'none';
    ec.globalCompositeOperation = 'source-in'; ec.fillStyle = T.gold ? 'rgba(20,10,4,0.7)' : 'rgba(240,214,140,0.0)'; ec.fillRect(0, 0, W, H);
    S.letters.push({ T, layer, edge, mask: m });
    if (!T.appear && !L.gilding) { b.drawImage(edge, 0.9 * u, 1.1 * u); b.drawImage(layer, 0, 0); if (T.gold) { gl.drawImage(m, 0, 0); } }
  }
  yield;
  // age: cracks over everything (stronger in paint), a warm grime in the corners
  const crk = makeCanvas(W, H), cc = ctxOf(crk);
  cc.drawImage(cracks, 0, 0);
  cc.globalCompositeOperation = 'destination-out'; cc.globalAlpha = 0.72; cc.beginPath(); polyPath(cc, L.goldClip); cc.fill(); cc.globalAlpha = 1; cc.globalCompositeOperation = 'source-over';
  b.save(); b.globalAlpha = 0.5; b.drawImage(crk, 0, 0); b.restore();
  b.save(); b.globalCompositeOperation = 'multiply';
  const vg = b.createRadialGradient(W / 2, H * 0.45, Math.min(W, H) * 0.35, W / 2, H * 0.5, Math.hypot(W, H) * 0.62);
  vg.addColorStop(0, 'rgba(255,255,255,0)'); vg.addColorStop(1, 'rgba(150,110,70,0.45)');
  b.fillStyle = vg; b.fillRect(0, 0, W, H); b.restore();
  S.base = base;
  // the bole-only sheet for the gilding reveal: bole, frame, letters later
  if (L.gilding) {
    const bole = makeCanvas(W, H), bl = ctxOf(bole);
    const boleTex = yield* makePaper(W, H, u, TEMP.bole, { mottle: 0.08, tooth: 0.04, fibres: 0, seed: 23 });
    bl.drawImage(boleTex, 0, 0);
    if (L.frame) paintFrame(bl, L, G, u, mulberry32(5));
    bl.save(); bl.globalAlpha = 0.5; bl.drawImage(cracks, 0, 0); bl.restore();
    S.bole = bole;
    // leaf order: spiral out from the eye
    const cx = L.eye.cx, cy = L.eye.cy;
    S.leafOrder = G.leaves.map(l => { const c = centroid(l.poly); return { l, d: Math.hypot(c[0] - cx, (c[1] - cy) * 1.6) + hash2(l.r, l.c, 3) * G.q * 0.8 }; }).sort((a, b2) => a.d - b2.d).map(o => o.l);
  }
  S.press = makePress(W, H);
  return S;
}

function paintFrame(b, L, G, u, rnd) {
  const W = L.W, H = L.H, F = L.frame, fw = F.fw;
  const gilt = (poly, evenodd) => { b.save(); b.beginPath(); for (const p of poly) polyPath(b, p); b.clip(evenodd ? 'evenodd' : 'nonzero'); b.drawImage(G.gold, 0, 0); b.restore(); };
  if (F.spandrels) {
    // spandrels outside the arch: azurite with small gold stars
    for (let i = 0; i < 26; i++) { const x = rnd() * W, y = rnd() * F.ys; if (insideArch(F, x, y)) continue; star(b, x, y, (3 + rnd() * 2.5) * u, G); }
    // moulding: a gilt band round the arch and field, with azurite fillets
    const ring = [];
    for (const k of [-1, 1]) ring.push(offsetArch(F, k * fw * 0.5));
    gilt([offsetPolyline(F, fw * 0.62), offsetPolyline(F, -fw * 0.1)], true);
    b.save(); b.lineJoin = 'round';
    b.beginPath(); polyPath(b, offsetPolyline(F, fw * 0.62)); b.strokeStyle = rgba(hexRGB(TEMP.brown), 0.6); b.lineWidth = 1.3 * u; b.stroke();
    b.beginPath(); polyPath(b, offsetPolyline(F, -fw * 0.1)); b.strokeStyle = TEMP.azurD; b.lineWidth = 2.8 * u; b.stroke();
    b.beginPath(); polyPath(b, offsetPolyline(F, fw * 0.25)); b.strokeStyle = 'rgba(80,50,10,0.55)'; b.lineWidth = 1.2 * u; b.stroke();
    b.restore();
    void ring;
    // outer frame edge
    gilt([[[0, 0], [W, 0], [W, H], [0, H]], [[fw, fw], [W - fw, fw], [W - fw, H - fw], [fw, H - fw]]], true);
    b.strokeStyle = rgba(hexRGB(TEMP.brown), 0.7); b.lineWidth = 1.5 * u; b.strokeRect(fw, fw, W - 2 * fw, H - 2 * fw);
    // predella frame lines
    if (L.band) { b.save(); b.strokeStyle = 'rgba(240,210,130,0.85)'; b.lineWidth = 2 * u; b.strokeRect(L.band.x0 + 6 * u, L.band.y0 + 6 * u, L.band.x1 - L.band.x0 - 12 * u, L.band.y1 - L.band.y0 - 12 * u); b.restore(); }
  } else {
    gilt([[[0, 0], [W, 0], [W, H], [0, H]], [[fw, fw], [W - fw, fw], [W - fw, H - fw], [fw, H - fw]]], true);
    if (L.divider) { const x = L.divider; gilt([[[x - fw * 0.6, 0], [x + fw * 0.6, 0], [x + fw * 0.6, H], [x - fw * 0.6, H]]]); }
    if (L.band) gilt([[[0, L.band.y0 - fw * 0.5], [W, L.band.y0 - fw * 0.5], [W, L.band.y0 + fw * 0.5], [0, L.band.y0 + fw * 0.5]]]);
    b.save();
    b.strokeStyle = rgba(hexRGB(TEMP.brown), 0.7); b.lineWidth = 1.4 * u; b.strokeRect(fw, fw, W - 2 * fw, H - 2 * fw);
    b.strokeStyle = TEMP.azurD; b.lineWidth = 2.4 * u; b.strokeRect(fw + 2.4 * u, fw + 2.4 * u, W - 2 * fw - 4.8 * u, H - 2 * fw - 4.8 * u);
    if (L.divider) { const x = L.divider; b.beginPath(); b.moveTo(x + fw * 0.6 + 1.2 * u, 0); b.lineTo(x + fw * 0.6 + 1.2 * u, H); b.moveTo(x - fw * 0.6 - 1.2 * u, 0); b.lineTo(x - fw * 0.6 - 1.2 * u, H); b.lineWidth = 2 * u; b.stroke(); }
    if (L.band) { b.beginPath(); b.moveTo(0, L.band.y0 - fw * 0.5 - 1.2 * u); b.lineTo(W, L.band.y0 - fw * 0.5 - 1.2 * u); b.moveTo(0, L.band.y0 + fw * 0.5 + 1.2 * u); b.lineTo(W, L.band.y0 + fw * 0.5 + 1.2 * u); b.lineWidth = 2 * u; b.stroke(); }
    b.restore();
  }
}
function insideArch(F, x, y) { if (y > F.ys) return x > F.x0 && x < F.x1; let c = false; const pts = [...F.arch, [F.x1, F.ys + 1], [F.x0, F.ys + 1]]; for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) { const [xi, yi] = pts[i], [xj, yj] = pts[j]; if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) c = !c; } return c; }
function offsetArch(F, d) { return F.arch.map(p => p); void d; }
// the arch + field outline offset outward by d (approx via centroid scaling per point normal)
function offsetPolyline(F, d) {
  const pts = [...F.arch, [F.x1, F.fieldBottom], [F.x0, F.fieldBottom]];
  const n = pts.length, out = [];
  for (let i = 0; i < n; i++) {
    const a = pts[(i - 1 + n) % n], b = pts[(i + 1) % n], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1;
    out.push([pts[i][0] - dy / l * d, pts[i][1] + dx / l * d]);
  }
  return out;
}
function star(b, x, y, r, G) {
  const pts = []; for (let i = 0; i < 16; i++) { const a = i / 16 * TAU - Math.PI / 2, rr = i % 2 ? r * 0.38 : r; pts.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr]); }
  b.save(); b.beginPath(); polyPath(b, pts); b.clip(); b.drawImage(G.gold, 0, 0); b.restore();
}

// ── per frame ─────────────────────────────────────────────────────────────────
function drawFilm2(S, ctx, t) {
  const L = S.L, u = L.u, W = L.W, H = L.H, loop = 8, tt = ((t % loop) + loop) % loop;
  // eye state per format
  let open = 1, look = [0.15, 0.25], agentOpen = 1, textAlpha = T => 1;
  if (L.story) {
    agentOpen = smooth(1.0, 1.6, tt) * (1 - smooth(7.35, 7.8, tt));
    open = easeInOut((tt - 2.9) / 1.6) * (1 - smooth(7.0, 7.7, tt));
    const lk = smooth(4.6, 5.6, tt);
    look = [lerp(0.0, 0.05, lk), lerp(-0.2, 0.95, lk)];
    textAlpha = T => smooth(T.appear, T.appear + 0.7, tt) * (1 - smooth(7.3, 7.85, tt));
  } else if (L.gilding) {
    open = easeInOut((tt - 2.5) / 1.3) * (1 - smooth(7.0, 7.5, tt));
    look = [0.0 + 0.25 * Math.sin(TAU * tt / loop * 2), 0.15];
  } else {
    // slow breath and a wandering gaze; one long blink per loop
    look = [0.45 * Math.sin(TAU * tt / loop + 0.4), 0.45 + 0.25 * Math.sin(TAU * tt / loop * 2 + 1.2)];
    const bl = Math.max(0, 1 - Math.abs(tt - 6.1) / 0.22);
    open = (0.94 + 0.05 * Math.sin(TAU * tt / loop * 2)) * (1 - bl * bl * (3 - 2 * bl));
  }
  if (L.gilding) gildingFrame(S, ctx, tt);
  else ctx.drawImage(S.base, 0, 0);
  // the eye opens in the gold
  drawEye(ctx, S.eye, L.eye.cx, L.eye.cy, open, look, u, null);
  // agents' eyes look up at it
  for (const { a, G } of S.agentGeoms) {
    const target = [L.eye.cx - G.eye.cx, L.eye.cy - G.eye.cy], dl = Math.hypot(...target) || 1;
    drawAgentEye(ctx, G, [target[0] / dl, target[1] / dl], L.story ? agentOpen : 1, u);
    void a;
  }
  // timed letters (the vertical story)
  for (const Lt of S.letters) {
    if (!Lt.T.appear) continue;
    const a = textAlpha(Lt.T); if (a <= 0) continue;
    ctx.save(); ctx.globalAlpha = a; ctx.drawImage(Lt.edge, 0.9 * u, 1.1 * u); ctx.drawImage(Lt.layer, 0, 0); ctx.restore();
  }
  // light moving across burnished gold
  const band = (tt / loop) * 1.6 - 0.3;
  const sc = S.press.ctx, cv = S.press.canvas;
  sc.setTransform(1, 0, 0, 1, 0, 0); sc.globalCompositeOperation = 'source-over'; sc.clearRect(0, 0, W, H);
  const gx0 = lerp(-0.4, 1.4, band) * W, g = sc.createLinearGradient(gx0 - W * 0.35, -H * 0.2, gx0 + W * 0.35, H * 0.4);
  g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(0.5, 'rgba(255,255,255,1)'); g.addColorStop(1, 'rgba(255,255,255,0)');
  sc.fillStyle = g; sc.fillRect(0, 0, W, H);
  sc.globalCompositeOperation = 'destination-in'; sc.drawImage(S.glint, 0, 0); sc.globalCompositeOperation = 'source-over';
  ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.globalAlpha = L.gilding ? 0.42 * smooth(1.8, 2.6, tt) : 0.38; ctx.drawImage(cv, 0, 0); ctx.restore();
}

function gildingFrame(S, ctx, tt) {
  const L = S.L, W = L.W, H = L.H;
  ctx.drawImage(S.bole, 0, 0);
  const k = clamp((tt - 0.15) / 2.1), n = Math.floor(k * S.leafOrder.length), fade = smooth(7.35, 7.95, tt);
  if (n > 0) {
    ctx.save(); ctx.beginPath();
    for (let i = 0; i < n; i++) polyPath(ctx, S.leafOrder[i].poly);
    ctx.clip(); ctx.drawImage(S.base, 0, 0); ctx.restore();
  }
  // the leaf being laid: a lifted square, brighter, settling
  if (n < S.leafOrder.length && k > 0 && k < 1) {
    const l = S.leafOrder[n], c = centroid(l.poly), f = fract(k * S.leafOrder.length);
    ctx.save(); ctx.translate(c[0], c[1]); ctx.rotate((1 - f) * 0.15); ctx.scale(1 + (1 - f) * 0.08, 1 + (1 - f) * 0.08); ctx.translate(-c[0], -c[1]);
    ctx.beginPath(); polyPath(ctx, l.poly); ctx.clip(); ctx.globalAlpha = 0.5 + 0.5 * f; ctx.drawImage(S.base, 0, 0);
    ctx.fillStyle = `rgba(255,240,190,${0.25 * (1 - f)})`; ctx.fillRect(0, 0, W, H); ctx.restore();
  }
  // letters are painted once the gold is down
  const la = smooth(3.7, 4.5, tt) * (1 - fade);
  if (la > 0) for (const Lt of S.letters) { ctx.save(); ctx.globalAlpha = la; ctx.drawImage(Lt.layer, 0, 0); ctx.restore(); }
  if (fade > 0) { ctx.save(); ctx.globalAlpha = fade; ctx.drawImage(S.bole, 0, 0); ctx.restore(); }
}

const FILM2 = { build: buildFilm2, draw: drawFilm2, loop: 8, animated: true, fps: fmt => (fmt === 'poster' || fmt === 'thumb' ? 15 : 24), still: 5.6 };
