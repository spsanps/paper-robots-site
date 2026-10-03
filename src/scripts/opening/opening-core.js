/* ============================================================================
   THE OPENING — "the overlay is the plot", now introducing the newest film.

   A full-page camcorder shot drawn in code, in the evidence loop's own rules
   (six colours, never black, halftone shade, cream-dash light, film grain, a
   crisp viewfinder overlay). The camera finds the paper robot, whips up, hunts
   across the stars, false-locks a star, then locks onto a folded-paper screen
   drifting in space. It zooms in; the screen tunes in from static to the newest
   film's own code-drawn title card; the riders cling to its frame. Then it
   holds: a slow handheld drift, REC blinking, the tape playing.

   Timeline (seconds)
     0.00-2.35  close-up: the robot gasps, wonders, blinks, looks toward the screen; whip pan
     2.35-4.30  wide, over the robot's shoulder: the reticle hunts, false-locks a star, locks the screen
     4.30-5.50  zoom: the screen grows from a speck to the hero; stars streak; the AF hunts
     5.50-      hold: the screen plays the title card; the page's film details fade in
     ~20-25     the camera pauses (PAUSE in the viewfinder) once the riders are at rest;
                Play motion, a tape button or Replay intro starts it again

   Cost: at most 1.5 device px per css px and about 2.4 MP; the hold draws at 24 fps;
   nothing draws while the opening is off screen, the tab is hidden, a film is
   playing in the screening room, or the camera is paused. Reduced motion shows
   the held shot as a still. Coming back in the same visit lands on the hold; a new visit plays the intro.

   The page's words are real HTML beside the shot; only the camera's own UI
   (REC, timecode, tape counter, battery, zoom bar, reticle, AF, date) is drawn.
   ========================================================================== */

/* ------------------------------------------------------------ more glyphs */
Object.assign(GLYPHS, {
  'B': ['####.', '#...#', '#...#', '####.', '#...#', '#...#', '####.'],
  'D': ['####.', '#...#', '#...#', '#...#', '#...#', '#...#', '####.'],
  'G': ['.###.', '#...#', '#....', '#.###', '#...#', '#...#', '.###.'],
  'H': ['#...#', '#...#', '#...#', '#####', '#...#', '#...#', '#...#'],
  'I': ['###', '.#.', '.#.', '.#.', '.#.', '.#.', '###'],
  'M': ['#...#', '##.##', '#.#.#', '#.#.#', '#...#', '#...#', '#...#'],
  'N': ['#...#', '##..#', '#.#.#', '#..##', '#...#', '#...#', '#...#'],
  'U': ['#...#', '#...#', '#...#', '#...#', '#...#', '#...#', '.###.'],
  'V': ['#...#', '#...#', '#...#', '#...#', '#...#', '.#.#.', '..#..'],
  'Y': ['#...#', '#...#', '.#.#.', '..#..', '..#..', '..#..', '..#..'],
  '/': ['....#', '...#.', '...#.', '..#..', '.#...', '.#...', '#....'],
  '-': ['.....', '.....', '.....', '#####', '.....', '.....', '.....'],
  '>': ['#....', '##...', '###..', '####.', '###..', '##...', '#....'],
});

/* --------------------------------------------------------------- the films */
// Newest first, from the site's film data (src/data/films.mjs) published on the page.
// Only the shot's own timing lives here: when each film's title card has finished
// its reveal, and the finished stretch it drifts through while the shot holds.
const FILMS = JSON.parse(document.getElementById('paper-robots-films').textContent);
const CARD_TIMING = { film2: { reveal: 4.7, hold: [4.7, 6.8] }, film1: { reveal: 2.9, hold: [3.0, 6.8] } };
const RENDERERS = { film1: () => (typeof FILM1 !== 'undefined' ? FILM1 : null), film2: () => (typeof FILM2 !== 'undefined' ? FILM2 : null) };
const TAPES = {};
for (const n of FILMS.order) {
  const f = FILMS.films[n], timing = CARD_TIMING[f.renderer] || { reveal: 3, hold: [3, 6.8] };
  TAPES[n] = { n, art: RENDERERS[f.renderer] || (() => null), date: f.dateStamp, runtime: f.runtime, reveal: timing.reveal, hold: timing.hold };
}
const ORDER = FILMS.order.slice();
const TAPE_COUNT = String(FILMS.count).padStart(2, '0');
const T_SET = 5.5;

/* ---------------------------------------------------------------- layout */
// copyTop: where the page's words start (css px from the top of the opening);
// on tall screens the shot must stay above them.
let LY = null;
function computeLayout(cssW, cssH, copyTop) {
  const wide = cssW / cssH >= 1.12;
  const uc = cssW / 1000;                 // css px per unit
  const q = 1 / uc;                       // units per css px
  const headU = (wide ? 96 : 118) * q;
  if (wide) {
    // The viewfinder's rows: REC + timecode and TAPE at the top, SP · AF · date at the bottom.
    const rowsEnd = headU + 14 * q + 26 * q + 7 * 1.55 * q + 12 * q;
    const bottomRow = H - 30 * q - 7 * 1.55 * q - 12 * q;
    // Measured from the screen's centre (in screen widths): the riders' heads reach 0.45 above it,
    // the bezel ends 0.39 below it and the hanging rider's head 0.7 below it.
    const UP = 0.45, BEZ = 0.393, HANG = 0.7;
    const sw = Math.min(520, (H * 0.56) / 0.5625, 430 + (H - 560) * 0.2,
      (bottomRow - rowsEnd - 6) / (UP + BEZ), (H - rowsEnd - 10) / (UP + HANG));
    const y = Math.min(Math.max(headU + sw * 0.34 + 40 * q, H * 0.52, rowsEnd + UP * sw + 6), bottomRow - BEZ * sw, H - 4 - HANG * sw);
    const set = { x: 708, y, w: sw };
    return {
      wide, uc, q, headU, set,
      far: { x: 742, y: Math.max(headU + 130 * q, H * 0.36), w: 30 },
      close: { x: 700, y: H * 0.7, k: H * 0.28 },
      over: { x: 872, y: H * 0.8, k: H * 0.1, mirror: true },
      lookSign: -1,
      hunt: [[690, H * 0.5, 250 * 1, 250], [588, H * 0.4, 210, 210], [846, H * 0.36, 210, 210]],
      star: [616, 0.22],
      full: [700, H * 0.55, 560, H - headU - 120 * q],
      riders: [
        { id: 'A', at: [-0.42, 0.66], edge: 'top' },
        { id: 'B', at: [0.5, 0.66], edge: 'top' },
        { id: 'D', at: [-0.7, -0.66], edge: 'hang' },
      ],
      ov: { l: 470, r: 40 * q, b: 30 * q },
      rollC: [700, H * 0.5],
    };
  }
  // tall: the shot sits above the words, which fill the lower half
  const sw = 780;
  const set = { x: 500, y: headU + 70 * q + sw * 0.5625 / 2 + 0.08 * sw / 1.84, w: sw };
  // The close-up robot fits between the viewfinder's top rows and the words: its head
  // reaches about 1.0 k above the head's centre, its body about 2.45 k below (with the
  // gasp's stretch and the slow push-in).
  const top = headU + 42 * q, bottom = (copyTop ? copyTop * q : H * 0.6) - 14 * q;
  const ck = Math.max(120, Math.min(212, (bottom - top) / 3.45));
  const cy = top + 1.0 * ck + Math.max(0, (bottom - top - 3.45 * ck) / 2);
  return {
    wide, uc, q, headU, set,
    far: { x: 650, y: headU + 60 * q, w: 50 },
    close: { x: 520, y: cy, k: ck },
    over: { x: 215, y: set.y + 150, k: 80, mirror: false },
    lookSign: 1,
    hunt: [[500, set.y, 380, 380], [330, set.y - 120, 320, 320], [700, set.y - 200, 320, 320]],
    star: [380, (headU + 160 * q) / H],
    full: [500, set.y + 60, 900, 900],
    riders: [
      { id: 'A', at: [-0.06, 0.66], edge: 'top' },
      { id: 'B', at: [0.6, 0.66], edge: 'top' },
    ],
    ov: { l: 36 * q, r: 36 * q, b: 0 },
    rollC: [500, set.y],
  };
}

