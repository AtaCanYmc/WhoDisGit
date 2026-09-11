# Security Policy

## Supported Versions

Security updates are applied only to the latest release branch.

| Version | Supported | Notes |
| :--- | :---: | :--- |
| 1.0.x | Yes | Active release branch |
| < 1.0 | No | Deprecated |

---

## Data Boundary and Client-Side Storage

WhoDisGit operates entirely client-side within the browser execution sandbox.

- **Local Execution**: All GitHub API queries originate directly from the client's browser to `https://api.github.com`. No intermediate proxy, relay, or analytics telemetry service is utilized.
- **Credential Storage**: Optional GitHub Personal Access Tokens (PAT) and usernames are stored solely within `window.localStorage`. Tokens are never transmitted to any third-party domain.
- **Local Erasure**: Stored credentials can be cleared instantly via the "Clear Records" control in the application interface or by wiping site storage via browser developer tools.

---

## Reporting a Vulnerability

Security vulnerabilities must be reported privately. Do not open public GitHub issues for potential vulnerabilities.

1. Submit a report through [GitHub Private Vulnerability Reporting](https://github.com/AtaCanYmc/WhoDisGit/security/advisories/new) or send an encrypted email to `atacanymc@gmail.com`.
2. Include reproduction steps, affected browser/runtime environment, and potential impact analysis.
3. The project maintainers will acknowledge receipt within 48 hours and provide remediation timelines prior to public disclosure.

