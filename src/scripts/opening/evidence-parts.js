/* The evidence loop's drawing kit, copied from the sankala.me code-drawn art study
   (design/prototypes/2026-10-code-drawn-art/evidence-loop). Changed for production:
   the far-star texture is capped at ~6 MP. */
/* ---------------------------------------------------------------- palette */
const INK = '#1b1747', COBALT = '#2f52d9', PERI = '#8c97ff',
      VERM = '#f2603f', CREAM = '#fbedd2', GREEN = '#a6c64f';
const LOOP = 8;
const TAU = Math.PI * 2;

/* ------------------------------------------------------------ math & ease */
const clamp = (x, a = 0, b = 1) => x < a ? a : x > b ? b : x;
const lerp = (a, b, t) => a + (b - a) * t;
const inv = (a, b, x) => clamp((x - a) / (b - a));
const sstep = (a, b, x) => { const t = inv(a, b, x); return t * t * (3 - 2 * t); };
const eio = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const eout = t => 1 - Math.pow(1 - t, 3);
const ein = t => t * t * t;
const eback = t => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
const spring = (t, f = 12, d = 6) => t < 0 ? 0 : Math.exp(-d * t) * Math.cos(f * t);
const bump = (a, b, c, x) => x < a || x > c ? 0 : x < b ? sstep(a, b, x) : 1 - sstep(b, c, x);

function mulberry32(a) {
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function hash2(x, y) {
  let h = (Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
function vnoise(x, y) {
  const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  const a = hash2(xi, yi), b = hash2(xi + 1, yi), c = hash2(xi, yi + 1), d = hash2(xi + 1, yi + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
function fbm(x, y) { let s = 0, a = .5, f = 1; for (let i = 0; i < 5; i++) { s += a * vnoise(x * f, y * f); f *= 2.03; a *= .5; } return s; }

/* 3D */
const v3 = (x, y, z) => [x, y, z];
const dot3 = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const sub3 = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const cross3 = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm3 = a => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
function rotX(a) { const c = Math.cos(a), s = Math.sin(a); return [1, 0, 0, 0, c, -s, 0, s, c]; }
function rotY(a) { const c = Math.cos(a), s = Math.sin(a); return [c, 0, s, 0, 1, 0, -s, 0, c]; }
function rotZ(a) { const c = Math.cos(a), s = Math.sin(a); return [c, -s, 0, s, c, 0, 0, 0, 1]; }
function mulM(A, B) {
  const r = new Array(9);
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++)
    r[i * 3 + j] = A[i * 3] * B[j] + A[i * 3 + 1] * B[3 + j] + A[i * 3 + 2] * B[6 + j];
  return r;
}
const mulMV = (M, v) => [M[0] * v[0] + M[1] * v[1] + M[2] * v[2], M[3] * v[0] + M[4] * v[1] + M[5] * v[2], M[6] * v[0] + M[7] * v[1] + M[8] * v[2]];

/* light: toward the upper left, a little toward the viewer (object space y up) */
const L3 = norm3([-0.48, 0.66, 0.58]);
const LS = (() => { const l = Math.hypot(-0.6, -0.8); return [-0.6 / l, -0.8 / l]; })(); // screen, y down

/* --------------------------------------------------------------- canvas */
const cv = document.getElementById('opening-canvas');
const ctx = cv.getContext('2d');
const scene = document.createElement('canvas');
const sctx = scene.getContext('2d');
let DPR = 1, U = 1, H = 1778, Wpx = 0, Hpx = 0;
let farTex = null, grains = [];
const TEX = { x0: -420, y0: -420, w: 1840, h: 0, fs: 1 };

/* --------------------------------------------------------------- helpers */
function poly(g, P) { g.beginPath(); g.moveTo(P[0][0], P[0][1]); for (let i = 1; i < P.length; i++) g.lineTo(P[i][0], P[i][1]); g.closePath(); }
function bboxOf(P) {
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
  for (const p of P) { if (p[0] < x0) x0 = p[0]; if (p[0] > x1) x1 = p[0]; if (p[1] < y0) y0 = p[1]; if (p[1] > y1) y1 = p[1]; }
  return [x0, y0, x1, y1];
}
function hull2(pts) {
  const p = pts.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo = [], up = [];
  for (const q of p) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); }
  for (let i = p.length - 1; i >= 0; i--) { const q = p[i]; while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q); }
  up.pop(); lo.pop(); return lo.concat(up);
}
/* intersection of a ray from c at angle th with a convex polygon; returns point + outward normal */
function rayHull(c, th, Hp) {
  const dx = Math.cos(th), dy = Math.sin(th);
  let best = null;
  for (let i = 0; i < Hp.length; i++) {
    const a = Hp[i], b = Hp[(i + 1) % Hp.length];
    const ex = b[0] - a[0], ey = b[1] - a[1];
    const den = dx * ey - dy * ex; if (Math.abs(den) < 1e-9) continue;
    const ax = a[0] - c[0], ay = a[1] - c[1];
    const t = (ax * ey - ay * ex) / den, u = (ax * dy - ay * dx) / den;
    if (t > 0 && u >= -1e-6 && u <= 1 + 1e-6 && (!best || t > best.t)) {
      let nx = ey, ny = -ex; const l = Math.hypot(nx, ny); nx /= l; ny /= l;
      if (nx * dx + ny * dy < 0) { nx = -nx; ny = -ny; }
      best = { t, x: c[0] + dx * t, y: c[1] + dy * t, nx, ny };
    }
  }
  return best || { t: 0, x: c[0], y: c[1], nx: dx, ny: dy };
}

/* Halftone: dots on a fixed screen grid (units), radius from shade 0..1.
   shade is a number or a function (x, y) -> 0..1. Caller sets the clip. */
function halftone(g, bb, shade, color, cell, ang) {
  const ca = Math.cos(ang), sa = Math.sin(ang);
  let imin = 1e9, imax = -1e9, jmin = 1e9, jmax = -1e9;
  for (const [x, y] of [[bb[0], bb[1]], [bb[2], bb[1]], [bb[0], bb[3]], [bb[2], bb[3]]]) {
    const i = (x * ca + y * sa) / cell, j = (-x * sa + y * ca) / cell;
    if (i < imin) imin = i; if (i > imax) imax = i; if (j < jmin) jmin = j; if (j > jmax) jmax = j;
  }
  const fn = typeof shade === 'function';
  const k = cell * 0.66;
  g.beginPath();
  for (let j = Math.floor(jmin) - 1; j <= Math.ceil(jmax) + 1; j++) {
    for (let i = Math.floor(imin) - 1; i <= Math.ceil(imax) + 1; i++) {
      const x = (i * ca - j * sa) * cell, y = (i * sa + j * ca) * cell;
      if (x < bb[0] - cell || x > bb[2] + cell || y < bb[1] - cell || y > bb[3] + cell) continue;
      const s = fn ? shade(x, y) : shade;
      if (s <= 0.025) continue;
      const r = Math.sqrt(Math.min(s, 0.92)) * k;
      if (r < 0.32 / U) continue;
      g.moveTo(x + r, y); g.arc(x, y, r, 0, TAU);
    }
  }
  g.fillStyle = color; g.fill();
}
const shadeFromNdl = ndl => clamp((0.6 - ndl) / 1.05, 0, 0.86);

function dash(g, x0, y0, x1, y1, w) {
  g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1);
  g.lineWidth = w; g.lineCap = 'round'; g.strokeStyle = CREAM; g.stroke();
}
/* light dashes along the polygon edge that faces the light */
function lightDashes(g, P, w, inset, seed) {
  let cx = 0, cy = 0; for (const p of P) { cx += p[0]; cy += p[1]; } cx /= P.length; cy /= P.length;
  let best = -2, bi = 0;
  for (let i = 0; i < P.length; i++) {
    const a = P[i], b = P[(i + 1) % P.length];
    let nx = b[1] - a[1], ny = a[0] - b[0]; const l = Math.hypot(nx, ny) || 1; nx /= l; ny /= l;
    const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
    if ((mx - cx) * nx + (my - cy) * ny < 0) { nx = -nx; ny = -ny; }
    const sc = nx * LS[0] + ny * LS[1];
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (sc * Math.min(1, len / (inset * 6)) > best) { best = sc * Math.min(1, len / (inset * 6)); bi = i; }
  }
  if (best < 0.15) return;
  const a = P[bi], b = P[(bi + 1) % P.length];
  const ex = b[0] - a[0], ey = b[1] - a[1], len = Math.hypot(ex, ey);
  if (len < inset * 3.2) return;
  let nx = -ey / len, ny = ex / len;
  if ((cx - a[0]) * nx + (cy - a[1]) * ny < 0) { nx = -nx; ny = -ny; }
  const r = hash2(seed, 7);
  const s0 = 0.14 + r * 0.14, s1 = s0 + 0.16 + hash2(seed, 9) * 0.14;
  const s2 = s1 + 0.07, s3 = Math.min(0.86, s2 + 0.06 + hash2(seed, 11) * 0.06);
  const ox = nx * inset, oy = ny * inset;
  dash(g, a[0] + ex * s0 + ox, a[1] + ey * s0 + oy, a[0] + ex * s1 + ox, a[1] + ey * s1 + oy, w);
  if (s3 - s2 > 0.03) dash(g, a[0] + ex * s2 + ox, a[1] + ey * s2 + oy, a[0] + ex * s3 + ox, a[1] + ey * s3 + oy, w);
}

