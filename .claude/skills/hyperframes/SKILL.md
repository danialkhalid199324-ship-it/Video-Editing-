---
name: hyperframes
description: Create videos from HTML/CSS/JS with HeyGen's open-source HyperFrames framework (HTML in, deterministic MP4 out). Use when the user mentions HyperFrames, wants "video as code" with plain HTML instead of React, wants an AI-agent-friendly HTML-to-MP4 pipeline, or wants GSAP/Lottie/Three.js/CSS animations rendered to video.
---

# HyperFrames

HyperFrames (github.com/heygen-com/hyperframes, Apache-2.0) renders an HTML composition to MP4 frame by frame in headless Chrome, then encodes it with FFmpeg. The same HTML always produces the same video. It's the plain-HTML alternative to Remotion. Pick it when the user wants no React, or wants quick agent-authored videos. Pick Remotion for large React codebases.

> This project moves fast. When unsure about a flag or attribute, check the official docs/README (or `npx hyperframes --help`) rather than guessing.

## Requirements and setup
- Node.js 22+, FFmpeg installed and on PATH.
```bash
npx hyperframes init my-video
cd my-video
npx hyperframes preview      # browser preview with live reload
npx hyperframes render       # render to MP4
npx hyperframes add <block>  # add a catalog block, e.g. flash-through-white transition
```
Official agent skills can also be installed: `npx skills add heygen-com/hyperframes`, or as a Claude Code plugin with `claude plugin marketplace add heygen-com/hyperframes` then `claude plugin install hyperframes@hyperframes`.

## Composition structure
A root element defines the composition. Every timed element is a `clip` with timing and track attributes (seconds):
```html
<div id="stage" data-composition-id="launch" data-start="0" data-width="1920" data-height="1080">
  <video class="clip" src="broll.mp4" data-start="0" data-duration="6" data-track-index="0" muted playsinline></video>
  <h1 id="title" class="clip" data-start="1" data-duration="4" data-track-index="1">Launch Day</h1>
  <audio src="music.wav" data-start="0" data-duration="6" data-track-index="2" data-volume="0.5"></audio>
</div>
```
- `data-start` / `data-duration`: when the clip is on screen.
- `data-track-index`: separate tracks, like an NLE timeline (use distinct integers per layer).
- `data-volume`: audio level 0–1.

## Seekable animation
Animations must be seekable, not real-time, because the renderer scrubs to each frame. With GSAP, create a **paused** timeline and register it under the composition id:
```html
<script>
  const tl = gsap.timeline({ paused: true });
  tl.from("#title", { opacity: 0, y: 40, duration: 0.8, ease: "power3.out" }, 1);
  window.__timelines = window.__timelines || {};
  window.__timelines.launch = tl;   // key = data-composition-id
</script>
```
Also supported: CSS animations, Lottie, Three.js, Anime.js, WAAPI and custom frame adapters.

## Rules
- No wall-clock logic (`Date.now()`, `setInterval`, unseeded `Math.random()`) driving visuals.
- Keep timeline positions (seconds) aligned with each clip's `data-start`.
- Load fonts and media locally where possible so renders are reproducible offline.
- Size the stage to the delivery format (1920×1080, 1080×1920, 1080×1350) instead of scaling afterwards.
- Lint and preview before a full render; render short sections first when iterating.

## Workflow
1. Scene list with start/duration per element (from `video-editor-architect`).
2. Write the HTML composition: clips and tracks.
3. Add one paused GSAP timeline for motion (timing and easing from `motion-architect`).
4. `preview` → fix → `render`. Use the `ffmpeg` skill for post-processing (loudness, captions burn-in, format variants).