/* ------------------------------------------------------------- the screen */
// a folded-paper screen: the bezel is a shallow box, the picture sits on its front
const SCREEN = boxGeom(1.0, 0.66, 0.07);
const PIC = { u0: -0.92, v0: 0.58, w: 1.84, h: 1.035 };   // the picture, in object units
const PIC_CY = PIC.v0 - PIC.h / 2;                          // its centre, above the box centre
const SCREEN_MAT = {
  front: { fill: VERM, dot: INK, cell: 6.5, shadeK: 0.55, grad: 0.16 },
  default: { fill: VERM, dot: INK, cell: 6.5, shadeAdd: 0.08 },
};

/* the card each tape plays: built once per size with the film's own renderer */
const cards = {};
function cardFor(n) {
  const T = TAPES[n], art = T.art();
  if (!art) return null;
  const cw = Math.max(160, Math.round(Math.min(1280, LY.set.w * U))), ch = Math.round(cw * 9 / 16);
  let c = cards[n];
  if (!c || c.cw !== cw) {
    const canvas = document.createElement('canvas'); canvas.width = cw; canvas.height = ch;
    c = cards[n] = { n, cw, ch, canvas, ctx: canvas.getContext('2d'), gen: null, state: null, lastDraw: -1, lastT: null };
  }
  return c;
}
function stepCard(c, budgetMs) {
  if (!c || c.state) return true;
  const art = TAPES[c.n].art();
  if (!c.gen) c.gen = art.build('title', c.cw, c.ch);
  const until = performance.now() + budgetMs;
  while (performance.now() < until) {
    const r = c.gen.next();
    if (r.done) { c.state = r.value; c.gen = null; return true; }
  }
  return false;
}
function buildCardNow(c) { if (!c) return; while (!stepCard(c, 1000)); }
/* card clock: play the reveal once, then hold by drifting back and forth inside the finished part */
function cardClock(n, since) {
  const T = TAPES[n];
  if (since <= T.reveal) return Math.max(0, since);
  const span = T.hold[1] - T.hold[0], ph = ((since - T.reveal) / span) % 2;
  return T.hold[0] + span * (ph < 1 ? ph : 2 - ph);
}
function paintCard(c, tc, force) {
  if (!c || !c.state) return false;
  if (!force && c.lastT !== null && Math.abs(tc - c.lastT) < 1 / 15) return true;
  TAPES[c.n].art().draw(c.state, c.ctx, tc);
  c.lastT = tc;
  return true;
}

/* ------------------------------------------------------------------ state */
const st8 = { tape: ORDER[0], tunedAt: null, switchAt: null, prevTape: null, tStart: 0 };

/* ------------------------------------------------------------------ shots */
function closeCam(s) {
  const hh = handheld(s, 1.0);
  const whip = s > 2.1 ? 1300 * ein(inv(2.1, 2.35, s)) : 0;
  return { ax: LY.close.x, ay: H / 2, px: 520, py: H * 0.5 + 520, Z: 1 + 0.035 * s, dx: hh.x, dy: hh.y + whip, roll: hh.r, whip };
}
function closeRobotPose(s) {
  const cam = closeCam(s), kk = LY.close.k / 338, ls = LY.lookSign;
  const sp = spring(s, 15, 5.2);
  const lookT = eback(inv(1.25, 1.55, s));
  const antic = sstep(1.85, 2.08, s);
  const sy = 1 + 0.12 * sp - 0.05 * antic;
  const blink = bump(0.95, 1.02, 1.14, s);
  const sparkleV = sstep(0.26, 0.4, s) * (1 - sstep(0.92, 1.0, s)) * (0.86 + 0.14 * Math.sin(TAU * 24 * s / LOOP));
  return {
    x: LY.close.x + cam.dx + 18 * kk * lookT * ls,
    y: LY.close.y + cam.dy + kk * (6 * Math.sin(TAU * s / LOOP * 2) + 34 * antic - 20 * sp - 26 * lookT),
    k: LY.close.k * cam.Z,
    yaw: -0.5 + 0.13 * lookT * ls, pitch: 0.27 - 0.13 * lookT + 0.06 * antic, roll: 0.025 * Math.sin(TAU * s / LOOP) - 0.03 * sp + cam.roll,
    headYaw: 0, headPitch: 0, sy,
    eyes: {
      eyeScale: 1 + 0.2 * Math.exp(-4.5 * s) * (1 + 0.15 * Math.cos(16 * s)),
      pupil: 0.6 + 0.4 * sstep(0.0, 0.3, s) + 0.5 * sparkleV - 0.06 * lookT * (1 - antic),
      lookX: ls * lerp(-0.08, 0.72, lookT), lookY: lerp(0.0, 0.78, lookT),
      open: 1 - blink * 0.98 - 0.12 * sstep(1.75, 1.95, s) + 0.12 * antic,
      sparkle: sparkleV,
    },
    earOff: [0.06 * spring(s - 0.02, 21, 5.5) + 0.04 * spring(s - 1.3, 24, 6), 0.05 * spring(s, 17, 5) - 0.03 * spring(s - 1.3, 20, 6)],
  };
}
function drawClose(g, base, s) {
  const cam = closeCam(s), camPrev = closeCam(Math.max(0, s - 0.035));
  drawBG(g, cam, camPrev, s);
  const pose = closeRobotPose(s);
  drawRobot(g, base, pose, false);
  const e = 1 - sstep(0.05, 0.45, s);
  if (e > 0.01) {
    const cx = pose.x, cy = pose.y - pose.k * 0.95, sc = eout(inv(0, 0.18, s));
    for (const [ang, len] of [[-2.25, 1], [-1.62, 1.25], [-1.0, 1]]) {
      const r0 = pose.k * (0.98 + 0.22 * sc), r1 = r0 + pose.k * 0.2 * len * e;
      dash(g, cx + Math.cos(ang) * r0 * 1.05, cy + Math.sin(ang) * r0 * 0.62, cx + Math.cos(ang) * r1 * 1.05, cy + Math.sin(ang) * r1 * 0.62, pose.k * 0.026);
    }
  }
}