function sparkle(g, x, y, r, rot = 0) {
  g.save(); g.translate(x, y); g.rotate(rot);
  g.beginPath();
  const t = r * 0.16;
  g.moveTo(0, -r); g.quadraticCurveTo(t, -t, r, 0); g.quadraticCurveTo(t, t, 0, r);
  g.quadraticCurveTo(-t, t, -r, 0); g.quadraticCurveTo(-t, -t, 0, -r);
  g.fillStyle = CREAM; g.fill(); g.restore();
}

/* camera shake that loops in 8 s: integer cycles only */
function handheld(s, amp) {
  const w = TAU / LOOP;
  return {
    x: amp * (4.2 * Math.sin(w * 2 * s + 1.3) + 2.1 * Math.sin(w * 5 * s + 0.4) + 0.9 * Math.sin(w * 13 * s + 2.2)),
    y: amp * (3.6 * Math.sin(w * 3 * s + 2.0) + 1.8 * Math.sin(w * 7 * s + 1.1) + 0.8 * Math.sin(w * 17 * s + 0.3)),
    r: amp * (0.0042 * Math.sin(w * 2 * s + 0.7) + 0.0018 * Math.sin(w * 9 * s + 1.9)),
  };
}

/* ------------------------------------------------------------- 3D meshes */
function boxGeom(w, h, d, c) {
  if (!c) {
    return {
      V: [[-w, -h, -d], [w, -h, -d], [w, h, -d], [-w, h, -d], [-w, -h, d], [w, -h, d], [w, h, d], [-w, h, d]],
      F: [
        { i: [4, 5, 6, 7], n: [0, 0, 1], m: 'front' }, { i: [5, 1, 2, 6], n: [1, 0, 0], m: 'right' },
        { i: [7, 6, 2, 3], n: [0, 1, 0], m: 'top' }, { i: [1, 0, 3, 2], n: [0, 0, -1], m: 'back' },
        { i: [0, 4, 7, 3], n: [-1, 0, 0], m: 'left' }, { i: [0, 1, 5, 4], n: [0, -1, 0], m: 'bottom' },
      ],
    };
  }
  // the head: a box whose front-top-right corner is folded away, showing the paper's cream back
  return {
    V: [[-w, -h, -d], [w, -h, -d], [w, h, -d], [-w, h, -d], [-w, -h, d], [w, -h, d], [-w, h, d],
        [w - c, h, d], [w, h - c, d], [w, h, d - c]],
    F: [
      { i: [4, 5, 8, 7, 6], n: [0, 0, 1], m: 'front' },
      { i: [5, 1, 2, 9, 8], n: [1, 0, 0], m: 'right' },
      { i: [6, 7, 9, 2, 3], n: [0, 1, 0], m: 'top' },
      { i: [7, 8, 9], n: norm3([1, 1, 1]), m: 'fold' },
      { i: [1, 0, 3, 2], n: [0, 0, -1], m: 'back' },
      { i: [0, 4, 6, 3], n: [-1, 0, 0], m: 'left' },
      { i: [0, 1, 5, 4], n: [0, -1, 0], m: 'bottom' },
    ],
  };
}
const HEAD = boxGeom(1, 0.86, 0.92, 0.5);
const NECK = boxGeom(0.2, 0.14, 0.2);
const TORSO = boxGeom(0.64, 0.46, 0.56);
const FOOT = boxGeom(0.2, 0.12, 0.26);

