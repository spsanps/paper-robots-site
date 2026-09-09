# Paper Robots website

September 9: San rejected both previous homepages as ordinary, boring blogs.
The new homepage is a full-screen film setting with silent local film previews,
a two-film selector and an in-page screening dialog. Preserve plain film/essay
links and reduced-motion/no-JS fallbacks. Do not call this award-winning or user
validated. See design/reviews/2026-09-09-cinema/README.md.

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
interaction changes, run scripts/check-browser.mjs against the local preview.
Read README.md and docs/launch/2026-09-domain-and-substack.md when resuming.
