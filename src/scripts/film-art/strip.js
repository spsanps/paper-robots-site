/* ═══════════════════════════════════════════════════════════════════════════
   strip.js — "One robot, defined once": the skeleton as a pencil construction
   drawing, then the same skeleton read by each film's hand (linocut, tempera
   on gold). Also the little head in the wordmark.
   ═══════════════════════════════════════════════════════════════════════════ */
'use strict';
// fmt 'plate' (the About page): the robot drawn larger on its sheet, the pencil heavier.
function tileLayout(W, H, fmt = '') {
  const plate = fmt === 'plate';
  const u = Math.min(W, H) / (plate ? 380 : 600);
  const s = plate ? Math.min(H * 0.72 / 1.25, W * 0.62 / 0.86) : Math.min(H * 0.6 / 1.25, W * 0.78 / 0.86);
  const L = { W, H, u, s, ox: W / 2 + 0.01 * s, oy: H * (plate ? 0.85 : 0.8) };
  L.P = p => [L.ox + p[0] * L.s, L.oy + p[1] * L.s];
  L.PP = pts => pts.map(L.P);
  return L;
}
// rotate robot-unit points about the head pivot
function tiltPts(pts, ang) {
  const [px, py] = PIVOT, c = Math.cos(ang), s = Math.sin(ang);
  return pts.map(([x, y]) => [px + (x - px) * c - (y - py) * s, py + (x - px) * s + (y - py) * c]);
}