/* object: {x, y, k, R, sx, sy, oy}  -> screen units; object y is up */
function proj(o, v) {
  const p = mulMV(o.R, [v[0] * (o.sx || 1), (v[1] + (o.oy || 0)) * (o.sy || 1), v[2] * (o.sx || 1)]);
  return [o.x + o.k * p[0], o.y - o.k * p[1], p[2]];
}

/* draws a convex mesh with flat fills, halftone shade, light dashes, PERI lines */
function drawMesh(g, geom, o, mat, lw, opts = {}) {
  const P = geom.V.map(v => proj(o, v));
  const vis = [];
  for (const f of geom.F) {
    const n = mulMV(o.R, f.n);
    if (n[2] > 0.02) vis.push({ f, n, P: f.i.map(i => P[i]) });
  }
  for (const F of vis) {
    const m = mat[F.f.m] || mat.default;
    poly(g, F.P); g.fillStyle = m.fill; g.fill();
    const s = shadeFromNdl(dot3(F.n, L3)) * (m.shadeK ?? 1) + (m.shadeAdd || 0);
    const bb = bboxOf(F.P);
    const span = Math.max(1, Math.hypot(bb[2] - bb[0], bb[3] - bb[1]));
    const gx = (bb[0] + bb[2]) / 2, gy = (bb[1] + bb[3]) / 2;
    const grad = m.grad ?? 0.22;
    const sf = (x, y) => s + grad * (((x - gx) * -LS[0] + (y - gy) * -LS[1]) / span * 2 + 0.15);
    if (s + grad > 0.04) {
      g.save(); poly(g, F.P); g.clip();
      halftone(g, bb, sf, m.dot, m.cell || 7.5, m.ang ?? Math.PI / 4);
      g.restore();
    }
  }
  for (const F of vis) {
    const m = mat[F.f.m] || mat.default;
    if (m.light !== false && dot3(F.n, L3) > 0.32) lightDashes(g, F.P, lw * 1.25, lw * 2.6, (opts.seed || 0) * 31 + F.f.i[0]);
  }
  g.lineJoin = 'round'; g.lineCap = 'round'; g.strokeStyle = PERI;
  g.lineWidth = lw * 0.55;
  for (const F of vis) { poly(g, F.P); g.stroke(); }
  const hp = hull2(vis.flatMap(F => F.P.map(p => [p[0], p[1]])));
  g.lineWidth = lw; poly(g, hp); g.stroke();
  return { P, vis, hull: hp };
}

/* affine transform that maps a face-local plane (u right, v up) to screen units */
function faceXf(o, origin, du, dv) {
  const a = proj(o, origin), b = proj(o, [origin[0] + du[0], origin[1] + du[1], origin[2] + du[2]]),
        c = proj(o, [origin[0] + dv[0], origin[1] + dv[1], origin[2] + dv[2]]);
  return [b[0] - a[0], b[1] - a[1], c[0] - a[0], c[1] - a[1], a[0], a[1]];
}
function setXf(g, m, base) { // base: roll matrix already on the scene context
  g.setTransform(base[0], base[1], base[2], base[3], base[4], base[5]);
  g.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
}

