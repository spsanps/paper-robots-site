# The rest of Paper Robots, thought through (October 3, 2026)

San, on the live site: "clear work to be done upping or pruning the rest of Paper Robots
studio pages to same level of quality", then: "or just relinking these appropriately — what
I mean is the style/old rest of the page thing has to be thought through."

Branch `subpages`, from `main` at `ccd1822` (the live evidence-loop homepage). Not merged or
deployed.

## The plan: what each page is for

Paper Robots is the film identity and a small publication: two films, one essay, one author.
A visitor needs to watch a film, read the essay behind it, learn who makes this, and follow.
The homepage already does most of that. Every other page has to earn its place.

| Page | Decision | Why |
| --- | --- | --- |
| `/` | **Keep** (approved). Link fixes only: the nav, the Follow links, an `id="reading"` on the reading room | It is the front door and already holds the films, the reading room, About and Follow |
| `/films/` | **Keep, upgrade** | The index every film page points back to ("All films"). It grows with each film and is lighter than the homepage (no intro). Plain heading in place of the decorative italic one |
| `/films/robotics-revolution/`, `/films/capricious-god/` | **Keep, polish** | Already built at the homepage's level. Align the notes headings and the essay button, use the shared page width |
| `/essays/` | **Fold into the homepage's reading room**: `/essays/` → `/#reading` (307, temporary) | One essay under a giant headline is not an index. The homepage's reading room lists the same essay. Temporary, because a real index should come back once there are several essays |
| `/follow/` | **Fold into About**: `/follow/` → `/about/#follow` (308, permanent) | One paragraph that repeated the homepage's Follow block and the footer |
| `/about/` | **Keep, upgrade** | The only page that says who makes this and why. It gains the Follow section. The generated workshop painting gives way to the paper robot drawn in code |
| `/essays/gpt7-will-have-arms/` | **Keep for now; chrome only** (San decided the essay stays as it is) | The duplicate question is San's call; see below |
| 404 | **Keep, plain** | Needed. Its "Browse the essays" link pointed at the page being removed |

Navigation becomes **Films · Essays · About** (Essays goes to the homepage's reading room;
Follow lives on About, on the homepage and in every footer).

### The essay duplicate: recommendation for San

