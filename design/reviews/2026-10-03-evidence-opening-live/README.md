# The evidence opening, built into the site (October 3, 2026)

San approved the homepage proposal (`design/prototypes/2026-10-evidence-opening/`):
"Paper robot site looks good, you can put it up." This folder reviews the production
build on branch `evidence-opening`. It has not been merged, deployed or tested with visitors.

Frames come from the local build, rendered with the `?t=` hook in headless Chromium.

| File | Shows |
| --- | --- |
| `01-opening-desktop-1440.jpg` | The close-up, the reticle hunt, and the hold with tape 02 playing and its details beside it |
| `02-opening-phone-390.jpg` | The same three moments on a phone. The robot now clears the heading, Skip and Pause sit just under the shot, and Watch is above the fold |
| `03-held-shot-four-sizes.jpg` | The hold at 1920×1080, 1280×720 (the riders now clear the timecode), 768×1024 and 360×740 |
| `04-homepage-films-reading-about-1440.jpg` | Below the opening: the films as tapes with code-drawn posters, the reading room, About, Follow |
| `05-film-page-robotics-revolution-1440.jpg` | A film page: the in-page player (its face is the code-drawn thumbnail), notes, Made, not generated, and Keep watching |
| `06-paused-camera-and-safari-focus.jpg` | The camera pausing itself after the hold, and the focus hunt with canvas blur next to the Safari fallback |
| `browser-checks.json` | Written by `npm run check:browser` |

## What changed from the proposal

- **Generated from the data, not copied.** Every title, line, date, runtime and link
  comes from `src/data/films.mjs` and `src/data/essays.mjs`, the About page and
  `site.config.mjs`. That includes the opening's tape label, timecode tape count,
  date stamp and runtime, and the lettering inside the posters, thumbnails, Shorts and
  title cards. `npm run check` fails if the art's lettering stops matching the film's
  title, line, essay title or script.
- **Kept from the live site:** the in-page screening room on the homepage, the film
  page player and chapters, analytics, RSS, the sitemap, share cards, every URL (no
  redirects needed), and the nonmonetized follow links (YouTube and RSS only).
- **Fixes:**
  - *Phone overlap.* On tall screens the close-up robot is sized and placed between the
    viewfinder's top rows and the measured top of the words.
  - *1280×720.* The screen's size and height are solved from the viewfinder rows, so the
    riders' heads clear the timecode. The lock label on phones moved above the bracket.
  - *Cost.* At most 1.5 device px per css px and about 2.4 MP (it was 2 and 4.2). The
    far-star texture is capped at ~6 MP (it reached ~38 MP on a retina laptop). The
    hold draws straight to the page at 24 fps (it was ~30 fps through an extra
    off-screen copy). About 20 s in, once the riders are at rest, the camera pauses:
    PAUSE shows in the viewfinder, and Play motion, a tape button or Replay starts it
    again. Nothing draws off screen, in a hidden tab or while a film is playing.
    Posters animate only on screen, for 8–16 s, then settle on their still. The canvas
    loop sleeps when idle. With CPU raster, a hold frame costs about 15 ms at
    1440×900 and 17 ms on a phone.
  - *Safari.* There is no canvas blur filter in Safari, so the AF hunt defocuses like a lens there
    (a softened frame spread over a small ring). It is detected by testing, not by name.
  - Reduced motion shows the held shot as a still, with Play motion offered. Visitors
    who saw the intro in the last 12 hours land on the hold. Without JavaScript the page
    shows the newest film's painted still, its details and plain links.
- **Checks:** `npm run build`, `npm run check`, and `npm run check:browser`. The
  browser check covers every page at seven sizes (1920×1080, 1440×900, 1280×720,
  768×1024, 390×844, 360×740 and 320×640) with no console errors and no horizontal
  scroll. It also covers the opening, tape switching, the screening room, pause, the
  film players and chapters, reduced motion, repeat visits and reading without JavaScript.

## For San to decide

- **Film 02's "Made, not generated" paragraph.** It is composed from the film-kit
  study's notes ("the god is the gold…"), because the proposal only had film 01's.
  Its wording is in `src/data/films.mjs`.
- **The automatic pause after ~20 s.** It saves battery. If the hold should loop
  forever, change `HOLD_PLAY` in `src/scripts/opening/opening-core.js`.
- **Wordmark.** The homepage header draws the robot's head in code, as the proposal
  did (the painted profile picture has a cream background that doesn't sit on the dark
  shot). Other pages keep the painted robot.
- **/films/** now lists the films as the same tape rows with code-drawn posters.
- **Still open from the proposal:** the intro length (5.5 s), the screen's busy
  vermilion bezel, and the darker space compared with the painted cobalt. Timings
  have not been checked on a real phone or in Safari.
