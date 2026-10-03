/* ═══════════════════════════════════════════════════════════════════════════
   kit.js — shared hand: noise, paper, ink, carving, lettering.
   Plain script (no modules) so the page also runs from file://.
   Utilities are copied from ../paper-robot-materials (the same robot, the same
   hand) and extended with the pieces the two film processes need.
   ═══════════════════════════════════════════════════════════════════════════ */
'use strict';
const TAU = Math.PI * 2;
const clamp = (v, a = 0, b = 1) => v < a ? a : v > b ? b : v;
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (a, b, v) => { const t = clamp((v - a) / (b - a)); return t * t * (3 - 2 * t); };
const fract = v => v - Math.floor(v);
const clampI = (v, a, b) => v < a ? a : v > b ? b : v;

function mulberry32(a) {
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function hash2(x, y, s = 0) {
  let h = Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263) + Math.imul(s | 0, 982451653);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}
function vnoise(x, y, s = 0) {
  const xi = Math.floor(x), yi = Math.floor(y);
  const xf = x - xi, yf = y - yi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  const a = hash2(xi, yi, s), b = hash2(xi + 1, yi, s), c = hash2(xi, yi + 1, s), d = hash2(xi + 1, yi + 1, s);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
function fbm(x, y, oct = 4, s = 0, lac = 2.03, gain = 0.5) {
  let sum = 0, amp = 0.5, norm = 0;
  for (let i = 0; i < oct; i++) { sum += amp * vnoise(x, y, s + i * 17); norm += amp; x *= lac; y *= lac; amp *= gain; }
  return sum / norm;
}
function hexRGB(h) { const n = parseInt(h.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
function rgba(c, a = 1) { return `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`; }
function mixRGB(a, b, t) { return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)]; }
function shadeRGB(c, k) { return k >= 0 ? mixRGB(c, [255, 255, 255], k) : mixRGB(c, [0, 0, 0], -k); }

function makeCanvas(w, h) {
  const c = document.createElement('canvas');
  c.width = Math.max(1, Math.ceil(w)); c.height = Math.max(1, Math.ceil(h));
  return c;
}
function ctxOf(c) { return c.getContext('2d'); }

// polygon helpers -----------------------------------------------------------
function polyPath(ctx, pts, close = true) {
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  if (close) ctx.closePath();
}
function fillPoly(ctx, pts, style) { ctx.beginPath(); polyPath(ctx, pts); ctx.fillStyle = style; ctx.fill(); }
function centroid(pts) { let x = 0, y = 0; for (const p of pts) { x += p[0]; y += p[1]; } return [x / pts.length, y / pts.length]; }
function bboxOf(pts) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const p of pts) { if (p[0] < x0) x0 = p[0]; if (p[1] < y0) y0 = p[1]; if (p[0] > x1) x1 = p[0]; if (p[1] > y1) y1 = p[1]; }
  return { x0, y0, x1, y1, w: x1 - x0, h: y1 - y0 };
}
// subdivide each edge and jitter perpendicular: hand-cut / hand-carved edges
function wobble(pts, step, amp, rnd, close = true) {
  const out = [], n = pts.length;
  for (let i = 0; i < (close ? n : n - 1); i++) {
    const a = pts[i], b = pts[(i + 1) % n];
    const dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy);
    const k = Math.max(1, Math.round(len / step));
    const nx = -dy / (len || 1), ny = dx / (len || 1);
    for (let j = 0; j < k; j++) {
      const t = j / k, o = j === 0 ? amp * 0.3 * (rnd() - 0.5) : amp * (rnd() - 0.5);
      out.push([a[0] + dx * t + nx * o, a[1] + dy * t + ny * o]);
    }
  }
  if (!close) out.push(pts[n - 1]);
  return out;
}
function insetPoly(pts, d) {
  const c = centroid(pts);
  return pts.map(p => { const dx = p[0] - c[0], dy = p[1] - c[1], l = Math.hypot(dx, dy) || 1; return [p[0] - dx / l * d, p[1] - dy / l * d]; });
}
function lerpPt(a, b, t) { return [lerp(a[0], b[0], t), lerp(a[1], b[1], t)]; }
function ellipsePts(cx, cy, rx, ry, n = 48, rot = 0) {
  const out = [];
  for (let i = 0; i < n; i++) { const a = i / n * TAU; const x = Math.cos(a) * rx, y = Math.sin(a) * ry; out.push([cx + x * Math.cos(rot) - y * Math.sin(rot), cy + x * Math.sin(rot) + y * Math.cos(rot)]); }
  return out;
}
function roundRectPts(x, y, w, h, r, n = 6) {
  const out = [], cs = [[x + w - r, y + r, -0.25], [x + w - r, y + h - r, 0], [x + r, y + h - r, 0.25], [x + r, y + r, 0.5]];
  for (const [cx, cy, a0] of cs) for (let i = 0; i <= n; i++) { const a = (a0 + i / n * 0.25) * TAU; out.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); }
  return out;
}
// polyline helpers ------------------------------------------------------------
function resample(pl, step) {
  const out = [pl[0]];
  for (let i = 1; i < pl.length; i++) {
    const a = pl[i - 1], b = pl[i], l = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const n = Math.max(1, Math.ceil(l / step));
    for (let j = 1; j <= n; j++) out.push(lerpPt(a, b, j / n));
  }
  return out;
}
function quadPts(a, c, b, n = 24) {
  const out = [];
  for (let i = 0; i <= n; i++) { const t = i / n, s = 1 - t; out.push([s * s * a[0] + 2 * s * t * c[0] + t * t * b[0], s * s * a[1] + 2 * s * t * c[1] + t * t * b[1]]); }
  return out;
}
// offset a polyline into a tube polygon; w may be a function of t (0..1)
function tubePoly(pl, w) {
  const L = [], R = [], n = pl.length;
  for (let i = 0; i < n; i++) {
    const a = pl[Math.max(0, i - 1)], b = pl[Math.min(n - 1, i + 1)];
    const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1, nx = -dy / l, ny = dx / l;
    const ww = (typeof w === 'function' ? w(i / (n - 1)) : w) / 2;
    L.push([pl[i][0] + nx * ww, pl[i][1] + ny * ww]); R.push([pl[i][0] - nx * ww, pl[i][1] - ny * ww]);
  }
  return L.concat(R.reverse());
}
function polyLength(pl) { let l = 0; for (let i = 1; i < pl.length; i++) l += Math.hypot(pl[i][0] - pl[i - 1][0], pl[i][1] - pl[i - 1][1]); return l; }
// point and unit tangent at arclength fraction t
function alongPoly(pl, t) {
  const total = polyLength(pl), target = clamp(t) * total; let acc = 0;
  for (let i = 1; i < pl.length; i++) {
    const a = pl[i - 1], b = pl[i], l = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (acc + l >= target || i === pl.length - 1) {
      const k = l ? (target - acc) / l : 0, tx = (b[0] - a[0]) / (l || 1), ty = (b[1] - a[1]) / (l || 1);
      return { p: [lerp(a[0], b[0], clamp(k)), lerp(a[1], b[1], clamp(k))], t: [tx, ty] };
    }
    acc += l;
  }
  return { p: pl[pl.length - 1], t: [1, 0] };
}

