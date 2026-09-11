import React, { useEffect } from 'react';
import { X, Sun, Moon, Check } from 'lucide-react';
import type { ThemeMode, Language } from '../types/github';
import { translations } from '../i18n/translations';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeMode;
  onThemeChange: (newTheme: ThemeMode) => void;
  lang: Language;
  onLanguageChange: (newLang: Language) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  theme,
  onThemeChange,
  lang,
  onLanguageChange
}) => {
  const t = translations[lang];

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl overflow-hidden p-6 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3
              id="settings-modal-title"
              className="text-base font-semibold text-slate-900 dark:text-slate-100"
            >
              {t.settingsTitle}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {t.settingsDesc}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label={t.closeBtn}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Section 1: Theme */}
        <div className="space-y-2.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {t.themeSection}
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            {/* Dark Theme Button */}
            <button
              type="button"
              onClick={() => onThemeChange('dark')}
              className={`p-3 rounded-lg border text-left flex items-center justify-between transition-colors cursor-pointer ${
                theme === 'dark'
                  ? 'border-slate-900 dark:border-slate-100 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 font-medium'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Moon className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                <span className="text-xs">{t.themeDark}</span>
              </div>
              {theme === 'dark' && <Check className="w-3.5 h-3.5 text-slate-900 dark:text-slate-100" />}
            </button>

            {/* Light Theme Button */}
            <button
              type="button"
              onClick={() => onThemeChange('light')}
              className={`p-3 rounded-lg border text-left flex items-center justify-between transition-colors cursor-pointer ${
                theme === 'light'
                  ? 'border-slate-900 dark:border-slate-100 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 font-medium'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Sun className="w-4 h-4 text-amber-500" />
                <span className="text-xs">{t.themeLight}</span>
              </div>
              {theme === 'light' && <Check className="w-3.5 h-3.5 text-slate-900 dark:text-slate-100" />}
            </button>
          </div>
        </div>

        {/* Section 2: Language */}
        <div className="space-y-2.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {t.languageSection}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { code: 'tr' as const, native: 'Türkçe' },
              { code: 'en' as const, native: 'English' },
              { code: 'es' as const, native: 'Español' },
              { code: 'de' as const, native: 'Deutsch' },
              { code: 'fr' as const, native: 'Français' },
            ].map((l) => (
              <button
                key={l.code}
                type="button"
                onClick={() => onLanguageChange(l.code)}
                className={`p-2.5 rounded-lg border text-left flex items-center justify-between transition-colors cursor-pointer ${
                  lang === l.code
                    ? 'border-slate-900 dark:border-slate-100 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 font-medium'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 uppercase">
                    {l.code}
                  </span>
                  <span className="text-xs font-medium">{l.native}</span>
                </div>
                {lang === l.code && <Check className="w-3.5 h-3.5 text-slate-900 dark:text-slate-100" />}
              </button>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:hover:bg-white dark:text-slate-950 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            {t.closeBtn}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
