# Paper Robots

Web Analytics setup and verification: [Vercel Web Analytics](docs/launch/2026-09-web-analytics.md).

September 8 launch update: San imported the project into Vercel and connected
GoDaddy DNS. The production origin is https://www.paperrobots.studio/; the apex
redirects there. A @ is 216.198.79.1 and CNAME www is
 d2a0066b926ad6c7.vercel-dns-017.com. Both backend addresses pass HTTPS checks.
Local DNS caches may still reach the former GoDaddy parking page. No further DNS
edits are indicated. https://paper-robots-site.vercel.app/ is a working fallback.
Cloudflare proxy/cache is not configured. GitHub Pages has no custom domain.

October 3 homepage: the evidence opening (approved by San; see
[the review](design/reviews/2026-10-03-evidence-opening-live/README.md) and
[How the homepage works](#how-the-homepage-works)). The pages around it were then
thought through and pruned on branch `subpages`: see
[The pages around the homepage](#the-pages-around-the-homepage) and
[that review](design/reviews/2026-10-03-subpages/README.md). Both films are on it, including
https://youtu.be/wswbqJNMFBw. Film details, chapters, script and sources are at
/films/capricious-god/. See docs/content/2026-09-capricious-god.md.
Substack remains paused; no revenue features or account settings were changed.
This is an ambitious design revision, not an award claim or visitor validation.

Earlier setup notes (superseded where they describe pending import or DNS):

Illustrated essays and animated films by San Kala. Intended home:
**https://paperrobots.studio**. This is the public website repository; film
production lives separately and remains private.

Windows: `C:\Users\sanps\Desktop\Projects\paper-robots\site`
WSL: `/home/san/Projects/paper-robots/site`

## Start here

```bash
npm ci
npm run dev
```

Open http://127.0.0.1:4174. The production build is static HTML, CSS, local
fonts, and JavaScript for the code-drawn art (the homepage opening, posters and
film-page formats), the screening room and the film player. Every page, the
newest film's details and the complete essay are readable without JavaScript.
YouTube loads only after someone presses play.

## Where things belong

| Folder | Purpose |
| --- | --- |
| `src/data/` | Films (newest first, with each film's `art` block), essays, and the redirects for folded pages: every page is generated from these |
| `src/pages/` | Editable homepage and About page (the homepage's About block is read from the About page) |
| `src/templates/` | Shared header, footer, metadata, follow links, redirect stubs, film rows and formats |
| `src/styles/` | `site.css` (base, header, footer, shared page parts, About), `reading.css` (the essay and film notes' prose), `films.css` (tapes, film pages), `home.css` (the opening) |
| `src/scripts/` | Browser interactions: `site.js` (film player, chapters), `screening.js` (the homepage's in-place player) |
| `src/scripts/opening/` | The homepage's evidence-loop opening: the drawing kit and the shot; built into `dist/scripts/opening.js` |
| `src/scripts/film-art/` | Each film's hand process (linocut, tempera), the shared kit and the canvas scheduler; built into `dist/scripts/film-art.js` |
| `content/essays/<slug>/` | Complete article, manuscript, source dates and checksums |
| `public/assets/` | Identity, illustrations, and essay figures served by the site |
| `public/fonts/` | Local fonts with licenses and provenance |
| `publishing/substack/` | Ready-to-use reading edition, original figures, profile assets, instructions |
| `design/illustrations/` | Source cover and its generation prompt |
| `design/social-cards/` | Editable HTML source for the link preview |
| `design/reviews/` | Browser checks and desktop/mobile captures |
| `scripts/` | Build, local server, checks, and manuscript sync |
| `docs/launch/` | Domain/hosting setup and release state |

`site.config.mjs` holds the public links. Set `substack` to the verified
publication origin when San finishes creating it. The follow buttons then use
the publication’s subscribe page. There is no collecting form or payment setup.

## Publish and update

**September 8 update:** Vercel is now the recommended primary host, matching
sankala.me. The repository includes `vercel.json`; import it into San's existing
Vercel account using [this walkthrough](docs/launch/2026-09-vercel-setup.md).
The Vercel import and domain connection remain pending. The GitHub Pages setup
below remains available while the switch is completed.

GitHub Actions builds and deploys `main` to GitHub Pages. The workflow reads the
Pages base path, so the temporary GitHub project address and the custom domain
both work without editing asset links. Project-address previews use `noindex`.

```bash
npm run build
npm run check          # static: pages, links, metadata, data ↔ art lettering, nonmonetized links, redirects, plain headings
npm run check:browser  # Playwright: 7 viewport sizes, the opening, tapes, screening room, players, About, old URLs
```

## How the homepage works

- **Data.** `src/data/films.mjs` (newest first) and `src/data/essays.mjs` drive every
  title, line, date, runtime and link on the homepage, `/films/` and the film pages.
  The build publishes the art's share of it (lettering, tape number, runtime, date
  stamp; no URLs) as JSON (`#paper-robots-films`). `npm run check` verifies that each
  film's lettering spells its title, line, essay title or script.
- **The opening** (`src/scripts/opening/`) draws the camcorder shot: close-up on the
  robot, the reticle hunt, the lock on the newest film (`films[0]`), whose title card
  tunes in on the folded-paper screen. The film's details are HTML beside the shot,
  one block per film; the tape buttons switch blocks and the screen. "Watch the film"
  opens the screening room (`screening.js`); without JavaScript it is a link to the
  film page.
- **Cost.** At most 1.5 device px per css px and about 2.4 MP; the hold draws at
  24 fps, and after ~20 s the camera pauses (PAUSE in the viewfinder, Play motion to
  resume). Nothing draws off screen, in a hidden tab or while a film plays. Posters and
  film-page formats animate only on screen, for 8–16 s, then settle on their still.
- **Access.** Skip/Replay and Pause/Play are always available (on phones they sit
  just under the shot). Reduced motion shows the held shot as a still. Coming back to the
  homepage in the same visit lands on the hold (`sessionStorage` `pr-opening-seen`);
  a new visit plays the intro. The shot's clock starts when it is first drawn and
  waits while the page is in a background tab. Safari has no canvas blur filter, so the focus hunt uses a
  lens-style defocus there.
- **Review hooks.** `?t=<s>` freezes every canvas at that moment and sets
  `window.__ready`; `?tape=01` starts on another film; `?settled` skips the intro;
  `?standby` draws the paused viewfinder; `?nofilter` forces the Safari focus hunt.
- **A new film.** Add it first in `films.mjs` with an `art` block, and give it its own
  hand process in `src/scripts/film-art/` (register it in the scheduler and in the
  opening's `RENDERERS` and `CARD_TIMING`). Never reuse another film's look.

## The pages around the homepage

| URL | What it is |
| --- | --- |
| `/films/` | Every film as a tape with its code-drawn poster; the film pages link back here |
| `/films/<slug>/` | The in-page player, the film's notes, How it’s made, Keep watching |
| `/about/` | Who makes this and why, the paper robot drawn in code (the kit's pencil `skeleton` in its `plate` framing), the robot in each film's hand, Follow (`#follow`) |
| `/essays/gpt7-will-have-arms/` | The reading edition (text and images unchanged), ending on its film |
| `/essays/` | Redirects to `/#reading` (307, temporary): bring back an index once there are several essays |
| `/follow/` | Redirects to `/about/#follow` (308) |

The navigation is Films · Essays · About. A folded page is listed in
`src/data/redirects.mjs` and in `vercel.json` (with and without the trailing slash); the
build writes a small stub at the old URL for the GitHub Pages fallback, and `npm run check`
keeps the two in step and fails if any page still links to it. Headings stay plain (no
decorative italics or forced breaks), and the art around the work is drawn in code, never
generated: `npm run check` enforces both.

The full GPT-7 essay comes from San’s existing rich edition. Update its original
source and generated mirror first, then sync this repository:

```bash
npm run sync:essay -- /home/san/Projects/sankala.me
npm run build
```

This copies the entire article and its three figures, localizes image URLs, and
records source checksums. The build also prepares the full Substack edition.
Cross-domain canonical metadata points to the original author-site essay.
The original December 2025 date and September 2026 adaptation date remain distinct.

See [the launch handoff](docs/launch/2026-09-domain-and-substack.md).