// pixel helpers: generators yield so the scheduler can slice heavy work -----
function* pixelRows(h, fn) { for (let y = 0; y < h; y++) { fn(y); if ((y & 15) === 15) yield; } }

// Paper: low-frequency mottle (computed small, upscaled), full-res tooth, fibres.
function* makePaper(W, H, u, col, o = {}) {
  const { mottle = 0.05, tooth = 0.05, fibres = 220, fibreCol = null, seed = 1, warm = 0 } = o;
  const c = makeCanvas(W, H), ctx = ctxOf(c);
  const sw = Math.ceil(W / 6), sh = Math.ceil(H / 6), small = makeCanvas(sw, sh), sc = ctxOf(small);
  const base = hexRGB(col), si = sc.createImageData(sw, sh), sd = si.data;
  yield* pixelRows(sh, y => {
    for (let x = 0; x < sw; x++) {
      const n = fbm(x / 34, y / 34, 4, seed) - 0.5, n2 = fbm(x / 9, y / 9, 2, seed + 5) - 0.5;
      const k = n * mottle * 2.2 + n2 * mottle * 0.8, i = (y * sw + x) * 4;
      sd[i] = base[0] * (1 + k) + warm * n; sd[i + 1] = base[1] * (1 + k); sd[i + 2] = base[2] * (1 + k) - warm * n; sd[i + 3] = 255;
    }
  });
  sc.putImageData(si, 0, 0);
  ctx.imageSmoothingQuality = 'high'; ctx.drawImage(small, 0, 0, W, H);
  const img = ctx.getImageData(0, 0, W, H), d = img.data;
  yield* pixelRows(H, y => {
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 4;
      const g = (hash2(x, y, seed + 99) - 0.5) * tooth * 255 + (vnoise(x / 2.3, y / 2.3, seed + 3) - 0.5) * tooth * 180;
      d[i] += g; d[i + 1] += g; d[i + 2] += g;
    }
  });
  ctx.putImageData(img, 0, 0);
  const rnd = mulberry32(seed * 7 + 3), fc = fibreCol ? hexRGB(fibreCol) : shadeRGB(base, -0.12);
  ctx.lineCap = 'round';
  const n = Math.round(fibres * W * H / (1440 * 900));
  for (let i = 0; i < n; i++) {
    const x = rnd() * W, y = rnd() * H, a = rnd() * TAU, l = (6 + rnd() * 22) * u;
    ctx.beginPath(); ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x + Math.cos(a + 0.6) * l * 0.5, y + Math.sin(a + 0.6) * l * 0.5, x + Math.cos(a) * l, y + Math.sin(a) * l);
    ctx.strokeStyle = rnd() < 0.5 ? rgba(shadeRGB(base, 0.35), 0.35) : rgba(fc, 0.22);
    ctx.lineWidth = (0.5 + rnd() * 0.7) * u; ctx.stroke();
  }
  return c;
}