/* ------------------------------------------------------------ the riders */
/* feet at (x, y); `up` is the screen direction of the body; h is total height */
function eggPath(g, a, b, y0) {
  // egg centred on x=0, bottom at y0, height 2b, width 2a; top a touch narrower
  const T = [0, y0 - 2 * b], Rr = [a, y0 - b * 0.92], B = [0, y0], Lf = [-a, y0 - b * 0.92];
  g.beginPath();
  g.moveTo(T[0], T[1]);
  g.bezierCurveTo(a * 0.6, T[1], a, y0 - b * 1.55, Rr[0], Rr[1]);
  g.bezierCurveTo(a, y0 - b * 0.32, a * 0.6, y0, B[0], B[1]);
  g.bezierCurveTo(-a * 0.6, y0, -a, y0 - b * 0.32, Lf[0], Lf[1]);
  g.bezierCurveTo(-a, y0 - b * 1.55, -a * 0.6, T[1], T[0], T[1]);
  g.closePath();
}
function limb(g, pts, w, lw, fill) {
  g.lineCap = 'round'; g.lineJoin = 'round';
  g.beginPath(); g.moveTo(pts[0][0], pts[0][1]);
  if (pts.length === 3) g.quadraticCurveTo(pts[1][0], pts[1][1], pts[2][0], pts[2][1]);
  else for (let i = 1; i < pts.length; i++) g.lineTo(pts[i][0], pts[i][1]);
  g.strokeStyle = PERI; g.lineWidth = w + lw * 2; g.stroke();
  g.strokeStyle = fill; g.lineWidth = w; g.stroke();
}
function drawRider(g, base, x, y, upAng, h, st) {
  if (h < 3.5) { // a speck at distance
    g.beginPath(); g.arc(x + Math.cos(upAng) * h * 0.5, y + Math.sin(upAng) * h * 0.5, Math.max(0.9, h * 0.38), 0, TAU);
    g.fillStyle = GREEN; g.fill(); return;
  }
  const lw = Math.max(1.4, h * 0.045);
  const stretch = st.stretch || 1, sx = 1 / Math.sqrt(stretch);
  const leg = h * 0.22, b = h * 0.385, a = h * 0.345;
  const rot = upAng + Math.PI / 2;
  g.save();
  g.translate(x, y); g.rotate(rot);
  g.scale(sx, stretch);
  const by = -leg; // body bottom
  // far arm and legs behind the body
  const armY = by - b * 1.0;
  const legPh = st.legPh || 0, legAmp = st.legAmp || 0;
  for (const side of [-1, 1]) {
    const sw = Math.sin(legPh + (side > 0 ? 0 : Math.PI)) * legAmp;
    const fx = side * a * 0.5 + sw * h * 0.2, fy = Math.abs(sw) * -h * 0.06;
    limb(g, [[side * a * 0.34, by - b * 0.2], [side * a * 0.42 + sw * h * 0.1, by + leg * 0.5], [fx, fy - h * 0.03]], h * 0.1, lw, GREEN);
    g.beginPath(); g.ellipse(fx + side * h * 0.035, fy - h * 0.02, h * 0.075, h * 0.045, 0, 0, TAU);
    g.fillStyle = GREEN; g.fill(); g.strokeStyle = PERI; g.lineWidth = lw * 0.9; g.stroke();
  }
  const arm = (side, ang, len) => {
    const sx0 = side * a * 0.86, sy0 = armY;
    const ex = sx0 + Math.cos(ang) * len, ey = sy0 + Math.sin(ang) * len;
    const mx = (sx0 + ex) / 2 + side * len * 0.12, my = (sy0 + ey) / 2 - len * 0.1;
    limb(g, [[sx0, sy0], [mx, my], [ex, ey]], h * 0.095, lw, GREEN);
    return [ex, ey];
  };
  const hands = {};
  if (st.armBehind) { hands.L = arm(-1, st.armL, h * 0.36); }
  // body
  eggPath(g, a, b, by);
  g.fillStyle = GREEN; g.fill();
  // shade: dots on the far side from the light (computed in screen space)
  g.save();
  eggPath(g, a, b, by); g.clip();
  const m = g.getTransform();
  g.setTransform(base[0], base[1], base[2], base[3], base[4], base[5]);
  const cxs = x + Math.cos(upAng) * (leg + b) * stretch, cys = y + Math.sin(upAng) * (leg + b) * stretch;
  const rS = b * 1.08;
  halftone(g, [cxs - rS * 1.4, cys - rS * 1.4, cxs + rS * 1.4, cys + rS * 1.4], (px, py) => {
    const dx = (px - cxs) / rS, dy = (py - cys) / rS;
    const lit = dx * LS[0] + dy * LS[1];
    const rr = Math.hypot(dx, dy);
    return clamp((-lit - 0.12) * 0.62 + Math.max(0, rr - 0.84) * 0.8, 0, 0.5);
  }, COBALT, Math.max(4.2, Math.min(6, h * 0.07)), Math.PI / 12);
  g.setTransform(m);
  g.restore();
  // a cream dash of light on the upper left rim (in screen space)
  {
    const m2 = g.getTransform();
    g.setTransform(base[0], base[1], base[2], base[3], base[4], base[5]);
    const la = Math.atan2(LS[1], LS[0]);
    g.beginPath(); g.arc(cxs, cys, rS * 0.74, la - 0.55, la - 0.08);
    g.strokeStyle = CREAM; g.lineWidth = lw * 1.25; g.lineCap = 'round'; g.stroke();
    if (h > 14) { g.beginPath(); g.arc(cxs, cys, rS * 0.74, la + 0.12, la + 0.26); g.stroke(); }
    g.setTransform(m2);
  }
  eggPath(g, a, b, by);
  g.strokeStyle = PERI; g.lineWidth = lw; g.stroke();
  // the eye
  const ey = by - b * 1.22, er = a * 0.56;
  g.beginPath(); g.arc(0, ey, er, 0, TAU); g.fillStyle = CREAM; g.fill();
  g.save(); g.beginPath(); g.arc(0, ey, er, 0, TAU); g.clip();
  const lx = (st.lookX || 0) * er * 0.42, ly = (st.lookY || 0) * er * 0.42;
  const pr = er * (st.pupil || 0.5);
  g.beginPath(); g.arc(lx, ly + ey, pr, 0, TAU); g.fillStyle = INK; g.fill();
  g.beginPath(); g.arc(lx - pr * 0.38, ly + ey - pr * 0.4, pr * 0.3, 0, TAU); g.fillStyle = CREAM; g.fill();
  const open = st.open ?? 1;
  if (open < 0.999) {
    g.fillStyle = GREEN; g.fillRect(-er * 1.2, ey - er * 1.2, er * 2.4, er * 2.4 * (1 - open));
    g.beginPath(); g.moveTo(-er, ey - er * 1.2 + er * 2.4 * (1 - open)); g.lineTo(er, ey - er * 1.2 + er * 2.4 * (1 - open));
    g.strokeStyle = PERI; g.lineWidth = lw * 0.8; g.stroke();
  }
  g.restore();
  g.beginPath(); g.arc(0, ey, er, 0, TAU); g.strokeStyle = PERI; g.lineWidth = lw * 0.85; g.stroke();
  // little sprout on top
  limb(g, [[0, by - 2 * b + lw], [a * 0.12, by - 2 * b - h * 0.08], [a * 0.3, by - 2 * b - h * 0.1]], h * 0.04, lw * 0.7, GREEN);
  // arms in front
  if (!st.armBehind) hands.L = arm(-1, st.armL, h * 0.36);
  hands.R = arm(1, st.armR, h * 0.36);
  g.restore();
  // hand positions in screen space (for ropes)
  const toScreen = (p) => {
    const px = p[0] * sx, py = p[1] * stretch;
    const c = Math.cos(rot), s = Math.sin(rot);
    return [x + px * c - py * s, y + px * s + py * c];
  };
  return { L: toScreen(hands.L), R: toScreen(hands.R) };
}

