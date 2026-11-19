# Video editing preferences

The kinds of videos I like and how I want my own videos edited. Use this as the default brief for every edit in
this repo; anything I say in a request overrides it.

## What I make

- **Brand:** Global Training Australia (GTA), a training provider. Tagline on the logo: "Your door to the future".
- **Format:** short vertical videos (9:16, 1080×1920) for Reels, TikTok and Shorts.
- **Footage:** me talking to camera (phone selfie, indoor), usually followed by the animated GTA logo.
- **Brand colours:** purple (about `#5a33d6` / `#7b4dff`) and orange (about `#ff9f1c`), taken from the GTA logo.

## Videos I like (references)

| Reference | What I like about it | Status |
|---|---|---|
| [How to Edit Videos With Claude Code (From a 10-Year Editor)](https://youtu.be/gM40EV6Esh0), Course Creator 360 | The overall AI-edited creator style | Analysed (see below) |
| A Facebook reel (`facebook.com/share/r/1AHUSd3q3G`) | How it's edited | **Not seen yet.** Facebook links can't be downloaded here; a screen recording of the first 15 s with sound is needed |
| A car video I made in ChatGPT | The look of the edit | **Not seen yet.** Private chat link; the file itself is needed |

### What the YouTube reference does (observed in its first ~48 s)

- **Speaker in a card:** the presenter shrinks into a rounded card with a glowing edge on a dark grid background,
  then returns to full frame between graphics.
- **Graphics fill the space around the speaker:** cards and thumbnails pop in one at a time, big bold numbers with a
  small label underneath (e.g. "$2,500 / what an editor charges"), app icons that appear one by one and are then
  struck through with a red line, a timeline with year markers, a paper "invoice" card that fills line by line.
- **Type:** extra-bold geometric sans in capitals, white with one accent word in a bright colour and a soft glow.
- **Cuts:** mostly hard cuts and seat moves; no flashes, shakes or glitches.
- **Pacing:** the picture changes every 1–3 s; the speaker is rarely on screen alone for long.
- **Captions:** no running subtitle track on the main video; words appear as part of the graphics.

## How I want my videos edited

### Always
- **Keep my real voice and natural delivery.** No AI voice, no re-recording.
- **Keep every spoken word.** Never cut words just to hit a length; cut only real dead air.
- **Captions checked word for word** against what I actually say, readable on a phone: bold, high contrast, inside
  the safe area (clear of the platform buttons on the right and the caption bar at the bottom).
- **End on the GTA logo**, short (about 2 s), so the full crest and "Global Training Australia" wordmark are visible.
- **Leave my original file untouched.** Work on a copy and save results separately.
- **Show me a preview first** and wait for my approval before editing the full video.

### Only when they help the point
- Punch-in zooms (about 1.3×) on key phrases.
- Motion graphics and B-roll that show what I'm saying.
- Sound effects: few, subtle, never over key lines.

### Don't, unless I ask
- Stock footage or stock photos.
- Added background music.
- An enrolment or other call to action that I didn't say.
- Forced effects (flashes, shakes, glitches) just for energy.
- The reference creator's own footage, music or branding.

## Caption style that worked

From the 15-second preview (`exports/gta-preview-15s-9x16.mp4`, awaiting approval):
- Montserrat Black, ~76 px on 1080 wide, capitals, white with a dark outline and soft shadow.
- 1–4 words per caption, timed to the words, centred at about 72% of the frame height (below the chin).
- Key words in GTA orange (e.g. *qualification*, *certificate*, *real skills*, *quality training*, *practice*).

## Technical defaults

- Export: H.264 MP4, 1080×1920, 30 fps, AAC audio.
- Loudness around −14 LUFS for social; true peak at or below −1 dBTP (turn on voice clean-up if the voice clips).
- Logo ending: the last ~2 s of the logo animation (18.85–20.85 s in the GTA clip).

## Past edits

| File | What it is |
|---|---|
| `exports/gta-qualification-edit.mp4` | Full 20.8 s AI Producer edit in the YouTube reference's style, brand colours, voice cleaned |
| `exports/gta-preview-15s-9x16.mp4` | Clean 14.7 s preview: full spoken line, captions, two punch-ins, 2 s logo ending |
