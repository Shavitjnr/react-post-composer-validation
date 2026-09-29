# Post Composer Pro — Social Media CMS & CSV Database

A single, unified, production-style **Social Media Post Composer & Content Management System** with real-time character limit validation (**Twitter/X (280)**, **LinkedIn (3,000)**, **Instagram (2,200)**, **Facebook (5,000)**), live platform previews, scheduling, drafts, executive dashboard, and **complete CSV file-based data storage (including passwords and user accounts)**.

[![React](https://img.shields.io/badge/React-18.x-61dafb.svg?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646cff.svg?logo=vite&logoColor=white)](https://vitejs.dev/)
[![CSV Powered](https://img.shields.io/badge/Storage-CSV_Database-10b981.svg)](data/)

---

## 🌟 Key Features

1. **Unified Single Architecture**:
   - Everything runs in one clean single project right from the repository root.
   - Zero complex database installation needed — everything is powered by RFC-4180 compliant CSV storage.

2. **CSV Storage for Data, Users & Passwords**:
   - [`data/users.csv`](file:///c:/Users/admin/Desktop/Modi/New%20folder%20%282%29/react-post-composer-validation/data/users.csv): Stores user IDs, full names, emails, **passwords**, roles, and creation timestamps.
   - [`data/posts.csv`](file:///c:/Users/admin/Desktop/Modi/New%20folder%20%282%29/react-post-composer-validation/data/posts.csv): Stores post ID, author email, platform, status (Published/Scheduled), character count, limit, and post contents.
   - [`data/drafts.csv`](file:///c:/Users/admin/Desktop/Modi/New%20folder%20%282%29/react-post-composer-validation/data/drafts.csv): Stores drafts, favorite flags, timestamps, and contents.
   - **Interactive CSV Database Inspector**: Visual inspection of all 3 CSV datasets, password masking/revealing toggle, raw CSV code view, and 1-click download of all `.csv` files.

3. **Advanced Post Composer**:
   - Platform selector (Twitter, LinkedIn, Instagram, Facebook).
   - Controlled `<textarea>` synchronized with live character, word, and remaining counters.
   - Dynamic progress bar that turns Amber near limits and Red Pulse when exceeded.
   - Quick toolbar: Emojis, Hashtags, Mention, Clear, Save Draft, Schedule, and Publish.

4. **Live Platform Previews**:
   - Pixel-accurate mockups for **Twitter/X** (dark theme, verified badge, engagement bar) and **LinkedIn** (author card, reaction counter, like/comment/repost bar).

5. **Scheduling & Drafts Pipeline**:
   - Pick future date and time to schedule automated releases.
   - Filter drafts by platform, search contents, duplicate drafts with 1-click, and star favorites.

6. **Executive Dashboard**:
   - Real-time KPI cards (Total Records, Saved Drafts, Scheduled Queue, Published Posts).
   - Platform share distribution bars and pipeline status breakdown.

---

## 📁 Project Structure

```text
react-post-composer-validation/
├── data/
│   ├── users.csv             # User credentials, roles, and passwords
│   ├── posts.csv             # Published and scheduled posts
│   └── drafts.csv            # Saved drafts repository
├── public/                   # Static CSV exports and assets
├── src/
│   ├── components/
│   │   ├── AuthModal.jsx     # Login/Register syncing directly with users.csv
│   │   ├── CharacterCounter.jsx
│   │   ├── CsvDatabaseView.jsx # Live CSV database inspector & export engine
│   │   ├── Dashboard.jsx     # Executive KPI cards & charts
│   │   ├── DraftsManager.jsx # Drafts search, duplicate, filter, and favorites
│   │   ├── Navbar.jsx        # Top navigation with CSV quick download
│   │   ├── PlatformSelector.jsx
│   │   ├── PostComposer.jsx  # Main composer with controlled textarea
│   │   ├── PostPreview.jsx   # Live Twitter/X & LinkedIn mockups
│   │   ├── ScheduleModal.jsx # Date & time picker dialog
│   │   └── ScheduledList.jsx # Scheduled queue manager
│   ├── utils/
│   │   ├── csvStorage.js     # RFC-4180 compliant CSV parser, reader & writer
│   │   └── validation.js     # Centralized platform limits & rules
│   ├── App.jsx               # Unified single application component
│   ├── index.css             # Premium glassmorphic dark design system
│   └── main.jsx              # React DOM entry
├── index.html                # Modern typography (Plus Jakarta Sans & JetBrains Mono)
├── package.json              # Scripts & dependencies
├── vite.config.js            # Vite build configuration
└── README.md
```

---

## 📊 CSV File Formats

### 1. `data/users.csv` (Users & Passwords)
```csv
ID,Name,Email,Password,Role,CreatedAt
usr_1,"Alex Morgan","alex@example.com","password123","Admin","2026-09-29 09:00:00"
usr_2,"Sarah Connor","sarah@tech.org","sarahSecure#2026","Creator","2026-09-29 09:15:00"
usr_3,"David Chen","david@startup.io","davidPass!789","Editor","2026-09-29 09:30:00"
```

### 2. `data/posts.csv` (Posts)
```csv
ID,UserEmail,Platform,Status,CharCount,Limit,ScheduledAt,PublishedAt,Content
post_1,"alex@example.com","Twitter","Published",126,280,"","2026-09-29 09:30:00","Excited to launch our new product today! Real-time platform character validation is finally here. 🚀 #Tech #Innovation"
post_2,"alex@example.com","LinkedIn","Published",248,3000,"","2026-09-29 09:45:00","Clean architecture and controlled components in React make scaling modern frontend applications seamless. Continuous learning and strict validation rules are essential in modern software engineering."
```

### 3. `data/drafts.csv` (Drafts)
```csv
ID,UserEmail,Platform,IsFavorite,CreatedAt,Content
draft_1,"alex@example.com","Twitter","true","2026-09-29 08:30:00","Draft thoughts on custom React hooks and memoization strategies for heavy UI rerenders..."
```

---

## 🚀 How to Run

1. Open your terminal in the repository folder:
   ```bash
   cd react-post-composer-validation
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```
4. Open **`http://localhost:5173`** in your browser.

**Demo Credentials (stored in `users.csv`)**:
- **Email**: `alex@example.com`
- **Password**: `password123`
*(Or click any demo pill in the Sign In modal for 1-click access)*
