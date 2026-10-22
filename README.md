# Bitzy — Your Number System Bestie & CS Study Guide

> *"Tiny bits, big numbers — you've got this, bestie!"*

Bitzy is a cute, highly interactive number system converter and study companion built specifically to make Computer Science fundamentals fun, tactile, and stress-free. Whether you're learning binary for your first CS midterm, practicing two's complement, or speed-running hex conversions, Bitzy has your back!

---

## Twilight Beach Sunset Color Palette

Bitzy features a soothing, modern color palette inspired by an evening twilight sunset over the ocean:

| Color | Hex | Role |
| :--- | :--- | :--- |
| **Night Charcoal** | `#18181B` | High-contrast text & dark mode depth |
| **Deep Oceanic Teal** | `#0E5B6A` | Primary interactive accents & binary base |
| **Dusk Plum / Violet** | `#573F5A` | Secondary headers & decimal base |
| **Muted Mauve Slate** | `#81697E` | Step-by-step borders, octal base, & badges |
| **Twilight Sunset Rose** | `#B7687C` | Highlights, buttons, streak badges, & hex base |
| **Soft Dawn Blush Pink** | `#F4C7CB` | Light mode tint, speech bubbles, & mascot blush |

---

## App Architecture

Bitzy is now a **focused four-page study system**. The landing page is deliberately trimmed to just the **Live Base Converter**, with every other tool reachable from the top navigation bar and **all trivia delivered by the Easter Fairy Chick**.

| Path | Page | Description |
| :--- | :--- | :--- |
| `index.html` | **Live Base Converter** | The home page: instant, as-you-type conversion across Bases 2–36 with a "Show me how Bitzy did it" step breakdown, toast notifications, and trivia spoken by the Fairy Chick (on each conversion and every 10 seconds while she is revealed). |
| `register.html` | **8-Bit Register Playground** | Interactive visual bit-flipper ($b_7$ to $b_0$), High/Low nibbles, signed two's complement sign-bit, and live formula sum. |
| `cheatsheet.html` | **Exam Cheat Sheet & CS Hacks** | Segmented-tab reference: searchable Powers of 2 lookup ($2^0$ to $2^{16}$) with 1-click copy, an 8-column nibble decoder grid, and 4 legendary exam shortcuts. |
| `ascii.html` | **ASCII Character Lab** | 7-bit ASCII decimal-to-character interactive laboratory with quick high-yield example chips. |

---

## Student Goods & Study Features

### 1. Live Base Converter (Home Page)
- **Instant Conversion**: Converts as you type across Bases 2, 8, 10, and 16 with a dedicated result pane.
- **Step Breakdown**: Hit *"Show me how Bitzy did it"* to see the full equation, the per-digit weighting, and the repeated-division table.
- **Toast Notifications**: Every conversion, invalid digit, hint and achievement is reported in a colour-coded toast notification at the top centre of the screen - no inline status lines anywhere. Repeated feedback reuses the same toast instead of stacking duplicates.
- **Fairy Chick Trivia**: Every conversion makes the Easter Fairy Chick pop up a computing-history fact in her speech bubble (why 255 is a byte, why octal groups 3 bits, why base-20 exists, and more), and while she is revealed she rotates in a fresh fact every 10 seconds. She waits for you to pause typing so her bubble never flickers.
- **Base Palette**: The toast accents and colours shift to match the base you are working in.

### 2. 8-Bit Register Playground (Visual Bit Flipper)
- **Unified Bit Strip**: All 8 toggles ($b_7$ down to $b_0$) sit in one compact panel, split by a hairline into **High Nibble** (Bits 7–4) and **Low Nibble** (Bits 3–0) so you intuitively understand how hexadecimal digits map to binary. On phones the strip reflows into two tappable rows of 4.
- **Live Equation Builder**: Displays the exact summation formula in real-time (e.g. $128 + 32 + 8 + 1 = 169$).
- **Single Readout Panel**: One hairline-separated strip shows Unsigned Decimal ($0–255$), Signed Two's Complement ($-128$ to $+127$, with a sign badge), Hexadecimal (`0x00`–`0xFF`, with the high/low nibble split), Octal, and ASCII preview.
- **Icon-Only Action Rail**: Clear, Set All, Invert (~NOT), Shift Left, Shift Right, Random, and **Send to Converter** — compact 38px buttons so the panel stays quiet.
- **Cross-Page Redirection**: Click **"Send to Converter"** to push your custom register byte to `index.html` with full step-by-step math!
- **Rotating Concept Cards**: The **"How Computer Registers Work"** guide shows **one card at a time** and auto-advances every 7 seconds, so the page never dumps every concept on you at once. Prev/next arrows and clickable dots sit under the card, and a **pause/resume toggle lives beside the "CS Theory" badge** in the section header. It pauses while you hover, focus a control, or switch tabs, and respects `prefers-reduced-motion`.

