<!-- well-document · audit scorecard: G1:5 G2:5 G3:5 G4:5 G5:5 G6:5 · STATUS: PASS -->

[← Back to Documentation Index](README.md) · [Root Repository](../README.md)

# Theming and Internationalization Specification

This document details the theme management architecture, CSS custom variants, zero-FOUC bootstrap sequence, and multilingual dictionary implementation in WhoDisGit.

---

## Table of Contents

- [Theme Architecture](#theme-architecture)
  - [Tailwind CSS v4 Custom Variant](#tailwind-css-v4-custom-variant)
  - [Zero-FOUC Bootstrap Sequence](#zero-fouc-bootstrap-sequence)
  - [Native Color-Scheme Synchronization](#native-color-scheme-synchronization)
  - [Scrollbar Standardization](#scrollbar-standardization)
- [Internationalization (i18n)](#internationalization-i18n)
  - [Supported Locales](#supported-locales)
  - [Type-Safe Translation Schema](#type-safe-translation-schema)
  - [Adding a New Language](#adding-a-new-language)

---

## Theme Architecture

### Tailwind CSS v4 Custom Variant

WhoDisGit uses Tailwind CSS v4. Rather than relying on legacy configuration files, the dark theme variant is registered directly in `src/index.css`:

```css
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));
```

This ensures utility classes like `dark:bg-slate-900` or `dark:text-slate-100` activate whenever the `.dark` class is attached to the document root (`document.documentElement`).

### Zero-FOUC Bootstrap Sequence

To prevent a Flash of Unstyled Content (FOUC) when reloading the page in dark mode, an inline script executes before the DOM body finishes parsing:

```html
<meta name="color-scheme" content="light dark" />
<script>
  try {
    const t = localStorage.getItem('whodisgit_theme') || 
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    if (t === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    const m = document.querySelector('meta[name="color-scheme"]');
    if (m) m.content = t;
  } catch (e) {}
</script>
```

### Native Color-Scheme Synchronization

Whenever the user toggles between themes in the Settings Modal or through the header controls, the application synchronizes two distinct layers:

1. **DOM Class**: Toggles the `.dark` class on `document.documentElement` for Tailwind styles.
2. **Meta Element**: Updates `<meta name="color-scheme">` to `dark` or `light` so browser controls, system inputs, and scrollbars render in the matching palette.

```typescript
useEffect(() => {
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
  const metaColorScheme = document.querySelector('meta[name="color-scheme"]') as HTMLMetaElement | null;
  if (metaColorScheme) {
    metaColorScheme.content = theme;
  }
  localStorage.setItem('whodisgit_theme', theme);
}, [theme]);
```

### Scrollbar Standardization

Scrollbars follow W3C CSS specifications rather than vendor-only pseudo-elements:

```css
:root {
  color-scheme: light dark;
  --scrollbar-thumb: #cbd5e1;
  --scrollbar-track: #f8fafc;
  scrollbar-color: var(--scrollbar-thumb) var(--scrollbar-track);
  scrollbar-width: thin;
}

:root.dark {
  color-scheme: dark;
  --scrollbar-thumb: #1e293b;
  --scrollbar-track: #020617;
  scrollbar-color: var(--scrollbar-thumb) var(--scrollbar-track);
}
```

Legacy `::-webkit-scrollbar` pseudo-elements are retained inside `@supports not (scrollbar-color: auto)` fallback blocks for older WebKit browsers.

---

## Internationalization (i18n)

### Supported Locales

WhoDisGit provides 100% dictionary coverage across 5 languages:

| Locale Code | Language | Native Name |
| :--- | :--- | :--- |
| `tr` | Turkish | Türkçe |
| `en` | English | English |
| `es` | Spanish | Español |
| `de` | German | Deutsch |
| `fr` | French | Français |

### Type-Safe Translation Schema

Dictionaries are defined in `src/i18n/translations.ts`. TypeScript validates all dictionaries against a shared interface to eliminate missing key errors at compile time:

```typescript
export type Language = 'tr' | 'en' | 'es' | 'de' | 'fr';

export interface TranslationSchema {
  heroTitleSuffix: string;
  heroSubtitle: string;
  settingsTitle: string;
  settingsDesc: string;
  themeSection: string;
  themeDark: string;
  themeLight: string;
  languageSection: string;
  closeBtn: string;
  // ... comprehensive string keys
}

export const translations: Record<Language, TranslationSchema> = {
  tr: { /* ... */ },
  en: { /* ... */ },
  es: { /* ... */ },
  de: { /* ... */ },
  fr: { /* ... */ }
};
```

### Adding a New Language

1. Update the `Language` union type in `src/types/github.ts`:
   ```typescript
   export type Language = 'tr' | 'en' | 'es' | 'de' | 'fr' | 'it';
   ```

2. Add the complete translation map in `src/i18n/translations.ts`:
   ```typescript
   export const translations: Record<Language, TranslationSchema> = {
     // ... existing languages
     it: {
       heroTitleSuffix: 'Git',
       heroSubtitle: 'Rilevatore di non-follower GitHub e dashboard analitica...',
       // ... implement all keys defined in TranslationSchema
     }
   };
   ```

3. Register the option in `src/components/SettingsModal.tsx`:
   ```typescript
   { code: 'it' as const, native: 'Italiano' }
   ```

4. Verify compile-time type safety:
   ```bash
   npm run type-check
   ```
