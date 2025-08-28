# E‑Week 2K25 Admin Dashboard 🚀

Powerful web admin panel to manage E‑Week events, registrations, results, leaderboard, history, and more.

## ✨ Features
- 📊 Dashboard overview (events, registrations, points)
- 🗓️ Event CRUD and management
- 🏆 Leaderboard management and scoring
- 🧠 SkillStorm admin tools
- 📰 E‑Week history editor
- 🔒 Admin‑only routes with React Router

## 🧰 Tech Stack
- ⚛️ React (Create React App)
- 🧭 react-router-dom
- 📡 axios
- 🎨 CSS/utility components, framer‑motion, lucide‑react

## 🚀 Quick Start
1) Install deps: `npm install`
2) Run dev server: `npm start` (default http://localhost:3000)
3) If port clashes with the public site, set a custom port before start, e.g. `PORT=3001 npm start` (Windows PowerShell: `$env:PORT=3001; npm start`)

Backend expected: E‑Week server running locally (default 5001) or your deployed API.

## 🔧 Scripts
- `npm start` – start dev server
- `npm run build` – production build
- `npm test` – tests

## 📁 Key Routes (React Router)
- `/` and `/admin` – Admin dashboard
- `/admin/ManageEvents` – Manage events
- `/admin/EventForm` and `/admin/EditableEventForm` – Create/update events
- `/admin/SetResult` – Set event results
- `/admin/leaderboard` – Leaderboard
- `/admin/history`, `/admin/addHistroy`, `/admin/editHistroy/:id` – History management
- `/admin/edit-points/:team/:points` – Edit points

## 🧩 Project Structure (high level)
- `src/pages/` – Admin pages (Dashboard, ManageEvents, Leaderboard, History, SkillStorm, etc.)
- `src/components/` – Shared layout and UI

## 🔐 Environment (optional)
- `REACT_APP_API_URL` – Override API base URL (otherwise proxy or relative paths are used)

## 🤝 Related
- Server API: E-Week-2k25-Server
- Public site: E-Week-2K25-Client
- Mobile app: E-Week-2k25-App

---
Made with ❤️ for E‑Week 2025.