/* --------------------------------------------------------- the robot */
const ROBOT_MAT = {
  front: { fill: COBALT, dot: INK, cell: 7.5 },
  right: { fill: COBALT, dot: INK, cell: 7.5 },
  top: { fill: COBALT, dot: INK, cell: 7.5 },
  fold: { fill: CREAM, dot: PERI, cell: 7, shadeK: 0.9, light: false, ang: Math.PI * 5 / 12, grad: 0.12 },
  default: { fill: COBALT, dot: INK, cell: 7.5 },
};

function drawEye(g, base, o, ex, ey, st, k) {
  // eye decal on the front plane (u right, v up), radius in head units
  const z = 0.92 + 0.004;
  const xf = faceXf(o, [ex, ey, z], [1, 0, 0], [0, 1, 0]);
  const r = 0.29 * st.eyeScale;
  const lwL = (st.lw / k);
  setXf(g, xf, base);
  g.beginPath(); g.ellipse(0, 0, r, r, 0, 0, TAU); g.fillStyle = CREAM; g.fill();
  g.save();
  g.beginPath(); g.ellipse(0, 0, r, r, 0, 0, TAU); g.clip();
  // pupil (local v is up)
  const px = st.lookX * r * 0.4, py = st.lookY * r * 0.4;
  const pr = r * 0.5 * st.pupil;
  g.beginPath(); g.arc(px, py, pr, 0, TAU); g.fillStyle = INK; g.fill();
  if (st.sparkle < 0.5) {
    g.beginPath(); g.arc(px - pr * 0.36, py + pr * 0.4, pr * 0.28, 0, TAU); g.fillStyle = CREAM; g.fill();
    g.beginPath(); g.arc(px + pr * 0.34, py - pr * 0.36, pr * 0.11, 0, TAU); g.fillStyle = CREAM; g.fill();
  }
  // a shade crescent of PERI dots inside the eye, lower right, in screen space
  const m = g.getTransform();
  g.setTransform(base[0], base[1], base[2], base[3], base[4], base[5]);
  const c = proj(o, [ex, ey, z]);
  const rS = r * k;
  halftone(g, [c[0] - rS, c[1] - rS, c[0] + rS, c[1] + rS], (x, y) => {
    const dx = (x - c[0]) / rS, dy = (y - c[1]) / rS;
    const lit = dx * LS[0] + dy * LS[1];
    return clamp((-lit - 0.25) * 0.6 + Math.max(0, Math.hypot(dx, dy) - 0.82) * 1.2, 0, 0.55);
  }, PERI, 6.5, Math.PI * 5 / 12);
  g.setTransform(m);
  // the lid: cobalt, coming down from the top
  const open = st.open;
  if (open < 0.999) {
    const yl = r - 2 * r * (1 - open);
    g.beginPath(); g.rect(-r * 1.2, yl, r * 2.4, r * 1.3);
    g.fillStyle = COBALT; g.fill();
    g.beginPath(); g.moveTo(-r * 1.1, yl); g.quadraticCurveTo(0, yl - r * 0.12, r * 1.1, yl);
    g.strokeStyle = PERI; g.lineWidth = lwL * 0.9; g.stroke();
  }
  g.restore();
  g.beginPath(); g.ellipse(0, 0, r, r, 0, 0, TAU);
  g.strokeStyle = PERI; g.lineWidth = lwL * 0.8; g.stroke();
  g.setTransform(base[0], base[1], base[2], base[3], base[4], base[5]);
  // wonder: four-point star glints inside the pupil (screen space, crisp)
  if (st.sparkle > 0.01) {
    const p = proj(o, [ex + px - pr * 0.3, ey + py + pr * 0.32, z]);
    sparkle(g, p[0], p[1], pr * k * 0.62 * st.sparkle, 0.12);
    const p2 = proj(o, [ex + px + pr * 0.42, ey + py - pr * 0.38, z]);
    sparkle(g, p2[0], p2[1], pr * k * 0.26 * st.sparkle, -0.2);
  }
}

