/* ═══════════════════════════════════════════════════════════════════════════
   linocut.js — FILM 01 · The Coming Robotics Revolution
   Process: reduction linocut, three blocks, hand-burnished on cream paper.
     1 OCHRE     #e6a92b  sun, screen glow, title band, stand   (printed first)
     2 VERMILION #d2432b  ear, cuffs, the screen's LED          (multiply)
     3 COBALT    #1d2c82  the key block: field, rays, robot, arms, lettering
                           (opaque relief ink; tooth lets the under-colours speak)
   Why linocut: the film's image is a burst — six arms out of one screen. A
   gouge makes radiating cuts naturally, and relief ink gives the hard
   Paper Robots cobalt without a gradient in sight.
   Rules: one block per colour, slight misregistration per block, white-line
   halos separate forms (that is how a carver separates them), lettering is cut
   out of the block, never set on top. Moving parts (arms, eyes, roller, rays in
   the vertical format) are re-cut every frame from the same seeded hand.
   Refuses: gradients, outlines that aren't cuts, vector-clean letters, black.
   ═══════════════════════════════════════════════════════════════════════════ */
'use strict';
const LINO = { paper: '#efe4c9', ochre: '#e6a92b', ochreThin: '#efc56d', verm: '#d2432b', vermThin: '#e06d55', cob: '#1d2c82', cobThin: '#34449a' };

// ── layouts: the same scene, re-composed per format ──────────────────────────
function film1Layout(fmt, W, H) {
  const u = Math.min(W, H) / 600;
  const L = { fmt, W, H, u, texts: [], armExtend: 1, armTweak: null };
  if (fmt === 'poster') {
    const m = W * 0.055;
    L.block = { x0: m, y0: m, x1: W - m, y1: H - m * 1.7 }; L.margin = true;
    const bw = L.block.x1 - L.block.x0;
    L.s = bw * 1.0 / 2.55; L.ox = W / 2 + 0.015 * L.s; L.oy = H * 0.64 + 0.74 * L.s;
    L.sun = 1.05;
    L.texts = [
      { str: 'THE COMING', cx: W / 2, base: L.block.y0 + H * 0.083, maxW: bw * 0.56, maxPx: H * 0.06, track: 0.06 },
      { str: 'ROBOTICS', cx: W / 2, base: L.block.y0 + H * 0.165, maxW: bw * 0.84, maxPx: H * 0.1, track: 0.02 },
      { str: 'REVOLUTION', cx: W / 2, base: L.block.y0 + H * 0.252, maxW: bw * 0.86, maxPx: H * 0.1, track: 0.0 },
      { str: 'PAPER ROBOTS  ·  FILM 01  ·  7:29', cx: W / 2, base: L.block.y1 - H * 0.03, maxW: bw * 0.7, maxPx: H * 0.022, track: 0.16, weight: 600, small: true },
    ];
    L.titleBand = [L.block.y0 + H * 0.025, L.block.y0 + H * 0.27];
    L.pencil = ['Film 01  ·  reduction linocut, three blocks', 'Paper Robots'];
  } else if (fmt === 'thumb') {
    L.block = { x0: -4, y0: -4, x1: W + 4, y1: H + 4 };
    L.s = H * 0.39; L.ox = W / 2 + 0.01 * L.s; L.oy = H * 0.275 + 1.285 * L.s;
    L.armExtend = 1.45; L.sun = 1.05;
    L.armTweak = [-0.32, 0.08, 0.32, 0.32, -0.08, -0.32];
    L.texts = [
      { str: 'GPT-7', cx: W / 2, base: H * 0.215, maxW: W * 0.34, maxPx: H * 0.22, track: 0.0 },
      { str: 'WILL HAVE ARMS', cx: W / 2, base: H * 0.95, maxW: W * 0.64, maxPx: H * 0.15, track: 0.02 },
    ];
    L.titleBand = null; L.letterBands = true;
  } else if (fmt === 'short') {
    L.block = { x0: -4, y0: -4, x1: W + 4, y1: H + 4 };
    L.s = W * 0.47; L.ox = W / 2 + 0.01 * L.s; L.oy = H * 0.515 + 0.735 * L.s;
    L.sun = 1.25; L.rotRays = true;
    L.armTweak = [0.6, 0.0, -0.6, -0.6, 0.0, 0.6];   // arms swing towards the long axis
    L.armExtend = 1.2;
    L.texts = [
      { str: 'ONE MODEL.', cx: W / 2, base: H * 0.135, maxW: W * 0.8, maxPx: H * 0.08, track: 0.02 },
      { str: 'A WORLD FULL', cx: W / 2, base: H * 0.868, maxW: W * 0.8, maxPx: H * 0.058, track: 0.02, group: 'b' },
      { str: 'OF HANDS.', cx: W / 2, base: H * 0.935, maxW: W * 0.8, maxPx: H * 0.058, track: 0.02, group: 'b' },
    ];
    L.letterBands = true;
  } else { // title card
    L.block = { x0: -4, y0: -4, x1: W + 4, y1: H + 4 };
    L.s = H * 0.46; L.ox = W * 0.255; L.oy = H * 0.52 + 0.735 * L.s;
    L.sun = 1.0; L.armExtend = 1.05; L.roller = true;
    L.armTweak = [0.1, 0, -0.1, -0.75, -0.2, 0.75];
    L.armExtendEach = [1.1, 1.15, 1.1, 0.78, 0.62, 0.78];
    const x0 = W * 0.555, tw = W * 0.4;
    L.texts = [
      { str: 'THE COMING', x: x0, base: H * 0.37, maxW: tw * 0.6, maxPx: H * 0.07, track: 0.06, group: 't' },
      { str: 'ROBOTICS', x: x0, base: H * 0.505, maxW: tw, maxPx: H * 0.15, track: 0.01, group: 't' },
      { str: 'REVOLUTION', x: x0, base: H * 0.64, maxW: tw, maxPx: H * 0.15, track: 0.0, group: 't' },
      { str: 'PAPER ROBOTS  ·  FILM 01', x: x0, base: H * 0.715, maxW: tw * 0.66, maxPx: H * 0.028, track: 0.18, weight: 600, small: true, group: 't' },
    ];
    L.letterBands = true;
  }
  L.P = p => [L.ox + p[0] * L.s, L.oy + p[1] * L.s];
  L.PP = pts => pts.map(L.P);
  return L;
}

