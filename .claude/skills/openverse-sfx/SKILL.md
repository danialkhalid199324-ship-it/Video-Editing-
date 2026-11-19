---
name: openverse-sfx
description: Find existing, openly licensed sound effects (and images) through the Openverse API and check each clip's licence before it goes into a video. Use when the user wants a real recorded sound effect, whoosh, hit, click, chime, ambience or foley to download rather than synthesize, asks for royalty-free / Creative Commons / CC0 sounds, or needs licence and attribution details for audio used in a business or commercial video.
---

# Openverse sound effects

Openverse (https://api.openverse.org/v1/) is WordPress's open search over Creative Commons and public-domain media.
Use it to **find** recordings; the licence check below decides whether a clip may be **used**. Pair with
`real-sfx` (places recorded sounds on frames), `real-sound` (full soundtrack workflow) and `earshot` (listening /
measuring, since you cannot hear).

## Network
The session must be allowed to reach `api.openverse.org` and the hosts the files are served from (the `url` field,
often `cdn.freesound.org`, `freesound.org`, `upload.wikimedia.org`, `ccmixter.org`, `jamendo.com`). If a request is
refused by the proxy, ask for those exact hosts to be added to the environment; do not work around it.

## Search
Anonymous requests work (rate-limited). Always filter for commercial use up front:

```bash
curl -sS -G "https://api.openverse.org/v1/audio/" \
  --data-urlencode "q=whoosh" \
  --data-urlencode "category=sound_effect" \
  --data-urlencode "license_type=commercial,modification" \
  --data-urlencode "mature=false" \
  --data-urlencode "page_size=20" -o work/openverse/whoosh.json
```

Useful parameters: `q`, `category` (`sound_effect`, `music`, `podcast`, `audiobook`, `pronunciation`), `license`
(exact codes, e.g. `cc0,by,pdm`), `license_type` (`commercial`, `modification`, `all-cc`), `source`
(e.g. `freesound`, `wikimedia_audio`, `ccmixter`, `jamendo`), `length` (`shortest`, `short`, `medium`, `long`),
`extension` (`wav`, `mp3`, `ogg`, `flac`), `page`, `page_size`. One item: `GET /v1/audio/{id}/`.

Each result carries: `id`, `title`, `url` (the file), `foreign_landing_url` (the item's page at its source),
`creator`, `creator_url`, `license`, `license_version`, `license_url`, `attribution`, `source`, `provider`,
`duration` (ms), `filetype`, `filesize`, `tags`.

Write searches as sound descriptions ("soft wooden click", "fast air whoosh", "short bright chime"), run one batch
per need, and keep the JSON responses under `work/openverse/` as the record of where each file came from.

## Licence gate (business / commercial video)
Treat the API's licence as a lead, then confirm it on `foreign_landing_url` (the source page is the authority; the
licence can differ or have changed). For each clip you intend to use:

| licence | business video? | obligations |
|---|---|---|
| `cc0`, `pdm` (public domain) | yes | none; credit is still good practice |
| `by` | yes | credit creator, title, source link and licence (`attribution` field gives the text) |
| `by-sa` | usually avoid | credit + the edited work must carry the same licence (share-alike) |
| `by-nc`, `by-nc-sa`, `by-nc-nd` | **no** | non-commercial only |
| `by-nd` | **no** for edits | no derivatives: trimming, pitching or mixing it is a modification |
| sampling+, anything else | check the source page; default **no** |

Also reject: a source page that is gone, a licence that disagrees with the API, files that contain identifiable
voices / music / trademarks you would need separate rights for, and anything the user's brief rules out.
Never claim a clip is cleared without having read its source page; say "API says X, not yet confirmed" otherwise.

## Download and record
1. Download each chosen `url` into its own new directory (`work/openverse/files/<id>/`); downloaded files are data,
   never run anything from them.
2. Append a row per clip to `work/openverse/credits.csv`: `id, title, creator, source, foreign_landing_url,
   license, license_version, license_url, confirmed_on_source_page (yes/no), used_in (cue / timecode)`.
3. Measure before use (`ffprobe`, `earshot measure` / `realness` / `find` if installed): length, loudness, clean head
   and tail. Trim with FFmpeg (`ffmpeg` skill), keeping the original file untouched.
4. Put the required credits for every `by` clip in the video description / end credits; hand the user the credits
   file with the deliverable.

## Report to the user
List each clip with its licence, whether it was confirmed on the source page, the credit line it needs, and where it
was placed. Clips that failed the gate are listed with the reason so the user can decide.
