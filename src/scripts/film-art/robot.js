/* ═══════════════════════════════════════════════════════════════════════════
   robot.js — the cast, defined once.
   The robot's skeleton is copied unchanged from ../paper-robot-materials, so it
   is literally the same robot in every process. Film 01 adds six arms that come
   out of the screen; film 02's one-eyed agent has its own small skeleton.
   Units: robot units, feet at y = 0, head top ≈ −1.07, x centred.
   ═══════════════════════════════════════════════════════════════════════════ */
'use strict';
const DEPTH = [0.27, -0.21];            // screen offset per unit of depth (oblique)
function box(id, x, y, w, h, d, extra = {}) {
  const dx = DEPTH[0] * d, dy = DEPTH[1] * d;
  return Object.assign({
    id, kind: 'box', x, y, w, h, d,
    front: [[x, y], [x + w, y], [x + w, y + h], [x, y + h]],
    top: [[x, y], [x + dx, y + dy], [x + w + dx, y + dy], [x + w, y]],
    side: [[x + w, y], [x + w + dx, y + dy], [x + w + dx, y + h + dy], [x + w, y + h]],
  }, extra);
}
const FACE_TONE = { top: 0.12, front: 0.42, side: 0.78 };   // 0 = lit, 1 = dark
const PIVOT = [-0.005, -0.565];                               // neck top: the head tilts here

const SKELETON = (() => {
  const parts = [
    box('plinth', -0.40, 0.03, 0.74, 0.12, 0.34, { group: 'ground' }),
    box('footL', -0.168, -0.055, 0.128, 0.055, 0.16, { group: 'body' }),
    box('legL', -0.150, -0.240, 0.094, 0.190, 0.10, { group: 'body' }),
    box('footR', 0.004, -0.055, 0.128, 0.055, 0.16, { group: 'body' }),
    box('legR', 0.020, -0.240, 0.094, 0.190, 0.10, { group: 'body' }),
    box('armL', -0.262, -0.498, 0.082, 0.200, 0.10, { group: 'body' }),
    box('handL', -0.268, -0.312, 0.094, 0.072, 0.11, { group: 'body' }),
    box('torso', -0.190, -0.510, 0.360, 0.290, 0.22, { group: 'body' }),
    box('armR', 0.188, -0.505, 0.082, 0.200, 0.10, { group: 'body' }),
    box('handR', 0.182, -0.318, 0.094, 0.072, 0.11, { group: 'body' }),
    box('neck', -0.062, -0.590, 0.112, 0.080, 0.12, { group: 'body' }),
    box('head', -0.300, -0.985, 0.550, 0.420, 0.42, { group: 'head' }),
  ];
  const head = parts[parts.length - 1];
  const hingeA = [0.150, -0.985], hingeB = [0.296, -0.835], tip = [0.318, -1.050];
  const fold = { hingeA, hingeB, tip, flap: [hingeA, tip, hingeB] };
  const eyes = [{ cx: -0.142, cy: -0.748, r: 0.068 }, { cx: 0.030, cy: -0.748, r: 0.068 }];
  const ear = { cx: 0.312, cy: -0.752, rx: 0.044, ry: 0.070, rim: 0.016 };
  const sun = { cx: -0.035, cy: -0.735, r: 0.56 };
  return { parts, head, fold, eyes, ear, sun, horizon: 0.15 };
})();
const partById = id => SKELETON.parts.find(p => p.id === id);

// ── shared idle: blink, glance, tilt. Periodic in `loop` so loops are seamless.
function robotIdle(t, loop, o = {}) {
  const { blinks = [loop * 0.31, loop * 0.79], looks = [[0.3, 0.1], [-0.25, 0.05], [0.1, 0.3]], tiltDeg = 1.6 } = o;
  t = ((t % loop) + loop) % loop;
  const tilt = (tiltDeg * wave(t, loop, 1, 0.5) + tiltDeg * 0.4 * wave(t, loop, 2, 2.1)) * Math.PI / 180;
  let blink = 0;
  for (const b of blinks) { const d = t - b; if (d > -0.09 && d < 0.13) blink = Math.max(blink, d < 0 ? 1 - Math.abs(d) / 0.09 : 1 - d / 0.13); }
  const seg = loop / looks.length, i = Math.floor(t / seg) % looks.length, tb = t - i * seg;
  const prev = looks[(i + looks.length - 1) % looks.length], cur = looks[i], k = smooth(0.0, 0.18, tb);
  const look = [lerp(prev[0], cur[0], k), lerp(prev[1], cur[1], k)];
  return { tilt, blink: clamp(blink * 1.25), look };
}

