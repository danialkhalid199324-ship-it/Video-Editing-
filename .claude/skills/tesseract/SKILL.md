---
name: tesseract
description: Extract text from images and video frames with Tesseract OCR. Use when the user wants OCR, to read on-screen text/burned-in subtitles/slides/lower thirds from a video, convert hardcoded subtitles to SRT, index or search video by on-screen text, or extract text from screenshots, scans or PDFs.
---

# Tesseract OCR

Tesseract is an open-source OCR engine with a CLI and bindings (`pytesseract`, `tesseract.js`). In video work it is paired with FFmpeg: extract frames, then OCR them.

## Install
```bash
sudo apt-get install -y tesseract-ocr tesseract-ocr-eng   # add tesseract-ocr-<lang> as needed
brew install tesseract                                    # macOS
tesseract --version && tesseract --list-langs
pip install pytesseract opencv-python                     # Python
```

## CLI basics
```bash
tesseract input.png out                 # writes out.txt
tesseract input.png stdout -l eng+deu   # multiple languages
tesseract input.png out --psm 6 --oem 1 # page segmentation / LSTM engine
tesseract input.png out tsv             # word boxes and confidence (also: hocr, pdf, alto)
```
Page segmentation modes (`--psm`): 3 auto (default), 6 single uniform block, 7 single line (subtitles, lower thirds), 8 single word, 11 sparse text (UI, scattered text), 13 raw line.
Whitelist characters (for timecodes or scores): `-c tessedit_char_whitelist=0123456789:`.

## Video OCR pipeline
1. **Extract frames** (only as often as text changes):
```bash
mkdir -p frames
ffmpeg -i in.mp4 -vf "fps=1" frames/f_%05d.png                              # 1 fps
ffmpeg -i in.mp4 -vf "crop=iw:ih*0.2:0:ih*0.8,fps=2" frames/sub_%05d.png    # bottom 20% (subtitles)
ffmpeg -i in.mp4 -vf "select='gt(scene,0.3)'" -vsync vfr frames/scene_%04d.png  # scene changes only
```
2. **Preprocess** — the biggest accuracy lever:
   - Crop to the text region; upscale small text 2–3× (`scale=iw*2:ih*2:flags=lanczos`).
   - Grayscale, then threshold (Otsu/adaptive). Invert light-on-dark text so it reads as dark text on light.
   - Denoise and remove the background when text sits over moving footage.
3. **OCR** each frame with a fitting `--psm` (usually 7 or 6 for subtitles), and keep the per-word confidence from TSV.
4. **Post-process**: drop low-confidence results (<60), merge identical consecutive frames into one cue with start/end times (frame index ÷ fps), fix common errors (l/1, O/0, rn/m), and spell-check.
5. **Output**: SRT/VTT for subtitles, JSON with timestamps for indexing/search, or plain text.

## Python sketch (hardcoded subs → SRT)
```python
import cv2, pytesseract, glob
FPS = 2
def prep(path):
    g = cv2.cvtColor(cv2.imread(path), cv2.COLOR_BGR2GRAY)
    g = cv2.resize(g, None, fx=2, fy=2, interpolation=cv2.INTER_CUBIC)
    _, b = cv2.threshold(g, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    return 255 - b if b.mean() < 127 else b
cues, prev, start = [], "", 0
for i, f in enumerate(sorted(glob.glob("frames/sub_*.png"))):
    t = pytesseract.image_to_string(prep(f), config="--psm 6").strip()
    if t != prev:
        if prev: cues.append((start / FPS, i / FPS, prev))
        prev, start = t, i
if prev: cues.append((start / FPS, (i + 1) / FPS, prev))
ts = lambda s: f"{int(s//3600):02}:{int(s%3600//60):02}:{int(s%60):02},{int(s%1*1000):03}"
with open("out.srt", "w") as o:
    for n, (a, b, t) in enumerate(cues, 1):
        o.write(f"{n}\n{ts(a)} --> {ts(b)}\n{t}\n\n")
```
Use fuzzy matching (e.g. `difflib.SequenceMatcher` ratio > 0.85) instead of `!=` to absorb OCR jitter between frames.

## Notes
- Tesseract struggles with stylized fonts, heavy motion blur, curved or perspective text. Crop and deskew first, or suggest a different OCR engine for scene text.
- For spoken words, use speech-to-text (Whisper), not OCR.
- Respect copyright and privacy when extracting text from others' content.
