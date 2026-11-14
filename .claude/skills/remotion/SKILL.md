---
name: remotion
description: Build programmatic videos with Remotion (React). Use when the user wants to create, animate, template or render videos in code with React/TypeScript, mentions Remotion, compositions, useCurrentFrame, interpolate, spring, Sequence, Remotion Studio, Remotion Lambda, or wants data-driven/personalized video at scale.
---

# Remotion

Remotion renders React components to video: every frame is a pure function of `frame` number. Pair with the `motion-architect` skill for timing/easing decisions.

## Setup
```bash
npx create-video@latest          # scaffold (choose a template)
npm run dev                      # or: npx remotion studio  — live preview
npx remotion render <CompId> out/video.mp4
npx remotion still <CompId> out/frame.png --frame=30
```
Requires Node 18+. Remotion ships its own FFmpeg binary. Licensing: free for individuals and companies of up to 3 people; larger companies need a company license. Mention this when the user is a business.

## Core model
```tsx
// src/Root.tsx
import { Composition } from "remotion";
import { Intro } from "./Intro";

export const RemotionRoot = () => (
  <Composition
    id="Intro"
    component={Intro}
    durationInFrames={150}
    fps={30}
    width={1920}
    height={1080}
    defaultProps={{ title: "Hello" }}
  />
);
```
```tsx
// src/Intro.tsx
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing } from "remotion";

export const Intro: React.FC<{ title: string }> = ({ title }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });
  const scale = spring({ frame, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", background: "#0b0b0f" }}>
      <h1 style={{ opacity, transform: `scale(${scale})`, color: "white", fontSize: 120 }}>{title}</h1>
    </AbsoluteFill>
  );
};
```

## Key APIs
- **Timing:** `useCurrentFrame()`, `useVideoConfig()` (fps, width, height, durationInFrames). Think in frames: `seconds * fps`.
- **Animation:** `interpolate()` (always set `extrapolateLeft/Right: "clamp"` unless overshoot is intended), `spring()`, `Easing.*`, `interpolateColors()`.
- **Layout and time:** `<AbsoluteFill>`, `<Sequence from={30} durationInFrames={60}>` (resets frame to 0 inside), `<Series>`, `<Loop>`, `<Freeze>`. Use `@remotion/transitions` (`TransitionSeries`) for scene transitions.
- **Media:** `<OffthreadVideo>` (preferred for rendering) or `<Video>`, `<Audio>`, `<Img>`, `staticFile("file.mp4")` for assets in `public/`. Trim with `startFrom` / `endAt`; control volume with the `volume` prop or a function `(f) => ...`.
- **Async data:** `delayRender()` / `continueRender()`, or `calculateMetadata` on `<Composition>` to set duration/props from data.
- **Parameterization:** `defaultProps` + a Zod `schema` makes props editable in Studio; pass `--props='{"title":"Hi"}'` or `--props=./data.json` at render.
- **Captions:** `@remotion/captions` and `@remotion/install-whisper-cpp` for auto-subtitles.
- **Fonts:** `@remotion/google-fonts` or `loadFont` from `@remotion/fonts`.

## Rules (determinism)
- Never use `Math.random()`, `Date.now()`, CSS transitions/animations, or `setTimeout` to drive visuals. Use `random("seed")` from `remotion` and derive everything from `frame`.
- Don't rely on component state across frames; frames may render out of order and in parallel.
- Keep heavy work memoized; preload assets with `@remotion/preload` during preview.

## Rendering
- CLI flags: `--codec=h264|h265|vp9|prores|gif`, `--crf`, `--prores-profile=4444` (alpha), `--image-format=png` for transparency, `--concurrency`, `--frames=0-89`, `--scale`.
- Vertical/social: define separate compositions (1080×1920) rather than scaling.
- At scale: `@remotion/lambda` (AWS) or `@remotion/cloudrun`; programmatic SSR with `@remotion/renderer` (`bundle`, `selectComposition`, `renderMedia`).

## Workflow
1. Turn the brief into a scene list with frame ranges (use `video-editor-architect` / `creative-architect` if needed).
2. One component per scene, composed with `<Sequence>`/`<TransitionSeries>` in a root composition.
3. Expose text, colors and media as typed props for templating.
4. Preview in Studio, render a still per scene to check, then render the full video.
