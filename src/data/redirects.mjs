// Pages folded into others (October 3, 2026). vercel.json redirects each old URL (one
// entry with and one without the trailing slash); the build writes a small stub at the
// old URL for the GitHub Pages fallback and local previews. npm run check keeps the two
// in step. /essays/ is temporary: a real index returns once there are several essays.
export const removed = [
  { from: '/essays/', to: '/#reading', label: 'The reading room', permanent: false },
  { from: '/follow/', to: '/about/#follow', label: 'Follow Paper Robots', permanent: true },
];
