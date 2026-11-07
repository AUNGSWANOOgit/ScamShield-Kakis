# SafeSeniors SG — Community-Based Deepfake Awareness Platform for Seniors

**Stay Sharp. Stay Safe. Learn Together.**

An interactive, frontend-only demo for a university innovation project. It helps seniors in Singapore practise recognising deepfakes, suspicious content and scams through short lessons, realistic (fictional) decision exercises, community groups, and shareable greeting-style stickers.

> **Demo, not a production app.** No backend, accounts, database, external APIs or API keys. Everything runs in the browser, progress is saved in `localStorage`, and all people, groups, messages and reports are fictional or simulated.

---

## Features

| Area | What works |
|---|---|
| Welcome & onboarding | Nickname + avatar (stored locally), or one-tap preconfigured demo profile "Auntie Mary" |
| Home dashboard | Greeting, points, streak, stickers, lessons, group, today's challenge, recommended lesson, weekly challenge |
| Learn | 3 lessons × 4 cards (swipe or Next) + 3-question quiz with instant explanations, completion screen, points |
| Identify & Decide | 12 fictional scenarios (voice-note impersonation, celebrity deepfake ad, fake officer video call, AI image, OTP takeover, investment group, **genuine** messages and **ambiguous** ones). Step 1 "How does this look?", step 2 "What would you do?", then safe/okay/unsafe feedback, warning signs, key lesson, points. Completion celebration after all 12. |
| Report (simulated) | Paste text/link, category, reasons, example loader, local personal-info warning, simulated status history (Submitted → Under Review → Reviewed). Nothing is fetched, opened or transmitted. No points for reports. Links to real ScamShield/Police resources, kept separate. |
| Community | Join one of 3 fictional groups, group total + milestone progress, your contribution, 4 weekly group challenges, helpers list, leaderboard, simulated referral code and invite |
| Rewards | 16 original greeting-image stickers (Daily Greetings, Achievements, Community) with rarity, criteria, locked/unlocked states, celebration animation, **PNG download**, **Web Share API** (phone share sheet with the PNG), WhatsApp/Telegram attach instructions fallback, copy greeting |
| Progress & Profile | Points-per-day chart, quiz accuracy, decision breakdown, lessons, badges, stickers; edit nickname/avatar, text size (3 levels), English/简体中文, presenter tools, reset |
| Guided Demo Mode | 7-step presenter journey (~2–3 min) with automatic step ticking, highlights, "Go there" and "Why this matters" tips; restart any time |
| About the Project | STEM, Business/Governance, Social Sciences lenses; real vs simulated features; no effectiveness claims (pilot needed) |

### Elderly-friendly design
- Large text by default (18 px base) with a one-tap **AA** button to cycle Standard / Large / Extra large; the smallest text in the app is about 15–17 px.
- High-contrast navy-on-white text, large rounded buttons with icons *and* words, and plain language with no jargon.
- **Listen** buttons read lessons, quiz questions, scenarios and feedback aloud (browser speech, slower rate, works offline on most phones).
- A short **"How to use this app"** guide opens automatically on first visit and is always one tap away on Home.
- No time limits; no hidden sideways-scrolling lists; "Exit" buttons are labelled and confirm before leaving a lesson.
- Messages stay on screen for 7 seconds (tap to dismiss) and wait until a sticker celebration is closed.
- English / 简体中文 interface switch; bilingual stickers.

### Greeting-style stickers
The stickers copy the *style* of the "早安 / Good Morning" images seniors already forward in family chats: a big blossom (sunflower, peony, orchid, lotus, plum blossom…) on a soft bokeh background, a bright yellow Chinese headline, an English script line, a wish, a blessing with emoji, and the user's **community group name as a watermark**. Each sticker also carries a short anti-scam tip (e.g. "Never share your OTP with anyone"), so every forwarded greeting spreads a safety message. All artwork is generated in code (`src/utils/stickerArt.ts`), with no photos or third-party images.

### Phone support
Mobile-first and tested on emulated iPhone (390×844) and small Android (360×740) with touch:
- Bottom navigation sized for thumbs and padded for the iPhone home bar (`safe-area-inset`); sidebar navigation on laptops.
- No sideways scrolling on any page, including with Extra-large text and Chinese.
- Tap targets ≥ 40 px; form inputs ≥ 16 px so iOS doesn't zoom in.
- Dialogs open as bottom sheets on phones.
- Sticker **Share** uses the phone's native share sheet (PNG pre-rendered so iOS Safari allows it); otherwise the PNG downloads with attach instructions.
- Guided Demo collapses to a one-line bar on phones so it never hides the app.
- Built for older phones too (iOS 14 Safari / Chrome 87 targets, no regex lookbehind).

---

## Points rules (centralised in `src/services/scoring.ts`)

| Activity | Points | Repeat rule |
|---|---|---|
| Complete a lesson | +20 | First completion only |
| Correct lesson quiz answer | +10 each | First completion only |
| Identify scenario | +10 safe / +5 okay / 0 unsafe | First answer only (replays are practice) |
| Daily challenge (1 lesson + 1 Identify answer, same day) | +30 | Once per day, resets at local midnight |
| Weekly group challenge | +50 each | Once per week each, resets Monday |
| Demo report | 0 | Never — content is unverified |