/* the wide, the zoom and the hold are one camera move */
function wideCam(s) {
  const F = LY.far, S = LY.set;
  const zt = eio(inv(4.3, 5.5, s));
  const Zmax = S.w / F.w;
  const Z = Math.exp(Math.log(Zmax) * zt);
  const drift = inv(2.35, 4.3, s);
  const S0x = F.x - 22 * drift, S0y = F.y + 8 * drift;
  let Sx = lerp(S0x, S.x, zt), Sy = lerp(S0y, S.y, zt);
  const held = sstep(5.3, 6.6, s);
  Sx += held * 5 * Math.sin(TAU * s / 16); Sy += held * 4 * Math.sin(TAU * s / 12 + 1);
  const arr = s < 2.7 ? -900 * Math.pow(1 - eout(inv(2.35, 2.7, s)), 1.4) : 0;
  const hh = handheld(s, lerp(1.0, 0.42, sstep(5.2, 6.2, s)));
  return { Z, zt, Sx, Sy, arr, dx: hh.x, dy: hh.y + arr, roll: hh.r, ax: Sx, ay: Sy, px: F.x, py: F.y };
}
function screenPose(s, cam) {
  const k = cam.Z * LY.far.w / PIC.w;
  const settle = sstep(4.7, 5.9, s);
  const yaw = lerp(0.42 * Math.sin(0.9 * s + 0.4) - 0.1, -0.17 + 0.035 * Math.sin(TAU * s / 9), settle);
  const pitch = lerp(0.24 + 0.06 * Math.sin(0.7 * s), 0.06 + 0.025 * Math.sin(TAU * s / 7 + 1), settle);
  const roll = lerp(0.32 - 0.05 * s, -0.022 + 0.014 * Math.sin(TAU * s / 11), settle);
  const R = mulM(rotZ(roll), mulM(rotX(pitch), rotY(yaw)));
  const bob = settle * 4 * Math.sin(TAU * s / 6);
  return { x: cam.Sx + cam.dx, y: cam.Sy + cam.dy + bob + PIC_CY * k, k, R };
}

/* riders, idling on the frame (all periods divide 8 s) */
function riderIdle(id, s) {
  const p = ((s % 8) + 8) % 8;
  switch (id) {
    case 'A': {
      const wv = bump(1.0, 1.4, 3.4, p);
      return { stretch: 1 + 0.06 * Math.sin(s * 9.5 * 2 + 1.2) * wv + 0.02 * Math.sin(TAU * s / 4),
        armR: lerp(0.95, -1.95 + 0.5 * Math.sin(s * 9.5), wv), armL: 2.2 + 0.06 * Math.sin(TAU * s / 4),
        lookX: lerp(0.2, -0.15, wv), lookY: 0.15, pupil: 0.52, open: 1 - bump(6.3, 6.37, 6.47, p), legAmp: 0 };
    }
    case 'B': {
      const peek = bump(4.6, 5.1, 6.6, p);
      return { stretch: 1 - 0.035 * Math.sin(TAU * s / 4 + 0.6), armR: 1.05 + 0.08 * Math.sin(TAU * s / 4), armL: 2.1 - 0.08 * Math.sin(TAU * s / 4),
        lookX: lerp(-0.55, 0.05, peek), lookY: lerp(0.35, 0.05, peek), pupil: 0.5 + 0.06 * peek, open: 1 - bump(2.9, 2.97, 3.06, p) };
    }
    case 'D': {
      const kick = bump(2.0, 2.3, 3.0, p);
      return { stretch: 1.12 + 0.03 * Math.sin(TAU * s / 2), armL: -1.72 + 0.04 * Math.sin(TAU * s / 2), armR: -1.42 - 0.04 * Math.sin(TAU * s / 2),
        legPh: s * (2.2 + 9 * kick), legAmp: 0.32 + 0.8 * kick, lookX: 0.1, lookY: 0.5 - 0.3 * kick, pupil: 0.42 + 0.08 * kick, open: 1 - bump(5.5, 5.57, 5.66, p) };
    }
  }
  return {};
}
function placeOnFrame(o, r) {
  const [ux, vy] = r.at, z = 0.035;
  const a = proj(o, [ux, vy, z]), b = proj(o, [ux, vy + (r.edge === 'hang' ? -1 : 1), z]);
  const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1;
  return { x: a[0], y: a[1], nx: dx / l, ny: dy / l, up: Math.atan2(dy, dx) };
}