### 3. Student Exam Cheat Sheet & CS Hacks
- **Segmented Section Tabs**: One compact pill control switches between **Powers of 2**, **Hex Nibbles**, and **Exam Hacks** — no page reload, no clutter.
- **Powers of 2 Table ($2^0$ to $2^{16}$)**: Searchable reference table with decimal values, hex equivalents, and real-world CS memory usage (1 Byte, 1 KiB, 4 KiB OS page, 64 KiB port range).
- **1-Click Copy**: Tap the **Common CS Usage** chip in any row to copy that usage note to your clipboard, so the table needs no extra column or icon.
- **4-Bit Hex Nibble Grid**: A tight 2×8 decoder grid connecting binary `0000`–`1111` to hex `0`–`F`; click a tile to copy its binary.
- **Professor Bitzy's Exam Shortcuts**: One numbered list panel, four shortcuts.
  - *The 4-Bit Chunking Magic*: Convert binary to hex in seconds without division.
  - *The Two's Complement 3-Second Rule*: Keep bits from the right up to the first `1`, invert the rest!
  - *Instant Even/Odd Rule*: Check the least significant bit ($2^0$).
  - *Prefix Guide*: `0b` (binary), `0o` (octal), `0x` (hex).

### 4. ASCII Character Lab
- **Two-Way Decoder**: Type a decimal code point (0–127) or type a character — Bitzy resolves the other side instantly.
- **Bit-Level Readouts**: Every character shows its 8-bit binary form and its hexadecimal form side by side.
- **Control Character Names**: The full 0–127 table with friendly names (NUL, SOH, LF, CR, DEL, …).
- **Quick High-Yield Examples**: One-click chips for `A = 65`, `a = 97`, `0 = 48`, `Space = 32`, and `! = 33`.

---

### 5. Easter Fairy Chick Companion
She is the **only voice of the app** — all trivia, study tips and blessings are spoken by her, never by a separate panel.
- An adorable, floating chibi Easter Fairy Chick that hovers at the bottom-right corner of every page.
- **"Hover to show Fairy"**: she stays tucked away until you move your cursor over her (or focus her with the keyboard), so she never blocks your work. Once shown, she **lingers for one minute** (each fresh hover restarts the minute), then tucks herself away; minimizing keeps her hidden even on hover. She is a hover reveal only — the chick herself is not clickable, and the **"Hover to show Fairy"** prompt hides the moment your cursor reaches her.
- Featuring glowing fairy wings, a flower crown, and a sparkling star wand.
- **The trivia speaker**: her bubble pops open with a fresh fact every time you convert a number, and while she is revealed a new trivia fact **rotates every 10 seconds** (with a little bulb icon and a sparkle shower). The rotation is skipped while she is minimized, while she is tucked away, or while the tab is in the background, and it never interrupts a study blessing.
- Use the little pill button under her (the only control she has) to minimize or bring her back for distraction-free focus; a study blessing greets you when she returns.
- Can be minimized anytime for distraction-free focus — and if she is minimized, trivia falls back to a toast so no fact is ever lost.

---

## Icon System

Every emoji has been replaced with a hand-picked **inline SVG icon set** (`js/icons.js`):

- **Zero dependencies**: no icon font, no CDN, no network request — the sprite is inlined at runtime.
- **Theme aware**: every icon inherits `currentColor`, so it re-tints automatically in light and dark mode.
- **Crisp at any size**: vector paths scale perfectly from a 16px table button to a 40px section heading.
- **Accessible**: icons are marked `aria-hidden="true"` and always sit next to real text labels.

---

## How to Run

Bitzy is 100% static client-side web technology — no installation, no node dependencies, no backend, and completely private (works offline):

1. Clone or download this repository.
2. Open `index.html` in any modern web browser.
3. Use the navigation bar at the top to move between the **Converter**, **8-Bit Register**, **Cheat Sheet**, and **ASCII Lab**!

---

## Project Structure

```
/ (repository root)
├── index.html          # Live Base Converter (home page)
├── register.html       # 8-Bit Visual Register Playground
├── cheatsheet.html     # Student Exam Cheat Sheet & CS Hacks
├── ascii.html          # 7-Bit ASCII Character Lab
├── assets/
│   └── fairy_chick.png # Official Easter Fairy Chick asset
├── css/
│   └── style.css       # Twilight Sunset palette, SVG icon system & responsive design
└── js/
    ├── icons.js        # Inline SVG icon sprite & helper
    ├── feedback.js     # Toast notification engine
    ├── app.js          # Core wiring, base conversions, ASCII decoding, & theme
    ├── converter.js    # Pure mathematical conversion & step explanation engine
    ├── fairy.js        # The Easter Fairy Chick: the only voice for trivia & blessings
    ├── student.js      # 8-Bit Register, Exam Cheat Sheet & rotating concept carousel
    └── trivia.js       # Context-aware computing history & number trivia picker
```

---

## Why Students Love Bitzy

- **Focused by Design**: The home page does two things brilliantly — convert and teach — with no duplicated tool listings.
- **Zero Judgment**: Made a typo? Bitzy explains exactly what went wrong without any penalty.
- **Visual Intuition**: Turn abstract binary formulas into interactive buttons you can click and experiment with.
- **Dark Mode Included**: Easy on tired eyes during late-night study sessions.
- **Completely Private**: Everything runs locally in your browser — no tracking, no ads, no sign-ups.

---

## License

MIT License. Built with love for students everywhere.

*Tiny bits, big numbers.*
