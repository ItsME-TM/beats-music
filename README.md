<div align="center">
  <a href="https://beats-music-nu.vercel.app/">
    <img src="public/icons/beats-logo.svg" alt="Beats Music Logo" width="100" />
  </a>

  # Beats Music

  **The Multi‑Universal Music Playlist**

  <p>
    Modern music experience built with <strong>Next.js 15</strong>, <strong>React 19</strong>, <strong>Firebase Auth</strong>, and <strong>TailwindCSS 4</strong>.
  </p>

  <br />

  <a href="https://beats-music-nu.vercel.app/"><strong>➥ 🌐 Live Demo</strong></a>
</div>

---

## ✨ Overview

Beats Music is an in‑progress streaming / playlist style interface. Users can:

- Register / Login with email & password
- Sign in with Google (Firebase Authentication)
- Persist sessions ("Remember me" vs session only)
- View a personalized home experience (after auth redirect)
- Interact with a rich lyric‑aware Song Player (play / pause / seek / like / repeat / shuffle simulation)
- Manage (placeholder) playlist actions (Add to playlist button component)

> NOTE: Audio search, real playlist persistence, and backend catalog APIs are not yet implemented—current player supports static sample media/lyrics. Contributions welcome.

---

## 🧱 Tech Stack

| Layer     | Tech                                                       |
| --------- | ---------------------------------------------------------- |
| Framework | Next.js 15 (App Router)                                    |
| Language  | TypeScript 5                                               |
| UI        | React 19 + TailwindCSS 4 (with PostCSS + Autoprefixer)     |
| Auth      | Firebase Authentication (Email/Password + Google Provider) |
| Fonts     | Geist Sans / Geist Mono via `next/font`                    |
| UX        | `nextjs-toploader` progress bar                            |
| Icons     | `react-icons`                                              |

---

## 📂 Project Structure (trimmed)

```
src/
	app/
		layout.tsx           # Root layout: fonts, AuthProvider, top loader, chrome wrappers
		page.tsx             # Redirects to /login
		firebase.ts          # Firebase initialization & auth exports
		login/               # Login page (email/password + Google)
		register/            # Registration page
		home/                # Post‑login landing
		songPlay/            # Song playback UI page
		searchSong/          # (Planned search UI)
	components/
		layout/              # Header, Sidebar, MobileNav wrappers & components
		ui/                  # Generic UI components (Buttons, Inputs, Icons, Popups)
		SongPlayer.tsx       # Lyric aware custom player component
		...
	providers/
		AuthProvider.tsx     # Context wrapper for Firebase user
	hooks/
		useAuth.ts           # Authentication hook
		useAudioPlayer.ts    # Audio player logic hook
	assets/ (svg art)
public/
	audio/                 # Sample audio assets
	images/                # Covers, artist images, UI illustrations
	icons/                 # Brand + social icons
```

---

## 🔐 Authentication Flow

- `AuthProvider` listens to `onAuthStateChanged` and supplies `User | null` via context.
- Unauthenticated root (`/`) immediately redirects to `/login`.
- Login supports:
  - Email / password with optional persistent session (local vs session storage)
  - Google OAuth popup via `GoogleAuthProvider`
- Register page adds display name via `updateProfile`.
- Basic client side error handling (wrong password, user not found, email in use).

---

## 🎵 Song Player Highlights (`SongPlayer.tsx`)

- Local or provided audio source support (HTMLAudio element abstraction)
- Simulated timing fallback when no `audioSrc` (uses interval + lyric timestamps)
- Highlighted current lyric window with sliding focus
- Controls: play/pause, skip prev/next (callbacks), shuffle (UI state), repeat (off / one), like toggle, progress seeking
- Extensible: pass `lyrics`, `audioSrc`, `onAddToPlaylist`, navigation callbacks

---

## 🚀 Getting Started

### 1. Clone & Install

```bash
git clone <your-fork-url> beats-music
cd beats-music
npm install
```

### 2. Environment Variables

Create a `.env.local` in the project root:

```
NEXT_PUBLIC_FIREBASE_API_KEY=xxxxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxxxx.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=xxxxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=xxxxx.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxxxx
NEXT_PUBLIC_FIREBASE_APP_ID=1:xxxx:web:xxxx
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-xxxx
```

Obtain these from your Firebase project settings (Web App config). All are exposed as `NEXT_PUBLIC_` because used on client.

### 3. Run Dev Server

```bash
npm run dev
```

Visit: http://localhost:3000 (redirects to `/login` until authenticated).

### 4. Build & Serve Production

```bash
npm run build
npm start
```

### 5. Lint

```bash
npm run lint
```

---

## 🧪 Scripts

| Script  | Purpose                                      |
| ------- | -------------------------------------------- |
| `dev`   | Run Next.js in development with fast refresh |
| `build` | Production compile + optimize                |
| `start` | Launch built app on Node server              |
| `lint`  | Run ESLint over source                       |

---

## 🗺️ Roadmap / Open Tasks

- Implement real playlist persistence (Firestore or custom backend)
- Song search integration (`/searchSong` placeholder)
- Global state for queue & now playing
- Responsive/mobile layout refinements
- Accessibility pass (ARIA labels, focus outlines in all interactive components)
- Unit / integration tests (React Testing Library / Vitest or Jest)
- Dark/light theming toggle (currently dark focused)

---

## 🧩 Architecture Notes

- App Router architecture (each folder in `app/` maps to a route)
- Global UI wrappers (`HeaderWrapper`, `SideBarWrapper`) mounted in `layout.tsx` for persistent chrome
- Auth context kept minimal—consider expanding to include loading state or roles
- Styling: Utility‑first via Tailwind v4; some custom sizing classes appear (ensure Tailwind config supports them if expanded)
- Player uses controlled internal state; could be lifted into a global store when queue logic is introduced

---

## 🛡️ Security Considerations

- Firebase keys are public client config (not secrets) but still avoid committing real production analytics projects inadvertently
- Add rate limiting & abuse protection if expanding to public API endpoints
- Validate any future user‑generated content (lyrics, playlist names) to prevent injection in rendered markup

---

## 🤝 Contributing

1. Fork the repo
2. Create feature branch: `git checkout -b feat/your-feature`
3. Commit changes: `git commit -m "feat: add your feature"`
4. Push branch: `git push origin feat/your-feature`
5. Open a Pull Request describing motivation & changes

Please keep PRs focused and lint‑clean. Include screenshots / short clips for UI tweaks.

---

## 📄 License

Specify your chosen license (e.g., MIT) in this section and add a `LICENSE` file. (Currently unspecified.)

---

## 🙋 Support / Questions

Feel free to open an Issue for bugs, enhancement ideas, or clarifications.

---

## 🔗 Useful References

- [Next.js Docs](https://nextjs.org/docs)
- [Firebase Web Setup](https://firebase.google.com/docs/web/setup)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Icons](https://react-icons.github.io/react-icons/)

---

### Attribution

Logos / images contained in `public/` are assumed for demo/development only. Replace with properly licensed assets before production use.

---

Happy hacking! 🎧