function drawScreen(g, base, s, cam) {
  const o = screenPose(s, cam);
  const k = o.k, lw = clamp(k * 0.016, 1.2, 4.6);
  // ribbon trail flowing away toward the upper right
  if (k > 6) {
    const flow = s * 1.6, R = k;
    const c0 = proj(o, [0.9, 0.5, 0]);
    g.lineCap = 'round';
    for (const [off, col, wk] of [[-0.18, PERI, 1], [0.16, PERI, 0.8], [0.0, CREAM, 0.55]]) {
      g.beginPath();
      for (let i = 0; i <= 40; i++) {
        const u = i / 40;
        const x = c0[0] + R * (0.2 + u * 2.2 + Math.sin(u * 3 + s * 0.6) * 0.12 + off * (1 - u) * 0.3);
        const y = c0[1] + R * (-0.15 - u * 1.25 + off * 0.6 + Math.cos(u * 2.4 + 0.5) * 0.12);
        if (i === 0) g.moveTo(x, y); else g.lineTo(x, y);
      }
      const dl = Math.max(6, R * 0.16);
      g.setLineDash([dl, dl * 0.8]); g.lineDashOffset = -flow * dl * 1.8;
      g.strokeStyle = col; g.lineWidth = Math.max(1.2, R * 0.016 * wk); g.stroke();
    }
    g.setLineDash([]);
  }
  // debris: folded scraps orbiting the screen
  const debris = [];
  for (let i = 0; i < 6; i++) {
    const ph = hash2(i, 41) * TAU, spd = 0.3 + hash2(i, 42) * 0.25, rad = 1.25 + hash2(i, 43) * 0.35;
    const a = ph + s * spd;
    debris.push({ x: o.x + Math.cos(a) * k * rad * 0.98, y: o.y - PIC_CY * k + Math.sin(a) * k * rad * 0.36, front: Math.sin(a) > 0, sz: k * (0.035 + hash2(i, 44) * 0.03), rot: s * (1 + hash2(i, 45) * 2) + ph, col: hash2(i, 46) < 0.5 ? CREAM : VERM });
  }
  const drawScrap = d => {
    if (d.sz < 1.2) return;
    g.save(); g.translate(d.x, d.y); g.rotate(d.rot);
    g.beginPath(); g.moveTo(0, -d.sz); g.lineTo(d.sz * 0.9, d.sz * 0.6); g.lineTo(-d.sz * 0.8, d.sz * 0.5); g.closePath();
    g.fillStyle = d.col; g.fill(); g.strokeStyle = PERI; g.lineWidth = Math.max(1, lw * 0.6); g.lineJoin = 'round'; g.stroke();
    g.restore();
  };
  debris.filter(d => !d.front).forEach(drawScrap);

  const riders = LY.riders.map(r => ({ r, p: placeOnFrame(o, r) }));
  const rh = k * 0.27;
  // the bezel
  const mesh = drawMesh(g, SCREEN, o, SCREEN_MAT, lw, { seed: 7 });
  const front = mulMV(o.R, [0, 0, 1])[2] > 0.04;
  if (front && k > 4) {
    const z = 0.07 + 0.003;
    // score lines around the picture, and the tape label on the bottom bezel
    const xfF = faceXf(o, [0, 0, z], [1, 0, 0], [0, -1, 0]);
    setXf(g, xfF, base);
    g.lineWidth = lw * 0.5 / k; g.strokeStyle = PERI;
    g.setLineDash([lw * 2.2 / k, lw * 1.7 / k]);
    g.strokeRect(PIC.u0 - 0.035, -PIC.v0 - 0.035, PIC.w + 0.07, PIC.h + 0.07);
    g.setLineDash([]);
    if (k > 40) {
      const lx = -0.5, ly = -(PIC.v0 - PIC.h) + 0.045, lwid = 1.0, lh = 0.11;
      g.fillStyle = CREAM; g.fillRect(lx, ly, lwid, lh);
      g.lineWidth = lw * 0.6 / k; g.strokeStyle = PERI; g.strokeRect(lx, ly, lwid, lh);
      const pitch = lh / 12.5;
      dotText(g, 'TAPE ' + st8.tape, lx + lwid * 0.07, ly + lh * 0.19, pitch, INK);
      dotText(g, TAPES[st8.tape].runtime, lx + lwid * 0.93, ly + lh * 0.19, pitch, PERI, 'right');
    }
    g.setTransform(base[0], base[1], base[2], base[3], base[4], base[5]);
    // the picture
    const xf = faceXf(o, [PIC.u0, PIC.v0, z], [PIC.w, 0, 0], [0, -PIC.h, 0]);
    setXf(g, xf, base);
    g.fillStyle = INK; g.fillRect(0, 0, 1, 1);
    const c = cards[st8.tape];
    const tuned = st8.tunedAt !== null ? clamp((s - st8.tunedAt) / 0.55) : 0;
    if (c && c.state && tuned > 0) {
      const since = s - st8.tunedAt;
      paintCard(c, cardClock(st8.tape, since));
      g.save(); g.globalAlpha = sstep(0, 1, tuned); g.drawImage(c.canvas, 0, 0, 1, 1); g.restore();
    }
    if (tuned < 1) drawStatic(g, s, 1 - sstep(0.2, 1, tuned), k);
    // the glass: two cream dashes of light and a thin PERI rim
    g.setTransform(base[0], base[1], base[2], base[3], base[4], base[5]);
    const gl = (u, v) => proj(o, [PIC.u0 + PIC.w * u, PIC.v0 - PIC.h * v, z]);
    if (k > 30) {
      const a1 = gl(0.06, 0.2), b1 = gl(0.15, 0.07), a2 = gl(0.05, 0.34), b2 = gl(0.08, 0.29);
      g.globalAlpha = 0.85;
      dash(g, a1[0], a1[1], b1[0], b1[1], lw * 1.1); dash(g, a2[0], a2[1], b2[0], b2[1], lw * 1.1);
      g.globalAlpha = 1;
    }
    const P4 = [gl(0, 0), gl(1, 0), gl(1, 1), gl(0, 1)];
    poly(g, P4); g.strokeStyle = PERI; g.lineWidth = lw * 0.8; g.lineJoin = 'round'; g.stroke();
    // glue tabs: unglued paper flaps on two edges
    for (const [ax, ay, bx, by, h] of [[-0.98, 0.3, -0.98, -0.1, 0.12], [0.2, 0.66, 0.62, 0.66, 0.1]]) {
      const ex = bx - ax, ey = by - ay;
      const out = ax < -0.9 ? [-1, 0] : [0, 1];
      const Q = [[ax, ay, z - 0.02], [bx, by, z - 0.02], [bx - ex * 0.12 + out[0] * h, by - ey * 0.12 + out[1] * h, z - 0.02], [ax + ex * 0.12 + out[0] * h, ay + ey * 0.12 + out[1] * h, z - 0.02]].map(v => proj(o, v));
      poly(g, Q); g.fillStyle = CREAM; g.fill();
      g.strokeStyle = PERI; g.lineWidth = lw * 0.7; g.stroke();
    }
  }
  // riders on the frame
  for (const { r, p } of riders) {
    const stR = riderIdle(r.id, s);
    if (r.edge === 'hang') {
      const fx = p.x + p.nx * rh * 1.04, fy = p.y + p.ny * rh * 1.04;
      drawRider(g, base, fx, fy, p.up + Math.PI, rh, stR);
    } else {
      drawRider(g, base, p.x, p.y, p.up, rh, stR);
    }
  }
  debris.filter(d => d.front).forEach(drawScrap);
  return { o, k, hull: mesh.hull };
}

/* static on the picture before it tunes in: dots that change every frame, a rolling band */
function drawStatic(g, s, a, k) {
  if (a <= 0.01) return;
  const fr = Math.floor(s * 18);
  g.save(); g.globalAlpha = a;
  g.fillStyle = INK; g.fillRect(0, 0, 1, 1);
  const n = Math.min(900, Math.max(60, Math.round(k * 2.2)));
  const d = 1.6 / Math.max(40, k * 1.6);
  for (let i = 0; i < n; i++) {
    const x = hash2(i, fr), y = hash2(i + 7919, fr);
    g.fillStyle = hash2(i, fr + 3) < 0.6 ? PERI : CREAM;
    g.fillRect(x, y, d * 1.8, d);
  }
  const band = ((s * 0.7) % 1.2) - 0.1;
  g.fillStyle = COBALT; g.globalAlpha = a * 0.45; g.fillRect(0, band, 1, 0.09);
  g.restore();
}

function drawWide(g, base, s) {
  const cam = wideCam(s), camPrev = wideCam(Math.max(2.35, s - 0.035));
  drawBG(g, cam, camPrev, s);
  // meteors in the wide
  for (const [t0, x0, y0, x1, y1] of LY.wide ? [[2.85, 960, 0.14, 640, 0.42], [3.6, 470, 0.08, 760, 0.25]] : [[2.85, 940, 0.1, 560, 0.3], [3.6, 120, 0.06, 470, 0.18]]) {
    const u = inv(t0, t0 + 0.32, s);
    if (u <= 0 || u >= 1) continue;
    const hx = lerp(x0, x1, eout(u)) + cam.dx * 0.8, hy = lerp(y0, y1, eout(u)) * H + cam.dy * 0.8;
    const dxm = x1 - x0, dym = (y1 - y0) * H, lm = Math.hypot(dxm, dym);
    const tl = 170 * (1 - u * 0.6);
    for (let i = 0; i < 4; i++) {
      const a0 = i * 0.3, a1 = a0 + 0.2 - i * 0.03;
      dash(g, hx - dxm / lm * tl * a0, hy - dym / lm * tl * a0, hx - dxm / lm * tl * a1, hy - dym / lm * tl * a1, 3.8 - i * 0.7);
    }
  }
  const scr = drawScreen(g, base, s, cam);
  // the robot over the shoulder; it leaves frame as we zoom
  if (cam.Z < 3.4) {
    const O = LY.over, F = LY.far;
    const Zr = Math.pow(cam.Z, 1.25);
    const bx = cam.Sx + (O.x - F.x) * Zr + cam.dx * 1.15, by = cam.Sy + (O.y - F.y) * Zr + cam.dy * 1.15;
    const m = O.mirror ? -1 : 1, mir = a => (O.mirror ? Math.PI - a : a);
    drawRobot(g, base, {
      x: bx, y: by + 9 * Math.sin(TAU * s / LOOP * 2), k: O.k * Zr,
      yaw: -0.62 * m, pitch: 0.12, roll: (0.16 + 0.03 * Math.sin(TAU * s / LOOP * 3)) * m + cam.roll,
      headYaw: 0.18 * m, headPitch: -0.22, sy: 1,
      eyes: { eyeScale: 1.04, pupil: 0.72, lookX: 0.55 * m, lookY: 0.8, open: 1 - bump(3.3, 3.36, 3.46, s), sparkle: 0 },
      earOff: [0.02 * Math.sin(s * 3), 0],
      arm: [[mir(2.2 + 0.12 * Math.sin(s * 2.2)), mir(1.7 + 0.2 * Math.sin(s * 2.2 + 0.8))], [mir(0.55 + 0.1 * Math.sin(s * 2.2 + 1.5)), mir(-0.35 + 0.18 * Math.sin(s * 2.2 + 2.3))]],
      leg: [[mir(1.95 + 0.1 * Math.sin(s * 1.7)), mir(1.75 + 0.15 * Math.sin(s * 1.7 + 0.6))], [mir(1.25 + 0.1 * Math.sin(s * 1.7 + 1.2)), mir(1.55 + 0.15 * Math.sin(s * 1.7 + 2))]],
    }, true);
  }
  return { cam, scr, Z: cam.Z };
}

