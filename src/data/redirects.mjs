// Pages folded into others (October 3, 2026). vercel.json redirects each old URL (one
// entry with and one without the trailing slash, except for files); the build writes a small stub at the
// old URL for the GitHub Pages fallback and local previews. npm run check keeps the two
// in step. /essays/ is temporary: a real index returns once there are several essays.
// `to` may be an external URL (the essay below): the stub then points there, with a
// canonical to the destination. `stub: false` skips the fallback file (for a download).
export const gpt7Essay = 'https://www.sankala.me/notes/gpt7-will-have-arms';
export const isExternal = to => /^https?:\/\//.test(to);
export const removed = [
  { from: '/essays/', to: '/#reading', label: 'The reading room', permanent: false },
  { from: '/follow/', to: '/about/#follow', label: 'Follow Paper Robots', permanent: true },
  // San's decision, October 3, 2026: the essay's canonical copy is on sankala.me.
  { from: '/essays/gpt7-will-have-arms/', to: gpt7Essay, label: 'GPT-7 Will Have Arms', permanent: true },
  { from: '/essays/gpt7-will-have-arms/manuscript.md', to: gpt7Essay, label: 'GPT-7 Will Have Arms', permanent: true, stub: false },
];
