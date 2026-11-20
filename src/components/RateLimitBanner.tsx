import React, { useState, useEffect } from 'react';
import { Clock, KeyRound, RefreshCw, AlertTriangle, CheckCircle2 } from 'lucide-react';
import type { TranslationSchema } from '../i18n/translations';

interface RateLimitBannerProps {
  resetTimestamp: number; // Unix timestamp in seconds
  onRetry: () => void;
  onApplyPat: (token: string) => void;
  t: TranslationSchema;
}

export const RateLimitBanner: React.FC<RateLimitBannerProps> = ({
  resetTimestamp,
  onRetry,
  onApplyPat,
  t
}) => {
  const [secondsLeft, setSecondsLeft] = useState<number>(() => {
    return Math.max(0, Math.floor(resetTimestamp - Date.now() / 1000));
  });
  const [initialSeconds] = useState<number>(() => {
    return Math.max(1, Math.floor(resetTimestamp - Date.now() / 1000));
  });
  const [patInput, setPatInput] = useState<string>('');

  useEffect(() => {
    const updateCountdown = () => {
      const remaining = Math.max(0, Math.floor(resetTimestamp - Date.now() / 1000));
      setSecondsLeft(remaining);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [resetTimestamp]);

  const formatCountdown = (totalSeconds: number): string => {
    if (totalSeconds <= 0) return '00:00';
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (n: number) => n.toString().padStart(2, '0');
    if (hours > 0) {
      return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    }
    return `${pad(minutes)}:${pad(seconds)}`;
  };

  const progressPercent = Math.min(
    100,
    Math.max(0, ((initialSeconds - secondsLeft) / initialSeconds) * 100)
  );

  const isReset = secondsLeft === 0;

  const handlePatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (patInput.trim()) {
      onApplyPat(patInput.trim());
    }
  };

  return (
    <div
      role="alert"
      aria-live="polite"
      className="p-5 sm:p-6 rounded-xl border border-amber-300 dark:border-amber-800/80 bg-amber-50/70 dark:bg-amber-950/40 text-amber-950 dark:text-amber-100 shadow-sm space-y-4"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-amber-200/80 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 shrink-0">
            {isReset ? <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> : <AlertTriangle className="w-5 h-5" />}
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold tracking-tight">
              {t.rateLimitCountdownTitle}
            </h3>
            <p className="text-xs text-amber-800 dark:text-amber-300 mt-0.5">
              {isReset ? t.rateLimitResetReady : t.rateLimitCountdownDesc(formatCountdown(secondsLeft))}
            </p>
          </div>
        </div>

        {/* Live Timer Pill & Retry Action */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-amber-300/80 dark:border-amber-700 bg-white dark:bg-slate-900 font-mono text-xs font-bold text-amber-900 dark:text-amber-200 shadow-2xs">
            <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 animate-pulse" />
            <span>{formatCountdown(secondsLeft)}</span>
          </div>

          <button
            type="button"
            onClick={onRetry}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer inline-flex items-center gap-1.5 focus-visible:outline-2 focus-visible:outline-offset-2 ${
              isReset
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white focus-visible:outline-emerald-600'
                : 'bg-amber-900 hover:bg-amber-800 text-white dark:bg-amber-100 dark:hover:bg-white dark:text-amber-950 focus-visible:outline-amber-900'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{t.rateLimitRetryBtn}</span>
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      {!isReset && (
        <div className="w-full bg-amber-200/60 dark:bg-amber-900/40 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-amber-600 dark:bg-amber-400 h-1.5 rounded-full transition-all duration-1000 ease-linear"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}

      {/* Fast PAT Bypass Option */}
      <form
        onSubmit={handlePatSubmit}
        className="pt-3 border-t border-amber-200/80 dark:border-amber-900/60 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs"
      >
        <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300">
          <KeyRound className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
          <span>{t.rateLimitPatPrompt}</span>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="password"
            placeholder="ghp_xxxxxxxxxxxx"
            value={patInput}
            onChange={(e) => setPatInput(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-amber-300 dark:border-amber-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs font-mono placeholder-amber-400/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 w-full sm:w-48"
          />
          <button
            type="submit"
            disabled={!patInput.trim()}
            className="px-3.5 py-1.5 bg-amber-900 hover:bg-amber-800 disabled:opacity-40 disabled:cursor-not-allowed text-white dark:bg-amber-200 dark:hover:bg-amber-100 dark:text-amber-950 rounded-lg font-semibold shrink-0 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-900"
          >
            {t.rateLimitApplyPat}
          </button>
        </div>
      </form>
    </div>
  );
};