// Brayer ink: an RGBA sheet whose alpha is how much ink the paper took.
// load = the roller's uneven film (long streaks along the roll direction plus
// blotches); tooth = the paper's grain that resists thin ink. Moving shapes are
// inked by masking this sheet, so they keep a printed surface frame to frame.
function* inkSheet(W, H, u, inkHex, thinHex, o = {}) {
  const { seed = 7, streak = 0.62, blot = 0.3, starve = 0.0, rollAngle = 0, heavy = 0.98, grain = 1 } = o;
  const c = makeCanvas(W, H), ctx = ctxOf(c), img = ctx.createImageData(W, H), d = img.data;
  const ink = hexRGB(inkHex), thin = hexRGB(thinHex || inkHex);
  // low-frequency load computed at 1/4 res
  const lw = Math.ceil(W / 4), lh = Math.ceil(H / 4), load = new Float32Array(lw * lh);
  const ca = Math.cos(rollAngle), sa = Math.sin(rollAngle);
  for (let y = 0; y < lh; y++) for (let x = 0; x < lw; x++) {
    const X = x * 4, Y = y * 4, rx = X * ca + Y * sa, ry = -X * sa + Y * ca;
    const s = fbm(rx / (320 * u), ry / (14 * u), 3, seed) - 0.5, b = vnoise(X / (55 * u), Y / (55 * u), seed + 1) - 0.5;
    const st = starve ? (vnoise(X / (180 * u), Y / (180 * u), seed + 2) - 0.5) * starve : 0;
    load[y * lw + x] = heavy + s * streak + b * blot + st;
  }
  yield;
  yield* pixelRows(H, y => {
    const fy = y / 4, y0 = Math.min(lh - 1, fy | 0), y1 = Math.min(lh - 1, y0 + 1), ky = fy - y0;
    for (let x = 0; x < W; x++) {
      const fx = x / 4, x0 = Math.min(lw - 1, fx | 0), x1 = Math.min(lw - 1, x0 + 1), kx = fx - x0;
      const l = lerp(lerp(load[y0 * lw + x0], load[y0 * lw + x1], kx), lerp(load[y1 * lw + x0], load[y1 * lw + x1], kx), ky);
      const tooth = hash2(x, y, seed + 9) * 0.6 + vnoise(x / (1.7 * u), y / (1.7 * u), seed + 10) * 0.4;
      const cov = smooth(tooth * 0.55 * grain + 0.2, tooth * 0.55 * grain + 0.42, l);
      const col = mixRGB(thin, ink, clamp(l * 1.1 - 0.1)), i = (y * W + x) * 4;
      d[i] = col[0]; d[i + 1] = col[1]; d[i + 2] = col[2]; d[i + 3] = cov * 255;
    }
  });
  ctx.putImageData(img, 0, 0);
  return c;
}

