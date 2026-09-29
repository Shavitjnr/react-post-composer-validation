# Post Composer Pro — Platform-Based Character Validation & CSV Storage

A modern, premium React.js application featuring real-time character limit validation for social platforms (**Twitter** and **LinkedIn**), responsive interactive design, and **CSV data persistence & export**.

---

## ✨ Features Added

1. **Premium Modern UI**:
   - Polished glassmorphic card interface with subtle radial gradient backdrop.
   - Clean typography using Google Fonts (**Plus Jakarta Sans** & **JetBrains Mono**).
   - Interactive platform tabs with official brand accents (Twitter / X and LinkedIn).
   - Real-time animated progress bar with dynamic color transitions (Blue → Amber → Red).
   - Smooth animated error alerts with excess character calculations.
   - Floating toast notification banner for actions.

2. **CSV Data Storage & Live Export**:
   - **Pre-populated CSV file**: Stored in `public/posts.csv`.
   - **In-App Persistent Storage**: Saves composed posts into `localStorage` so they persist across reloads.
   - **One-Click CSV Export**: Converts validated posts into RFC-compliant `.csv` format and triggers an instant browser download.
   - **Post Management Table**: Clean interactive table showing platform tag, timestamp, character meter, preview, and delete action.

3. **Controlled Component Core**:
   - The `<textarea>` is strictly controlled via React's `useState()` hook.
   - Fully synchronized character count (`post.length`) and dynamic platform limits (280 for Twitter, 3,000 for LinkedIn).

---

## 📁 Project Structure

```text
post-composer/
├── public/
│   └── posts.csv            # Static/Sample CSV dataset
├── src/
│   ├── components/
│   │   └── PostComposer.jsx # Main component with controlled inputs & CSV handler
│   ├── App.jsx              # Application container
│   ├── index.css            # Premium CSS design system
│   └── main.jsx             # React DOM root entry
├── index.html               # HTML with Google Fonts integration
├── package.json             # Scripts & dependencies
├── vite.config.js           # Vite React bundler config
└── README.md
```

---

## 🚀 Running the Project

```bash
cd post-composer
npm install
npm run dev
```

Visit `http://localhost:5173` in your browser.