/* ---------------------------------------------------------------- reticle */
function reticle(s, W, starPos) {
  if (s < 2.42) return null;
  const box = (x, y, w, h) => ({ x, y, w, h });
  const hb = bboxOf(W.scr.hull);
  const m = Math.max(16 * LY.q, (hb[2] - hb[0]) * 0.07);
  const tape = () => box((hb[0] + hb[2]) / 2, (hb[1] + hb[3]) / 2, Math.max(70 * LY.q, hb[2] - hb[0] + 2 * m), Math.max(56 * LY.q, hb[3] - hb[1] + 2 * m));
  const [fx, fy, fw, fh] = LY.full, [A, B, C] = LY.hunt.map(h => box(...h));
  const full = box(fx, fy, fw, fh);
  const S = box(starPos[0], starPos[1], 64 * LY.q, 64 * LY.q);
  const tb = tape();
  const Rel = box(lerp(starPos[0], tb.x, 0.45), lerp(starPos[1], tb.y, 0.45), 180 * LY.q, 180 * LY.q);
  const mix = (p, q, t) => box(lerp(p.x, q.x, t), lerp(p.y, q.y, t), lerp(p.w, q.w, t), lerp(p.h, q.h, t));
  if (s < 2.7) return Object.assign(mix(full, A, eout(inv(2.42, 2.7, s))), { phase: 'in' });
  if (s < 2.87) return Object.assign(A, { phase: 'hunt' });
  if (s < 3.13) return Object.assign(mix(A, B, eout(inv(2.87, 2.99, s))), { phase: 'hunt' });
  if (s < 3.31) return Object.assign(mix(B, C, eout(inv(3.13, 3.25, s))), { phase: 'hunt' });
  if (s < 3.61) return Object.assign(mix(C, S, eback(inv(3.31, 3.45, s))), { phase: 'false', blink: s > 3.45 });
  if (s < 3.83) return Object.assign(mix(S, Rel, eout(inv(3.61, 3.75, s))), { phase: 'hunt' });
  return Object.assign(mix(Rel, tb, eback(inv(3.83, 3.99, s))), { phase: 'lock' });
}

/* ---------------------------------------------------------------- overlay */
function drawOverlay(g, t, s, info) {
  const q = LY.q, ov = CREAM;
  const top = LY.headU + (LY.wide ? 14 : 4) * q;
  const L0 = LY.ov.l, R0 = 1000 - LY.ov.r;
  const f = LY.wide ? 1 : 0.82, P = 2.5 * q * f, p = 1.55 * q * f;
  // the viewfinder's frame: four faint corner marks around the camera's picture
  {
    const x0 = L0 - 14 * q, x1 = R0 + 14 * q, y0 = top - 14 * q;
    const y1 = LY.wide ? H - LY.ov.b + 10 * q : LY.set.y + 0.7225 * LY.set.w / PIC.w + 16 * q + 7 * p + 14 * q;
    const a = 16 * q;
    g.beginPath();
    g.moveTo(x0, y0 + a); g.lineTo(x0, y0); g.lineTo(x0 + a, y0);
    g.moveTo(x1 - a, y0); g.lineTo(x1, y0); g.lineTo(x1, y0 + a);
    g.moveTo(x1, y1 - a); g.lineTo(x1, y1); g.lineTo(x1 - a, y1);
    g.moveTo(x0 + a, y1); g.lineTo(x0, y1); g.lineTo(x0, y1 - a);
    g.globalAlpha = 0.5; g.lineWidth = 1.3 * q; g.strokeStyle = ov; g.lineCap = 'square'; g.stroke(); g.globalAlpha = 1;
  }
  // REC dot + timecode (counts the tape since the page opened); paused, two cream bars
  if (info.standby) { g.fillStyle = ov; g.fillRect(L0 + 2 * q, top + 2 * q, 3.6 * q, 13 * q); g.fillRect(L0 + 8.4 * q, top + 2 * q, 3.6 * q, 13 * q); }
  else if ((t % 1) < 0.62) { g.beginPath(); g.arc(L0 + 7 * q, top + 8.5 * q, 6.5 * q, 0, TAU); g.fillStyle = VERM; g.fill(); }
  const mm = Math.floor(t / 60) % 60, ss = Math.floor(t) % 60, fr = Math.floor((t % 1) * 24);
  const tc = `00:${mm < 10 ? '0' : ''}${mm}:${ss < 10 ? '0' : ''}${ss}`;
  dotText(g, tc, L0 + 22 * q, top, P, ov);
  dotText(g, (fr < 10 ? '0' : '') + fr, L0 + 22 * q + textWidth(tc, P) + 7 * q, top + 7 * q, p, ov);
  dotText(g, 'TAPE ' + st8.tape + '/' + TAPE_COUNT, L0 + 22 * q, top + 26 * q, p, ov);
  // battery, last cell blinking low
  {
    const bw = 34 * q, bh = 17 * q, bx = R0 - bw - 4 * q, by = top + 0.5 * q;
    g.lineWidth = 1.8 * q; g.strokeStyle = ov; g.lineJoin = 'round';
    g.beginPath(); g.roundRect(bx, by, bw, bh, 3 * q); g.stroke();
    g.beginPath(); g.roundRect(bx + bw + 1.5 * q, by + bh * 0.3, 3 * q, bh * 0.4, 1 * q); g.fillStyle = ov; g.fill();
    const cells = 3, gap = 2 * q, cw = (bw - 5 * q - gap * (cells - 1)) / cells;
    for (let i = 0; i < cells; i++) {
      if (i === 0 && (t % 2) > 1.2) continue;
      g.beginPath(); g.roundRect(bx + 2.5 * q + i * (cw + gap), by + 2.5 * q, cw, bh - 5 * q, 1.2 * q); g.fill();
    }
  }
  // bottom right: tape mode, AF, and the tape's date stamp
  const bot = LY.wide ? H - LY.ov.b - 7 * p : LY.set.y + 0.7225 * LY.set.w / PIC.w + 16 * q;
  const date = TAPES[st8.tape].date;
  const dx = R0;
  dotText(g, date, dx, bot, p, ov, 'right');
  const afx = dx - textWidth(date, p) - 18 * q;
  if (info.af === 'solid' || (info.af === 'blink' && (t * 6 % 2) < 1.2)) {
    dotText(g, 'AF', afx, bot, p, ov, 'right');
    if (info.af === 'blink') { g.beginPath(); g.roundRect(afx - textWidth('AF', p) - 5 * q, bot - 4 * q, textWidth('AF', p) + 10 * q, 7 * p + 8 * q, 2 * q); g.strokeStyle = ov; g.lineWidth = 1.2 * q; g.stroke(); }
  }
  dotText(g, 'SP', afx - textWidth('AF', p) - 16 * q, bot, p, ov, 'right');
  // reticle
  const r = info.reticle;
  if (r) {
    const lw = 2.1 * q, arm = 24 * q;
    if (!(r.blink && (s * 16 % 2) < 1)) {
      const relock = info.relock || 0;
      const grow = 1 + 0.25 * relock;
      bracketBox(g, r.x, r.y, r.w * grow, r.h * grow, lw, arm);
      if (r.phase !== 'lock' || s < 5.7) cross(g, r.x, r.y, (r.phase === 'false' ? 7 : 11) * q, 1.6 * q);
    }
    if (r.phase === 'lock' && s > 3.91) {
      const lt = inv(3.91, 4.01, s), kk = lerp(9 * q, 0, eout(lt));
      g.beginPath();
      g.moveTo(r.x - r.w / 2 - 7 * q - kk, r.y); g.lineTo(r.x - r.w / 2 + 6 * q - kk, r.y);
      g.moveTo(r.x + r.w / 2 + 7 * q + kk, r.y); g.lineTo(r.x + r.w / 2 - 6 * q + kk, r.y);
      g.moveTo(r.x, r.y - r.h / 2 - 7 * q - kk); g.lineTo(r.x, r.y - r.h / 2 + 6 * q - kk);
      g.moveTo(r.x, r.y + r.h / 2 + 7 * q + kk); g.lineTo(r.x, r.y + r.h / 2 - 6 * q + kk);
      g.strokeStyle = ov; g.lineWidth = 1.9 * q; g.stroke();
      const label = s < 5.9 ? 'LOCK' : info.standby ? 'PAUSE' : 'PLAY >';
      const show = s < 5.9 ? ((s * 4) % 2 < 1.4 || s > 4.5) : true;
      if (show && LY.wide) dotText(g, label, r.x + r.w / 2, r.y + r.h / 2 + 10 * q, p, ov, 'right');
      // tall screens: above the bracket's right corner, clear of the words below the shot
      else if (show) dotText(g, label, r.x + r.w / 2, r.y - r.h / 2 - 10 * q - 7 * p, p, ov, 'right');
    }
  }
  // zoom bar on the right edge
  if (info.zoom && (LY.wide || s < 6.0)) {
    const x = R0 - 2 * q, y0 = LY.wide ? H * 0.34 : LY.set.y - 90 * q, y1 = LY.wide ? H * 0.62 : LY.set.y + 90 * q;
    g.strokeStyle = ov; g.lineWidth = 1.6 * q; g.lineCap = 'round';
    g.beginPath(); g.moveTo(x, y0); g.lineTo(x, y1); g.stroke();
    g.beginPath();
    for (let i = 0; i <= 8; i++) { const y = lerp(y1, y0, i / 8); const w = (i % 4 === 0 ? 7 : 4) * q; g.moveTo(x - w, y); g.lineTo(x, y); }
    g.lineWidth = 1.1 * q; g.stroke();
    dotText(g, 'T', x, y0 - 20 * q, p, ov, 'center');
    dotText(g, 'W', x, y1 + 9 * q, p, ov, 'center');
    const zmax = LY.set.w / LY.far.w;
    const zt = Math.min(1, Math.log(info.zoom) / Math.log(zmax * 1.2));
    const sy = lerp(y1, y0, zt);
    g.beginPath(); g.roundRect(x - 4.5 * q, sy - 7 * q, 9 * q, 14 * q, 2.5 * q); g.fillStyle = ov; g.fill();
    dotText(g, 'x' + info.zoom.toFixed(1), x - 13 * q, sy - 5.5 * q, p, ov, 'right');
  }
}