// ── the skeleton: non-photo-blue construction under graphite ────────────────
function* buildSkeleton(fmt, W, H) {
  const L = tileLayout(W, H, fmt), u = L.u;
  const paper = yield* makePaper(W, H, u, '#f4efe2', { mottle: 0.03, tooth: 0.035, fibres: 120, seed: 61 });
  const base = makeCanvas(W, H), b = ctxOf(base);
  b.drawImage(paper, 0, 0);
  const rnd = mulberry32(611), blue = 'rgba(74,128,196,0.5)';
  // faint grid in robot units (0.1)
  b.save(); b.strokeStyle = 'rgba(74,128,196,0.14)'; b.lineWidth = 0.8 * u;
  for (let x = -0.6; x <= 0.61; x += 0.1) { const [px] = L.P([x, 0]); b.beginPath(); b.moveTo(px, H * 0.06); b.lineTo(px, H * 0.94); b.stroke(); }
  for (let y = -1.3; y <= 0.31; y += 0.1) { const [, py] = L.P([0, y]); b.beginPath(); b.moveTo(W * 0.06, py); b.lineTo(W * 0.94, py); b.stroke(); }
  b.restore();
  // body boxes: blue construction, graphite visible edges
  for (const p of SKELETON.parts) {
    if (p.group === 'head') continue;
    pencil(b, ['front', 'top', 'side'].map(f => L.PP(p[f]).concat([L.P(p[f][0])])), rnd, blue, 1.0 * u);
    pencil(b, ['front', 'top', 'side'].map(f => L.PP(p[f]).concat([L.P(p[f][0])])), rnd, 'rgba(58,56,64,0.6)', 1.0 * u);
  }
  // ground line + label
  const [gx0, gy] = L.P([-0.55, 0.15]), [gx1] = L.P([0.55, 0.15]);
  pencil(b, [[[gx0, gy], [gx1, gy]]], rnd, blue, 1 * u);
  const label = (txt, x, y, al = 'left') => { b.save(); b.fillStyle = 'rgba(58,56,64,0.72)'; setFont(b, 10.5 * u, 500, FONT_SANS); b.textAlign = al; b.fillText(txt, x, y); b.restore(); };
  // labels with leaders for the torso faces
  const tr = partById('torso'), [fx, fy] = L.P([tr.x + tr.w * 0.5, tr.y + tr.h * 0.55]);
  pencil(b, [[[fx, fy], [fx - L.s * 0.42, fy + L.s * 0.08]]], rnd, blue, 0.9 * u); label('front', fx - L.s * 0.44, fy + L.s * 0.08 + 4 * u, 'right');
  const [sx, sy] = L.P([tr.x + tr.w + 0.03, tr.y + tr.h * 0.4]);
  pencil(b, [[[sx, sy], [sx + L.s * 0.32, sy + L.s * 0.1]]], rnd, blue, 0.9 * u); label('side', sx + L.s * 0.34, sy + L.s * 0.1 + 4 * u);
  // dimension: head width
  const hd = SKELETON.head, [dx0, dy] = L.P([hd.x, hd.y - 0.17]), [dx1] = L.P([hd.x + hd.w, 0]);
  pencil(b, [[[dx0, dy], [dx1, dy]], [[dx0, dy - 4 * u], [dx0, dy + 4 * u]], [[dx1, dy - 4 * u], [dx1, dy + 4 * u]]], rnd, blue, 0.9 * u);
  label('0.55', (dx0 + dx1) / 2, dy - 5 * u, 'center');
  label('robot units · feet at 0', W * 0.08, fmt === 'plate' ? H * 0.09 : H * 0.94);
  const S = { L, base, rnd };
  return S;
}
function drawSkeleton(S, ctx, t) {
  const L = S.L, u = L.u, loop = 8;
  ctx.drawImage(S.base, 0, 0);
  const rr = mulberry32(912);
  const tilt = 3.2 * Math.sin(TAU * t / loop) * Math.PI / 180;
  const hd = SKELETON.head;
  // rest position in blue, live position in graphite
  pencil(ctx, ['front', 'top', 'side'].map(f => L.PP(hd[f]).concat([L.P(hd[f][0])])), rr, 'rgba(74,128,196,0.45)', 0.9 * u);
  const live = f => L.PP(tiltPts(hd[f], tilt));
  pencil(ctx, ['front', 'top', 'side'].map(f => live(f).concat([live(f)[0]])), rr, 'rgba(50,48,58,0.8)', 1.2 * u);
  // fold: hinge dashed, flap in graphite
  const fl = L.PP(tiltPts(SKELETON.fold.flap, tilt));
  pencil(ctx, [[fl[0], fl[1], fl[2]]], rr, 'rgba(50,48,58,0.8)', 1.1 * u);
  ctx.save(); ctx.setLineDash([4 * u, 4 * u]); ctx.strokeStyle = 'rgba(200,70,50,0.75)'; ctx.lineWidth = 1 * u; ctx.beginPath(); ctx.moveTo(...fl[0]); ctx.lineTo(...fl[2]); ctx.stroke(); ctx.restore();
  for (const e of SKELETON.eyes) { const [cx, cy] = L.P(tiltPts([[e.cx, e.cy]], tilt)[0]); pencil(ctx, [ellipsePts(cx, cy, e.r * L.s, e.r * L.s, 30).concat([[cx + e.r * L.s, cy]])], rr, 'rgba(50,48,58,0.75)', 1 * u); }
  const ear = SKELETON.ear, [ex, ey] = L.P(tiltPts([[ear.cx, ear.cy]], tilt)[0]);
  pencil(ctx, [ellipsePts(ex, ey, ear.rx * L.s, ear.ry * L.s, 30).concat([[ex + ear.rx * L.s, ey]])], rr, 'rgba(200,70,50,0.8)', 1.1 * u);
  // pivot crosshair
  const [px, py] = L.P(PIVOT);
  pencil(ctx, [[[px - 9 * u, py], [px + 9 * u, py]], [[px, py - 9 * u], [px, py + 9 * u]]], rr, 'rgba(200,70,50,0.85)', 1.1 * u);
  ctx.save(); ctx.fillStyle = 'rgba(58,56,64,0.72)'; setFont(ctx, 10.5 * u, 500, FONT_SANS);
  ctx.fillText('pivot', px + 12 * u, py + 14 * u);
  const [lx, ly] = L.P([0.2, -1.12]); ctx.fillText('fold', lx + 10 * u, ly - 6 * u);
  const [tx, ty] = L.P([-0.32, -1.08]); ctx.textAlign = 'right'; ctx.fillText('top', tx, ty);
  ctx.restore();
}

