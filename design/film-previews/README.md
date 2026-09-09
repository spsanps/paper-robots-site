# Homepage film previews

Short, silent excerpts of the existing finished films. Full release files stay in
the private film collection; only compressed web excerpts are committed here.

| Public asset | Source | Selection |
|---|---|---|
| `public/assets/films/capricious-god/previews/the-palace-8s.mp4` | Film 02, `08-release/2026-09-08-v22-1080p/youtube/capricious-god_1080p.mp4` | 3:15–3:23 |
| `public/assets/films/robotics-revolution/previews/robotics-8s.mp4` | Film 01, `08-release/2026-09-05-v8-1080p/youtube/gpt-7-will-have-arms_1080p.mp4` | 6:10–6:18 |
| `public/assets/films/robotics-revolution/previews/robotics-poster.webp` | Second excerpt, frame at 2 seconds | WebP quality 86 |

Both clips: FFmpeg, 1280×720, 24 fps, libx264, CRF 26, fast preset, yuv420p,
no audio, `+faststart`. Sizes approximately 624 KB and 632 KB. Scenes were selected
and visually checked for coherence with the published painted films.

The homepage loads only the selected clip, pauses it offscreen/in hidden tabs,
and has a visible pause control. Reduced-motion and Save-Data start on a still.
Full YouTube playback is separate and begins only when a visitor chooses Watch.
