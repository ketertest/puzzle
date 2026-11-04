# How to Add a Puzzle

Each puzzle is a movie-guessing round: 3 picture hints → audio hint → video hint → reveal → traits question.

## 1. Create the puzzle folder

Inside `puzzles/`, create a new folder for the movie, e.g. `puzzles/frozen/`. Name it anything — guests never see the folder name, only a generic "Puzzle N" label.

## 2. Add the required files

Put these files inside the folder, named **exactly** like this (case-sensitive):

| File | Purpose | Allowed extensions |
|---|---|---|
| `pic_0` | Guess slide 1 | `.jpeg`, `.jpg`, `.png` |
| `pic_1` | Guess slide 2 | `.jpeg`, `.jpg`, `.png` |
| `pic_2` | Guess slide 3 | `.jpeg`, `.jpg`, `.png` |
| `audio.mp3` | Audio hint | `.mp3` |
| `video.mp4` | Video hint | `.mp4` (H.264 video + AAC audio) |
| `title_card` | Reveal image | `.jpeg`, `.jpg`, `.png` |

`pic_3` / `pic_4` are not used by the app — fine to leave extra images in the folder if you have them, but not required.

## 3. Extracting audio/video clips from a YouTube video

If your audio or video hint comes from a specific moment in a YouTube video, use `yt-dlp` to pull just that section. Requires `yt-dlp` installed (`brew install yt-dlp`).

**Audio clip (MP3):**
```bash
yt-dlp -x --audio-format mp3 --download-sections "*START-END" "https://youtu.be/VIDEO_ID" -o audio.mp3
```

**Video clip (MP4):**
```bash
yt-dlp --download-sections "*START-END" "https://youtu.be/VIDEO_ID" --recode-video mp4 -o video.mp4
```

- `START` and `END` are timestamps in `HH:MM:SS` format, matching the moment in the source video.
- Example — extracting `01:07:12` to `01:07:23` as the audio hint, and `02:09:20` to `02:09:42` as the video hint, from the same source video:
  ```bash
  yt-dlp -x --audio-format mp3 --download-sections "*01:07:12-01:07:23" "https://youtu.be/qIYziJAhgP0" -o audio.mp3
  yt-dlp --download-sections "*02:09:20-02:09:42" "https://youtu.be/qIYziJAhgP0" --recode-video mp4 -o video.mp4
  ```
- Run these from inside the puzzle's folder (or move the output files there afterward) so they land as `audio.mp3` / `video.mp4` in the right place.
- Pick a video clip that's short and clearly recognizable — a few seconds is usually plenty.

## 4. Register the puzzle in the menu

Open `manifest.json` in a text editor and add your new folder name to the `puzzles` list:

```json
{
  "puzzles": [
    "_test",
    "ram_sita",
    "achievers",
    "oscar",
    "frozen"
  ]
}
```

Save, then refresh the browser tab. A new "Puzzle N" button appears on the menu, in the order listed.

## 5. Troubleshooting

- **Menu is empty / says "No puzzles found"** — check `manifest.json` is valid JSON (commas between entries, no trailing comma on the last one) and that the folder names listed actually exist under `puzzles/`.
- **An image/audio/video won't load** — a red banner will say which file. Double check the base filename is exactly right and the extension is lowercase.
- **Video won't play** — make sure it's a standard `.mp4` (H.264 video + AAC audio); `yt-dlp --recode-video mp4` handles this automatically.

## Before the real event

Remove the `_test` puzzle's folder under `puzzles/` and its entry in `manifest.json` so it doesn't show up as a stray "Puzzle" button.