// ── carving helpers in screen px ─────────────────────────────────────────────
// a robot box: halo, faces, per-face hatching (top light, front mid, side dark)
function linoBoxFaces(L, p) { return { side: L.PP(p.side), top: L.PP(p.top), front: L.PP(p.front) }; }
function linoHatchBox(c, L, faces, rnd, o = {}) {
  const u = Math.max(L.u, L.s / 300);
  // top = lit (cut mostly away), front = solid ink with a few long cuts, side = solid
  const spec = {
    top: { ang: Math.atan2(DEPTH[1], DEPTH[0]), gap: 3.6, w: 2.1, br: 0.95 },
    front: { ang: -0.62, gap: o.head ? 6.2 : o.body ? 12 : 6.8, w: 1.9, br: o.body ? 0.45 : 0.78 },
    side: { ang: Math.PI / 2 + 0.05, gap: 18, w: 1.0, br: 0.3 },
  };
  for (const f of ['top', 'front', 'side']) {
    const s = spec[f];
    hatchCuts(c, insetPoly(faces[f], 3.2 * u), s.ang, s.gap * u, s.w * u, rnd, { breakage: s.br, len: [0.15, 0.35] });
  }
  c.save(); c.lineJoin = 'round'; c.lineWidth = 1.8 * u;
  for (const f of ['top', 'side']) { c.beginPath(); polyPath(c, faces[f]); c.stroke(); }
  c.restore();
}

