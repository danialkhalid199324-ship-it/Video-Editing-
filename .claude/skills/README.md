# Skills in this repo

| Skill | What it does | Source |
|---|---|---|
| `video-editor-architect` | Edit plans: structure, pacing, cut lists, audio/colour, export specs | this repo |
| `creative-architect` | Concepts, hooks, scripts, storyboards, visual direction | this repo |
| `motion-architect` | Motion graphics, easing/timing systems, titles, Lottie/CSS/GSAP/Remotion motion | this repo |
| `remotion` | Programmatic video in React with Remotion | this repo |
| `hyperframes` | HTML-to-MP4 video with HeyGen HyperFrames | this repo |
| `tesseract` | OCR of frames, burned-in subtitles to SRT | this repo |
| `ffmpeg` | Command-line trim, encode, reframe, loudness, subtitles, batch | this repo |
| `openverse-sfx` | Search Openverse for CC / public-domain sound effects, licence gate for business use | this repo |
| `real-sfx` | Places real recorded SFX on exact frames, keeps voice and music, returns MP4 + SFX track | [Clipwing/skills](https://github.com/Clipwing/skills) (commit edbefcb) |
| `earshot` | "Ears" for the agent: measure, describe, rank, compare audio; make sounds in code (forge) and render effects from its bank | [Leonxlnx/earshot](https://github.com/Leonxlnx/earshot) (commit 4ac3d2a, MIT) |
| `real-sound` | Full soundtrack workflow from real licensed recordings: cue list, sourcing, licence audit, mix, QA, master, credits | [Leonxlnx/earshot](https://github.com/Leonxlnx/earshot) (commit 4ac3d2a, MIT) |

## Sound library in this repo

- `sfx-library/earshot-kits/{calm,crisp,launch}/` – effect kits rendered from earshot's bank (code-made sounds plus
  15 fitted from CC0 recordings; 200 takes, all passing `earshot kit check`). Only `kit.json` / `kit.lock.json` are
  committed; re-render the WAVs in ~10 s with
  `tools/earshot/.venv/bin/python -m earshot kit render sfx-library/earshot-kits/<preset>/kit.json --out sfx-library/earshot-kits/<preset>`.
- `sfx-library/recorded/` – put real recorded packs here; `real-sfx` is already configured to use it as its main
  library (rebuild its index after adding files). Freesound refuses downloads from the cloud session, so add packs
  from your own computer.
- `real-sfx` also has the bundled uisfx UI cues ready.

## Setup the third-party skills still need

- **earshot / real-sound**: the Python package is vendored at `tools/earshot`. Install once:
  `python3 -m venv tools/earshot/.venv && tools/earshot/.venv/bin/pip install -e "tools/earshot[mcp]"`, then
  `tools/earshot/.venv/bin/python -m earshot doctor`. It pulls PyTorch-class dependencies and downloads its CLAP/AST
  models from Hugging Face on first use, so the environment must allow those hosts.
- **real-sfx**: needs Python 3.9+ and FFmpeg; ships without a sound library. Point it at one with
  `python scripts/setup.py init --library main=<folder> --uisfx --index` (run from `.claude/skills/real-sfx`).
  The bundled uisfx UI pack is CC0/MIT. The Clipwing repo has no top-level licence file; check its terms before
  redistributing.
- **openverse-sfx**: needs network access to `api.openverse.org` and the file hosts its results point to.
