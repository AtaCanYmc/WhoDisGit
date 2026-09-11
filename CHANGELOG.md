# Changelog

All notable changes to the WhoDisGit project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-08-09

### Added
- Single page web dashboard for GitHub network and profile analytics.
- Unfollowers detection via set-difference algorithm (`Following \ Followers`).
- Tabbed categorization for unfollowers, fans (followers not followed back), and mutual connections.
- GitHub REST API v3 traversal with automatic pagination (`per_page=100`) for high-count profiles.
- Aggregate star count summation across all public user repositories.
- Optional Personal Access Token (PAT) authentication to raise rate limit quotas from 60 to 5,000 requests per hour.
- LocalStorage credential persistence toggle for remembered sessions.
- Multilingual interface supporting English, Turkish, Spanish, German, and French.
- Dark and light theme toggle support implemented with Tailwind CSS v4 custom variants.
- Export functionality for follower and repository tables to CSV and JSON formats.
- Deep linking support via URL query parameters (`?username=`, `?pat=`, `?raw=1`).
- Public repository explorer with keyword filtering, fork indicators, and sorting controls.
- PWA manifest and responsive icons for mobile and desktop home screen installation.
- Automated CI and CD workflows for GitHub Pages deployment.

### Changed
- Migrated codebase to strict TypeScript (`.tsx`).
- Configured class-based dark mode selector targeting `@custom-variant dark`.

