# The evidence opening — a Paper Robots homepage proposal

> October 3, 2026: San approved this ("Paper robot site looks good, you can put it up").
> It is built into the site from `src/` on branch `evidence-opening`; see
> `design/reviews/2026-10-03-evidence-opening-live/`. This folder stays as the proposal.

October 3, 2026. San asked for prep on a Paper Robots site proposal built on the
animation he liked: "I love the evidence loop... that could be a full page thing on
the Paper Robots site", plus his "made, not generated" direction (each film's poster,
thumbnail, Shorts loop and title card drawn in code), which he wanted expanded. This
is a proposal for him to react to, not a decision. Nothing in `src/`, `public/` or the
deploy config was touched.

Open `index.html` (the homepage) and `film-01.html` (the film page) straight from the
folder; they run from `file://`. Previews are in `previews/`.

## What the opening does

The homepage opens on a full-page camcorder shot, drawn in code, in the evidence
loop's own rules. It's a page, so the shot ends on the content instead of looping:

| Time | Shot |
| --- | --- |
| 0.0–2.35 s | Close-up. The paper robot gasps, its eyes fill with star glints, it blinks and looks toward something. Whip pan. |
| 2.35–4.3 s | Wide, over the robot's shoulder. The reticle hunts, false-locks a bright star, then snaps `LOCK` onto a speck. |
| 4.3–5.5 s | Zoom. The speck grows into a folded-paper screen drifting in space, with green one-eyed riders clinging to its frame. Stars streak; the AF hunts. |
| 5.5 s on | Hold. The screen tunes in from static to the newest film's own title card (egg tempera and gold leaf for film 02), which plays its reveal. The film's title, line, runtime and Watch / Story actions fade in beside it, as real HTML. A slow handheld drift, REC blinking, riders waving, a ribbon trail and paper scraps keep it alive. |

**How it leads to content:** the thing the camera locks onto *is* the newest film.
The screen's tape label, the overlay's tape counter (`TAPE 02/02`) and the date stamp
(`SEP 08 2026`, the release date) all belong to that film. The tape buttons
(02 The Hugging Face incident · 01 When AI gets a body) whip the camera sideways and
tune the screen to the other film's linocut title card, with the copy and links
switching to match. This keeps the live homepage's two-film selector.

Below the opening, the page goes quiet on the live site's paper: each film as a tape
row with its code-drawn poster, the reading room, About and Follow, and the footer.

## The film page (`film-01.html`)

The expanded "made, not generated" idea for The Coming Robotics Revolution:
- the film itself, as its code-drawn thumbnail linking to YouTube (on the live site
  this becomes the in-page player);
- a "Made, not generated" section: poster, title card, the robot on its own, and the
  Shorts loop, all from one linocut renderer;
- the essay it came from, and Keep watching (tape 02).

## What's real and what's placeholder

- **Real:** both films' titles, lines, descriptions, runtimes, dates, YouTube links and
  live page links; the essay's title, dates and description; the About and Follow copy;
  the nav and footer. All taken from the repo (`src/data/films.mjs`, the built pages)
  and kept word for word.
- **Real code, reused:** the evidence loop's drawing kit is copied unchanged into
  `js/_evidence-parts.js`; the linocut, tempera, robot and strip renderers are copied
  from the sankala.me film-kit study (`paper-robots-made/`).
- **New:** the opening's storyboard, the folded-paper screen, the riders' idle loops, the
  tape switching, the tuning, the page layout and the film page layout.
- **Placeholder or proposal-only:**
  - links point at the live site, except Films (in-page) and film 01 (this folder's
    `film-01.html`);
  - the date stamp shows each film's release date;
  - the YouTube player is a link, not an embed;
  - `noindex` is set on both pages.
- **Nothing monetized.** Follow links are YouTube and RSS only; Substack is still
  unconfirmed in `site.config.mjs`, so it isn't linked.

## Design rules kept

- **The opening is the camera's world:** six colours (deep blue-violet space, cobalt,
  periwinkle outlines, vermilion, cream, green riders), never black, no gradients.
  Halftone dots make shade, cream dashes make light, grain rides over the footage.
