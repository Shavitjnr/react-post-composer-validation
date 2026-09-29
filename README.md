# Post Composer Pro — Platform-Based Character Validation & CSV Storage

A modern, responsive React.js web application that validates social media posts against platform-specific character limits (**Twitter / X** and **LinkedIn**), complete with real-time character meters, error feedback, and **CSV data storage & export**.

[![React](https://img.shields.io/badge/React-18.x-61dafb.svg?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646cff.svg?logo=vite&logoColor=white)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 🌟 Key Features

- **Controlled Component Textarea**: State is fully managed and controlled using React's `useState` hook and synchronized via `onChange`.
- **Platform-Based Validation**:
  - **Twitter**: **280 characters**
  - **LinkedIn**: **3,000 characters**
- **Live Progress Bar & Dynamic Meter**: Color-coded feedback (Blue → Warning Amber at 80% → Red Pulse when exceeded).
- **Shake-Animated Error Alerts**: Clear, informative banner displaying the exact number of excess characters.
- **CSV Data Persistence & Export**:
  - Automatically stores validated posts to `localStorage`.
  - Pre-loaded starter dataset in `public/posts.csv`.
  - One-click **"Download posts.csv"** export button generating standard RFC-compliant CSV files.
- **Interactive Post Management Table**: View, manage, and delete saved posts in real-time.
- **Premium Modern UI**: Designed with Plus Jakarta Sans, JetBrains Mono, glassmorphism cards, and official platform themes.

---

## 📁 Repository Structure

```text
react-post-composer-validation/
├── post-composer/
│   ├── public/
│   │   └── posts.csv            # Static / sample CSV dataset
│   ├── src/
│   │   ├── components/
│   │   │   └── PostComposer.jsx # Main PostComposer component with validation & CSV export
│   │   ├── App.jsx              # App container
│   │   ├── index.css            # Premium CSS design system
│   │   └── main.jsx             # React entry point
│   ├── index.html               # HTML template with Google Fonts
│   ├── package.json             # Scripts & dependencies
│   ├── vite.config.js           # Vite configuration
│   └── README.md
├── .gitignore
└── README.md
```

---

## 🛠️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Shavitjnr/react-post-composer-validation.git
cd react-post-composer-validation/post-composer
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the development server

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 📊 CSV Export Format

The generated `posts.csv` includes the following columns:

| Column           | Description                               |
| :--------------- | :---------------------------------------- |
| `ID`             | Unique timestamp identifier               |
| `Timestamp`      | Date and time the post was composed       |
| `Platform`       | Target platform (`Twitter` or `LinkedIn`) |
| `CharacterCount` | Total characters typed (`post.length`)    |
| `Limit`          | Maximum allowed characters (280 or 3000)  |
| `Status`         | Post status (`Valid`)                     |
| `PostContent`    | The text content of the post              |