// A press: draw shapes as a mask, carve with destination-out, ink the mask with
// a sheet, then lay it on the paper. mode 'multiply' lets inks overprint.
function makePress(W, H) {
  const sc = makeCanvas(W, H), s = ctxOf(sc);
  return {
    canvas: sc, ctx: s,
    pull(target, sheet, shapes, carve, o = {}) {
      const { dx = 0, dy = 0, rot = 0, mode = 'multiply', alpha = 1 } = o;
      s.setTransform(1, 0, 0, 1, 0, 0); s.globalCompositeOperation = 'source-over'; s.globalAlpha = 1;
      s.clearRect(0, 0, W, H);
      s.fillStyle = '#000'; s.strokeStyle = '#000';
      shapes(s);
      if (carve) { s.setTransform(1, 0, 0, 1, 0, 0); s.globalCompositeOperation = 'destination-out'; s.fillStyle = '#000'; s.strokeStyle = '#000'; carve(s); }
      if (o.after) { s.setTransform(1, 0, 0, 1, 0, 0); s.globalCompositeOperation = 'source-over'; s.fillStyle = '#000'; s.strokeStyle = '#000'; o.after(s); }
      s.setTransform(1, 0, 0, 1, 0, 0); s.globalCompositeOperation = 'source-in'; s.drawImage(sheet, 0, 0);
      s.globalCompositeOperation = 'source-over';
      target.save(); target.globalCompositeOperation = mode; target.globalAlpha = alpha;
      if (rot) { target.translate(W / 2, H / 2); target.rotate(rot); target.translate(-W / 2, -H / 2); }
      target.drawImage(sc, dx, dy); target.restore();
    },
  };
}

// a V-gouge cut: pointed entry, swelling body, lifted exit (drawn as a fill)
function gouge(ctx, a, b, w, rnd) {
  const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1, nx = -dy / l, ny = dx / l;
  const pk = 0.3 + rnd() * 0.3, n = Math.max(4, Math.round(l / 4));
  const top = [], bot = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n, ww = w * 0.5 * Math.pow(Math.sin(Math.PI * Math.min(1, t < pk ? t / pk * 0.5 : 0.5 + (t - pk) / (1 - pk) * 0.5)), 0.6);
    const j = (rnd() - 0.5) * w * 0.12;
    top.push([a[0] + dx * t + nx * (ww + j), a[1] + dy * t + ny * (ww + j)]);
    bot.push([a[0] + dx * t - nx * (ww - j), a[1] + dy * t - ny * (ww - j)]);
  }
  ctx.beginPath(); polyPath(ctx, top.concat(bot.reverse())); ctx.fill();
}
// a curved gouge along a polyline
function gougeAlong(ctx, pl, w, rnd) {
  const n = pl.length, top = [], bot = [], pk = 0.25 + rnd() * 0.35;
  for (let i = 0; i < n; i++) {
    const a = pl[Math.max(0, i - 1)], b = pl[Math.min(n - 1, i + 1)];
    const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1, nx = -dy / l, ny = dx / l, t = i / (n - 1);
    const ww = w * 0.5 * Math.pow(Math.sin(Math.PI * Math.min(1, t < pk ? t / pk * 0.5 : 0.5 + (t - pk) / (1 - pk) * 0.5)), 0.55) + w * 0.04;
    const j = (rnd() - 0.5) * w * 0.1;
    top.push([pl[i][0] + nx * (ww + j), pl[i][1] + ny * (ww + j)]); bot.push([pl[i][0] - nx * (ww - j), pl[i][1] - ny * (ww - j)]);
  }
  ctx.beginPath(); polyPath(ctx, top.concat(bot.reverse())); ctx.fill();
}
// hatch a clipped region with broken parallel cuts (used by linocut + tempera)
function hatchCuts(ctx, clipPts, ang, gap, w, rnd, o = {}) {
  const { breakage = 0.9, jitter = 0.04, fn = gouge, len = [0.25, 0.6] } = o;
  const bb = bboxOf(clipPts);
  ctx.save(); ctx.beginPath(); polyPath(ctx, clipPts); ctx.clip();
  const ca = Math.cos(ang), sa = Math.sin(ang), diag = Math.hypot(bb.w, bb.h), cx = (bb.x0 + bb.x1) / 2, cy = (bb.y0 + bb.y1) / 2;
  for (let d = -diag / 2; d < diag / 2; d += gap) {
    const ox = cx - sa * d, oy = cy + ca * d;
    let t = -diag / 2;
    while (t < diag / 2) {
      const l = (len[0] + rnd() * len[1]) * diag, tw = (rnd() - 0.5) * jitter;
      if (rnd() < breakage) fn(ctx, [ox + ca * t, oy + sa * t], [ox + ca * (t + l) - sa * tw * l, oy + sa * (t + l) + ca * tw * l], w * (0.7 + rnd() * 0.6), rnd);
      t += l + rnd() * gap * 1.4;
    }
  }
  ctx.restore();
}