function drawEar(g, base, o, st, k) {
  // vermilion disc on the right face, extruded outward along +x
  const w = 1, lwL = st.lw / k, r = 0.34;
  const off = st.earOff || [0, 0];
  const layers = 6, depth = 0.17;
  const xfAt = d => faceXf(o, [w + d, -0.06 + off[1], off[0]], [0, 0, -1], [0, 1, 0]);
  // body of the disc: stacked ellipses
  for (let i = 0; i <= layers; i++) {
    setXf(g, xfAt(depth * i / layers), base);
    g.beginPath(); g.arc(0, 0, r, 0, TAU); g.fillStyle = VERM; g.fill();
  }
  // shade the rim band with ink dots
  g.save();
  g.beginPath();
  for (let i = 0; i <= layers; i++) {
    const m = xfAt(depth * i / layers);
    // build each ellipse in screen space via transform math
    const steps = 36;
    for (let j = 0; j <= steps; j++) {
      const a = j / steps * TAU, u = Math.cos(a) * r, v = Math.sin(a) * r;
      const X = m[0] * u + m[2] * v + m[4], Y = m[1] * u + m[3] * v + m[5];
      if (j === 0) g.moveTo(X, Y); else g.lineTo(X, Y);
    }
    g.closePath();
  }
  g.setTransform(base[0], base[1], base[2], base[3], base[4], base[5]);
  g.clip('nonzero');
  const c = proj(o, [w, -0.06, 0]);
  halftone(g, [c[0] - r * k * 1.6, c[1] - r * k * 1.6, c[0] + r * k * 1.6, c[1] + r * k * 1.6], 0.62, INK, 7.2, Math.PI / 4);
  g.restore();
  // the face of the disc
  const fm = xfAt(depth);
  setXf(g, fm, base);
  g.beginPath(); g.arc(0, 0, r, 0, TAU); g.fillStyle = VERM; g.fill();
  g.save(); g.beginPath(); g.arc(0, 0, r, 0, TAU); g.clip();
  const mm = g.getTransform();
  g.setTransform(base[0], base[1], base[2], base[3], base[4], base[5]);
  const cf = [fm[4], fm[5]], rS = Math.hypot(fm[0], fm[1]) * r;
  halftone(g, [cf[0] - rS * 1.5, cf[1] - rS * 1.5, cf[0] + rS * 1.5, cf[1] + rS * 1.5], (x, y) => {
    const dx = (x - cf[0]) / rS, dy = (y - cf[1]) / rS;
    return clamp(0.12 + (dx * -LS[0] + dy * -LS[1]) * 0.35, 0, 0.5);
  }, INK, 7.2, Math.PI / 4);
  g.setTransform(mm);
  g.restore();
  g.beginPath(); g.arc(0, 0, r, 0, TAU); g.strokeStyle = PERI; g.lineWidth = lwL * 0.9; g.stroke();
  g.beginPath(); g.arc(0, 0, r * 0.52, 0, TAU); g.lineWidth = lwL * 0.5; g.stroke();
  // light on the disc
  g.beginPath(); g.arc(0, 0, r * 0.76, Math.PI * 0.62, Math.PI * 0.9);
  g.strokeStyle = CREAM; g.lineWidth = lwL * 1.2; g.lineCap = 'round'; g.stroke();
  // back edge outline
  setXf(g, xfAt(0), base);
  g.beginPath(); g.arc(0, 0, r, 0, TAU); g.strokeStyle = PERI; g.lineWidth = lwL * 0.9;
  g.save(); setXf(g, fm, base); g.beginPath(); g.rect(-9, -9, 18, 18); g.arc(0, 0, r, 0, TAU, true); g.restore();
  g.setTransform(base[0], base[1], base[2], base[3], base[4], base[5]);
}

/* the paper robot. pose: {x,y,k,yaw,pitch,roll,sy, eye state..., arms (full only)} */
function drawRobot(g, base, pose, full) {
  const k = pose.k;
  const lw = Math.max(1.6, k * 0.022);
  const Rb = mulM(rotZ(pose.roll), mulM(rotX(pose.pitch), rotY(pose.yaw)));
  const Rh = mulM(Rb, mulM(rotX(pose.headPitch || 0), rotY(pose.headYaw || 0)));
  const sy = pose.sy || 1, sx = 1 / Math.sqrt(sy);
  const headO = { x: pose.x, y: pose.y, k, R: Rh, sx, sy };
  // body hangs below the head: neck and torso in the body frame
  const neckY = -0.86 - 0.12, torsoY = -0.86 - 0.24 - 0.46;
  const bodyO = (oy) => ({ x: pose.x, y: pose.y, k, R: Rb, oy, sx: 1, sy: 1 });
  const bodyMat = {
    default: { fill: COBALT, dot: INK, cell: 7.5 },
  };
  const P = (o, v) => proj(o, v);
  const limbW = k * 0.2;
  const armPts = (side) => {
    const sh = P(bodyO(torsoY), [side * 0.7, 0.28, 0]);
    const a1 = pose.arm[side > 0 ? 1 : 0];
    const el = [sh[0] + Math.cos(a1[0]) * k * 0.55, sh[1] + Math.sin(a1[0]) * k * 0.55];
    const ha = [el[0] + Math.cos(a1[1]) * k * 0.5, el[1] + Math.sin(a1[1]) * k * 0.5];
    return [sh, el, ha];
  };
  const legPts = (side) => {
    const hp = P(bodyO(torsoY), [side * 0.34, -0.44, 0]);
    const l1 = pose.leg[side > 0 ? 1 : 0];
    const kn = [hp[0] + Math.cos(l1[0]) * k * 0.42, hp[1] + Math.sin(l1[0]) * k * 0.42];
    const ft = [kn[0] + Math.cos(l1[1]) * k * 0.4, kn[1] + Math.sin(l1[1]) * k * 0.4];
    return [hp, kn, ft];
  };
  const drawLimb = (pts) => {
    limb(g, pts, limbW, lw, COBALT);
    // shade dash on the limb (ink) and light dash (cream)
    const [a, b, c] = pts;
    g.beginPath(); g.arc(c[0], c[1], limbW * 0.62, 0, TAU); g.fillStyle = COBALT; g.fill();
    g.strokeStyle = PERI; g.lineWidth = lw; g.stroke();
    dash(g, lerp(a[0], b[0], 0.25) - limbW * 0.22, lerp(a[1], b[1], 0.25) - limbW * 0.22, lerp(a[0], b[0], 0.6) - limbW * 0.22, lerp(a[1], b[1], 0.6) - limbW * 0.22, lw * 1.1);
  };
  if (full) {
    // far limbs (robot's left = -x, away from us when yaw < 0)
    drawLimb(legPts(-1));
    drawLimb(armPts(-1));
    drawMesh(g, TORSO, bodyO(torsoY), bodyMat, lw, { seed: 2 });
    drawLimb(legPts(1));
  } else {
    drawMesh(g, TORSO, bodyO(torsoY), bodyMat, lw, { seed: 2 });
  }
  drawMesh(g, NECK, bodyO(neckY), bodyMat, lw * 0.8, { seed: 3 });
  const head = drawMesh(g, HEAD, headO, ROBOT_MAT, lw, { seed: 1 });
  const frontVis = mulMV(Rh, [0, 0, 1])[2] > 0.05;
  const st = Object.assign({ lw }, pose.eyes);
  if (frontVis) {
    drawEye(g, base, headO, -0.45, -0.04, st, k);
    drawEye(g, base, headO, 0.38, -0.04, st, k);
  }
  if (mulMV(Rh, [1, 0, 0])[2] > 0.02) drawEar(g, base, Object.assign({}, headO), Object.assign({ earOff: pose.earOff }, st), k);
  if (full) drawLimb(armPts(1));
  return head;
}

