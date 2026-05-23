# Handoff - Monash Presentation Flow

## Scope Completed
- Added two new opening slides to `presentation.html`:
1. `legacy-reference` (blank-style image slide using your provided screenshot).
2. `transition-open` (short opening animation that reveals the redesigned experience).
- Existing guided/live slides continue after these two slides.

## Files Touched
- `C:\Users\erhse\Documents\CODE\cyberPage\presentation.html`
- `C:\Users\erhse\Documents\CODE\cyberPage\HANDOFF_PRESENTATION.md` (this file)

## New Slide Behavior
- Slide 1 (`legacy-reference`):
  - Shows only the image overlay in a neutral frame.
  - Image source is now repo-local:
    - `./assets/legacy-password-page.png`
- Slide 2 (`transition-open`):
  - Plays a subtle curtain/card intro animation.
  - Then the standard live presentation flow starts.

## Rendering Modes Introduced
Each slide now supports a mode:
- `mode: "media"` -> full image overlay.
- `mode: "transition"` -> animated intro overlay.
- `mode: "live"` (default/legacy behavior) -> iframe + spotlight/callouts/notes.

## Save System Status
- Save pipeline remains the same as current implementation:
  - Draft save to `localStorage`
  - File save via `POST /__save-presentation-state` to `server.js`
- These new two slides do not add editable callout/spotlight state by default.

## Important Notes for Next Model
1. If image does not show in some environments:
   - Replace `media.src` in `defaultSlides` with a project-relative asset path (recommended).
   - Example: move image to `./assets/legacy-page.png` and set `src: './assets/legacy-page.png'`.
2. If animation should wait for click (instead of auto-hide):
   - Remove the `setTimeout` in `render()` for `transition-open` and toggle class on Next.
3. If you want editable text on intro card:
   - Add editable fields in `#introAnimation .intro-card` and persist via slide state.

## Quick Run
From project root:
```powershell
node .\server.js
```
Open:
- `http://localhost:3000/presentation.html`
- `http://localhost:3000/`

## Suggested Next Enhancements
- Add one optional text caption under the first image slide (`contenteditable`) for presenter notes.
- Add a slide-level toggle for "auto-play transition" vs "manual".
- Move media assets into repo folder for portability across machines.
