import React, { useState, useMemo } from 'react';
import {
  FolderGit2,
  Star,
  GitFork,
  ExternalLink,
  Search,
  ArrowUpDown,
  Clock,
  ChevronDown,
  Download
} from 'lucide-react';
import type { GithubRepo, RepoSortOption, Language } from '../types/github';
import { translations } from '../i18n/translations';

interface RepositorySectionProps {
  repos: GithubRepo[];
  lang: Language;
  isOpen?: boolean;
  onToggle?: () => void;
  username?: string;
}

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  Go: '#00ADD8',
  Rust: '#dea584',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Java: '#b07219',
  'C++': '#f34b7d',
  C: '#555555',
  'C#': '#178600',
  PHP: '#4F5D95',
  Ruby: '#701516',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
  Shell: '#89e051',
  Vue: '#41b883',
  Svelte: '#ff3e00'
};

export const RepositorySection: React.FC<RepositorySectionProps> = ({
  repos,
  lang,
  isOpen,
  onToggle,
  username
}) => {
  const t = translations[lang];
  const [internalOpen, setInternalOpen] = useState(true);
  const isExpanded = isOpen !== undefined ? isOpen : internalOpen;
  const toggleOpen = () => {
    if (onToggle) {
      onToggle();
    } else {
      setInternalOpen((prev) => !prev);
    }
  };

  const [searchFilter, setSearchFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<RepoSortOption>('stars');

  // Filter & Sort
  const filteredAndSortedRepos = useMemo(() => {
    let list = [...repos];

    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase().trim();
      list = list.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          (r.description && r.description.toLowerCase().includes(q))
      );
    }

    list.sort((a, b) => {
      if (sortBy === 'stars') {
        return (b.stargazers_count || 0) - (a.stargazers_count || 0);
      }
      if (sortBy === 'forks') {
        return (b.forks_count || 0) - (a.forks_count || 0);
      }
      if (sortBy === 'updated') {
        return new Date(b.updated_at || 0).getTime() - new Date(a.updated_at || 0).getTime();
      }
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

    return list;
  }, [repos, searchFilter, sortBy]);

  const exportRepos = (format: 'csv' | 'json'): void => {
    if (filteredAndSortedRepos.length === 0) return;

    if (format === 'json') {
      const dataToExport = filteredAndSortedRepos.map((r) => ({
        name: r.name,
        full_name: r.full_name,
        description: r.description,
        html_url: r.html_url,
        language: r.language,
        stars: r.stargazers_count,
        forks: r.forks_count,
        is_fork: r.fork,
        updated_at: r.updated_at
      }));
      const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `whodisgit-repos-${username || 'export'}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (format === 'csv') {
      const header = 'Name,Full Name,Description,Language,Stars,Forks,Is Fork,URL,Updated At\n';
      const rows = filteredAndSortedRepos
        .map((r) => {
          const name = `"${r.name.replace(/"/g, '""')}"`;
          const fullName = `"${(r.full_name || '').replace(/"/g, '""')}"`;
          const desc = `"${(r.description || '').replace(/"/g, '""')}"`;
          const lang = `"${(r.language || '').replace(/"/g, '""')}"`;
          const stars = r.stargazers_count || 0;
          const forks = r.forks_count || 0;
          const isFork = Boolean(r.fork);
          const url = `"${r.html_url}"`;
          const updated = `"${r.updated_at || ''}"`;
          return `${name},${fullName},${desc},${lang},${stars},${forks},${isFork},${url},${updated}`;
        })
        .join('\n');
      const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `whodisgit-repos-${username || 'export'}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  if (repos.length === 0) return null;

  return (
    <section
      id="repositories-section"
      className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl p-5 sm:p-6 shadow-sm space-y-5"
    >
      {/* Section Accordion Header */}
      <div
        role="button"
        tabIndex={0}
        onClick={toggleOpen}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleOpen();
          }
        }}
        aria-expanded={isExpanded}
        className="flex items-center justify-between gap-3 cursor-pointer select-none group"
        title={isExpanded ? t.collapseSection : t.expandSection}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-colors">
            <FolderGit2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-100">
                {t.reposSectionTitle}
              </h3>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                {filteredAndSortedRepos.length}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {t.reposSectionSubtitle}
            </p>
          </div>
        </div>

        <div className="p-1.5 rounded-lg text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <ChevronDown
            className={`w-5 h-5 transition-transform duration-200 ${
              isExpanded ? 'rotate-180 text-slate-900 dark:text-slate-100' : ''
            }`}
          />
        </div>
      </div>

      {/* Collapsible Body */}
      {isExpanded && (
        <div className="space-y-5 pt-3 border-t border-slate-100 dark:border-slate-800">
          {/* Search & Sort Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:w-60">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search className="w-3.5 h-3.5" />
              </div>
              <input
                type="text"
                placeholder={t.repoSearchPlaceholder}
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 text-xs placeholder-slate-400 focus:outline-none focus:border-slate-400 dark:focus:border-slate-600 transition-colors"
              />
            </div>

            {/* Actions: Sort & Export */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap sm:flex-nowrap">
              {/* Sort Selector Segmented */}
              <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-0.5 text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setSortBy('stars')}
                  className={`px-2.5 py-1 rounded-md transition-colors inline-flex items-center gap-1 cursor-pointer ${
                    sortBy === 'stars'
                      ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                  title={t.sortByStars}
                >
                  <Star className="w-3 h-3 text-amber-400" />
                  <span className="hidden md:inline">{t.sortByStars}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSortBy('forks')}
                  className={`px-2.5 py-1 rounded-md transition-colors inline-flex items-center gap-1 cursor-pointer ${
                    sortBy === 'forks'
                      ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                  title={t.sortByForks}
                >
                  <GitFork className="w-3 h-3 text-slate-400" />
                  <span className="hidden md:inline">{t.sortByForks}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSortBy('updated')}
                  className={`px-2.5 py-1 rounded-md transition-colors inline-flex items-center gap-1 cursor-pointer ${
                    sortBy === 'updated'
                      ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                  title={t.sortByUpdated}
                >
                  <Clock className="w-3 h-3" />
                  <span className="hidden md:inline">{t.sortByUpdated}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSortBy('name')}
                  className={`px-2.5 py-1 rounded-md transition-colors inline-flex items-center gap-1 cursor-pointer ${
                    sortBy === 'name'
                      ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                  title={t.sortByName}
                >
                  <ArrowUpDown className="w-3 h-3" />
                  <span className="hidden md:inline">{t.sortByName}</span>
                </button>
              </div>

              {/* Dışa Aktarma Butonları (CSV & JSON) */}
              <div className="flex items-center gap-1.5 border-l border-slate-200 dark:border-slate-800 pl-2">
                <button
                  type="button"
                  onClick={() => exportRepos('csv')}
                  disabled={filteredAndSortedRepos.length === 0}
                  className="px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="CSV olarak indir"
                >
                  <Download className="w-3 h-3 text-slate-500" />
                  <span>{t.exportCsv}</span>
                </button>
                <button
                  type="button"
                  onClick={() => exportRepos('json')}
                  disabled={filteredAndSortedRepos.length === 0}
                  className="px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="JSON olarak indir"
                >
                  <Download className="w-3 h-3 text-slate-500" />
                  <span>{t.exportJson}</span>
                </button>
              </div>
            </div>
          </div>

      {/* Repositories Grid */}
      {filteredAndSortedRepos.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 dark:bg-slate-950/40 rounded-lg border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500 mx-auto flex items-center justify-center">
            <FolderGit2 className="w-5 h-5" />
          </div>
          <h4 className="text-slate-800 dark:text-slate-200 font-semibold text-sm">
            {t.noReposTitle}
          </h4>
          <p className="text-slate-500 text-xs max-w-sm mx-auto">
            {t.noReposMsg}
          </p>
          {searchFilter && (
            <button
              type="button"
              onClick={() => setSearchFilter('')}
              className="text-xs text-cyan-600 dark:text-cyan-400 hover:underline pt-1 cursor-pointer"
            >
              Temizle / Clear
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredAndSortedRepos.map((repo) => {
            const langColor = repo.language
              ? LANGUAGE_COLORS[repo.language] || '#64748b'
              : undefined;

            return (
              <div
                key={repo.id}
                className="bg-slate-50/50 dark:bg-slate-950/40 hover:bg-white dark:hover:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 rounded-xl p-4 transition-all flex flex-col justify-between group shadow-2xs hover:shadow-xs"
              >
                {/* Top Row: Name & Links */}
                <div className="space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono font-semibold text-xs text-slate-900 dark:text-slate-100 hover:text-cyan-600 dark:hover:text-cyan-400 inline-flex items-center gap-1.5 transition-colors truncate"
                      title={repo.name}
                    >
                      <span className="truncate">{repo.name}</span>
                      <ExternalLink className="w-3 h-3 shrink-0 opacity-40 group-hover:opacity-100 transition-opacity" />
                    </a>

                    {repo.fork && (
                      <span className="shrink-0 text-[10px] font-mono px-1.5 py-0.2 rounded border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-500">
                        {t.forkBadge}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed min-h-[32px]">
                    {repo.description || (
                      <span className="text-slate-400 dark:text-slate-500 italic text-[11px]">
                        —
                      </span>
                    )}
                  </p>
                </div>

                {/* Bottom Row: Language & Metrics */}
                <div className="pt-3 mt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono">
                  {/* Primary Language */}
                  <div className="flex items-center gap-1.5 truncate pr-2">
                    {repo.language ? (
                      <>
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: langColor }}
                        />
                        <span className="truncate text-[11px] font-sans font-medium text-slate-700 dark:text-slate-300">
                          {repo.language}
                        </span>
                      </>
                    ) : (
                      <span className="text-[11px] text-slate-400 italic font-sans">—</span>
                    )}
                  </div>

                  {/* Stats: Stars & Forks */}
                  <div className="flex items-center gap-3 shrink-0 text-[11px]">
                    <div
                      className="flex items-center gap-1 text-slate-700 dark:text-slate-300"
                      title={`${repo.stargazers_count} stars`}
                    >
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500/20" />
                      <span>{repo.stargazers_count}</span>
                    </div>

                    {typeof repo.forks_count === 'number' && (
                      <div
                        className="flex items-center gap-1 text-slate-500 dark:text-slate-400"
                        title={`${repo.forks_count} forks`}
                      >
                        <GitFork className="w-3 h-3" />
                        <span>{repo.forks_count}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
        </div>
      )}
    </section>
  );
};

export default RepositorySection;