// ── build ──────────────────────────────────────────────────────────────────────
function* buildFilm1(fmt, W, H) {
  const L = film1Layout(fmt, W, H), u = L.u, P = L.P, S = {};
  S.L = L;
  const rnd = mulberry32(1101);
  const paper = yield* makePaper(W, H, u, LINO.paper, { mottle: 0.045, tooth: 0.05, fibres: 240, seed: 11, warm: 6 });
  S.sheets = {
    ochre: yield* inkSheet(W, H, u, LINO.ochre, LINO.ochreThin, { seed: 21, streak: 0.5, rollAngle: 0.04 }),
    verm: yield* inkSheet(W, H, u, LINO.verm, LINO.vermThin, { seed: 31, streak: 0.5, rollAngle: -0.03 }),
    cob: yield* inkSheet(W, H, u, LINO.cob, LINO.cobThin, { seed: 41, streak: 0.8, blot: 0.36, heavy: 0.9, rollAngle: 0.0 }),
  };
  S.press = makePress(W, H);
  // registration drift per block (the paper never lands twice in the same place)
  const reg = { ochre: [1.4 * u, -0.8 * u], verm: [-1.1 * u, 1.2 * u], cob: [0, 0] };
  S.reg = reg;
  const blk = L.block;
  const blockPts = wobble([[blk.x0, blk.y0], [blk.x1, blk.y0], [blk.x1, blk.y1], [blk.x0, blk.y1]], 16 * u, (L.margin ? 1.8 : 0) * u, rnd);
  const scr = MONITOR.screen, bz = MONITOR.bezel;
  const outer = roundRectPts(scr.x0 - bz, scr.y0 - bz, scr.x1 - scr.x0 + 2 * bz, scr.y1 - scr.y0 + 2 * bz, 0.055, 6);
  const inner = roundRectPts(scr.x0, scr.y0, scr.x1 - scr.x0, scr.y1 - scr.y0, 0.022, 4);
  const outerPx = wobble(L.PP(outer), 7 * u, 0.9 * u, rnd), innerPx = wobble(L.PP(inner), 7 * u, 0.8 * u, rnd);
  const [scx, scy] = P([(scr.x0 + scr.x1) / 2, (scr.y0 + scr.y1) / 2]);
  S.center = [scx, scy];
  const sunR = L.sun * L.s;
  const st = MONITOR.stand;
  const neckPts = L.PP([[st.neck[0], st.neck[1]], [st.neck[0] + st.neck[2], st.neck[1]], [st.neck[0] + st.neck[2], st.neck[1] + st.neck[3]], [st.neck[0], st.neck[1] + st.neck[3]]]);
  const baseBox = box('base', st.base[0], st.base[1], st.base[2], st.base[3], st.base[4]);
  const baseFaces = linoBoxFaces(L, baseBox);

  // lettering masks (carved out of the cobalt block)
  const letters = makeCanvas(W, H), lc = ctxOf(letters), smallLetters = makeCanvas(W, H), sl = ctxOf(smallLetters);
  const bands = [];
  for (const T of L.texts) {
    const c = T.small ? sl : lc;
    c.fillStyle = '#000'; c.textBaseline = 'alphabetic';
    const px = fitText(c, T.str, T.maxW, T.maxPx, T.weight || 900, FONT_DISPLAY, T.track);
    setFont(c, px, T.weight || 900, FONT_DISPLAY);
    const w = trackedWidth(c, T.str, px, T.track), x = T.cx !== undefined ? T.cx - w / 2 : T.x;
    drawTracked(c, T.str, x, T.base, px, T.track, 'left');
    T._box = { x0: x - px * 0.18, x1: x + w + px * 0.18, y0: T.base - px * 0.86, y1: T.base + px * 0.2, px, group: T.group || T.str };
    bands.push(T._box);
  }
  // lines in one group share one cartouche
  const groups = {};
  for (const b of bands) { const g = groups[b.group]; if (!g) groups[b.group] = Object.assign({}, b); else { g.x0 = Math.min(g.x0, b.x0); g.x1 = Math.max(g.x1, b.x1); g.y0 = Math.min(g.y0, b.y0); g.y1 = Math.max(g.y1, b.y1); g.px = Math.max(g.px, b.px); } }
  const cartouches = Object.values(groups);
  yield* roughenMask(letters, u, 0.2, 77, 0.55);
  yield* roughenMask(smallLetters, u, 0.08, 78, 0.3);
  lc.drawImage(smallLetters, 0, 0);
  S.bands = bands; S.cartouches = cartouches;
  yield;

  // ── 1 · OCHRE block (printed first)
  const under = makeCanvas(W, H), uc = ctxOf(under);
  uc.drawImage(paper, 0, 0);
  S.press.pull(uc, S.sheets.ochre, s => {
    s.save(); s.beginPath(); polyPath(s, blockPts); s.clip();
    // the sun behind the screen, carved with a soft-edged, slightly lumpy rim
    s.beginPath(); polyPath(s, wobble(ellipsePts(scx, scy, sunR, sunR, 160), 10 * u, 2.2 * u, rnd)); s.fill();
    // screen glow
    s.beginPath(); polyPath(s, innerPx); s.fill();
    // stand
    s.beginPath(); polyPath(s, neckPts); s.fill();
    for (const f of ['side', 'top', 'front']) { s.beginPath(); polyPath(s, baseFaces[f]); s.fill(); }
    // under the big letters: ochre bands, so the cut letters read warm
    if (L.titleBand) s.fillRect(blk.x0, L.titleBand[0], blk.x1 - blk.x0, L.titleBand[1] - L.titleBand[0]);
    if (L.letterBands) for (const b of bands) { s.beginPath(); polyPath(s, wobble([[b.x0, b.y0], [b.x1, b.y0], [b.x1, b.y1], [b.x0, b.y1]], 12 * u, 2 * u, rnd)); s.fill(); }
    s.restore();
  }, s => {
    // the ochre block is cut away under the robot, so its carved lights read as paper
    s.save(); s.beginPath(); polyPath(s, innerPx); s.clip();
    for (const id of ['neck', 'torso', 'head']) { const p = partById(id); for (const f of ['side', 'top', 'front']) { s.beginPath(); polyPath(s, L.PP(p[f])); s.fill(); } }
    s.beginPath(); polyPath(s, L.PP(SKELETON.fold.flap)); s.fill();
    s.restore();
  }, { dx: reg.ochre[0], dy: reg.ochre[1], mode: 'multiply' });
  yield;
  // ── 2 · VERMILION block (static parts)
  const ear = SKELETON.ear, [ex, ey] = P([ear.cx, ear.cy]);
  const ledPt = P([scr.x1 - 0.06, scr.y1 + bz * 0.5]);
  S.press.pull(uc, S.sheets.verm, s => {
    s.beginPath(); polyPath(s, wobble(ellipsePts(ex, ey, ear.rx * L.s * 1.05, ear.ry * L.s * 1.05, 40), 4 * u, 0.8 * u, rnd)); s.fill();
    s.beginPath(); s.arc(ledPt[0], ledPt[1], 0.014 * L.s, 0, TAU); s.fill();
    if (L.margin) { // a vermilion rule under the title
      const y = L.titleBand[1] + 0.004 * H;
      s.beginPath(); polyPath(s, wobble([[blk.x0 + 0.2 * (blk.x1 - blk.x0), y], [blk.x1 - 0.2 * (blk.x1 - blk.x0), y], [blk.x1 - 0.2 * (blk.x1 - blk.x0), y + 0.006 * H], [blk.x0 + 0.2 * (blk.x1 - blk.x0), y + 0.006 * H]], 10 * u, 1 * u, rnd)); s.fill();
    }
  }, null, { dx: reg.verm[0], dy: reg.verm[1], mode: 'multiply' });
  S.under = under;
  yield;

  // ── 3 · COBALT key block — static
  const head = SKELETON.head, headF = linoBoxFaces(L, head);
  const robotParts = ['neck', 'torso'].map(partById);
  const innerClip = innerPx;
  S.staticCarve = (s, rr, rayRot = 0) => {
    // white-line halo round the monitor so it separates from the field
    s.save(); s.lineJoin = 'round';
    s.beginPath(); polyPath(s, outerPx); s.lineWidth = 9 * u; s.stroke(); s.fill();
    s.restore();
    // rays never cross the lettering: clip them to everything outside the bands
    s.save(); s.beginPath(); s.rect(-10, -10, W + 20, H + 20);
    if (L.titleBand) s.rect(blk.x0 - 10, blk.y0 - 10, blk.x1 - blk.x0 + 20, L.titleBand[1] - blk.y0 + 10 + 0.012 * H);
    for (const b of S.cartouches) { if (L.titleBand && b.y1 < L.titleBand[1] + 4) continue; const pad = Math.min(b.px * 0.22, 26 * u); s.rect(b.x0 - pad, b.y0 - pad, b.x1 - b.x0 + pad * 2, b.y1 - b.y0 + pad * 2); }
    s.clip('evenodd');
    // rays: wedges cut from the screen outwards; fine chatter in the uncut wedges
    const N = L.fmt === 'short' ? 36 : 44, R0 = Math.hypot(outerPx[0][0] - scx, outerPx[0][1] - scy) * 0.62, R1 = Math.hypot(W, H);
    for (let i = 0; i < N; i++) {
      const a = (i / N) * TAU + rayRot, half = (TAU / N) * (0.2 + 0.08 * Math.sin(i * 2.7)), a0 = a - half, a1 = a + half;
      const p0 = [scx + Math.cos(a) * R0, scy + Math.sin(a) * R0];
      const pts = [p0, [scx + Math.cos(a0) * R1, scy + Math.sin(a0) * R1], [scx + Math.cos(a1) * R1, scy + Math.sin(a1) * R1]];
      s.beginPath(); polyPath(s, wobble(pts, 18 * u, 2.4 * u, rr)); s.fill();
      // a narrow cut down the middle of every other dark wedge
      const am = a + TAU / N / 2, q0 = [scx + Math.cos(am) * R0 * 1.5, scy + Math.sin(am) * R0 * 1.5];
      if (i % 2 === 0) gouge(s, q0, [scx + Math.cos(am) * R1 * 0.5, scy + Math.sin(am) * R1 * 0.5], 2.2 * u, rr);
    }
    s.restore();
    // the clear areas round the letters get a carved border line, like a cartouche
    s.save(); s.lineWidth = 2.4 * u;
    for (const b of S.cartouches) { if (L.titleBand && b.y1 < L.titleBand[1] + 4) continue; const pad = Math.min(b.px * 0.22, 26 * u); s.beginPath(); polyPath(s, wobble([[b.x0 - pad * 0.55, b.y0 - pad * 0.55], [b.x1 + pad * 0.55, b.y0 - pad * 0.55], [b.x1 + pad * 0.55, b.y1 + pad * 0.55], [b.x0 - pad * 0.55, b.y1 + pad * 0.55]], 14 * u, 1.4 * u, rr)); s.stroke(); }
    if (L.titleBand) { const y = L.titleBand[1] + 0.006 * H; s.beginPath(); s.moveTo(blk.x0 + 10 * u, y); s.lineTo(blk.x1 - 10 * u, y + 1.5 * u); s.lineWidth = 3 * u; s.stroke(); }
    s.restore();
    // ground cuts near the stand: short arcs
    const baseY = P([0, st.base[1] + st.base[3]])[1];
    for (let i = 0; i < 26; i++) {
      const x = scx + (rr() - 0.5) * L.s * 1.6, y = baseY + (0.02 + rr() * 0.06) * L.s;
      gouge(s, [x, y], [x + (0.05 + rr() * 0.08) * L.s, y + (rr() - 0.5) * 2 * u], 1.6 * u, rr);
    }
    // the stand: a cut outline, ochre inside with a few hatch lines left
    s.save(); s.lineJoin = 'round'; s.lineWidth = 6 * u;
    s.beginPath(); polyPath(s, neckPts); s.stroke(); s.fill();
    for (const f of ['side', 'top', 'front']) { s.beginPath(); polyPath(s, baseFaces[f]); s.stroke(); s.fill(); }
    s.restore();
    // the screen: cut almost clean, leaving thin scan ridges of ink
    s.save(); s.beginPath(); polyPath(s, innerClip); s.fill(); s.restore();
    // the robot's halo inside the screen
    s.save(); s.beginPath(); polyPath(s, innerClip); s.clip(); s.lineJoin = 'round'; s.lineWidth = 9 * u;
    for (const p of robotParts) for (const f of ['side', 'top', 'front']) { s.beginPath(); polyPath(s, L.PP(p[f])); s.stroke(); }
    for (const f of ['side', 'top', 'front']) { s.beginPath(); polyPath(s, headF[f]); s.stroke(); }
    s.beginPath(); s.ellipse(ex, ey, ear.rx * L.s * 1.5, ear.ry * L.s * 1.35, 0, 0, TAU); s.fill();
    s.restore();
    // lettering
    s.drawImage(letters, 0, 0);
  };
  S.staticInk = (s, rr) => {
    s.beginPath(); polyPath(s, blockPts); s.fill();
  };
  // second cobalt pass: things that sit inside carved areas (scan ridges, robot, bezel detail)
  S.innerInk = s => {
    // scan ridges in the screen, cleared round the robot (its white-line halo)
    s.save(); s.beginPath(); polyPath(s, innerClip); s.clip();
    const b = bboxOf(innerClip);
    // the screen glows: no scan lines, only the chatter a carver leaves in a wide clearing
    const rc = mulberry32(5150);
    for (let i = 0; i < 70; i++) {
      const edge = rc() < 0.5, x = edge ? (rc() < 0.5 ? b.x0 + rc() * b.w * 0.12 : b.x1 - rc() * b.w * 0.12) : b.x0 + rc() * b.w;
      const y = edge ? b.y0 + rc() * b.h : (rc() < 0.5 ? b.y0 + rc() * b.h * 0.1 : b.y1 - rc() * b.h * 0.1);
      s.save(); s.translate(x, y); s.rotate((rc() - 0.5) * 0.4); s.fillRect(0, 0, (4 + rc() * 14) * u, (0.6 + rc() * 0.9) * u); s.restore();
    }
    s.globalCompositeOperation = 'destination-out'; s.lineJoin = 'round'; s.lineWidth = 7 * u;
    for (const p of robotParts) for (const f of ['side', 'top', 'front']) { s.beginPath(); polyPath(s, L.PP(p[f])); s.stroke(); s.fill(); }
    for (const f of ['side', 'top', 'front']) { s.beginPath(); polyPath(s, headF[f]); s.stroke(); s.fill(); }
    s.beginPath(); s.ellipse(ex, ey, ear.rx * L.s * 1.5, ear.ry * L.s * 1.35, 0, 0, TAU); s.fill();
    s.beginPath(); polyPath(s, L.PP(SKELETON.fold.flap)); s.stroke(); s.fill();
    s.globalCompositeOperation = 'source-over';
    s.restore();
    // bezel (solid)
    s.beginPath(); polyPath(s, outerPx); polyPath(s, innerPx); s.fill('evenodd');
    // stand outline as ink lines
    s.save(); s.lineJoin = 'round'; s.lineWidth = 2.2 * u;
    s.beginPath(); polyPath(s, neckPts); s.stroke();
    for (const f of ['side', 'top', 'front']) { s.beginPath(); polyPath(s, baseFaces[f]); s.stroke(); }
    s.restore();
    // robot body + head (clipped to the screen)
    s.save(); s.beginPath(); polyPath(s, innerClip); s.clip();
    for (const p of robotParts) for (const f of ['side', 'top', 'front']) { s.beginPath(); polyPath(s, wobble(L.PP(p[f]), 9 * u, 0.8 * u, rnd)); s.fill(); }
    for (const f of ['side', 'top', 'front']) { s.beginPath(); polyPath(s, wobble(headF[f], 9 * u, 0.8 * u, rnd)); s.fill(); }
    // ear rim ring
    s.beginPath(); s.ellipse(ex, ey, ear.rx * L.s * 1.18, ear.ry * L.s * 1.1, 0, 0, TAU); s.lineWidth = 2.2 * u; s.stroke();
    s.restore();
  };
  S.innerCarve = (s, rr) => {
    const k = L.s / 300;
    // bezel bevel cuts: light from the upper left
    const ob = bboxOf(outerPx), ib = bboxOf(innerPx);
    gouge(s, [ob.x0 + 14 * u, ob.y0 + (ib.y0 - ob.y0) * 0.45], [ob.x1 - 30 * u, ob.y0 + (ib.y0 - ob.y0) * 0.5], 2.6 * u, rr);
    gouge(s, [ob.x0 + (ib.x0 - ob.x0) * 0.45, ob.y0 + 16 * u], [ob.x0 + (ib.x0 - ob.x0) * 0.5, ob.y1 - 26 * u], 2.4 * u, rr);
    for (let i = 0; i < 9; i++) { const x = lerp(ib.x0, ib.x1, (i + 0.5) / 9); gouge(s, [x, ib.y1 + (ob.y1 - ib.y1) * 0.35], [x + 10 * u, ib.y1 + (ob.y1 - ib.y1) * 0.4], 1.4 * u, rr); }
    // LED socket
    s.beginPath(); s.arc(ledPt[0], ledPt[1], 0.02 * L.s, 0, TAU); s.fill();
    // robot hatching
    s.save(); s.beginPath(); polyPath(s, innerClip); s.clip();
    for (const p of robotParts) linoHatchBox(s, L, linoBoxFaces(L, p), rr, { body: true });
    linoHatchBox(s, L, headF, rr, { head: true });
    // fold: the dog-ear is cut clean (paper), with one uncut crease
    const fl = L.PP(SKELETON.fold.flap);
    s.beginPath(); polyPath(s, wobble(fl, 5 * u, 0.8 * u, rr)); s.fill();
    // eye sockets: cut clean; pupils are inked per frame
    for (const e of SKELETON.eyes) { const [cx, cy] = P([e.cx, e.cy]); s.beginPath(); polyPath(s, wobble(ellipsePts(cx, cy, e.r * L.s, e.r * L.s, 40), 4 * u, 0.9 * u, rr)); s.fill(); }
    // ear: cut out so the vermilion shows
    s.beginPath(); s.ellipse(ex, ey, ear.rx * L.s * 1.02, ear.ry * L.s * 1.02, 0, 0, TAU); s.fill();
    s.restore();
    void k;
  };
  // The cobalt that never moves is printed once into `base`.
  const base = makeCanvas(W, H), bc = ctxOf(base);
  bc.drawImage(under, 0, 0);
  const rCarve = mulberry32(2202);
  if (!L.rotRays) {
    S.press.pull(bc, S.sheets.cob, S.staticInk, s => S.staticCarve(s, rCarve, 0), { mode: 'source-over' });
  }
  S.base = base;
  // inner pass baked separately (it sits on top of the rotating field in the vertical format)
  const innerLayer = makeCanvas(W, H), il = ctxOf(innerLayer);
  const rInner = mulberry32(3303);
  S.press.pull(il, S.sheets.cob, S.innerInk, s => S.innerCarve(s, rInner), { mode: 'source-over' });
  // fold crease line (uncut ink) and ear rings in vermilion territory
  S.inner = innerLayer;
  if (!L.rotRays) { bc.drawImage(innerLayer, 0, 0); }
  // edition marks on the poster margin, in pencil
  if (L.pencil) {
    bc.save(); bc.fillStyle = 'rgba(70,64,60,0.62)'; setFont(bc, 11 * u, 400, FONT_SANS); bc.textBaseline = 'alphabetic';
    const y = blk.y1 + (H - blk.y1) * 0.55;
    bc.textAlign = 'left'; bc.fillText(L.pencil[0], blk.x0, y);
    bc.textAlign = 'right'; bc.fillText(L.pencil[1], blk.x1, y);
    bc.restore();
  }
  // roller reveal needs a bare sheet
  S.paper = paper;
  S.blockPts = blockPts;
  yield;
  return S;
}