- **Camera UI stays separate from the page:** the viewfinder overlay (REC, timecode,
  tape counter, battery, zoom bar, reticle, AF, date) frames only the right side of
  the screen on desktop and the top on phones. The page's words, nav and buttons are
  plain, legible HTML outside it. The only film-world art inside the shot is the title
  card playing on the screen.
- **Below the fold:** the live site's paper, ink and type (Fraunces and DM Sans,
  self-hosted copies in `fonts/`). The posters are the only loud things.
- **Motion and accessibility:**
  - "Skip intro" (then "Replay intro") and "Pause motion" are always available.
  - Anyone who watched the intro in the last 12 hours lands straight on the hold.
  - With reduced motion, the opening and every poster show composed stills.
  - Animation stops when the opening is off screen or the tab is hidden.
  - The hold runs at about 30 fps.

## Checks

- **Iteration:** nine render passes, at 1440×900, 1920×1080, 1280×720, 1024×768,
  768×1024, 390×844 and 360×740. Fixes made along the way:
  - The camera UI was colliding with the copy column; it now lives in the right-hand
    viewfinder.
  - The far screen started too close to the header.
  - On phones, the header wrapped into the REC row.
  - On phones, riders covered the timecode.
  - The tape label overlapped itself.
  - The phone shot needed recomposing so the Watch button sits above the fold on a
    390×844 screen.
- **Real-clock interaction test:**
  - the intro locks and the film details appear;
  - switching to tape 01 whips, tunes in the linocut card and updates the copy and links;
  - Pause works;
  - posters build after the opening's card;
  - reduced motion shows a still.
- **Errors:** no console errors and no horizontal scroll on either page at desktop or phone size.
- **Recording:** `previews/opening-desktop.mp4` is the first 14 seconds at real speed,
  recorded frame by frame with the `?t=` hook.

## Honest weaknesses

- **Untested hardware:** all timing comes from headless software rendering. The opening
  canvas is full-page (capped at about 4.2 MP) and redraws stars and halftones every frame.
  It should be fine on a GPU but hasn't been checked on a real phone or in Safari.
  Safari lacks `ctx.filter`, so the AF focus-hunt blur is skipped there.
- **Intro length:** 5.5 seconds before the film details appear. They fade in at the
  lock, and the brand and nav are readable from the first frame, but some visitors will
  want it shorter.
- **The title card's reveal:** it takes another 3–4 seconds before the film's own title
  shows on the screen, because the gold leaf is laid first.
- **Phone overlap:** on phones the robot's body briefly overlaps the "Paper Robots"
  heading during the close-up.
- **Small screens:** at 1280×720 the riders' heads reach the timecode.
- **The screen frame:** it's busy with vermilion halftone. A calmer cream bezel might
  read better; worth trying.
- **Colour versus the live site:** the deep blue-violet space is darker than the live
  site's painted cobalt sky. It's the evidence loop's palette, so it reads as the same
  family, but San should judge whether it still feels like Paper Robots.

## Other directions, one line each

1. **Loop as a strip, not the page:** keep the live painted homepage and show the evidence
   loop as a short camcorder band between the hero and the films, so it's less of a commitment.
2. **The reticle as navigation:** scrolling down, the camera pans to each film's tape in
   turn, so the films section becomes one continuous shot. More cinematic, more work.
3. **Every film gets a tape:** each new film ships with its own code-drawn title card,
   and the opening always locks onto the newest one automatically, so the homepage
   renews itself with each release.

## Files

- `index.html`, `film-01.html`, `proposal.css`
- `js/opening.js`, generated by `./build.sh` from:
  - `js/_evidence-parts.js` (the evidence loop's drawing kit, copied);
  - `js/_opening-core.js` (the new opening; edit this).
- `js/kit.js`, `robot.js`, `linocut.js`, `tempera.js`, `strip.js`: copied from the film-kit study.
- `js/main.js`: copied from the film-kit study; it now waits for the opening's first card.
- `fonts/`: the site's self-hosted Fraunces and DM Sans, with licences.
- `previews/`:
  - `opening-desktop.jpg`
  - `opening-sequence.jpg` (three desktop moments over three phone moments)
  - `homepage-and-film-page.jpg`
  - `opening-desktop.mp4`

Review hooks: `?t=<seconds>` freezes a moment; `?tape=01` starts on film 01;
`?settled` skips the intro; with `?t`, `window.__renderAt(t)` draws any moment.
