# WhoDisGit 🔍 — GitHub Unfollowers & Profile Analytics Dashboard

<p align="center">
  <img src="https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/GitHub_API-v3-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub API" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License" />
</p>

---

## 🌟 About WhoDisGit

**WhoDisGit** is a modern, high-performance, single-page web application built with React, TypeScript, and Tailwind CSS v4. It empowers GitHub users to analyze their follower ratio, detect users who don't follow back, and view comprehensive profile metrics in a sleek, responsive dashboard.

Using the official GitHub REST API v3, **WhoDisGit** categorizes your GitHub network into:
- 🚫 **Unfollowers**: Users you follow who do not follow you back.
- ⭐ **Fans**: Followers whom you haven't followed back yet.
- 🤝 **Mutuals**: Users who follow each other.
- 📊 **Profile Metrics**: Total stargazers earned across all public repositories, follower/following counts, public repos, and bio overview.

---

## ✨ Key Features

- 🔍 **Unfollowers Detection**: Instantly identifies non-reciprocal connections using set-based `$O(1)$` matching.
- ⚡ **Dynamic API Pagination**: Seamlessly handles users with large follower bases (>100) using `per_page=100` page loops with real-time status feedback.
- ⭐ **Total Stargazers Calculation**: Iterates over public repositories to sum up total stars earned.
- 🔒 **Optional PAT Support**: Allows users to input a Personal Access Token (PAT) to boost GitHub API rate limits from 60 to 5,000 requests/hr.
- 🛡️ **100% Client-Side Privacy**: Credentials and tokens are stored **exclusively in your browser's LocalStorage**. Zero remote servers or data collection.
- 🌍 **Bilingual i18n**: Seamless toggle between English 🇬🇧 and Turkish 🇹🇷 localization.
- 🌗 **Dark & Light Mode**: Toggle between sleek dark mode (slate-950) and clean light mode (slate-50).
- 📊 **CSV & JSON Export**: Export your filtered user lists with one click for offline record-keeping.
- 🔎 **Real-Time Search & Sorting**: Live username filtering and A-Z / Z-A alphabetical sorting.
- 🚀 **Automated GitHub Pages CD**: Built-in GitHub Actions workflow (`.github/workflows/deploy.yml`) for automated deployment on push.

---

## 🛠️ Tech Stack

| Component | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | React 18 | Declarative Functional Components & Custom Hooks |
| **Language** | TypeScript 5.5 | Type safety, clean interfaces, & autocomplete |
| **Styling** | Tailwind CSS v4 | Class-based dark/light mode variants & responsive layout |
| **Build Tool** | Vite 5 | Lightning-fast HMR & production bundle optimization |
| **Icons** | Lucide React | Clean, accessible SVG icon set |
| **API** | GitHub REST API v3 | Live user, repository, follower, and following data |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm, yarn, or pnpm

### Local Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/WhoDisGit.git
   cd WhoDisGit
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:3000`.

4. **Build for production:**
   ```bash
   npm run build
   ```

---

## 🌐 Deploying to GitHub Pages

### Option 1: Automatic Deployment (GitHub Actions - Recommended)
1. Push your code to your GitHub repository.
2. In your repository settings, navigate to **Settings > Pages > Build and deployment > Source** and select **`GitHub Actions`**.
3. Every push to the `main` or `master` branch will automatically build and deploy the app via `.github/workflows/deploy.yml`.

### Option 2: Manual CLI Deployment
```bash
npm run deploy
```

---

## 📜 License

This project is open-source and available under the [MIT License](LICENSE). Feel free to use, modify, and distribute it.