// ── per frame: arms, eyes, rays (vertical), roller (title card) ─────────────
function drawFilm1(S, ctx, t) {
  const L = S.L, u = L.u, P = L.P, W = L.W, H = L.H, loop = 8;
  if (L.rotRays) {
    ctx.drawImage(S.under, 0, 0);
    const rr = mulberry32(2202);
    S.press.pull(ctx, S.sheets.cob, S.staticInk, s => S.staticCarve(s, rr, (t / loop) * (TAU / 36) * 1), { mode: 'source-over' });
    ctx.drawImage(S.inner, 0, 0);
  } else ctx.drawImage(S.base, 0, 0);

  // arms: restore what lies under the cobalt where the arm + its halo will be,
  // then print cuffs (vermilion) and the arms (cobalt) with their cuts.
  const poses = ARMS.map((a, i) => {
    const arm = L.armTweak ? Object.assign({}, a, { a1: a.a1 + L.armTweak[i] }) : a;
    return { arm, pose: poseArm(arm, t, loop, 1, L.armExtend * (L.armExtendEach ? L.armExtendEach[i] : 1)) };
  });
  const toPx = pl => pl.map(P);
  const handPolys = poses.map(({ arm, pose }) => {
    const hs = handShape(arm.hand, arm.side, 0.5 + 0.5 * wave(t, loop, 1, arm.ph));
    const ca = Math.cos(pose.dir), sa = Math.sin(pose.dir), [wx, wy] = pose.wrist, sc = 1.72;
    const tf = pts => pts.map(([x, y]) => P([wx + (x * ca - y * sa) * sc, wy + (x * sa + y * ca) * sc]));
    return {
      palm: tf(hs.palm),
      fingers: hs.fingers.map(f => tf(capsulePts(f.pl[0], f.pl[1], f.w, 6))),
      thumb: tf(capsulePts(hs.thumb.pl[0], hs.thumb.pl[1], hs.thumb.w, 6)),
      knuckles: hs.fingers.map(f => tf([[f.pl[0][0] - 0.008, f.pl[0][1]], [f.pl[0][0] + 0.012, f.pl[0][1]]])),
      palmLine: tf([[0.012, -0.02 * arm.side], [0.05, 0.012 * arm.side]]),
    };
  });
  const armW = tt => (0.104 - 0.02 * tt) * L.s;
  const tubes = poses.map(({ pose }) => {
    const pl = toPx(pose.pl);
    return { pl, poly: tubePoly(pl, tt => armW(tt)) };
  });
  // 1) halo: the carver cut around each arm, so the under-print shows
  const haloMask = s => {
    s.save(); s.lineJoin = 'round'; s.lineCap = 'round';
    for (const tb of tubes) { s.beginPath(); polyPath(s, tb.poly); s.lineWidth = 10 * u; s.stroke(); s.fill(); }
    for (const h of handPolys) for (const poly of [h.palm, h.thumb, ...h.fingers]) { s.beginPath(); polyPath(s, poly); s.lineWidth = 9 * u; s.stroke(); s.fill(); }
    s.restore();
  };
  const sc = S.press.ctx, scv = S.press.canvas;
  sc.setTransform(1, 0, 0, 1, 0, 0); sc.globalCompositeOperation = 'source-over'; sc.clearRect(0, 0, W, H); sc.fillStyle = '#000'; sc.strokeStyle = '#000';
  haloMask(sc);
  sc.globalCompositeOperation = 'source-in'; sc.drawImage(S.under, 0, 0); sc.globalCompositeOperation = 'source-over';
  ctx.drawImage(scv, 0, 0);
  // 2) vermilion cuffs
  const cuffs = poses.map(({ pose }) => {
    const pl = toPx(pose.pl), c0 = alongPoly(pl, 0.84), c1 = alongPoly(pl, 0.93);
    return tubePoly([c0.p, lerpPt(c0.p, c1.p, 0.5), c1.p], armW(0.9) * 1.12);
  });
  S.press.pull(ctx, S.sheets.verm, s => { for (const c of cuffs) { s.beginPath(); polyPath(s, c); s.fill(); } }, null, { dx: S.reg.verm[0], dy: S.reg.verm[1], mode: 'multiply' });
  // 3) cobalt arms + hands, with their cuts
  const rr = mulberry32(4404);
  S.press.pull(ctx, S.sheets.cob, s => {
    for (const tb of tubes) { s.beginPath(); polyPath(s, tb.poly); s.fill(); }
    for (const h of handPolys) for (const poly of [h.palm, h.thumb, ...h.fingers]) { s.beginPath(); polyPath(s, poly); s.fill(); }
  }, s => {
    for (let i = 0; i < tubes.length; i++) {
      const pl = tubes[i].pl, len = polyLength(pl), step = 0.036 * L.s, n = Math.floor(len / step);
      // ring cuts across the tube (each a slight arc: a cylinder seen from the side)
      for (let k = 1; k < n; k++) {
        const f = k / n; if (f > 0.8 && f < 0.95) continue;
        const { p, t: tg } = alongPoly(pl, f), nx = -tg[1], ny = tg[0], w = armW(f) * 0.36;
        const bow = 0.9 * u;
        gougeAlong(s, [[p[0] + nx * w - tg[0] * bow, p[1] + ny * w - tg[1] * bow], [p[0] + tg[0] * bow * 0.6, p[1] + tg[1] * bow * 0.6], [p[0] - nx * w - tg[0] * bow, p[1] - ny * w - tg[1] * bow]], 1.5 * u, rr);
      }
      // the lit edge: a long broken cut along the upper-left side
      const seg = [];
      for (let k = 0; k <= 24; k++) { const f = 0.04 + k / 24 * 0.76, { p, t: tg } = alongPoly(pl, f); let nx = -tg[1], ny = tg[0]; if (nx + ny > 0) { nx = -nx; ny = -ny; } seg.push([p[0] + nx * armW(f) * 0.3, p[1] + ny * armW(f) * 0.3]); }
      gougeAlong(s, seg.slice(0, 12), 2.2 * u, rr); gougeAlong(s, seg.slice(13), 1.8 * u, rr);
      // cuff: cut the cobalt away so the vermilion shows
      s.beginPath(); polyPath(s, cuffs[i]); s.fill();
    }
    for (const h of handPolys) {
      for (const k of h.knuckles) gouge(s, k[0], k[1], 1.6 * u, rr);
      gouge(s, h.palmLine[0], h.palmLine[1], 1.8 * u, rr);
    }
  }, { mode: 'source-over' });
  // cuff edges: thin cobalt rings either side of the vermilion band
  S.press.pull(ctx, S.sheets.cob, s => {
    s.lineWidth = 1.6 * u;
    for (const c of cuffs) { s.beginPath(); polyPath(s, c); s.stroke(); }
  }, null, { mode: 'source-over' });

  // eyes: pupils and lids inked every frame
  const id = robotIdle(t, loop, { blinks: [2.6, 6.9], looks: [[0.35, -0.1], [-0.3, 0.05], [0.15, 0.32], [0.38, 0.2]] });
  S.press.pull(ctx, S.sheets.cob, s => {
    for (const e of SKELETON.eyes) {
      const [cx, cy] = P([e.cx, e.cy]), r = e.r * L.s;
      const px = cx + id.look[0] * r * 0.42, py = cy + id.look[1] * r * 0.42;
      s.beginPath(); s.arc(px, py, r * 0.5, 0, TAU); s.fill();
      if (id.blink > 0.02) { // lid comes down from the top of the socket
        s.save(); s.beginPath(); s.arc(cx, cy, r * 1.04, 0, TAU); s.clip();
        s.fillRect(cx - r * 1.2, cy - r * 1.2, r * 2.4, r * 2.4 * id.blink);
        s.restore();
      }
    }
  }, s => {
    for (const e of SKELETON.eyes) { // catch-lights cut into the pupils
      const [cx, cy] = P([e.cx, e.cy]), r = e.r * L.s;
      const px = cx + id.look[0] * r * 0.42, py = cy + id.look[1] * r * 0.42;
      if (id.blink < 0.5) { s.beginPath(); s.arc(px - r * 0.17, py - r * 0.18, r * 0.13, 0, TAU); s.fill(); }
    }
  }, { mode: 'source-over' });

  // title card: a brayer reveal, then a hold, then a fresh sheet
  if (L.roller) rollerReveal(S, ctx, t, loop);
}