// Lettering from a typeface, printed: the glyphs are filled into a mask and
// the press does the rest. fitText finds a size that fills a width.
const FONT_DISPLAY = '"Fraunces", Georgia, "Times New Roman", serif';
const FONT_SANS = '"DM Sans", "Helvetica Neue", Arial, sans-serif';
function setFont(ctx, px, weight = 900, family = FONT_DISPLAY, opsz = null) {
  ctx.font = `${weight} ${px}px ${family}`;
  if ('fontVariationSettings' in ctx && opsz) ctx.fontVariationSettings = `"opsz" ${opsz}`;
}
function fitText(ctx, text, maxW, maxPx, weight = 900, family = FONT_DISPLAY, tracking = 0) {
  let px = maxPx;
  for (let i = 0; i < 30; i++) {
    setFont(ctx, px, weight, family);
    const w = ctx.measureText(text).width + tracking * px * (text.length - 1);
    if (w <= maxW) break;
    px *= Math.max(0.6, maxW / w * 0.995);
  }
  return px;
}
function drawTracked(ctx, text, x, y, px, tracking = 0, align = 'left') {
  if (!tracking) { ctx.textAlign = align; ctx.fillText(text, x, y); return; }
  let w = 0; const ws = [];
  for (const ch of text) { const cw = ctx.measureText(ch).width; ws.push(cw); w += cw; }
  w += tracking * px * (text.length - 1);
  let cx = align === 'center' ? x - w / 2 : align === 'right' ? x - w : x;
  ctx.textAlign = 'left';
  let i = 0;
  for (const ch of text) { ctx.fillText(ch, cx, y); cx += ws[i++] + tracking * px; }
}
function trackedWidth(ctx, text, px, tracking = 0) {
  let w = 0; for (const ch of text) w += ctx.measureText(ch).width;
  return w + tracking * px * (text.length - 1);
}
// roughen the edges of whatever is in a mask canvas (alpha threshold + noise):
// carved or punched letter edges, never vector-clean.
function* roughenMask(c, u, amt = 0.35, seed = 5, blurPx = 1.2) {
  const W = c.width, H = c.height, t = makeCanvas(W, H), tc = ctxOf(t);
  tc.filter = `blur(${Math.max(0.4, blurPx * u)}px)`; tc.drawImage(c, 0, 0); tc.filter = 'none';
  const img = tc.getImageData(0, 0, W, H), d = img.data;
  yield* pixelRows(H, y => {
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 4, a = d[i + 3] / 255;
      if (a <= 0) continue;
      const n = (vnoise(x / (3.2 * u), y / (3.2 * u), seed) - 0.5) * amt + (hash2(x, y, seed) - 0.5) * amt * 0.4;
      d[i + 3] = smooth(0.42, 0.58, a + n) * 255; d[i] = d[i + 1] = d[i + 2] = 0;
    }
  });
  const cx = ctxOf(c); cx.clearRect(0, 0, W, H); cx.putImageData(img, 0, 0);
  return c;
}

// graphite pencil lines (construction drawing, edition marks)
function pencil(ctx, lines, rnd, color = 'rgba(60,58,66,0.55)', w = 1.1) {
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (const pl of lines) {
    const pts = resample(pl, 1.6);
    for (let pass = 0; pass < 3; pass++) {
      ctx.beginPath(); let pen = false;
      for (const p of pts) {
        if (rnd() < 0.1) { pen = false; continue; }
        const x = p[0] + (rnd() - 0.5) * w * 0.7, y = p[1] + (rnd() - 0.5) * w * 0.7;
        if (!pen) { ctx.moveTo(x, y); pen = true; } else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = color; ctx.lineWidth = w * (0.6 + rnd() * 0.5); ctx.stroke();
    }
  }
  ctx.restore();
}
// shared ease helpers
const easeOut = t => 1 - Math.pow(1 - clamp(t), 3);
const easeInOut = t => { t = clamp(t); return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
const wave = (t, loop, k = 1, ph = 0) => Math.sin(TAU * (t / loop) * k + ph);
