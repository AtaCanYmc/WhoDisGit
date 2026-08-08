# Changelog 📜

All notable changes to the **WhoDisGit** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-08-09

### Added 🚀
- Initial release of **WhoDisGit** single page application.
- **Unfollowers Detection**: Automated comparison algorithm (`Following \ Followers`).
- **Fans & Mutuals Calculation**: Tabbed view for non-followers, followers you don't follow back, and mutual connections.
- **GitHub API v3 Integration**: Dynamic pagination handling (`per_page=100`) for users with large follower/following lists (>100).
- **Total Stars Metric**: Automatic calculation of stargazers across all public user repositories.
- **PAT Authorization Support**: Optional Personal Access Token header input to increase GitHub API rate limits from 60 to 5,000 requests/hour.
- **LocalStorage Persistence**: Toggle option to remember username and PAT securely client-side.
- **Bilingual i18n**: Full Turkish (🇹🇷) and English (🇬🇧) language switcher.
- **Dark & Light Mode**: Complete theme toggle support using Tailwind CSS v4 custom variants.
- **Export Capabilities**: CSV and JSON export options for result lists.
- **GitHub Pages CD**: Automated GitHub Actions workflow (`.github/workflows/deploy.yml`) and `gh-pages` CLI support.

### Changed 💅
- Refactored entire codebase from `.jsx` to strict TypeScript (`.tsx`).
- Enhanced Tailwind CSS v4 class-based dark mode selector support (`@custom-variant dark`).
- Added Info tooltip for LocalStorage privacy clarification.