/* ----------------------------------------------------------------- render */
/* The AF focus hunt. Where the canvas has a real blur filter, use it; where it doesn't
   (Safari), defocus like a lens instead: a softened copy of the frame spread over a small
   ring, so stars open into soft discs. Either way it reads as the camera finding focus. */
const FILTER_BLUR = !new URLSearchParams(location.search).has('nofilter') && (() => {
  try {
    const c = document.createElement('canvas'); c.width = c.height = 9;
    const g = c.getContext('2d');
    if (!('filter' in g)) return false;
    g.filter = 'blur(2px)'; g.fillStyle = '#fff'; g.fillRect(4, 4, 1, 1);
    return g.getImageData(1, 4, 1, 1).data[3] > 0;
  } catch (e) { return false; }
})();
const soft = document.createElement('canvas'), softCtx = soft.getContext('2d');
function defocus(dst, src, r) {
  if (FILTER_BLUR) { dst.filter = `blur(${r.toFixed(2)}px)`; dst.drawImage(src, 0, 0); dst.filter = 'none'; return; }
  const f = Math.min(10, 1 + r * 0.75), w = Math.max(1, Math.round(Wpx / f)), h = Math.max(1, Math.round(Hpx / f));
  if (soft.width !== w || soft.height !== h) { soft.width = w; soft.height = h; }
  softCtx.imageSmoothingEnabled = true; softCtx.imageSmoothingQuality = 'high';
  softCtx.drawImage(src, 0, 0, w, h);
  dst.imageSmoothingEnabled = true; dst.imageSmoothingQuality = 'high';
  dst.drawImage(soft, 0, 0, Wpx, Hpx);
  const ring = r * 0.9;
  for (let i = 0; i < 8; i++) { const a = i * TAU / 8 + 0.3; dst.globalAlpha = 1 / (i + 2); dst.drawImage(soft, Math.cos(a) * ring, Math.sin(a) * ring, Wpx, Hpx); }
  dst.globalAlpha = 1;
}

let baseXf = [1, 0, 0, 1, 0, 0], renders = 0;
function render(t, still, standby) {
  renders++;
  const s = t;
  const wideShot = s >= 2.35;
  // whip smears and the focus hunt need the frame drawn off screen first; the hold draws straight to the page
  let blur = 0, smear = 0, smearX = 0, sw = null;
  if (!wideShot) smear = s > 2.12 ? 520 * Math.pow(inv(2.12, 2.35, s), 2) : 0;
  else {
    smear = s < 2.7 ? 520 * Math.pow(1 - inv(2.35, 2.7, s), 2) : 0;
    if (s > 4.55 && s < 4.95) blur = 8 * sstep(4.55, 4.95, s);
    else if (s >= 4.95 && s < 6.4) { const tau = s - 4.95; blur = Math.abs(8 * Math.exp(-4.2 * tau) * Math.cos(TAU * 2.1 * tau)); }
    if (blur < 0.25) blur = 0;
    if (st8.switchAt !== null) { const u = s - st8.switchAt; if (u >= 0 && u < 0.5) { sw = u; smearX = 520 * bump(0, 0.16, 0.42, u); } }
  }
  const direct = smear <= 1 && smearX <= 1 && blur <= 0;
  const g = direct ? ctx : sctx;
  g.setTransform(1, 0, 0, 1, 0, 0);
  g.fillStyle = INK; g.fillRect(0, 0, Wpx, Hpx);
  const roll = wideShot ? wideCam(s).roll : closeCam(s).roll;
  const c = Math.cos(roll), sn = Math.sin(roll);
  const cx = LY.rollC[0] * U, cy = LY.rollC[1] * U;
  baseXf = [U * c, U * sn, -U * sn, U * c, cx - (cx * c - cy * sn), cy - (cx * sn + cy * c)];
  g.setTransform(baseXf[0], baseXf[1], baseXf[2], baseXf[3], baseXf[4], baseXf[5]);
  const info = { af: 'solid', reticle: null, zoom: 0, relock: 0, standby: Boolean(standby) };
  if (!wideShot) drawClose(g, baseXf, s);
  else {
    const W = drawWide(g, baseXf, s);
    info.reticle = reticle(s, W, starScreen(STARS[0], wideCam(s)));
    info.zoom = W.Z;
    info.af = s > 4.55 && s < 5.6 ? 'blink' : 'solid';
    if (sw !== null) { info.relock = 1 - sstep(0.18, 0.46, sw); info.af = sw < 0.4 ? 'blink' : 'solid'; }
  }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (!direct) {
    ctx.fillStyle = INK; ctx.fillRect(0, 0, Wpx, Hpx);
    if (smear > 1 || smearX > 1) {
      const n = 9;
      for (let i = 0; i < n; i++) {
        const f = i / (n - 1) - 0.5;
        ctx.globalAlpha = 1 / (i + 1);
        ctx.drawImage(scene, -smearX * U * f, -smear * U * f);
      }
      ctx.globalAlpha = 1;
    } else defocus(ctx, scene, blur * U * LY.q);
  }
  const gi = still ? 0 : Math.floor(s * 12) % grains.length;
  ctx.drawImage(grains[gi], 0, 0, Wpx, Hpx);
  ctx.setTransform(U, 0, 0, U, 0, 0);
  drawOverlay(ctx, t, s, info);
}

