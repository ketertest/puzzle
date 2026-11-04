# Guess the Movie! 🎬

A simple party game for the gender reveal event. One shared screen/TV, host clicks through, guests shout out guesses in person — nothing is typed into the app.

## How to run it

1. Open Terminal.
2. Run:
   ```
   cd /Users/ramteja/work/gender_reveal_event
   python3 -m http.server 8000
   ```
3. Open **http://localhost:8000** in Chrome or Safari.

**Important:** Do NOT just double-click `index.html`. The app needs to be loaded through that `http://localhost:8000` address or the puzzle list won't load (browsers block local file access needed for that).

## How to stop it

Go back to the Terminal window and press `Ctrl+C`.

## How to add a new puzzle

1. Inside the `puzzles/` folder, create a new folder for the movie, e.g. `puzzles/frozen/`. Name it anything you like — guests never see the folder name.
2. Put these 8 files inside it, named exactly like this (image files can be `.jpeg`, `.jpg`, or `.png` — mix and match freely, the app checks all three):
   - `pic_0`, `pic_1`, `pic_2` — the 3 guess slides
   - `pic_3`, `pic_4` — not used by the app, fine to leave in the folder
   - `audio.mp3` — the audio hint
   - `video.mp4` — the video hint
   - `title_card` — the reveal image shown at the end
3. Open `manifest.json` in any text editor. Add your new folder name to the list, for example:
   ```json
   {
     "puzzles": [
       "shrek",
       "frozen"
     ]
   }
   ```
4. Save, then refresh the browser tab. A new "Puzzle 2" (etc.) button appears on the menu, in the order listed.

The menu only ever shows generic labels ("Puzzle 1", "Puzzle 2", ...) — never the folder name — so there's no spoiler risk no matter what you name the folders.

## Host cheat-sheet (on-screen buttons)

- **⬅ Back** — go back one step (undoes a misclick, or returns from Reveal to wherever you skipped from).
- **🏠 Menu** — bail out to the puzzle menu at any time, from anywhere.
- **⏭ Skip to Reveal** — the guest got it right! Jump straight to the answer, skipping the rest of the hints.
- **Next ➡** — move forward one step in the sequence (Guess 1 → 2 → 3 → Audio → Video → Reveal → Traits).
- **✅ Finish** — on the last (traits) page, finish this puzzle and return to the menu for the next guest.

Game order per puzzle: **3 picture guesses → audio hint → video hint → reveal → "what traits would you want?" question.**

## Troubleshooting

- **Menu is empty / says "No puzzles found"** — check `manifest.json` is valid JSON (commas between entries, no trailing comma on the last one) and that the folder names listed actually exist under `puzzles/`.
- **An image/audio/video won't load** — a red banner will say which file. Double check the base filename is exactly right (case-sensitive, e.g. `pic_0`/`title_card`) and that its extension is lowercase `.jpeg`, `.jpg`, or `.png`.
- **Video won't play** — make sure it's a standard `.mp4` (H.264 video + AAC audio), which is what phones and most video editors export by default.
- **Page looks unstyled / broken** — make sure you started the server with `python3 -m http.server 8000` from inside the `gender_reveal_event` folder, and that you're visiting `http://localhost:8000` (not opening the file directly).

## Before the real event

A `_test` puzzle may be included for trying things out — remove its folder under `puzzles/` and its entry in `manifest.json` before guests arrive, so it doesn't show up as a stray "Puzzle" button.
