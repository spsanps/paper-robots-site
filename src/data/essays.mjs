// The reading room: a section of the homepage (/#reading; /essays/ redirects there
// until there are several essays). Newest first. The essay page itself is built from
// content/essays/<slug>/ and its source.json.
export const readingRoom = {
  eyebrow: 'The reading room',
  title: 'Follow an idea.',
  lede: 'Arguments, imagined futures, and the sources behind them.',
};

export const essays = [
  {
    slug: 'gpt7-will-have-arms', number: '01',
    title: 'GPT-7 Will Have Arms',
    subject: 'AI & robotics · Essay + film',
    summary: 'A forecast about foundation models and robotics: one model, many bodies, and the changes that might follow.',
    context: 'The full argument behind the first film, with original figures and sources.',
    dates: 'Essay: December 2025 · Film: September 2026',
    page: '/essays/gpt7-will-have-arms/',
    film: '/films/robotics-revolution/',
  },
];