/* ----------------------------------------------------------------- layout */
const section = cv.closest('[data-opening]');
let laidOut = [0, 0];
function layout() {
  const r = section.getBoundingClientRect();
  const cw = Math.max(320, r.width), ch = Math.max(420, r.height);
  laidOut = [r.width, r.height];
  // keep the full-page canvas affordable: at most 1.5 device px per css px and about 2.4 MP
  DPR = Math.min(1.5, window.devicePixelRatio || 1);
  const cap = Math.sqrt(2.4e6 / (cw * ch));
  if (DPR > cap) DPR = Math.max(1, cap);
  cv.style.width = cw + 'px'; cv.style.height = ch + 'px';
  Wpx = Math.round(cw * DPR); Hpx = Math.round(ch * DPR);
  cv.width = Wpx; cv.height = Hpx; scene.width = Wpx; scene.height = Hpx;
  U = Wpx / 1000; H = Hpx / U;
  const copy = section.querySelector('.opening-copy');
  const copyTop = copy.getBoundingClientRect().top - r.top + parseFloat(getComputedStyle(copy).paddingTop || '0');
  LY = computeLayout(cw, ch, copyTop);
  LY.botPad = 0;
  STARS[0].x = LY.star[0]; STARS[0].y = LY.star[1];
  buildFarTex();
  buildGrain();
  for (const k in cards) delete cards[k];
  if (st8.tunedAt !== null && fixedT === null) st8.tunedAt = null;   // re-tune the resized card
  cardFor(st8.tape);
}

/* -------------------------------------------------------------------- run */
const qs = new URLSearchParams(location.search);
const fixedT = qs.has('t') ? parseFloat(qs.get('t')) : null;
if (qs.has('tape') && TAPES[qs.get('tape')]) st8.tape = qs.get('tape');
const reduce = matchMedia('(prefers-reduced-motion: reduce)');
const SEEN_KEY = 'pr-opening-seen';
const HOLD_PLAY = 12;      // seconds the hold stays alive after the card's reveal, before the camera pauses
const HOLD_FPS = 24;       // the hold is slow: film rate is plenty
// the intro plays on every fresh visit and every reload; only someone coming back to the
// homepage from another page of the site, after watching it, lands straight on the hold
// (the head script decides, so the film details show without a flash)
const seen = document.documentElement.classList.contains('opening-seen');
const skipIntro = qs.has('settled') || (fixedT === null && seen);
let t0 = performance.now() - (skipIntro ? (T_SET + 0.2) * 1000 : 0);
let raf = 0, lastFrame = 0, lastTs = 0, firstTick = true, onScreen = true, screening = false;
let paused = null;          // null, or why the shot is still: 'user' | 'settled' | 'reduced'
let frozenAt = 0;           // performance.now() when the clock stopped (paused, hidden, screening)
let playFrom = 0;           // the hold's motion budget counts from here
let resolveReady; window.OPENING_READY = new Promise(r => { resolveReady = r; });
window.__openingReady = false;

const ctl = {
  skip: section.querySelector('[data-skip]'),
  motion: section.querySelector('[data-motion]'),
  tapes: [...section.querySelectorAll('[data-tape]')],
  copies: [...section.querySelectorAll('[data-tape-copy]')],
};
function now() { return (performance.now() - t0) / 1000; }
const frozen = () => paused !== null || document.hidden || screening;
function lockedUI(t) {
  section.classList.toggle('is-locked', t >= 5.35);
  section.classList.toggle('is-intro', t < T_SET);
  if (ctl.skip) ctl.skip.textContent = t < T_SET ? 'Skip intro' : 'Replay intro';
  if (t >= T_SET && !lockedUI.saved) { lockedUI.saved = true; try { sessionStorage.setItem(SEEN_KEY, '1'); } catch (e) { /* ignore */ } }
}
function motionUI() {
  if (!ctl.motion) return;
  ctl.motion.setAttribute('aria-pressed', String(paused !== null));
  ctl.motion.textContent = paused !== null ? 'Play motion' : 'Pause motion';
}
function tuneIfReady(t) {
  if (st8.tunedAt !== null) return;
  const c = cardFor(st8.tape);
  if (!c || !c.state) return;
  if (st8.switchAt !== null) { if (t - st8.switchAt > 0.22) st8.tunedAt = t; }
  else if (t >= 5.15) st8.tunedAt = Math.max(5.15, t);
}
function buildOthers() {
  for (const n of ORDER) { if (n === st8.tape) continue; const c = cardFor(n); if (c && !c.state) { stepCard(c, 4); return; } }
}
/* the hold may stop once its card has revealed and it has been alive for HOLD_PLAY s;
   it stops at the start of the riders' 8 s idle, when everyone is at rest */