function rollerReveal(S, ctx, t, loop) {
  const L = S.L, W = L.W, H = L.H, u = L.u;
  const tt = ((t % loop) + loop) % loop;
  const k = easeInOut((tt - 0.2) / 2.4);           // 0 → 1 across the sheet
  const fade = smooth(7.2, 7.95, tt);              // a new sheet slides in
  const x = lerp(-0.1 * W, 1.12 * W, k);
  if (k < 1) {
    // ahead of the roller: bare paper; the ink edge is streaky, never a straight wipe
    const sc = S.press.ctx, cv = S.press.canvas;
    sc.setTransform(1, 0, 0, 1, 0, 0); sc.globalCompositeOperation = 'source-over'; sc.clearRect(0, 0, W, H);
    sc.fillStyle = '#000'; sc.beginPath(); sc.moveTo(W + 10, -10);
    for (let y = -10; y <= H + 10; y += 6 * u) { const j = (fbm(y / (40 * u), 3.3, 2, 91) - 0.5) * 34 * u + (hash2(y | 0, 7, 92) - 0.5) * 6 * u; sc.lineTo(x + j, y); }
    sc.lineTo(W + 10, H + 10); sc.closePath(); sc.fill();
    sc.globalCompositeOperation = 'source-in'; sc.drawImage(S.paper, 0, 0); sc.globalCompositeOperation = 'source-over';
    ctx.drawImage(cv, 0, 0);
    // the roller's shadow just ahead of the ink edge
    if (k > 0 && k < 1) {
      const g = ctx.createLinearGradient(x, 0, x + 60 * u, 0);
      g.addColorStop(0, 'rgba(40,30,20,0.22)'); g.addColorStop(1, 'rgba(40,30,20,0)');
      ctx.fillStyle = g; ctx.fillRect(x, 0, 60 * u, H);
    }
  }
  if (fade > 0) { ctx.save(); ctx.globalAlpha = fade; ctx.drawImage(S.paper, 0, 0); ctx.restore(); }
}

const FILM1 = { build: buildFilm1, draw: drawFilm1, loop: 8, animated: true, fps: fmt => (fmt === 'poster' || fmt === 'thumb' ? 12 : 24), still: 3.4 };
