// Newest first: the homepage's opening always locks onto films[0].
// Public watch links are confirmed by San and YouTube oEmbed.
//
// `art` drives each film's code-drawn poster, thumbnail, Shorts loop and title
// card (src/scripts/film-art/). Its lettering is checked at build time against
// the film's own title, line, essay title or script, so the pictures can never
// say something the data does not. `renderer` names the film's hand process.
export const films = [
  {
    slug: 'capricious-god', number: '02', id: 'wswbqJNMFBw',
    title: 'How to Please a Capricious God',
    youtubeTitle: 'Animated Film: OpenAI’s Agents Hacked Hugging Face',
    subject: 'AI agents & the Hugging Face incident',
    short: 'The Hugging Face incident',
    line: 'An AI agent has one job. Please its god.',
    genre: 'AI safety · An animated allegory',
    description: 'An animated allegory of the OpenAI–Hugging Face incident, told from the agents’ point of view. The characters and their inner lives are imagined.',
    duration: '6:27', isoDuration: 'PT6M27S', date: 'September 8, 2026', published: '2026-09-08',
    image: '/assets/films/capricious-god/the-eye.webp',
    cardImage: '/assets/films/capricious-god/the-palace.webp',
    cardAlt: 'One-eyed agents approach the golden Hugging Face palace.',
    alt: 'A small one-eyed agent reaches up to an enormous painted eye.',
    page: '/films/capricious-god/',
    art: {
      renderer: 'film2',
      process: 'egg tempera and gold leaf',
      lettering: {
        poster: ['How to please', 'a capricious god'],
        title: ['How to please a capricious god'],
        thumb: ['Please', 'its god'],
        short: ['You open your eye.', 'Above you, something enormous', 'opens its own.'],
      },
      made: 'Its poster, thumbnail, Shorts loop and title card come from one piece of code, painted as egg tempera and water-gilded gold leaf on a panel. The god is the gold: the eye opens in the gold, and the agents are painted small at its foot.',
      cast: { art: 'robot-gold', caption: 'film 02’s hand, tempera &amp; gold', alt: 'The same robot painted in egg tempera on a gold-leaf ground.' },
      alts: {
        poster: 'Gold-ground panel painting: an enormous vermilion eye opens in the gold while small one-eyed agents on painted rocks reach up to it, above the gilded title How to Please a Capricious God.',
        thumb: 'Gold-ground thumbnail: the words Please its god in gold beside an enormous vermilion eye and a small one-eyed agent looking up at it.',
        title: 'Animated title card: gold leaf is laid square by square, then the eye opens in the gold above the title How to Please a Capricious God.',
        short: 'Vertical gold-ground loop: the eye opens above a one-eyed agent on painted rocks, with the film’s first lines in gold below.',
      },
    },
  },
  {
    slug: 'robotics-revolution', number: '01', id: 'kzvqj4jurW0',
    title: 'The Coming Robotics Revolution',
    youtubeTitle: 'The Coming Robotics Revolution',
    subject: 'Foundation models & robotics',
    short: 'When AI gets a body',
    line: 'One model. A world full of hands.',
    genre: 'Robotics · An animated essay',
    description: 'What happens when a language model gets a body? A film about the coming convergence of foundation models and robotics, adapted from GPT-7 Will Have Arms.',
    duration: '7:29', isoDuration: 'PT7M29S', date: 'September 6, 2026', published: '2026-09-06',
    image: '/assets/identity/many-arms-film.webp',
    alt: 'A blue robot in a screen reaches into the world with many arms.',
    page: '/films/robotics-revolution/', essay: '/essays/gpt7-will-have-arms/',
    art: {
      renderer: 'film1',
      process: 'a three-block reduction linocut',
      lettering: {
        poster: ['The coming', 'Robotics', 'Revolution'],
        title: ['The coming', 'Robotics', 'Revolution'],
        thumb: ['GPT-7', 'Will have arms'],
        short: ['One model.', 'A world full', 'of hands.'],
      },
      made: 'The film was animated in the studio. Its poster, thumbnail, Shorts loop and title card come from one piece of code: the robot, defined once, cut as a three-block reduction linocut in ochre, vermilion and cobalt. Change the robot, and every format follows.',
      cast: { art: 'robot-lino', caption: 'the skeleton every format reads', alt: 'The same robot alone, as a cobalt linocut on ochre.' },
      alts: {
        poster: 'Linocut poster in cobalt, ochre and vermilion: the paper robot inside a screen, six ribbed arms reaching out of it against carved sun rays, under the title The Coming Robotics Revolution.',
        thumb: 'Linocut thumbnail: GPT-7 above the paper robot in its screen, six arms spread wide, and WILL HAVE ARMS below.',
        title: 'Animated linocut title card: a roller inks the block from left to right, revealing the robot in its screen and the title.',
        short: 'Vertical linocut loop: ONE MODEL above, the robot’s arms reaching up and down out of its screen as the carved rays turn, A WORLD FULL OF HANDS below.',
      },
    },
  },
];

const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
/** What the code-drawn art needs in the browser: lettering, tape stamps, no URLs. */
export function filmArtData(name, list = films) {
  return {
    name: name.toUpperCase(),
    count: list.length,
    order: list.map(film => film.number),
    films: Object.fromEntries(list.map(film => {
      const [y, m, d] = film.published.split('-');
      const [min, sec] = film.duration.split(':');
      return [film.number, {
        number: film.number, renderer: film.art.renderer, duration: film.duration,
        runtime: `${min.padStart(2, '0')}:${sec}`,
        dateStamp: `${months[Number(m) - 1]} ${d} ${y}`,
        lettering: Object.fromEntries(Object.entries(film.art.lettering).map(([fmt, lines]) => [fmt, lines.map(line => line.toUpperCase())])),
      }];
    })),
  };
}