function readyToSettle(t) {
  if (st8.tunedAt === null || t < T_SET + 1) return false;
  const from = Math.max(st8.tunedAt + TAPES[st8.tape].reveal, playFrom);
  return t > from + HOLD_PLAY && ((t - 0.4) % LOOP) < 0.25;
}
function tick(ts) {
  raf = 0;
  if (frozen() || !onScreen) { lastTs = 0; return; }
  // the intro's clock starts on its first drawn frame, and during the intro a slow frame
  // (building textures, a busy machine, a moment off screen) never skips more than a
  // tenth of a second of the shot
  if (firstTick) { firstTick = false; if (!skipIntro) t0 = performance.now(); }
  else if (lastTs && now() < T_SET + 0.6) { const gap = ts - lastTs; if (gap > 100) t0 += gap - 100; }
  lastTs = ts;
  const t = now();
  // build the playing card in slices; later the other tapes
  const done = stepCard(cardFor(st8.tape), t < 5.6 ? 9 : 6);
  if (done) { resolveReady(); if (t > 7) buildOthers(); }
  tuneIfReady(t);
  if (readyToSettle(t)) { settle('settled'); return; }
  // the intro and tape switches at full rate; the hold at film rate
  const busy = t < T_SET + 0.6 || (st8.switchAt !== null && t - st8.switchAt < 0.8);
  if (busy || ts - lastFrame > 1000 / HOLD_FPS - 4) { render(t, false); lastFrame = ts; }
  lockedUI(t);
  raf = requestAnimationFrame(tick);
}
let booted = false;
function kick() { if (booted && !raf && !frozen() && onScreen && fixedT === null) raf = requestAnimationFrame(tick); }
function freezeClock() { if (!frozenAt) frozenAt = performance.now(); cancelAnimationFrame(raf); raf = 0; lastTs = 0; }
function thawClock() { if (frozenAt) { t0 += performance.now() - frozenAt; frozenAt = 0; } }
/* stop the camera: the last frame stays, with the viewfinder showing PAUSE */
function settle(reason) {
  paused = reason;
  freezeClock();
  const t = (frozenAt - t0) / 1000;
  const c = cardFor(st8.tape);
  if (st8.tunedAt === null && c) { buildCardNow(c); st8.tunedAt = Math.min(5.15, t); }
  render(t, false, true);
  lockedUI(t);
  motionUI();
}
function play() {
  if (paused === null) return;
  const wasUser = paused === 'user';
  paused = null;
  thawClock();
  if (now() < T_SET) { /* resume the intro where it stopped */ }
  playFrom = now();
  motionUI();
  if (wasUser) document.dispatchEvent(new CustomEvent('pr:motion', { detail: { paused: false } }));
  kick();
}
function setPaused(p) {
  if (p && paused === null) { settle('user'); document.dispatchEvent(new CustomEvent('pr:motion', { detail: { paused: true } })); }
  else if (!p && paused !== null) play();
}
function drawStillAt(t) {
  buildCardNow(cardFor(st8.tape));
  if (st8.tunedAt === null) st8.tunedAt = t - (TAPES[st8.tape].reveal + 1.2);
  render(t, true, true);
  lockedUI(t);
  resolveReady();
  window.__openingReady = true;
}
function start() {
  cancelAnimationFrame(raf); raf = 0;
  if (fixedT !== null && !isNaN(fixedT)) {
    const c = cardFor(st8.tape);
    if (fixedT >= 5.15) { buildCardNow(c); st8.tunedAt = qs.has('tuned') ? fixedT - parseFloat(qs.get('tuned')) : 5.15; }
    render(fixedT, false, qs.has('standby')); lockedUI(fixedT);
    resolveReady(); window.__openingReady = true;
    // review hook for recordings: draw any moment of the shot without reloading
    window.__renderAt = tt => {
      if (tt >= 5.15) { buildCardNow(cardFor(st8.tape)); if (st8.tunedAt === null) st8.tunedAt = 5.15; }
      render(tt, false); lockedUI(tt);
    };
    return;
  }
  if (reduce.matches) {
    // reduced motion: the held shot, composed, as a still
    paused = 'reduced'; frozenAt = performance.now(); t0 = frozenAt - 7.2 * 1000;
    st8.tunedAt = null; drawStillAt(7.2); motionUI();
    return;
  }
  if (paused !== null) {
    const t = (frozenAt - t0) / 1000;
    if (t >= 5.15) { buildCardNow(cardFor(st8.tape)); if (st8.tunedAt === null) st8.tunedAt = t - (TAPES[st8.tape].reveal + 1.2); }
    render(t, false, true);
    return;
  }
  kick();
}

/* page controls: skip / replay, pause / play, the tape buttons */
ctl.skip?.addEventListener('click', () => {
  const t = paused !== null ? (frozenAt - t0) / 1000 : now();
  if (paused !== null) { paused = null; frozenAt = 0; motionUI(); document.dispatchEvent(new CustomEvent('pr:motion', { detail: { paused: false } })); }
  if (t < T_SET) t0 = performance.now() - (T_SET + 0.2) * 1000;
  else { t0 = performance.now(); st8.tunedAt = null; st8.switchAt = null; }
  playFrom = now();
  kick();
});
ctl.motion?.addEventListener('click', () => setPaused(paused === null));
function showTapeCopy(n) {
  for (const b of ctl.tapes) b.setAttribute('aria-pressed', String(b.dataset.tape === n));
  for (const el of ctl.copies) el.hidden = el.dataset.tapeCopy !== n;
}
function switchTape(n) {
  if (n === st8.tape || !TAPES[n]) return;
  st8.prevTape = st8.tape; st8.tape = n;
  st8.tunedAt = null;
  const c = cardFor(n);
  showTapeCopy(n);
  section.dispatchEvent(new CustomEvent('tapechange', { detail: { tape: n } }));
  if (fixedT !== null) { buildCardNow(c); st8.switchAt = null; st8.tunedAt = fixedT - (TAPES[n].reveal + 1.2); render(Math.max(fixedT, 7.2), true); return; }
  if (paused === 'settled') { paused = null; thawClock(); motionUI(); }
  if (paused !== null) {
    // paused by the visitor, or reduced motion: tune the still straight to the other film
    const t = Math.max(7.2, (frozenAt - t0) / 1000);
    buildCardNow(c); st8.switchAt = null; st8.tunedAt = t - (TAPES[n].reveal + 1.2);
    render(t, true, true);
    return;
  }
  if (now() < T_SET) t0 = performance.now() - (T_SET + 0.2) * 1000;
  st8.switchAt = now();
  playFrom = now();
  stepCard(c, 0);
  kick();
}
for (const b of ctl.tapes) b.addEventListener('click', () => switchTape(b.dataset.tape));

// only animate while the opening is on screen, the tab is visible and no film is playing
new IntersectionObserver(es => { for (const e of es) onScreen = e.isIntersecting; kick(); }).observe(section);
document.addEventListener('visibilitychange', () => {
  if (fixedT !== null || paused !== null) return;
  if (document.hidden) freezeClock(); else { thawClock(); kick(); }
});
document.addEventListener('pr:screening', e => {
  screening = Boolean(e.detail && e.detail.open);
  if (fixedT !== null || paused !== null) return;
  if (screening) freezeClock(); else { thawClock(); kick(); }
});
reduce.addEventListener?.('change', () => { if (!reduce.matches && paused === 'reduced') { paused = null; frozenAt = 0; t0 = performance.now() - 7.2 * 1000; playFrom = now(); motionUI(); } start(); });
let rt = 0;
addEventListener('resize', () => {
  clearTimeout(rt);
  rt = setTimeout(() => {
    // phones resize the window as the address bar slides; the opening itself doesn't change
    const r = section.getBoundingClientRect();
    if (!booted || (Math.abs(r.width - laidOut[0]) < 1 && Math.abs(r.height - laidOut[1]) < 1)) return;
    layout(); start();
  }, 160);
});

async function boot() {
  try { await Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 1500))]); } catch (e) { /* fall back */ }
  for (const el of [ctl.skip, ctl.motion, section.querySelector('.opening-tapes')]) if (el) el.hidden = false;
  showTapeCopy(st8.tape);
  layout();
  booted = true;
  // the shot's clock starts now, when it can first be drawn (not when the script loaded,
  // which can be over a second earlier while fonts arrive), and it waits if the page
  // opened in a background tab, so nobody misses the intro
  t0 = performance.now() - (skipIntro ? (T_SET + 0.2) * 1000 : 0);
  if (document.hidden && fixedT === null) freezeClock();
  start();
}
boot();
window.OPENING = { switchTape, setPaused, state: () => ({ tape: st8.tape, paused, renders, onScreen, t: paused !== null ? (frozenAt - t0) / 1000 : now() }) };