Each completed daily challenge unlocks the next Daily Greeting sticker (Good Morning Monday → … → Have a Blessed Weekend). Sticker unlock rules are in `src/services/stickerRules.ts`.

All statistics (points, streak, group totals, weekly progress) are **derived** from a single points ledger and activity log, so every screen stays consistent.

---

## Run locally

Requirements: Node.js 20+ (22 recommended).

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # unit tests for the game engine (Vitest)
npm run build      # type-check + production build into dist/
npm run preview    # serve the production build
```

To try it on your own phone during development, run `npm run dev -- --host` and open the "Network" URL on a phone connected to the same Wi-Fi.

---

## Deploy to GitHub Pages

The project is already configured:
- `vite.config.ts` uses a **relative base (`./`)**, so assets load from any repository sub-path (`https://<user>.github.io/<repo>/`) without editing anything.
- **HashRouter** (`/#/home`) means refreshing any page never returns a 404 on static hosting.
- `.github/workflows/deploy.yml` installs, tests, builds and deploys automatically on every push to `main`.

### Steps
1. Create a new repository on GitHub (public, or private on a plan that supports Pages).
2. Push this folder:
   ```bash
   git init
   git add .
   git commit -m "SafeSeniors SG demo"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```
3. On GitHub open **Settings → Pages**. Under **Build and deployment → Source**, choose **GitHub Actions**.
4. Open the **Actions** tab. The "Deploy to GitHub Pages" workflow runs (re-run it if it started before step 3). When it is green, your site is live at
   `https://<your-username>.github.io/<repo-name>/`.

No secrets or environment variables are needed. Optional: to force an absolute base path, build with `VITE_BASE=/<repo-name>/ npm run build`.

---

## Using Guided Demo Mode (for presentations)

1. Open the site and tap **Presentation Demo** (welcome screen, top bar, or Profile → Presenter tools).
   This loads the fresh "Auntie Mary" profile: 70 points, Lesson 1 done, Tampines group joined, *Good Morning Monday* still locked.
2. Follow the panel (bottom-right on laptops, one-line bar on phones — tap ▲ for details). You do every tap yourself; steps tick off automatically:
   1. **Open the dashboard** — greeting, points, streak, today's challenge.
   2. **Complete a short lesson** — Learn → Lesson 2 → 4 cards → 3-question quiz. *(+50 → 120 pts, unlocks Rising Star)*
   3. **Answer an Identify question** — e.g. the "grandson" voice note → "Looks suspicious" → "Call Wei Jie on his OLD saved number".
   4. **Earn points** — shown in the toast and top bar.
   5. **Unlock Good Morning Monday** — lesson + Identify answer today completes the daily challenge. *(160 pts)*
   6. **Download or share the sticker** — Rewards → sticker → Share (phone) / Download PNG (laptop).
   7. **View community progress** — Tampines group total moves to 1,940 / 2,000.
3. Use **Go there** to jump to the right screen and **Why this matters** for talking points. **Restart** reloads fresh demo data.

Presenter extras (Profile → Presenter tools): **Simulate next day** to show daily resets and the next greeting sticker; Report page has "Simulate next review step".

**Reset:** Profile → Reset Demo clears everything on that device.

---

## Project structure

```
src/
  components/   Layout (top bar, bottom/side nav), GuidedDemoPanel, Celebration & toasts,
                StickerShareModal, ScenarioView (phone mock-ups), Avatar, Illustration, ui
  pages/        Welcome, Onboarding, Home, Learn, Lesson, Identify, Report,
                Community, Rewards, Progress, Profile, About
  data/         lessons, scenarios, stickers, community (groups + weekly challenges), avatars, demoSteps
  services/     engine (pure game logic), scoring (points rules), selectors (derived stats),
                stickerRules, stickerExport (PNG/share/clipboard), storage (localStorage)
  context/      AppContext (state, actions, toasts, celebrations, guided demo)
  i18n/         translations (English + Simplified Chinese core UI)
  utils/        time helpers, stickerArt (original SVG sticker generator)
  types/        shared TypeScript types
e2e/journey.py  Playwright acceptance test (phones + laptop)
```

## Testing

- `npm test` — Vitest unit tests for scoring, daily/weekly challenges, stickers, community contributions, reports and the guided-demo data path.
- `e2e/journey.py` — Playwright end-to-end test of every acceptance criterion on an emulated iPhone, a small Android phone and a laptop, against the built site served from a sub-path (like GitHub Pages). It also checks for sideways scrolling, tap-target size, PNG download validity, the Web Share API path, persistence after refresh, text size, Chinese UI and reset. Run instructions are at the top of the file.

## Responsible design notes
- Teaches **safe decision-making** (pause, verify, report), and states clearly that visual inspection cannot reliably detect all AI-generated content.
- Includes genuine and ambiguous examples, so users don't learn to fear every message.
- No "AI verified" claims; reports are never auto-labelled or rewarded.
- Community copy is collaborative — no "last place" shaming.
- Official resources (ScamShield Helpline 1799, scamshield.gov.sg, Police Hotline 1800-255-0000, i-Witness, 999) are shown separately from the simulation.
- Effectiveness is **not** claimed; it would need evaluation through a pilot with seniors.