const STARS = (() => {
  const rnd = mulberry32(4242);
  const out = [];
  // the false-lock star, placed where the reticle will look
  out.push({ x: 432, y: 0.29, r: 3.4, e: 0.55, par: 0.75, tw: 0, kind: 2, cyc: 2 });
  for (let i = 0; i < 230; i++) {
    const near = rnd() < 0.28;
    out.push({
      x: -260 + rnd() * 1520, y: -0.16 + rnd() * 1.32,
      r: near ? 2.2 + rnd() * 2.0 : 1.0 + rnd() * 1.4,
      e: near ? 0.62 : 0.36, par: near ? 0.85 : 0.5,
      tw: rnd() * TAU, kind: near && rnd() < 0.18 ? 2 : (rnd() < 0.5 ? 1 : 0),
      cyc: 1 + Math.floor(rnd() * 3),
    });
  }
  return out;
})();

function buildFarTex() {
  // nebula of halftone dots and faint stars, cached at 1.45x so zoom stays crisp
  TEX.h = H + 840;
  // cached at up to 1.45x so the zoom stays crisp, but never more than ~6 MP (memory on phones)
  TEX.fs = Math.min(U * 1.45, Math.sqrt(6e6 / (TEX.w * TEX.h)));
  const c = document.createElement('canvas');
  c.width = Math.ceil(TEX.w * TEX.fs); c.height = Math.ceil(TEX.h * TEX.fs);
  const g = c.getContext('2d');
  g.setTransform(TEX.fs, 0, 0, TEX.fs, -TEX.x0 * TEX.fs, -TEX.y0 * TEX.fs);
  g.fillStyle = INK; g.fillRect(TEX.x0, TEX.y0, TEX.w, TEX.h);
  const bb = [TEX.x0, TEX.y0, TEX.x0 + TEX.w, TEX.y0 + TEX.h];
  // two inks of nebula: cobalt (broad) and peri (wisps)
  halftone(g, bb, (x, y) => {
    const n = fbm(x * 0.0021 + 3.1, y * 0.0021 + 1.7);
    const band = Math.exp(-Math.pow((y - 0.33 * H - (x - 500) * 0.55) / 520, 2));
    return clamp((n - 0.5) * 1.9 * band, 0, 0.3);
  }, COBALT, 8, Math.PI / 12);
  halftone(g, bb, (x, y) => {
    const n = fbm(x * 0.0034 + 9.2, y * 0.0034 + 4.4);
    const band = Math.exp(-Math.pow((y - 0.3 * H - (x - 500) * 0.6) / 360, 2));
    return clamp((n - 0.56) * 2.2 * band, 0, 0.26);
  }, PERI, 7, Math.PI * 5 / 12);
  // faint far stars
  const rnd = mulberry32(777);
  g.fillStyle = CREAM;
  for (let i = 0; i < 520; i++) {
    const x = TEX.x0 + rnd() * TEX.w, y = TEX.y0 + rnd() * TEX.h, r = 0.55 + rnd() * rnd() * 1.3;
    g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill();
  }
  g.fillStyle = PERI;
  for (let i = 0; i < 380; i++) {
    const x = TEX.x0 + rnd() * TEX.w, y = TEX.y0 + rnd() * TEX.h, r = 0.6 + rnd() * 1.1;
    g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill();
  }
  farTex = c;
}

function buildGrain() {
  grains = [];
  const w = Math.ceil(Wpx / 1.5), h = Math.ceil(Hpx / 1.5);
  const rnd = mulberry32(1234);
  const cr = [251, 237, 210], ik = [27, 23, 71];
  for (let f = 0; f < 4; f++) {
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    const g = c.getContext('2d');
    const id = g.createImageData(w, h), d = id.data;
    for (let i = 0; i < w * h; i++) {
      const r = rnd();
      if (r < 0.055) { d[i * 4] = cr[0]; d[i * 4 + 1] = cr[1]; d[i * 4 + 2] = cr[2]; d[i * 4 + 3] = 14 + rnd() * 26; }
      else if (r < 0.14) { d[i * 4] = ik[0]; d[i * 4 + 1] = ik[1]; d[i * 4 + 2] = ik[2]; d[i * 4 + 3] = 30 + rnd() * 40; }
    }
    g.putImageData(id, 0, 0);
    grains.push(c);
  }
}

/* bg camera: {ax, ay} anchor on screen, {px, py} same point in star space, Z zoom, d offset */
function starScreen(st, cam) {
  const ze = Math.pow(cam.Z, st.e);
  return [cam.ax + (st.x - cam.px) * ze + cam.dx * st.par, cam.ay + (st.y * H - cam.py) * ze + cam.dy * st.par];
}
function drawBG(g, cam, camPrev, s) {
  // far layer: nebula texture
  const zf = Math.pow(cam.Z, 0.12);
  g.save();
  g.translate(cam.ax + cam.dx * 0.25, cam.ay + cam.dy * 0.25);
  g.scale(zf, zf);
  g.translate(-cam.px, -cam.py);
  g.drawImage(farTex, TEX.x0, TEX.y0, TEX.w, TEX.h);
  g.restore();
  // near stars, procedural, with zoom streaks
  g.lineCap = 'round';
  for (let i = 0; i < STARS.length; i++) {
    const st = STARS[i];
    const p = starScreen(st, cam);
    if (p[0] < -60 || p[0] > 1060 || p[1] < -60 || p[1] > H + 60) continue;
    const q = camPrev ? starScreen(st, camPrev) : p;
    const tw = 0.75 + 0.25 * Math.sin(TAU * st.cyc * s / LOOP + st.tw);
    const streak = Math.hypot(p[0] - q[0], p[1] - q[1]);
    if (streak > st.r * 1.5) {
      g.beginPath(); g.moveTo(q[0], q[1]); g.lineTo(p[0], p[1]);
      g.strokeStyle = st.kind === 1 ? PERI : CREAM; g.lineWidth = st.r * 1.5; g.stroke();
    } else if (st.kind === 2) {
      sparkle(g, p[0], p[1], st.r * 3.4 * tw, 0);
      g.beginPath(); g.arc(p[0], p[1], st.r * 0.55, 0, TAU); g.fillStyle = CREAM; g.fill();
    } else {
      g.beginPath(); g.arc(p[0], p[1], st.r * tw, 0, TAU); g.fillStyle = st.kind === 1 ? PERI : CREAM; g.fill();
    }
  }
}

