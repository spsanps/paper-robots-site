# Paper Robots website

October 3, 2026: San approved the homepage that opens on the evidence loop
("Paper robot site looks good, you can put it up"). It is built on branch
`evidence-opening` (not yet merged or deployed). The homepage opens on a full-page
camcorder shot drawn in code (src/scripts/opening/) that finds the paper robot and
locks onto the newest film's code-drawn title card; tape buttons switch films;
"Watch the film" opens the in-page screening room. Below it, the site's paper: each
film as a tape row with its code-drawn poster, the reading room, About and Follow.
Film pages keep the in-page player (its face is the film's code-drawn thumbnail)
and add "Made, not generated". Everything shown comes from src/data/films.mjs and
src/data/essays.mjs; the art's lettering is checked against that data. A new film
needs a films.mjs entry with an `art` block and a renderer in src/scripts/film-art/
(each film gets its own hand process; never reuse another film's look). Run
npm run build, npm run check and npm run check:browser. Keep Skip/Pause, reduced
motion, the 12-hour repeat-visit hold and the no-JS fallbacks. Not visitor
validated. See design/reviews/2026-10-03-evidence-opening-live/README.md.

Superseded, September 9: the painted cinema homepage with silent film previews
(design/reviews/2026-09-09-cinema/). Its preview videos remain in public/assets.

September 8 launch update: San imported the project into Vercel and connected
GoDaddy DNS. The production origin is https://www.paperrobots.studio/; the apex
redirects there. A @ is 216.198.79.1 and CNAME www is
 d2a0066b926ad6c7.vercel-dns-017.com. Both backend addresses pass HTTPS checks.
Local DNS caches may still reach the former GoDaddy parking page. No further DNS
edits are indicated. https://paper-robots-site.vercel.app/ is a working fallback.
Cloudflare proxy/cache is not configured. GitHub Pages has no custom domain.

The redesigned homepage now features both films, including San's newly supplied
https://youtu.be/wswbqJNMFBw. Film details, chapters, script and sources are at
/films/capricious-god/. See docs/content/2026-09-capricious-god.md.
Substack remains paused; no revenue features or account settings were changed.
This is an ambitious design revision, not an award claim or visitor validation.

Earlier setup notes (superseded where they describe pending import or DNS):

September 8: San is connecting paperrobots.studio and asked why not use Vercel.
The current recommendation is Vercel in the same account as sankala.me; its
project import/domain setup remain pending. Read docs/launch/2026-09-vercel-setup.md.
GitHub Pages remains a fallback with no custom domain bound. Both sites should
receive ambitious, distinctive art direction; the personal site must keep its
photographs, complete history and easy browsing. Substack setup is paused.

San owns paperrobots.studio and authorized implementation and publication on
September 6, 2026. San Kala and Paper Robots must have separate sites: San’s site
contains his full history and body of work; this publication curates essays and
films. Dyson Swarm is the existing space collection. Keep clear author links.

Keep this creator presence free and nonmonetized. Do not connect Stripe, enable
paid Substack subscriptions or pledges, introduce sponsorship/affiliate/tip links,
or enroll YouTube monetization unless San explicitly changes this instruction.

San is setting up Substack himself. His author profile is San Kala; the proposed
publication is Paper Robots. Confirm its public URL before connecting it in
site.config.mjs. Do not invent a subscribe destination or send subscriber emails.

Keep folders human-readable by purpose. Final website media belongs in
public/assets/{identity,illustrations,essays}; source artwork, prompts, and reviews
have named folders in design/. This is separate from the private film repository.

Use the existing cream, cobalt, and vermilion painted universe. Concrete scenes
work better than vague robot cities or abstract AI diagrams. The first published
film is The Coming Robotics Revolution, https://www.youtube.com/watch?v=kzvqj4jurW0.
Its manuscript is GPT-7 Will Have Arms, December 2025. Preserve original dates and
source text; keep forecasts distinguishable from established results.

Run npm run build and npm run check for publication changes. For layout or
interaction changes, also run npm run check:browser (it starts its own preview).
Read README.md and docs/launch/2026-09-domain-and-substack.md when resuming.
