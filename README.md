# PetFlow – A Little Friend While You Work

Developer: Y Pengly. Web + Windows desktop virtual pet companion. No accounts, no login.

## Features
12 distinct animated pets, floating interaction menu with speech bubbles, drag, Follow Mouse, autonomous behavior with cooldowns, clock and calendar, Open-Meteo weather with pet reactions, countdown and Pomodoro (timestamp-accurate), settings with local persistence and a privacy section, and a native Tauri 2 desktop overlay.

## Web development
1. Install Node.js 20+.
2. `npm install`
3. `npm run dev` → http://localhost:1420
4. `npm test` and `npm run build`

## Windows desktop build
Prerequisites: Node 20+, Rust (https://rustup.rs), Microsoft C++ Build Tools (Desktop development with C++), WebView2 (preinstalled on Windows 11).
1. `npm install`
2. `npx tauri icon app-icon.png` (only if `src-tauri/icons` is missing)
3. `npm run tauri dev` to try it, `npm run tauri build` for installers in `src-tauri/target/release/bundle/` (NSIS .exe and .msi).
Or push a `v*` tag / run the **Build Windows installer** GitHub Action.

## How the desktop overlay works
`start_overlay` opens a small transparent, undecorated, always-on-top window (`?overlay=1`). It grows while a menu or panel is open so empty areas never block your clicks. Drag it anywhere, including across monitors. Settings: always on top, click-through, start with Windows, restore on restart. Closing the main window minimizes it while the pet runs.

## Structure
- `src/shared/` pet types, registry, state machine, autonomy, timer, pomodoro, weather, store
- `src/components/`, `src/pages/` web rendering layer
- `src-tauri/` Rust desktop layer
- `assets/pets/` reserved for future sprite-sheet art; current pets are vector SVG with CSS animation

## Known limitations
- The Rust code and Windows installer have not been compiled or tested by the author of this package; first build on Windows may need small fixes.
- No screenshots are included; run the app to capture them.
- Pets use code-drawn vector art rather than hand-drawn sprite sheets.
- Donation link, QR code and social links on the Support page are placeholders.