/* ------------------------------------------------------------ dot-matrix */
const GLYPHS = {
  '0': ['.###.', '#...#', '#..##', '#.#.#', '##..#', '#...#', '.###.'],
  '1': ['..#..', '.##..', '..#..', '..#..', '..#..', '..#..', '.###.'],
  '2': ['.###.', '#...#', '....#', '...#.', '..#..', '.#...', '#####'],
  '3': ['#####', '...#.', '..#..', '...#.', '....#', '#...#', '.###.'],
  '4': ['...#.', '..##.', '.#.#.', '#..#.', '#####', '...#.', '...#.'],
  '5': ['#####', '#....', '####.', '....#', '....#', '#...#', '.###.'],
  '6': ['..##.', '.#...', '#....', '####.', '#...#', '#...#', '.###.'],
  '7': ['#####', '....#', '...#.', '..#..', '.#...', '.#...', '.#...'],
  '8': ['.###.', '#...#', '#...#', '.###.', '#...#', '#...#', '.###.'],
  '9': ['.###.', '#...#', '#...#', '.####', '....#', '...#.', '.##..'],
  ':': ['.', '.', '#', '.', '#', '.', '.'],
  '.': ['.', '.', '.', '.', '.', '.', '#'],
  ' ': ['...', '...', '...', '...', '...', '...', '...'],
  'A': ['.###.', '#...#', '#...#', '#####', '#...#', '#...#', '#...#'],
  'C': ['.###.', '#...#', '#....', '#....', '#....', '#...#', '.###.'],
  'E': ['#####', '#....', '#....', '####.', '#....', '#....', '#####'],
  'F': ['#####', '#....', '#....', '####.', '#....', '#....', '#....'],
  'K': ['#...#', '#..#.', '#.#..', '##...', '#.#..', '#..#.', '#...#'],
  'L': ['#....', '#....', '#....', '#....', '#....', '#....', '#####'],
  'O': ['.###.', '#...#', '#...#', '#...#', '#...#', '#...#', '.###.'],
  'P': ['####.', '#...#', '#...#', '####.', '#....', '#....', '#....'],
  'R': ['####.', '#...#', '#...#', '####.', '#.#..', '#..#.', '#...#'],
  'S': ['.####', '#....', '#....', '.###.', '....#', '....#', '####.'],
  'T': ['#####', '..#..', '..#..', '..#..', '..#..', '..#..', '..#..'],
  'W': ['#...#', '#...#', '#...#', '#.#.#', '#.#.#', '##.##', '#...#'],
  'x': ['.....', '.....', '#...#', '.#.#.', '..#..', '.#.#.', '#...#'],
  '!': ['#', '#', '#', '#', '#', '.', '#'],
};
function textWidth(str, pitch) {
  let w = 0; for (const ch of str) { const gl = GLYPHS[ch] || GLYPHS[' ']; w += (gl[0].length + 1) * pitch; } return w - pitch;
}
function dotText(g, str, x, y, pitch, color, align = 'left') {
  if (align === 'right') x -= textWidth(str, pitch);
  if (align === 'center') x -= textWidth(str, pitch) / 2;
  g.beginPath();
  const r = pitch * 0.4;
  for (const ch of str) {
    const gl = GLYPHS[ch] || GLYPHS[' '];
    for (let row = 0; row < 7; row++) for (let col = 0; col < gl[row].length; col++) {
      if (gl[row][col] === '#') { const cx = x + col * pitch + pitch / 2, cy = y + row * pitch + pitch / 2; g.moveTo(cx + r, cy); g.arc(cx, cy, r, 0, TAU); }
    }
    x += (gl[0].length + 1) * pitch;
  }
  g.fillStyle = color; g.fill();
}

/* --------------------------------------------------------------- overlay */
function bracketBox(g, cx, cy, w, h, lw, arm) {
  const x0 = cx - w / 2, x1 = cx + w / 2, y0 = cy - h / 2, y1 = cy + h / 2;
  const a = Math.min(arm, w * 0.4, h * 0.4);
  g.beginPath();
  g.moveTo(x0, y0 + a); g.lineTo(x0, y0); g.lineTo(x0 + a, y0);
  g.moveTo(x1 - a, y0); g.lineTo(x1, y0); g.lineTo(x1, y0 + a);
  g.moveTo(x1, y1 - a); g.lineTo(x1, y1); g.lineTo(x1 - a, y1);
  g.moveTo(x0 + a, y1); g.lineTo(x0, y1); g.lineTo(x0, y1 - a);
  g.lineWidth = lw; g.lineCap = 'round'; g.lineJoin = 'round'; g.strokeStyle = CREAM; g.stroke();
}
function cross(g, x, y, r, lw) {
  g.beginPath(); g.moveTo(x - r, y); g.lineTo(x - r * 0.35, y); g.moveTo(x + r * 0.35, y); g.lineTo(x + r, y);
  g.moveTo(x, y - r); g.lineTo(x, y - r * 0.35); g.moveTo(x, y + r * 0.35); g.lineTo(x, y + r);
  g.lineWidth = lw; g.strokeStyle = CREAM; g.lineCap = 'round'; g.stroke();
}