// ── Film 01: the robot in a screen with six arms reaching out of it.
// The screen frames the head; arms leave through the bezel into the world.
const MONITOR = {
  screen: { x0: -0.48, y0: -1.14, x1: 0.47, y1: -0.33 },
  bezel: 0.105,
  stand: { neck: [-0.075, -0.225, 0.15, 0.10], base: [-0.30, -0.125, 0.60, 0.07, 0.22] },
};
// each arm: start on the screen edge, upper-arm angle, elbow bend, lengths, gesture
const ARMS = [
  { side: -1, s: [-0.44, -0.98], a1: -2.55, bend: 0.55, l1: 0.32, l2: 0.28, hand: 'open', ph: 0.0 },
  { side: -1, s: [-0.44, -0.74], a1: -3.05, bend: -0.25, l1: 0.33, l2: 0.28, hand: 'point', ph: 1.7 },
  { side: -1, s: [-0.44, -0.50], a1: 2.62, bend: -0.5, l1: 0.32, l2: 0.28, hand: 'open', ph: 3.1 },
  { side: 1, s: [0.43, -0.98], a1: -0.62, bend: -0.55, l1: 0.32, l2: 0.28, hand: 'open', ph: 0.9 },
  { side: 1, s: [0.43, -0.74], a1: -0.08, bend: 0.3, l1: 0.33, l2: 0.28, hand: 'pinch', ph: 2.4 },
  { side: 1, s: [0.43, -0.50], a1: 0.52, bend: 0.5, l1: 0.32, l2: 0.28, hand: 'open', ph: 4.2 },
];
// pose an arm at time t (radians in screen space, y down). Returns centreline
// polyline, wrist point/direction, cuff position, hand transform.
function poseArm(arm, t, loop, amt = 1, extend = 1) {
  const g = amt * (0.16 * wave(t, loop, 1, arm.ph) + 0.06 * wave(t, loop, 2, arm.ph * 1.7));
  const a1 = arm.a1 + g, a2 = a1 + arm.bend + amt * 0.22 * wave(t, loop, 1, arm.ph + 1.2);
  const l1 = arm.l1 * extend, l2 = arm.l2 * extend;
  const s = arm.s, e = [s[0] + Math.cos(a1) * l1, s[1] + Math.sin(a1) * l1];
  const w = [e[0] + Math.cos(a2) * l2, e[1] + Math.sin(a2) * l2];
  // the tube bends smoothly through the elbow: quadratic with the elbow as control
  const c = [e[0] + (e[0] - (s[0] + w[0]) / 2) * 0.35, e[1] + (e[1] - (s[1] + w[1]) / 2) * 0.35];
  const pl = quadPts(s, c, w, 30);
  const dir = Math.atan2(w[1] - pl[pl.length - 3][1], w[0] - pl[pl.length - 3][0]);
  return { pl, wrist: w, dir, a1, a2 };
}
// hand outline parts in hand space: x along the arm, y across; size ≈ 0.12
// returns { palm, fingers: [capsule polylines with widths], thumb }
function handShape(kind, side, flex = 0) {
  const m = side < 0 ? -1 : 1;            // mirror so thumbs face upward on both sides
  const palm = roundRectPts(-0.005, -0.047, 0.085, 0.094, 0.026, 4);
  const F = [];
  const finger = (y, ang, len, w = 0.024) => { const x0 = 0.07, y0 = y; F.push({ pl: [[x0, y0], [x0 + Math.cos(ang) * len, y0 + Math.sin(ang) * len]], w }); };
  if (kind === 'open') {
    finger(-0.034 * m, -0.38 * m - flex * 0.1 * m, 0.064); finger(-0.012 * m, -0.12 * m, 0.074); finger(0.012 * m, 0.1 * m, 0.07); finger(0.033 * m, 0.34 * m + flex * 0.1 * m, 0.056, 0.022);
  } else if (kind === 'point') {
    finger(-0.03 * m, -0.05 * m, 0.088); finger(-0.004 * m, 0.5 * m, 0.028); finger(0.018 * m, 0.7 * m, 0.026); finger(0.036 * m, 0.9 * m, 0.022, 0.021);
  } else if (kind === 'pinch') {
    finger(-0.03 * m, -0.25 * m, 0.07); finger(-0.008 * m, 0.25 * m, 0.05); finger(0.016 * m, 0.55 * m, 0.03); finger(0.034 * m, 0.8 * m, 0.024, 0.021);
  }
  const thumb = { pl: [[0.03, -0.044 * m], [0.03 + Math.cos(-1.1 * m) * 0.055, -0.044 * m + Math.sin(-1.1 * m) * 0.055]], w: 0.027 };
  return { palm, fingers: F, thumb };
}
function capsulePts(a, b, w, n = 8) {
  const dx = b[0] - a[0], dy = b[1] - a[1], ang = Math.atan2(dy, dx), r = w / 2, out = [];
  for (let i = 0; i <= n; i++) { const t = ang - Math.PI / 2 + i / n * Math.PI; out.push([b[0] + Math.cos(t) * r, b[1] + Math.sin(t) * r]); }
  for (let i = 0; i <= n; i++) { const t = ang + Math.PI / 2 + i / n * Math.PI; out.push([a[0] + Math.cos(t) * r, a[1] + Math.sin(t) * r]); }
  return out;
}

// ── Film 02: the one-eyed agent (olive, pear-shaped, one large eye).
// Agent units: feet at y = 0, top of head at y = −1.
const AGENT = {
  body(lean = 0) {
    const pts = [];
    for (let i = 0; i < 64; i++) {
      const a = i / 64 * TAU, s = Math.sin(a), c = Math.cos(a);
      // pear: narrow head, full belly, flat bottom
      const yN = -0.5 + -c * 0.5;                     // −1 (top) … 0 (bottom)
      const widen = 0.27 + 0.11 * smooth(-0.95, -0.35, yN) - 0.05 * smooth(-0.25, 0, yN);
      pts.push([s * widen + lean * (yN + 0.1) * -0.12, Math.min(-0.02, yN)]);
    }
    return pts;
  },
  eye: { cx: 0.0, cy: -0.66, r: 0.17 },
  feet: [[-0.13, -0.01, 0.1, 0.04], [0.12, -0.01, 0.1, 0.04]],
  shoulderL: [-0.3, -0.42], shoulderR: [0.3, -0.42],
};