// ── the same robot in linocut (film 01's hand) ───────────────────────────────
function* buildRobotLino(fmt, W, H) {
  const L = tileLayout(W, H), u = L.u, P = L.P;
  const paper = yield* makePaper(W, H, u, LINO.paper, { mottle: 0.045, tooth: 0.05, fibres: 180, seed: 71 });
  const ochre = yield* inkSheet(W, H, u, LINO.ochre, LINO.ochreThin, { seed: 72 });
  const verm = yield* inkSheet(W, H, u, LINO.verm, LINO.vermThin, { seed: 73 });
  const cob = yield* inkSheet(W, H, u, LINO.cob, LINO.cobThin, { seed: 74, streak: 0.8, heavy: 0.9 });
  const press = makePress(W, H), rnd = mulberry32(745);
  const base = makeCanvas(W, H), b = ctxOf(base); b.drawImage(paper, 0, 0);
  const m = W * 0.06, blk = wobble([[m, m], [W - m, m], [W - m, H - m], [m, H - m]], 14 * u, 1.6 * u, rnd);
  const sun = SKELETON.sun, [scx, scy] = P([sun.cx, sun.cy]), sr = sun.r * L.s;
  const bodyIds = ['footL', 'legL', 'footR', 'legR', 'armL', 'handL', 'torso', 'armR', 'handR', 'neck'];
  press.pull(b, ochre, s => { s.beginPath(); polyPath(s, wobble(ellipsePts(scx, scy, sr, sr, 120), 9 * u, 2 * u, rnd)); s.fill(); const pl = partById('plinth'); for (const f of ['side', 'top', 'front']) { s.beginPath(); polyPath(s, L.PP(pl[f])); s.fill(); } }, s => {
    for (const id of [...bodyIds, 'head']) { const p = partById(id); for (const f of ['side', 'top', 'front']) { s.beginPath(); polyPath(s, L.PP(p[f])); s.fill(); } }
  }, { dx: 1.2 * u, dy: -0.8 * u, mode: 'multiply' });
  const ear = SKELETON.ear, [ex, ey] = P([ear.cx, ear.cy]);
  press.pull(b, verm, s => { s.beginPath(); s.ellipse(ex, ey, ear.rx * L.s * 1.05, ear.ry * L.s * 1.05, 0, 0, TAU); s.fill(); }, null, { dx: -1 * u, dy: 1 * u, mode: 'multiply' });
  const under = makeCanvas(W, H); ctxOf(under).drawImage(base, 0, 0);
  press.pull(b, cob, s => { s.beginPath(); polyPath(s, blk); s.fill(); }, s => {
    // halo round the figure, rays round the sun
    s.save(); s.lineJoin = 'round'; s.lineWidth = 9 * u;
    for (const id of [...bodyIds, 'head', 'plinth']) { const p = partById(id); for (const f of ['side', 'top', 'front']) { s.beginPath(); polyPath(s, L.PP(p[f])); s.stroke(); s.fill(); } }
    s.beginPath(); s.ellipse(ex, ey, ear.rx * L.s * 1.5, ear.ry * L.s * 1.35, 0, 0, TAU); s.fill();
    s.restore();
    for (let i = 0; i < 40; i++) { const a = i / 40 * TAU, half = TAU / 40 * 0.22, R0 = sr * 1.02, R1 = sr * 2.4; s.beginPath(); polyPath(s, wobble([[scx + Math.cos(a) * R0, scy + Math.sin(a) * R0], [scx + Math.cos(a - half) * R1, scy + Math.sin(a - half) * R1], [scx + Math.cos(a + half) * R1, scy + Math.sin(a + half) * R1]], 14 * u, 2 * u, rnd)); s.fill(); }
    s.beginPath(); polyPath(s, wobble(ellipsePts(scx, scy, sr, sr, 120), 9 * u, 2 * u, rnd)); s.fill();
    for (let y = P([0, 0.18])[1]; y < H - m; y += 6 * u) gouge(s, [m + rnd() * 30 * u, y], [W - m - rnd() * 30 * u, y + (rnd() - 0.5) * 3 * u], (1 + rnd()) * u, rnd);
  }, { mode: 'source-over' });
  press.pull(b, cob, s => {
    for (const id of [...bodyIds, 'head', 'plinth']) { const p = partById(id); for (const f of ['side', 'top', 'front']) { s.beginPath(); polyPath(s, wobble(L.PP(p[f]), 9 * u, 0.8 * u, rnd)); s.fill(); } }
    s.beginPath(); s.ellipse(ex, ey, ear.rx * L.s * 1.18, ear.ry * L.s * 1.1, 0, 0, TAU); s.lineWidth = 2.2 * u; s.stroke();
  }, s => {
    for (const id of [...bodyIds, 'plinth']) linoHatchBox(s, L, linoBoxFaces(L, partById(id)), rnd);
    linoHatchBox(s, L, linoBoxFaces(L, SKELETON.head), rnd, { head: true });
    s.beginPath(); polyPath(s, wobble(L.PP(SKELETON.fold.flap), 5 * u, 0.8 * u, rnd)); s.fill();
    for (const e of SKELETON.eyes) { const [cx, cy] = P([e.cx, e.cy]); s.beginPath(); polyPath(s, wobble(ellipsePts(cx, cy, e.r * L.s, e.r * L.s, 40), 4 * u, 0.9 * u, rnd)); s.fill(); }
    s.beginPath(); s.ellipse(ex, ey, ear.rx * L.s * 1.02, ear.ry * L.s * 1.02, 0, 0, TAU); s.fill();
  }, { mode: 'source-over' });
  return { L, base, press, cob };
}
function drawRobotLino(S, ctx, t) {
  const L = S.L, P = L.P;
  ctx.drawImage(S.base, 0, 0);
  const id = robotIdle(t, 8, { blinks: [3.1], looks: [[0.3, 0.1], [-0.2, 0.2]] });
  S.press.pull(ctx, S.cob, s => {
    for (const e of SKELETON.eyes) { const [cx, cy] = P([e.cx, e.cy]), r = e.r * L.s; s.beginPath(); s.arc(cx + id.look[0] * r * 0.42, cy + id.look[1] * r * 0.42, r * 0.5, 0, TAU); s.fill(); if (id.blink > 0.02) { s.save(); s.beginPath(); s.arc(cx, cy, r * 1.04, 0, TAU); s.clip(); s.fillRect(cx - r * 1.2, cy - r * 1.2, r * 2.4, r * 2.4 * id.blink); s.restore(); } }
  }, null, { mode: 'source-over' });
}

