# Benmark Diaz — Portfolio v2

Three ways to view the same portfolio, switchable live from the Main Menu
(bottom-right floating button → **Viewing Portfolio**):

- **Signature** — the animated experience. Preloader, a 4-tab About hub
  (About / Works / Social / Visuals), Experience timeline, scrolling Recent
  Works, and a closing footer.
- **Minimalist** — clean, single-column, light/dark toggle, Selected Work,
  Experience, and a Stack section split into Daily Driver vs Occasional.
- **Legacy** — reserved slot for your original portfolio. Currently a
  placeholder; see "Adding the Legacy portfolio" below.

The **Main Menu** (same floating button) is global across all three themes:
Book a Meeting, Speed Test, Typing Test, Ask Anything, plus the mode
switcher and Back to Top.

## 1. Install & run

```bash
npm install
npm run dev
```

Open the printed localhost URL. `npm run build` produces a production
build in `dist/`.

## 2. Edit your content in ONE place

Everything — your name, bio, experience, projects, certificates, socials,
and stack — lives in:

```
src/lib/portfolioData.js
```

Add a new project, cert, or timeline entry by pushing a new object into the
matching array. Every theme and tab reads from this same file, so nothing
gets out of sync and adding one more entry never breaks the layout.

## 3. Add your images

Drop files into `public/images/` and reference them as `/images/filename.png`
in `portfolioData.js`. Already bundled:

- `ss1.png`, `ss2.png`, `ss3.png` — CampusPark screenshots (used in the
  Works tab gallery and Visuals tab fallback)

Still needed from you:
- `/images/campuspark.png` — CampusPark's card thumbnail
- Anything you want to show in the Visuals tab (`VISUALS` array in
  `portfolioData.js`)
- Your resume PDF at `public/documents/Benmark-Diaz-CV.pdf` (path is set
  in `PROFILE.resume`)

## 4. Backend endpoints (contact form + Ask Anything)

Both the Social tab's contact form and the Ask Anything chat call a
backend you control — this keeps any API keys off the client. Copy
`.env.example` to `.env` and point these at your server:

```
VITE_CONTACT_API_URL=...
VITE_ASK_API_URL=...
```

`server/ask.example.js` is a ready-to-mount Express route for Ask Anything
using the Anthropic SDK — plug it into whatever backend already serves
your contact form. Full setup notes are in that file's header comment.

## 5. Speed Test

Runs a real, keyless speed test against M-Lab's open NDT7 network (the
same measurement infrastructure real speed-test tools use) — no API key,
no third-party tracking. Implementation: `src/lib/ndt7.js`.

## 6. Adding the Legacy portfolio

When you're ready to attach your first portfolio:

1. Drop its files into `src/components/legacy/original/`
2. Replace the contents of `src/components/legacy/LegacyTheme.jsx` with a
   component that renders those files (or import and render them directly
   if they're already React components)
3. Everything else — the Main Menu, mode switcher, dark mode — keeps
   working around it automatically since Legacy is just another mode.

## Theme

Black / white / blue throughout — `ink` (near-black), `paper` (near-white),
and `signal` (electric blue accent) in `tailwind.config.js`. Adjust the
exact hex values there if you want to match a specific reference image.
