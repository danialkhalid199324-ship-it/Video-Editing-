# Recorded sound library

Put real recorded effects here (one sub-folder per kind: whoosh/, hit/, pop/, click/, riser/, chime/, foley/, ambience/),
then from `.claude/skills/real-sfx` run:

    python3 scripts/setup.py init --library main=../../../sfx-library/recorded --uisfx --index

Good free sources (check every licence before business use, see the `openverse-sfx` skill):
Freesound (CC0 filter), Sonniss GDC bundles, Mixkit, Pixabay sound effects.
Freesound refuses downloads from the cloud session, so download packs on your own computer and add them here.
Audio files in this folder are git-ignored; keep a credits file next to them.