// ── the same robot in egg tempera on gold (film 02's hand) ────────────────────
function* buildRobotGold(fmt, W, H) {
  const L = tileLayout(W, H), u = L.u, P = L.P, rnd = mulberry32(821);
  const G = yield* makeGoldLeaf(W, H, u, 29, Math.max(24, 70 * u));
  const base = makeCanvas(W, H), b = ctxOf(base);
  b.drawImage(G.gold, 0, 0);
  // halo: incised rings and punches behind the head
  const [hx, hy] = P([-0.02, -0.78]), hr = L.s * 0.48;
  // the halo is a burnished disc: brighter, smoother gold than the ground
  b.save(); b.beginPath(); b.arc(hx, hy, hr, 0, TAU); b.clip(); b.globalCompositeOperation = 'screen'; b.fillStyle = 'rgba(255,236,170,0.22)'; b.fillRect(0, 0, W, H); b.restore();
  b.save(); b.beginPath(); b.arc(hx, hy, hr * 1.012, 0, TAU); b.strokeStyle = 'rgba(70,40,8,0.55)'; b.lineWidth = 2.2 * u; b.stroke(); b.restore();
  for (const k of [1, 0.9, 0.62]) incise(b, ellipsePts(hx, hy, hr * k, hr * k, 140).concat([[hx + hr * k, hy]]), u, 1.8);
  for (let i = 0; i < 54; i++) { const a = i / 54 * TAU; punch(b, hx + Math.cos(a) * hr * 0.95, hy + Math.sin(a) * hr * 0.95, 2.3 * u, u, i % 3 === 0 ? 'rosette' : 'ring'); }
  for (let i = 0; i < 90; i++) { const a = i / 90 * TAU; punch(b, hx + Math.cos(a) * hr * 0.66, hy + Math.sin(a) * hr * 0.66, 1.3 * u, u); }
  for (let i = 0; i < 24; i++) { const a = i / 24 * TAU; incise(b, [[hx + Math.cos(a) * hr * 0.64, hy + Math.sin(a) * hr * 0.64], [hx + Math.cos(a) * hr * 0.9, hy + Math.sin(a) * hr * 0.9]], u, 0.8); }
  yield;
  // the figure, painted face by face: azurite modelled with lead white and indigo
  const tone = { top: { base: TEMP.azurL, light: '#c9d6f0', dark: TEMP.azur }, front: { base: TEMP.azur, light: TEMP.azurL, dark: TEMP.azurD }, side: { base: TEMP.azurD, light: TEMP.azur, dark: '#0d1640' } };
  const stone = { top: { base: '#d8c08a', light: '#f1e2b6', dark: '#a98e55' }, front: { base: '#bba06a', light: '#dcc591', dark: '#8a7044' }, side: { base: '#94794a', light: '#b39662', dark: '#6b5532' } };
  const paintBox = (p, pal) => { for (const f of ['side', 'top', 'front']) { const pts = L.PP(p[f]), bb = bboxOf(pts); paintForm(b, pts, { ...pal[f], shade: (x, y) => clamp(0.35 - (y - bb.y0) / (bb.h || 1) * 0.6 - (x - bb.x0) / (bb.w || 1) * 0.3, -1, 1), dir: () => (f === 'side' ? Math.PI / 2 : f === 'top' ? Math.atan2(DEPTH[1], DEPTH[0]) : 0.08), density: 2.4, len: [4, 10], width: [0.8, 1.3], outline: TEMP.brown, outlineW: 1.1, outlineA: 0.75 }, rnd, u); } };
  paintBox(partById('plinth'), stone);
  for (const p of SKELETON.parts) if (p.group === 'body') paintBox(p, tone);
  paintBox(SKELETON.head, tone);
  const fl = L.PP(SKELETON.fold.flap);
  paintForm(b, fl, { base: TEMP.white, light: '#fffaf0', dark: '#c7b894', shade: (x, y) => clamp((fl[0][1] - y) / L.s * 4, -1, 1), dir: () => 0.9, density: 1.4, len: [2, 5], outline: TEMP.brown, outlineW: 0.9 }, rnd, u);
  const ear = SKELETON.ear, [ex, ey] = P([ear.cx, ear.cy]), ep = ellipsePts(ex, ey, ear.rx * L.s * 1.08, ear.ry * L.s * 1.08, 40);
  paintForm(b, ep, { base: TEMP.cin, light: TEMP.cinL, dark: TEMP.lake, shade: shadeSphere(ex, ey, ear.ry * L.s), dir: () => 1.2, density: 1.6, len: [2, 4], outline: TEMP.lake, outlineW: 1 }, rnd, u);
  for (const e of SKELETON.eyes) { const [cx, cy] = P([e.cx, e.cy]); paintForm(b, ellipsePts(cx, cy, e.r * L.s, e.r * L.s, 36), { base: '#efe4cb', light: '#fffaf0', dark: '#b8a582', shade: shadeSphere(cx, cy, e.r * L.s), density: 2, len: [2, 4], outline: TEMP.brown, outlineW: 1 }, rnd, u); }
  const cracks = yield* makeCracks(W, H, u, 33, 9);
  b.save(); b.globalAlpha = 0.35; b.drawImage(cracks, 0, 0); b.restore();
  const glint = makeCanvas(W, H), gl = ctxOf(glint); gl.drawImage(G.glint, 0, 0);
  gl.globalCompositeOperation = 'destination-out';
  for (const p of SKELETON.parts) for (const f of ['side', 'top', 'front']) { gl.beginPath(); polyPath(gl, L.PP(p[f])); gl.fill(); }
  return { L, base, glint, press: makePress(W, H) };
}
function drawRobotGold(S, ctx, t) {
  const L = S.L, P = L.P, W = L.W, H = L.H, tt = ((t % 8) + 8) % 8;
  ctx.drawImage(S.base, 0, 0);
  const id = robotIdle(t, 8, { blinks: [5.3], looks: [[0.2, -0.3], [-0.25, -0.1]] });
  for (const e of SKELETON.eyes) {
    const [cx, cy] = P([e.cx, e.cy]), r = e.r * L.s;
    ctx.fillStyle = TEMP.brown; ctx.beginPath(); ctx.arc(cx + id.look[0] * r * 0.42, cy + id.look[1] * r * 0.42, r * 0.48, 0, TAU); ctx.fill();
    ctx.fillStyle = 'rgba(250,244,228,0.9)'; ctx.beginPath(); ctx.arc(cx + id.look[0] * r * 0.42 - r * 0.16, cy + id.look[1] * r * 0.42 - r * 0.17, r * 0.12, 0, TAU); ctx.fill();
    if (id.blink > 0.02) { ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, r * 1.02, 0, TAU); ctx.clip(); ctx.fillStyle = TEMP.azur; ctx.fillRect(cx - r * 1.2, cy - r * 1.2, r * 2.4, r * 2.4 * id.blink); ctx.restore(); }
  }
  const sc = S.press.ctx, cv = S.press.canvas, gx = lerp(-0.4, 1.4, tt / 8) * W;
  sc.setTransform(1, 0, 0, 1, 0, 0); sc.globalCompositeOperation = 'source-over'; sc.clearRect(0, 0, W, H);
  const g = sc.createLinearGradient(gx - W * 0.4, 0, gx + W * 0.4, H * 0.5); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(0.5, '#fff'); g.addColorStop(1, 'rgba(255,255,255,0)');
  sc.fillStyle = g; sc.fillRect(0, 0, W, H); sc.globalCompositeOperation = 'destination-in'; sc.drawImage(S.glint, 0, 0); sc.globalCompositeOperation = 'source-over';
  ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.globalAlpha = 0.4; ctx.drawImage(cv, 0, 0); ctx.restore();
}

