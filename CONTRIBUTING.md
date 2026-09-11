# Contributing to WhoDisGit 🤝

First off, thank you for considering contributing to **WhoDisGit**! It's contributions like yours that make the open-source community an amazing place to learn, inspire, and create.

---

## 🚀 How Can I Contribute?

### 1. Reporting Bugs 🐛
If you find a bug, please open an issue using the [Bug Report Template](.github/ISSUE_TEMPLATE/bug_report.md) with:
- A clear and descriptive title.
- Steps to reproduce the bug.
- Expected behavior vs actual behavior.
- Screenshots if applicable.

### 2. Suggesting Features 💡
Feature requests are welcome! Please open an issue using the [Feature Request Template](.github/ISSUE_TEMPLATE/feature_request.md) describing:
- The problem your feature solves.
- Your proposed solution or user flow.

### 3. Pull Requests 🔀
1. Fork the repository.
2. Create a topic branch from `main`:
   ```bash
   git checkout -b feature/my-awesome-feature
   ```
3. Make your changes and write clean code following TypeScript & React best practices.
4. Verify local build and type checking:
   ```bash
   make ci
   # or: npm run type-check && npm run build
   ```
5. Commit your changes with a clear commit message.
6. Push to your branch and open a Pull Request against `main`.

---

## 🎨 Code Style Guidelines

- **TypeScript**: Always define strict types or interfaces for new data structures in `src/types/github.ts`.
- **Localization (i18n)**: When adding user-facing text, update all 5 language keys (`tr`, `en`, `es`, `de`, `fr`) in `src/i18n/translations.ts`.
- **Styling**: Use Tailwind CSS utility classes and ensure both **Dark** (`dark:`) and **Light** mode variants look great.
- **Formatting**: Keep code clean, readable, and properly formatted.
