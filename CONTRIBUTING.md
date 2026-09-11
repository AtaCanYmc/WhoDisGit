# Contributing to WhoDisGit

Contributions to WhoDisGit are welcome. To maintain codebase quality, predictable release cycles, and consistent architecture, all contributions must follow the guidelines outlined below.

---

## Local Development Workflow

### Prerequisites

- Node.js 18.0.0 or higher
- npm (or compatible package manager: pnpm, yarn)
- Git

### Initial Setup

```bash
git clone https://github.com/AtaCanYmc/WhoDisGit.git
cd WhoDisGit
npm install
```

### Local Commands

```bash
npm run dev          # Start local Vite development server
npm run type-check   # Run TypeScript compilation check (tsc --noEmit)
npm run build        # Build production bundle
npm run ci           # Run verification suite (type-check + build)
```

Alternatively, use the provided `Makefile` shortcuts: `make dev`, `make type-check`, `make ci`.

---

## Branching Strategy

Branch directly from `main`. Use descriptive, lowercase branch names prefixed with the change type:

- `feature/<short-description>`: New functionality or enhancements.
- `fix/<short-description>`: Bug and defect fixes.
- `chore/<short-description>`: Tooling, dependency, or workflow updates.
- `docs/<short-description>`: Documentation changes.

```bash
git checkout -b feature/rate-limit-retry
```

---

## Commit Message Standards

WhoDisGit adheres to the [Conventional Commits](https://www.conventionalcommits.org/) specification (v1.0.0). Commit messages must follow this structure:

```text
<type>(<scope>): <short imperative summary>

[optional body]

[optional footer(s)]
```

### Allowed Types

| Type | Purpose | Example |
| :--- | :--- | :--- |
| `feat` | Introduces a new feature to the codebase | `feat(api): add exponential backoff retry handler` |
| `fix` | Patches a bug or regression | `fix(dashboard): resolve state desync on tab toggle` |
| `docs` | Documentation changes only | `docs(readme): update environment requirements table` |
| `style` | Formatting or markup adjustments with no logic changes | `style(table): align numeric metrics columns` |
| `refactor` | Code refactoring with no behavioral change | `refactor(i18n): consolidate language translation keys` |
| `perf` | Performance optimizations | `perf(sorting): memoize repository filter computation` |
| `test` | Adding or correcting test suites | `test(helpers): add pagination boundary assertions` |
| `chore` | Build processes, package dependencies, CI scripts | `chore(deps): bump tailwindcss from 4.0.0 to 4.0.1` |

---

## Code Quality Standards

1. **TypeScript Rigor**: Maintain strict typing. Avoid `any`. Define interfaces and shared data contracts in `src/types/github.ts`.
2. **Internationalization (i18n)**: Every user-facing label or status message must be defined across all 5 supported locales (`en`, `tr`, `es`, `de`, `fr`) in `src/i18n/translations.ts`.
3. **Theme Compatibility**: Ensure styling behaves consistently across both light mode and dark mode classes (`dark:` modifier) using Tailwind CSS v4 variables.
4. **Zero Telemetry and Sandboxing**: Never introduce network calls to third-party endpoints. API calls are restricted to the official GitHub REST API endpoints.

---

## Pull Request Process

1. Ensure the local verification suite passes completely before pushing commits:
   ```bash
   npm run ci
   ```
2. Rebase onto the latest `origin/main` to avoid merge conflicts.
3. Open a Pull Request targeting `main`. Fill out the pull request template completely.
4. Automated CI workflows will run type verification and bundle builds on every PR update. All checks must pass before merging.

