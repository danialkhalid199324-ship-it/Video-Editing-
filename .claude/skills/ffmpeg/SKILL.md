---
name: ffmpeg
description: Process video and audio with FFmpeg/ffprobe — trim, cut, concat, transcode, resize/reframe to 9:16 or 1:1, compress, normalize loudness, mix audio, burn or mux subtitles, overlays/watermarks, speed changes, GIFs, thumbnails, frame extraction, and batch scripts. Use whenever the user wants a command-line or scripted media operation, or mentions ffmpeg/ffprobe.
---

# FFmpeg

Always explain what each command does. Inspect inputs before transforming them. Never overwrite source files: write to a new output, and use `-n` or a fresh name.

## Inspect first
```bash
ffprobe -v error -show_entries format=duration:stream=index,codec_type,codec_name,width,height,r_frame_rate,sample_rate,channels -of json in.mp4
```

## Trimming and cutting
```bash
ffmpeg -ss 00:01:05 -to 00:01:35 -i in.mp4 -c copy cut.mp4                 # fast, keyframe-accurate only
ffmpeg -ss 00:01:05 -to 00:01:35 -i in.mp4 -c:v libx264 -crf 18 -c:a aac cut.mp4  # frame-accurate (re-encode)
```

## Concatenate
```bash
# same codecs/params: list.txt lines like  file 'a.mp4'
ffmpeg -f concat -safe 0 -i list.txt -c copy joined.mp4
# different sources: re-encode with the concat filter
ffmpeg -i a.mp4 -i b.mp4 -filter_complex "[0:v][0:a][1:v][1:a]concat=n=2:v=1:a=1[v][a]" -map "[v]" -map "[a]" out.mp4
# crossfade
ffmpeg -i a.mp4 -i b.mp4 -filter_complex "[0:v][1:v]xfade=transition=fade:duration=1:offset=4[v];[0:a][1:a]acrossfade=d=1[a]" -map "[v]" -map "[a]" out.mp4
```
(`offset` = duration of A minus the fade duration.)

## Delivery encodes
```bash
# YouTube / general H.264
ffmpeg -i in.mov -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -c:a aac -b:a 320k -ar 48000 -movflags +faststart out.mp4
# smaller H.265 (add -tag:v hvc1 for Apple playback)
ffmpeg -i in.mov -c:v libx265 -crf 22 -tag:v hvc1 -c:a aac -b:a 192k out_hevc.mp4
# mezzanine / editing master
ffmpeg -i in.mp4 -c:v prores_ks -profile:v 3 -c:a pcm_s16le master.mov
# web proxy
ffmpeg -i in.mp4 -vf scale=-2:720 -c:v libx264 -crf 28 -preset veryfast proxy.mp4
```
CRF guide (x264): 18 visually lossless, 23 default, 28 small. Always use `-pix_fmt yuv420p` for broad compatibility.

## Reframe for social
```bash
# 16:9 → 9:16 center crop
ffmpeg -i in.mp4 -vf "crop=ih*9/16:ih,scale=1080:1920" -c:a copy vertical.mp4
# 16:9 → 9:16 with blurred background fill
ffmpeg -i in.mp4 -filter_complex "[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=20[bg];[0:v]scale=1080:-2[fg];[bg][fg]overlay=(W-w)/2:(H-h)/2" -c:a copy vertical_blur.mp4
# letterbox/pad to exact size
ffmpeg -i in.mp4 -vf "scale=1080:1080:force_original_aspect_ratio=decrease,pad=1080:1080:(ow-iw)/2:(oh-ih)/2" square.mp4
```

## Audio
```bash
# loudness normalize (single pass; use two-pass for precision): -14 LUFS YouTube, -16 podcast, -23 EBU broadcast
ffmpeg -i in.mp4 -af loudnorm=I=-14:TP=-1.5:LRA=11 -c:v copy out.mp4
# measure loudness
ffmpeg -i in.mp4 -af ebur128=peak=true -f null -
# replace audio / extract audio
ffmpeg -i video.mp4 -i music.mp3 -map 0:v -map 1:a -c:v copy -shortest out.mp4
ffmpeg -i in.mp4 -vn -c:a pcm_s16le audio.wav
# duck music under voice (sidechain)
ffmpeg -i voice.wav -i music.wav -filter_complex "[1:a][0:a]sidechaincompress=threshold=0.05:ratio=8:attack=20:release=300[m];[0:a][m]amix=inputs=2:duration=first[a]" -map "[a]" mix.wav
# fades
ffmpeg -i in.mp4 -af "afade=t=in:d=1,afade=t=out:st=29:d=1" -vf "fade=t=in:d=0.5,fade=t=out:st=29.5:d=0.5" out.mp4
```

## Subtitles, text, overlays
```bash
ffmpeg -i in.mp4 -vf "subtitles=subs.srt:force_style='FontName=Inter,FontSize=18,Outline=2,MarginV=60'" burned.mp4   # burn in
ffmpeg -i in.mp4 -i subs.srt -c copy -c:s mov_text soft.mp4                     # soft subs (mp4)
ffmpeg -i in.mp4 -i logo.png -filter_complex "overlay=W-w-40:40" watermarked.mp4 # logo top-right
ffmpeg -i in.mp4 -vf "drawtext=text='Title':fontfile=Inter.ttf:fontsize=72:fontcolor=white:x=(w-tw)/2:y=h*0.8:enable='between(t,1,4)'" titled.mp4
```

## Speed, frames, GIFs, thumbnails
```bash
ffmpeg -i in.mp4 -vf "setpts=0.5*PTS" -af "atempo=2.0" fast.mp4                 # 2× speed
ffmpeg -i in.mp4 -vf fps=1 frames/f_%04d.png                                    # 1 frame/sec
ffmpeg -ss 00:00:10 -i in.mp4 -frames:v 1 -q:v 2 thumb.jpg                      # thumbnail
ffmpeg -i in.mp4 -vf "fps=15,scale=480:-1:flags=lanczos,split[a][b];[a]palettegen[p];[b][p]paletteuse" out.gif
ffmpeg -i in.mp4 -vf "select='gt(scene,0.4)',showinfo" -f null - 2>&1 | grep pts_time   # scene-cut times
ffmpeg -i in.mp4 -af silencedetect=noise=-35dB:d=0.5 -f null -                  # find silences (dead-air removal)
```

## Batch
```bash
for f in *.mov; do ffmpeg -n -i "$f" -c:v libx264 -crf 20 -pix_fmt yuv420p -c:a aac "${f%.mov}.mp4"; done
```

## Gotchas
- `-ss` before `-i` = fast seek. With `-c copy`, cuts snap to keyframes.
- `-c copy` can't be combined with filters on the same stream.
- Odd dimensions break yuv420p. Use `scale=-2:H`.
- Variable frame rate (phone/screen recordings) → conform with `-vf fps=30` or `-fps_mode cfr` before editing.
- Hardware encoders (`h264_nvenc`, `h264_videotoolbox`, `h264_qsv`) are fast but less efficient per bit than x264/x265.
- Quote filter graphs. Escape `:` and `'` inside `drawtext` text.
