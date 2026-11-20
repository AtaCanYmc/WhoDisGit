import React from 'react';
import { History, UserPlus, UserMinus, Check, Sparkles, Calendar } from 'lucide-react';
import type { SnapshotDiff, ActiveTab } from '../types/github';
import type { TranslationSchema } from '../i18n/translations';

interface SnapshotDiffBannerProps {
  diff: SnapshotDiff;
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onSaveBaseline: () => void;
  isBaselineSaved: boolean;
  t: TranslationSchema;
}

export const SnapshotDiffBanner: React.FC<SnapshotDiffBannerProps> = ({
  diff,
  activeTab,
  onSelectTab,
  onSaveBaseline,
  isBaselineSaved,
  t
}) => {
  const previousDate = new Date(diff.previousTimestamp).toLocaleString();
  const hasChanges = diff.newFollowers.length > 0 || diff.lostFollowers.length > 0;

  return (
    <div className="p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 shadow-sm space-y-3.5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>{t.snapshotDiffTitle}</span>
              <span className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 inline-flex items-center gap-1">
                <Calendar className="w-2.5 h-2.5" />
                {previousDate}
              </span>
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              {hasChanges
                ? t.snapshotComparedWith(previousDate)
                : t.snapshotUnchanged}
            </p>
          </div>
        </div>

        {/* Save Baseline Button */}
        <button
          type="button"
          onClick={onSaveBaseline}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors inline-flex items-center gap-1.5 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-slate-900 dark:focus-visible:outline-slate-100 ${
            isBaselineSaved
              ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold'
              : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
          }`}
          title={t.snapshotSaveBaseline}
        >
          {isBaselineSaved ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{t.snapshotBaselineSaved}</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-slate-500" />
              <span>{t.snapshotSaveBaseline}</span>
            </>
          )}
        </button>
      </div>

      {/* Snapshot Diff Badges / Tabs */}
      {hasChanges && (
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex-wrap">
          {/* Lost Followers (Unfollowed you) */}
          <button
            type="button"
            onClick={() => onSelectTab('snapshot_lost')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-2 cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-rose-500 ${
              activeTab === 'snapshot_lost'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/60'
            }`}
          >
            <UserMinus className="w-3.5 h-3.5" />
            <span>{t.snapshotTabLost}</span>
            <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-white/20">
              {diff.lostFollowers.length}
            </span>
          </button>

          {/* New Followers */}
          <button
            type="button"
            onClick={() => onSelectTab('snapshot_gained')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-2 cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-emerald-500 ${
              activeTab === 'snapshot_gained'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>{t.snapshotTabGained}</span>
            <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-white/20">
              {diff.newFollowers.length}
            </span>
          </button>
        </div>
      )}
    </div>
  );
};
