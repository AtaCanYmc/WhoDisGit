# Roadmap

Development milestones and planned architectural enhancements for WhoDisGit.

---

## [1.0.0] - Released (2026-08-09)

- [x] Client-side GitHub REST API v3 integration with pagination (`per_page=100`).
- [x] Set-difference calculation for unfollowers, fans, and mutual connections.
- [x] Aggregate stargazer metrics across public repositories.
- [x] Public repository explorer with keyword filtering, language tags, and multi-criteria sorting.
- [x] Client-side Personal Access Token (PAT) storage with localStorage persistence toggle.
- [x] Five-locale internationalization (English, Turkish, Spanish, German, French).
- [x] Dark and light themes powered by Tailwind CSS v4 variables.
- [x] CSV and JSON table export handlers.
- [x] PWA manifest and mobile responsive assets.
- [x] Continuous integration and automated GitHub Pages deployment pipelines.

---

## [1.1.0] - Planned

- [ ] Rate limit exhaustion banner with live visual countdown timer.
- [ ] Snapshot comparison: diff follower network changes across local sessions.
- [ ] Additional table export formats (Markdown, NDJSON).
- [ ] Filter by account creation date and minimum stargazer threshold.

---

## [1.2.0] - Backlog

- [ ] GitHub GraphQL API v4 adapter for single-request bulk query execution.
- [ ] Automated rate limit backoff and queuing system for high-volume follower networks.
- [ ] Bi-directional diff view for organization members and collaborator lists.