// ── the wordmark's head (flat, crisp at small sizes) ─────────────────────────
function* buildIcon(fmt, W, H) {
  const hd = SKELETON.head, s = Math.min(W, H) / 0.78, ox = W * 0.5 - 0.0 * s, oy = H * 0.5 + 0.79 * s;
  const P = p => [ox + p[0] * s, oy + p[1] * s];
  const c = makeCanvas(W, H), x = ctxOf(c);
  const col = { top: '#5a80d8', front: '#2a4db4', side: '#172e80' };
  for (const f of ['side', 'top', 'front']) { x.beginPath(); polyPath(x, hd[f].map(P)); x.fillStyle = col[f]; x.fill(); }
  x.beginPath(); polyPath(x, SKELETON.fold.flap.map(P)); x.fillStyle = '#f4efe2'; x.fill();
  const e = SKELETON.ear, [ex, ey] = P([e.cx, e.cy]); x.beginPath(); x.ellipse(ex, ey, e.rx * s, e.ry * s, 0, 0, TAU); x.fillStyle = '#e3492a'; x.fill();
  for (const eye of SKELETON.eyes) { const [cx, cy] = P([eye.cx, eye.cy]); x.beginPath(); x.arc(cx, cy, eye.r * s, 0, TAU); x.fillStyle = '#f7f1e3'; x.fill(); x.beginPath(); x.arc(cx + eye.r * s * 0.18, cy + eye.r * s * 0.05, eye.r * s * 0.5, 0, TAU); x.fillStyle = '#1b1830'; x.fill(); }
  yield;
  return { c };
}
function drawIcon(S, ctx) { ctx.clearRect(0, 0, S.c.width, S.c.height); ctx.drawImage(S.c, 0, 0); }

const STRIP = {
  skeleton: { build: buildSkeleton, draw: drawSkeleton, animated: true, fps: 12, still: 2 },
  'robot-lino': { build: buildRobotLino, draw: drawRobotLino, animated: true, fps: 12, still: 1 },
  'robot-gold': { build: buildRobotGold, draw: drawRobotGold, animated: true, fps: 20, still: 3.5 },
  icon: { build: buildIcon, draw: drawIcon, animated: false },
};