The full GPT-7 essay exists twice: the rich interactive edition on sankala.me
(https://www.sankala.me/essays/gpt7-will-have-arms, the canonical home) and a plain reading
copy here. The copy already points search engines at sankala.me (cross-domain canonical, left
out of the sitemap), so it does no SEO harm.

- **For keeping it:** it is fast and readable without JavaScript (sankala.me is an app that
  shows humans an empty page without it); it is what the Substack reading edition is built
  from; readers coming from the film stay in the film's world.
- **For relinking:** one home per piece; the sankala.me edition has the interactive figures;
  no sync step (`npm run sync:essay`) to keep two copies identical.

**Recommendation:** keep it until the Substack publication exists, then decide between
(a) keeping this as the publication's reading edition, or (b) a 308 from
`/essays/gpt7-will-have-arms/` to the sankala.me edition, with the film page and the reading
room linking straight there. Not implemented: it is not clear-cut, so it is left to San.

## What each page shows now

- **Navigation** on every page: Films · Essays · About (Essays goes to the homepage's reading
  room). The mobile `<details>` menu, hidden on every screen size, is gone. The wordmark's
  full stop now sits against the word (it was floating 5 px away, homepage included).
- **`/films/`**: eyebrow, the plain heading "The films", San's existing line, then each film
  as a tape with its code-drawn poster (the homepage's own rows).
- **`/about/`**: eyebrow and "A way of thinking out loud." beside the paper robot as a pencil
  construction drawing, drawn in code by the film-art kit (`skeleton`, a new `plate` framing:
  larger robot, heavier pencil; its head tilts on the pivot for 8 s, then settles). Then four
  quiet rows, heading left and copy right: What happens next? · Made by San Kala. (with his
  portrait) · The films so far. (with the same robot in each film's hand: film 01's linocut,
  film 02's tempera and gold, each linking to its film) · Follow (`#follow`: YouTube, RSS,
  write to me). The robot-and-mechanic painting is no longer used. Without JavaScript the
  drawings step aside and every word stays.
- **Film pages**: unchanged in substance. Shared page width (1200 px, the homepage's), the
  notes' headings without forced line breaks, the essay button as the homepage's ink pill,
  film 01's notes aligned with its title instead of centred.
- **`/essays/gpt7-will-have-arms/`**: the text, figures and images are untouched (the build
  still checks the article survives byte for byte). Around them: the title block now sits in
  the reading column (back link to the reading room, eyebrow, plain "GPT-7 Will Have Arms"
  in place of "GPT-7 Will / *Have Arms.*", deck, byline, other editions, the edition note),
  contents on the left (sticky), headings in the site's serif weight, and the page ends on
  the film it became (film 01's tape row and linocut poster) instead of a Follow button.
- **404**: plain "Something went astray." with All the films / Back home.
- **CSS**: `publication.css` and `studio.css` (about 2,000 lines, mostly the sankala.me
  prototype and the September painted cinema) are replaced by a compact `site.css` (base
  and shared parts) and `reading.css` (the essay and the film notes' prose). The homepage's
  computed styles were diffed before and after: only the nav, the dropped Follow link and
  the wordmark's full stop changed.

## New copy (everything else is San's existing words)

- About, under the drawing: "The paper robot, defined once in code. Each film draws it in
  its own hand."
- About, under each robot: "Tape 01 · a three-block reduction linocut", "Tape 02 · egg
  tempera and gold leaf" (built from each film's data).
- `/films/` heading: "The films" (the homepage's section heading; replaces "AI, through
  *another lens.*").
- Essay page: back link "← The reading room"; the closing section's eyebrow "The film".
- 404: "Try the films, or return to the beginning." (was "Try the reading room…"); button
  "All the films" (the homepage's existing link text).
- Redirect stubs (seen only on the GitHub Pages fallback): "This page has moved: …".

Removed copy: the Follow page's "Stay curious / Keep a *thread open.* / Essays to read, films
to watch, and the next idea when it's ready." and its aside "Prefer to read? / The writing
behind the films. / The essays have the space for sources and arguments…"; the essays index's
"Follow *an idea.*" headline (the homepage keeps "Follow an idea." as plain text).

## Checks

- `npm run build`, `npm run check` (also with `SITE_BASE_PATH`), `npm run check:browser`: all pass.
- `check` now also verifies each folded page: the `vercel.json` redirect (with and without the
  trailing slash), the fallback stub, its absence from the sitemap, RSS and llms.txt, the
  destination anchor, and that no page links to it. On every page: the three-item nav, no
  `<em>`/`<i>`/`<br>` in h1/h2, no `/assets/illustrations/`. About: Follow, the code-drawn
  robot and one robot per film. The essay ends on its film without linking to itself.
- `check:browser` covers all six pages and the 404 at 1920, 1440, 1280, 768, 390, 360 and 320
  (no console errors, no horizontal scroll, images, anchors, nav), plus: About's drawings
  render, the essay's film poster renders, `/essays/` lands on the reading room and `/follow/`
  on About's Follow (also without JavaScript), and everything the homepage check did before.
  Results: `browser-checks.json`.
- The production redirects could not be exercised locally (Vercel should send each
  destination, `#fragment` included, as the Location header unchanged). Once deployed, open
  `https://www.paperrobots.studio/follow/` and `/essays/` to confirm they land on the anchors.
- `public/assets/illustrations/robot-workshop.webp` (the old About painting) and the old
  essays-card image stay in `public/` so their URLs keep working; no page uses them.

## Review images

Before is the live site (main `ccd1822`, built locally); after is this branch. Canvases are
frozen with `?t=`. Each JPEG is before | after.

| File | Shows |
| --- | --- |
| `01-home-*.jpg` | Homepage: only the nav, the Follow links and the wordmark's full stop |
| `02-films-*.jpg` | `/films/` |
| `03-about-*.jpg` | `/about/` |
| `04-essays-folded-*.jpg` | The old essays index, and the homepage's reading room it now redirects to |
| `05-follow-folded-*.jpg` | The old Follow page, and About's Follow section it now redirects to |
| `06-film-robotics-revolution-*.jpg`, `07-film-capricious-god-*.jpg` | The film pages |
| `08-essay-top-*.jpg`, `09-essay-end-*.jpg` | The essay page's opening and its end |
| `10-404-*.jpg` | The 404 |

`*-desktop-1440.jpg` at half scale, `*-phone-390.jpg` at full scale.

## Open questions for San

- **The essay duplicate** (above): keep the reading copy here, or relink to sankala.me once
  Substack exists.
- **Nav "Essays" with one essay**: it goes to the homepage's reading room. When a second
  essay exists, bring back `/essays/` as a real index (remove its redirect, which is temporary
  for that reason).
- **About's drawing** is the kit's pencil construction of the robot, the one look the site
  had not used yet. If it reads too technical, the robot could instead be drawn in the
  homepage opening's camcorder style.
- Not visitor validated.
