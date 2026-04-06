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

<a href="https://beats-music-nu.vercel.app/"><strong>🌐 Live Demo 1</strong></a>
<a ><strong> | </strong></a>
<a href="https://beat-music-latest.onrender.com"><strong>🌐 Live Demo 2</strong></a>

</div>

---

## ✨ Overview

Beats Music is a Next.js App Router music app focused on discovery and continuous playback across route changes.

Current codebase includes:

- Firebase Authentication (email/password + Google sign-in)
- Home discovery feed powered by API search data
- Song player with seek, repeat, shuffle, queue navigation, and volume persistence
- Cross-page playback continuity via global player context + background media engine
- Mobile and desktop navigation with animated play indicator while music is playing
- Profile page with user info and local stats
- Library route currently gated behind a development-mode "Coming Soon" state

> NOTE: Custom playlist flow and full liked-song persistence are still in progress.

---

## 🧱 Tech Stack

| Layer     | Tech                                                             |
| --------- | ---------------------------------------------------------------- |
| Framework | Next.js 15 (App Router, standalone output)                       |
| Language  | TypeScript 5                                                     |
| UI        | React 19 + TailwindCSS 4                                         |
| Auth      | Firebase Auth (Email/Password + Google Provider)                 |
| Media     | react-player v3 + NoSleep.js                                     |
| API       | Next.js Route Handlers + iTunes Search/Lookup + YouTube Data API |
| Testing   | Vitest + fast-check property tests                               |
| Tooling   | ESLint 9, PostCSS, Autoprefixer, SVGR                            |

---

## 📂 Project Structure (trimmed)

```
src/
	app/
		layout.tsx           # Root layout: providers + loaders + nav chrome
		page.tsx             # Auth-aware redirect (/home or /login)
		firebase.ts          # Client-safe Firebase initialization
		login/               # Login UI (email/password + Google)
		register/            # Registration UI
		home/                # Home discovery page
		searchSong/          # Search page with debounce + genre chips
		songPlay/            # Main playback page + queue panel
		library/             # Library UI (currently dev-gated)
		profile/             # Profile + local stats
		api/
			saavn/search/route.ts    # Search proxy (iTunes + fallback data)
			saavn/songs/route.ts     # Song details lookup proxy
			saavn/stream/route.ts    # Placeholder (501)
			youtube/search/route.ts  # YouTube search proxy (server key)
	components/
		layout/              # Header, Sidebar, MobileNav
		SongPlayer.tsx       # Player UI and media event handling
		QueuePanel.tsx       # Up-next queue UI
		ui/                  # Shared UI primitives
	providers/
		AuthProvider.tsx     # Auth context + global player context
	hooks/
		useAuth.ts           # Auth and player context hooks
		useDebounce.ts       # Debounce helper for search UX
	services/
		jioSaavnApi.ts       # Client calls to /api/saavn
		youtubeService.ts    # Client calls to /api/youtube/search
	__tests__/             # 27 property-focused Vitest test files
public/
	audio/                 # Keep-alive silent audio + sample audio assets
	images/                # Covers, artist images, UI illustrations
	icons/                 # Brand + social icons
```

---

## 🔐 Authentication Flow

- `AuthProvider` tracks `onAuthStateChanged` and exposes user/loading context.
- Root route (`/`) redirects to `/home` when authenticated, otherwise `/login`.
- Login supports email/password and Google popup sign-in.
- "Remember me" switches Firebase persistence between local and session storage.
- Register flow creates account and updates display name.
- Firebase initialization is guarded for client-side runtime to avoid SSR/build crashes.

---

## 🎵 Song Player Highlights (`SongPlayer.tsx`)

- Plays either YouTube source (`youtubeVideoId`) or direct audio preview URL.
- Uses ReactPlayer v3 media events for play/pause/time/duration/end/error handling.
- Supports seek, repeat (`off`/`all`/`one`), shuffle state, next/previous, and mute/volume restore.
- Persists volume in localStorage (`beats:volume`) and syncs it with global player context.
- Updates Media Session metadata and lock-screen controls when available.
- Shows temporary "Playlist support coming soon" ghost text when `ADD +` is tapped.
- Integrates with queue logic from `songPlay/page.tsx` and stays in sync across route changes.

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
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=xxxxx.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxxxx
NEXT_PUBLIC_FIREBASE_APP_ID=1:xxxx:web:xxxx
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-xxxx
YOUTUBE_API_KEY=xxxxx
```

Obtain the Firebase values from your Firebase project settings (Web App config).

- `YOUTUBE_API_KEY` is used by the server-side YouTube API route and should be kept private.

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

### 6. Run Tests

```bash
npx vitest run
```

The repository currently includes 27 property-style test files under `src/__tests__`.

---

## 🧪 Scripts

| Script  | Purpose                                      |
| ------- | -------------------------------------------- |
| `dev`   | Run Next.js in development with fast refresh |
| `build` | Production compile + optimize                |
| `start` | Launch built app on Node server              |
| `lint`  | Run ESLint over source                       |

Testing is available via Vitest CLI (`npx vitest run`) even though a `test` npm script is not yet defined.

---

## 🌐 API Routes

- `GET /api/saavn/search?query=...&limit=...`:
  - Uses iTunes Search API as primary source
  - Normalizes response to app-friendly song schema
  - Falls back to bundled mock songs when upstream calls fail
- `GET /api/saavn/songs?id=...`:
  - Uses iTunes Lookup API for a single track
- `GET /api/youtube/search?query=...`:
  - Uses server-side `YOUTUBE_API_KEY`
  - Caches query responses in-memory for 1 hour
- `GET /api/saavn/stream`:
  - Placeholder endpoint returning `501 Not Implemented`

---

## 🗺️ Roadmap / Open Tasks

- Wire liked-song actions in `SongPlayer` to persistent storage used by Library.
- Enable full Library experience (currently blocked by `isDevelopmentMode = true`).
- Implement full custom playlist lifecycle (create, rename, delete, track assignment).
- Improve background playback resilience across browser throttling scenarios.
- Add stronger auth UX (replace alerts with inline/toast feedback).
- Add `npm test` script and CI test workflow.
- Accessibility pass and theme strategy (currently dark-leaning visual style).

### 🔜 Next Version (Planned)

- Liked Songs list improvements with richer song metadata and easier playback actions
- Custom playlist support (create, rename, delete, add/remove tracks)
- Better playlist persistence and sync behavior
- Queue and now-playing continuity improvements across pages
- Additional UI polish and quality-of-life enhancements

---

## 🧩 Architecture Notes

- `AuthProvider` now carries both authentication state and global player state.
- Playback continuity is handled by a hidden background ReactPlayer engine mounted outside `/songPlay`.
- A silent keep-alive audio element is used to reduce browser background throttling impact.
- `songPlay/page.tsx` orchestrates track loading, YouTube lookup fallback, and queue transitions.
- Search and song details are abstracted through internal API routes to avoid client CORS issues.
- Next.js config enables standalone output and SVG component imports via SVGR.

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

Happy Listening! 🎧
