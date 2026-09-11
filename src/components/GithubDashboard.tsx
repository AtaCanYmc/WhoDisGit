import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Key,
  UserCheck,
  UserX,
  Users,
  Star,
  BookOpen,
  ExternalLink,
  RefreshCw,
  AlertTriangle,
  ShieldAlert,
  UserPlus,
  HeartHandshake,
  Download,
  Copy,
  Check,
  Eye,
  EyeOff,
  ArrowUpDown,
  Filter,
  Trash2,
  Info,
  Settings,
  ChevronDown,
  Activity,
  GitFork,
  MapPin,
  Building2,
  Link2,
  Calendar,
  Code2,
  FolderGit2
} from 'lucide-react';

const GithubIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

import type {
  GithubUser,
  GithubSimpleUser,
  GithubRepo,
  ApiError,
  ActiveTab,
  SortOrder,
  ExportFormat,
  Language,
  ThemeMode
} from '../types/github';

import { translations } from '../i18n/translations';
import SettingsModal from './SettingsModal';
import RepositorySection from './RepositorySection';

/**
 * WhoDisGit - GitHub Unfollowers & Profile Analytics Dashboard (TypeScript TSX)
 * 
 * - Türkçe 🇹🇷 / İngilizce 🇬🇧 Çift Dil Desteği
 * - Koyu (Dark) / Açık (Light) Tema Geçişi
 * - LocalStorage İnfografik ve İpucu Desteği
 */
export default function GithubDashboard(): React.ReactElement {
  // --- Tema Durumu (Dark / Light) ---
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const savedTheme = localStorage.getItem('whodisgit_theme') as ThemeMode;
    if (savedTheme === 'dark' || savedTheme === 'light') return savedTheme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('whodisgit_theme', theme);
  }, [theme]);

  // --- Dil Seçimi Durumu (i18n) ---
  const [lang, setLang] = useState<Language>(() => {
    const savedLang = localStorage.getItem('whodisgit_lang') as Language;
    return (['tr', 'en', 'es', 'de', 'fr'] as Language[]).includes(savedLang) ? savedLang : 'tr';
  });

  const t = translations[lang];

  const handleLanguageChange = (newLang: Language): void => {
    setLang(newLang);
    localStorage.setItem('whodisgit_lang', newLang);
  };

  // --- Ayarlar Modalı Durumu ---
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // --- Form & Kimlik Doğrulama Durumları ---
  const [username, setUsername] = useState<string>('');
  const [pat, setPat] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [showPat, setShowPat] = useState<boolean>(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // --- Analiz & Veri Durumları ---
  const [loading, setLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [error, setError] = useState<ApiError | null>(null);

  // API Sonuçları
  const [profile, setProfile] = useState<GithubUser | null>(null);
  const [totalStars, setTotalStars] = useState<number>(0);
  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [followers, setFollowers] = useState<GithubSimpleUser[]>([]);
  const [following, setFollowing] = useState<GithubSimpleUser[]>([]);

  // UI / Tab & Filtreleme Durumları
  const [activeTab, setActiveTab] = useState<ActiveTab>('unfollowers');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [copiedUser, setCopiedUser] = useState<string | null>(null);

  // Akordiyon Bölüm Durumları
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(true);
  const [isNetworkOpen, setIsNetworkOpen] = useState<boolean>(true);
  const [isReposOpen, setIsReposOpen] = useState<boolean>(true);

  // --- Sayfa Yüklendiğinde Kayıtlı Bilgileri Al ---
  useEffect(() => {
    const savedUsername = localStorage.getItem('whodisgit_username');
    const savedPat = localStorage.getItem('whodisgit_pat');
    const savedRecent = localStorage.getItem('whodisgit_recent');

    if (savedUsername) {
      setUsername(savedUsername);
      setRememberMe(true);
    }
    if (savedPat) {
      setPat(savedPat);
    }
    if (savedRecent) {
      try {
        setRecentSearches(JSON.parse(savedRecent) as string[]);
      } catch (e) {
        console.error('Geçmiş aramalar yüklenemedi:', e);
      }
    }
  }, []);

  // --- Ortak Header Oluşturucu ---
  const getHeaders = (token: string): Record<string, string> => {
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
    };
    const cleanToken = token ? token.trim() : '';
    if (cleanToken) {
      headers['Authorization'] = cleanToken.startsWith('Bearer ') || cleanToken.startsWith('token ')
        ? cleanToken
        : `token ${cleanToken}`;
    }
    return headers;
  };

  // --- GitHub API Sayfalama (Pagination) Fonksiyonu ---
  const fetchAllPages = async (
    urlEndpoint: string,
    totalCount: number,
    type: 'followers' | 'following',
    headers: Record<string, string>
  ): Promise<GithubSimpleUser[]> => {
    const perPage = 100;
    const totalPages = Math.ceil(totalCount / perPage) || 1;
    let allData: GithubSimpleUser[] = [];

    for (let page = 1; page <= totalPages; page++) {
      setStatusMessage(
        type === 'followers'
          ? t.fetchingFollowers(page, totalPages)
          : t.fetchingFollowing(page, totalPages)
      );
      
      const res = await fetch(`${urlEndpoint}?per_page=${perPage}&page=${page}`, { headers });

      if (!res.ok) {
        if (res.status === 403) {
          const rateLimitReset = res.headers.get('X-RateLimit-Reset');
          const resetTime = rateLimitReset ? new Date(parseInt(rateLimitReset, 10) * 1000).toLocaleTimeString() : undefined;
          throw {
            code: 403,
            title: t.errRateLimitTitle,
            message: t.errRateLimitMsg(resetTime)
          } as ApiError;
        } else if (res.status === 401) {
          throw {
            code: 401,
            title: t.errUnauthorizedTitle,
            message: t.errUnauthorizedMsg
          } as ApiError;
        }
        throw {
          code: res.status,
          title: t.errGenericTitle,
          message: t.errGenericMsg(res.status)
        } as ApiError;
      }

      const data: GithubSimpleUser[] = await res.json();
      if (!Array.isArray(data) || data.length === 0) break;
      allData = allData.concat(data);

      if (data.length < perPage) break;
    }

    return allData;
  };

  // --- Toplam Yıldız Sayısını ve Repoları Çekme ---
  const fetchReposAndStars = async (
    userLogin: string,
    totalPublicRepos: number,
    headers: Record<string, string>
  ): Promise<{ totalStars: number; repos: GithubRepo[] }> => {
    try {
      setStatusMessage(t.calculatingStars);
      const perPage = 100;
      const totalPages = Math.min(Math.ceil(totalPublicRepos / perPage) || 1, 5);
      let starsSum = 0;
      const allRepos: GithubRepo[] = [];

      for (let page = 1; page <= totalPages; page++) {
        const res = await fetch(`https://api.github.com/users/${userLogin}/repos?per_page=${perPage}&page=${page}&sort=updated&type=owner`, { headers });
        if (!res.ok) break;
        const pageRepos: GithubRepo[] = await res.json();
        if (!Array.isArray(pageRepos) || pageRepos.length === 0) break;

        allRepos.push(...pageRepos);
        starsSum += pageRepos.reduce((acc, repo) => acc + (repo.stargazers_count || 0), 0);
        if (pageRepos.length < perPage) break;
      }
      return { totalStars: starsSum, repos: allRepos };
    } catch (e) {
      console.warn('Yıldız sayısı ve repolar hesaplanırken hata oluştu:', e);
      return { totalStars: 0, repos: [] };
    }
  };

  // --- Ana Analiz İşleme Fonksiyonu ---
  const handleAnalyze = async (e?: React.FormEvent<HTMLFormElement>): Promise<void> => {
    if (e) e.preventDefault();

    const cleanUsername = username.trim();
    if (!cleanUsername) {
      setError({
        code: 400,
        title: t.errMissingUsernameTitle,
        message: t.errMissingUsernameMsg
      });
      return;
    }

    setLoading(true);
    setError(null);
    setProfile(null);
    setFollowers([]);
    setFollowing([]);
    setRepos([]);
    setTotalStars(0);
    setStatusMessage(t.fetchingProfile);

    const headers = getHeaders(pat);

    try {
      const userRes = await fetch(`https://api.github.com/users/${cleanUsername}`, { headers });
      
      if (!userRes.ok) {
        if (userRes.status === 404) {
          setError({
            code: 404,
            title: t.errUserNotFoundTitle,
            message: t.errUserNotFoundMsg(cleanUsername)
          });
        } else if (userRes.status === 403) {
          setError({
            code: 403,
            title: t.errRateLimitTitle,
            message: t.errRateLimitMsg()
          });
        } else if (userRes.status === 401) {
          setError({
            code: 401,
            title: t.errUnauthorizedTitle,
            message: t.errUnauthorizedMsg
          });
        } else {
          setError({
            code: userRes.status,
            title: t.errGenericTitle,
            message: t.errGenericMsg(userRes.status)
          });
        }
        return;
      }

      const userData: GithubUser = await userRes.json();
      setProfile(userData);

      const [fetchedFollowers, fetchedFollowing, repoData] = await Promise.all([
        fetchAllPages(`https://api.github.com/users/${cleanUsername}/followers`, userData.followers, 'followers', headers),
        fetchAllPages(`https://api.github.com/users/${cleanUsername}/following`, userData.following, 'following', headers),
        fetchReposAndStars(userData.login, userData.public_repos, headers)
      ]);

      setFollowers(fetchedFollowers);
      setFollowing(fetchedFollowing);
      setTotalStars(repoData.totalStars);
      setRepos(repoData.repos);

      if (rememberMe) {
        localStorage.setItem('whodisgit_username', cleanUsername);
        if (pat) localStorage.setItem('whodisgit_pat', pat.trim());
      } else {
        localStorage.removeItem('whodisgit_username');
        localStorage.removeItem('whodisgit_pat');
      }

      updateRecentSearches(cleanUsername);
      setStatusMessage(t.analysisComplete);
    } catch (err: unknown) {
      console.error('Analiz Hatası:', err);
      const typedErr = err as ApiError;
      setError({
        code: typedErr.code || 500,
        title: typedErr.title || t.errGenericTitle,
        message: typedErr.message || t.errGenericMsg()
      });
    } finally {
      setLoading(false);
    }
  };

  const updateRecentSearches = (user: string): void => {
    const updated = [user, ...recentSearches.filter((u) => u.toLowerCase() !== user.toLowerCase())].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('whodisgit_recent', JSON.stringify(updated));
  };

  const removeRecentSearch = (userToRemove: string, e: React.MouseEvent): void => {
    e.stopPropagation();
    const updated = recentSearches.filter((u) => u !== userToRemove);
    setRecentSearches(updated);
    localStorage.setItem('whodisgit_recent', JSON.stringify(updated));
  };

  const handleClearSavedData = (): void => {
    localStorage.removeItem('whodisgit_username');
    localStorage.removeItem('whodisgit_pat');
    setUsername('');
    setPat('');
    setRememberMe(false);
  };

  // --- ALGORİTMA HESAPLAMALARI ---
  const followersMap = useMemo<Set<string>>(() => {
    const set = new Set<string>();
    followers.forEach((u) => set.add(u.login.toLowerCase()));
    return set;
  }, [followers]);

  const followingMap = useMemo<Set<string>>(() => {
    const set = new Set<string>();
    following.forEach((u) => set.add(u.login.toLowerCase()));
    return set;
  }, [following]);

  const unfollowers = useMemo<GithubSimpleUser[]>(() => {
    return following.filter((user) => !followersMap.has(user.login.toLowerCase()));
  }, [following, followersMap]);

  const fans = useMemo<GithubSimpleUser[]>(() => {
    return followers.filter((user) => !followingMap.has(user.login.toLowerCase()));
  }, [followers, followingMap]);

  const mutuals = useMemo<GithubSimpleUser[]>(() => {
    return following.filter((user) => followersMap.has(user.login.toLowerCase()));
  }, [following, followersMap]);

  // Ekstra Profil ve Repo Metrikleri
  const totalForks = useMemo<number>(() => {
    return repos.reduce((acc, r) => acc + (r.forks_count || 0), 0);
  }, [repos]);

  const topLanguage = useMemo<{ language: string; count: number } | null>(() => {
    if (repos.length === 0) return null;
    const counts: Record<string, number> = {};
    repos.forEach((r) => {
      if (r.language) {
        counts[r.language] = (counts[r.language] || 0) + 1;
      }
    });
    let maxLang: string | null = null;
    let maxCount = 0;
    Object.entries(counts).forEach(([language, count]) => {
      if (count > maxCount) {
        maxCount = count;
        maxLang = language;
      }
    });
    return maxLang ? { language: maxLang, count: maxCount } : null;
  }, [repos]);

  const repoBreakdown = useMemo(() => {
    const sources = repos.filter((r) => !r.fork).length;
    const forked = repos.filter((r) => r.fork).length;
    return { sources, forked };
  }, [repos]);

  const memberSinceFormatted = useMemo<string>(() => {
    if (!profile?.created_at) return '';
    try {
      const date = new Date(profile.created_at);
      const formatted = new Intl.DateTimeFormat(lang, { month: 'short', year: 'numeric' }).format(date);
      const diffYears = Math.max(0, new Date().getFullYear() - date.getFullYear());
      return diffYears > 0 ? `${formatted} (${diffYears}y)` : formatted;
    } catch {
      return '';
    }
  }, [profile?.created_at, lang]);

  // --- Filtrelenmiş ve Sıralanmış Liste ---
  const currentList = useMemo<GithubSimpleUser[]>(() => {
    let list: GithubSimpleUser[] = [];
    if (activeTab === 'unfollowers') list = unfollowers;
    else if (activeTab === 'fans') list = fans;
    else if (activeTab === 'mutuals') list = mutuals;
    else if (activeTab === 'following') list = following;

    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase().trim();
      list = list.filter((user) => user.login.toLowerCase().includes(q));
    }

    return [...list].sort((a, b) => {
      const nameA = a.login.toLowerCase();
      const nameB = b.login.toLowerCase();
      return sortOrder === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    });
  }, [activeTab, unfollowers, fans, mutuals, following, searchFilter, sortOrder]);

  const handleCopyUsername = (userLogin: string): void => {
    navigator.clipboard.writeText(userLogin);
    setCopiedUser(userLogin);
    setTimeout(() => setCopiedUser(null), 2000);
  };

  const exportData = (format: ExportFormat): void => {
    const dataToExport = currentList.map((u) => ({
      username: u.login,
      profile_url: u.html_url,
      avatar_url: u.avatar_url
    }));

    if (format === 'json') {
      const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `whodisgit-${activeTab}-${profile?.login || 'export'}.json`;
      a.click();
    } else if (format === 'csv') {
      const header = 'Username,Profile URL,Avatar URL\n';
      const rows = dataToExport.map((u) => `"${u.username}","${u.profile_url}","${u.avatar_url}"`).join('\n');
      const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `whodisgit-${activeTab}-${profile?.login || 'export'}.csv`;
      a.click();
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* ==================== TOP NAVIGATION & BRAND ==================== */}
      <header className="border-b border-slate-200 dark:border-slate-800/80 pb-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950">
              <GithubIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                  WhoDis<span className="text-cyan-600 dark:text-cyan-400">{t.heroTitleSuffix}</span>
                </h1>
                <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-800 text-slate-500">
                  v1.0
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block mt-0.5">
                {t.heroSubtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Settings Button */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors inline-flex items-center gap-1.5 text-xs font-medium cursor-pointer"
              title={t.settingsTitle}
              aria-label={t.settingsTitle}
            >
              <Settings className="w-3.5 h-3.5 text-slate-500" />
              <span>{t.settingsTitle}</span>
            </button>
          </div>
        </div>
      </header>

      {/* ==================== WORKBENCH / QUERY SECTION ==================== */}
      <section className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl p-5 sm:p-6 shadow-sm">
        <form onSubmit={handleAnalyze} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* 1. GitHub Kullanıcı Adı Input */}
            <div className="space-y-1.5">
              <label htmlFor="github-username" className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                {t.usernameLabel} <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <GithubIcon className="w-4 h-4" />
                </div>
                <input
                  id="github-username"
                  type="text"
                  placeholder={t.usernamePlaceholder}
                  value={username}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 text-sm font-medium focus:outline-none focus:border-slate-400 dark:focus:border-slate-600 focus:ring-1 focus:ring-slate-400 transition-all"
                  required
                />
              </div>
            </div>

            {/* 2. Personal Access Token (PAT) Input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="github-pat" className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                  {t.patLabel} <span className="text-slate-400 text-[11px] font-normal lowercase">({t.patOptional})</span>
                </label>
                <a
                  href="https://github.com/settings/tokens/new?scopes=read:user&description=WhoDisGit"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-cyan-600 dark:text-cyan-400 hover:underline inline-flex items-center gap-1"
                >
                  <Key className="w-3 h-3" /> {t.patCreateToken}
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Key className="w-4 h-4" />
                </div>
                <input
                  id="github-pat"
                  type={showPat ? 'text' : 'password'}
                  placeholder={t.patPlaceholder}
                  value={pat}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPat(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 text-sm font-mono focus:outline-none focus:border-slate-400 dark:focus:border-slate-600 focus:ring-1 focus:ring-slate-400 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPat(!showPat)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  title={showPat ? 'Gizle' : 'Göster'}
                >
                  {showPat ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Geçmiş Aramalar Hızlı Seçim */}
          {recentSearches.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap pt-1">
              <span className="text-xs text-slate-500 font-medium">{t.recentSearches}</span>
              {recentSearches.map((searchedUser) => (
                <span
                  key={searchedUser}
                  className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-md text-xs text-slate-700 dark:text-slate-300 font-mono"
                >
                  <button
                    type="button"
                    onClick={() => setUsername(searchedUser)}
                    className="hover:text-cyan-600 dark:hover:text-cyan-400 cursor-pointer"
                  >
                    @{searchedUser}
                  </button>
                  <button
                    type="button"
                    onClick={(e: React.MouseEvent) => removeRecentSearch(searchedUser, e)}
                    className="text-slate-400 hover:text-rose-500 rounded cursor-pointer leading-none"
                    title="Kaldır"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Alt Seçenekler ve Analiz Butonu */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-slate-900 focus:ring-slate-400 bg-white dark:bg-slate-950"
                  />
                  <span className="text-xs text-slate-600 dark:text-slate-300">
                    {t.rememberMe}
                  </span>
                </label>

                {/* Info Tooltip */}
                <div className="relative group/tooltip inline-flex items-center">
                  <Info className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer" />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/tooltip:block w-64 p-2.5 bg-slate-900 dark:bg-slate-800 text-slate-200 text-xs rounded-lg shadow-xl border border-slate-700 z-30 leading-relaxed">
                    {t.rememberInfoTooltip}
                  </div>
                </div>
              </div>

              {(localStorage.getItem('whodisgit_username') || localStorage.getItem('whodisgit_pat')) && (
                <button
                  type="button"
                  onClick={handleClearSavedData}
                  className="text-xs text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 flex items-center gap-1 transition-colors cursor-pointer"
                  title="Kayıtlı bilgileri temizle"
                >
                  <Trash2 className="w-3 h-3" /> {t.clearRecords}
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:hover:bg-white dark:text-slate-950 text-sm font-semibold rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{t.analyzingBtn}</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>{t.analyzeBtn}</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Loading Progress */}
        {loading && (
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 font-mono mb-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-slate-500" />
              <span>{statusMessage}</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div className="bg-slate-900 dark:bg-slate-100 h-full w-2/5 animate-pulse"></div>
            </div>
          </div>
        )}
      </section>

      {/* ==================== HATA BİLDİRİM KUTUSU ==================== */}
      {error && (
        <section className="bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 rounded-xl p-4 flex items-start gap-3.5 text-rose-800 dark:text-rose-300">
          <div className="p-1.5 bg-rose-100 dark:bg-rose-900/40 rounded-md text-rose-600 dark:text-rose-400 shrink-0">
            {error.code === 403 ? <ShieldAlert className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
          </div>
          <div className="space-y-0.5">
            <h3 className="font-semibold text-sm text-rose-900 dark:text-rose-200">{error.title}</h3>
            <p className="text-xs text-rose-700 dark:text-rose-300/90 leading-relaxed">{error.message}</p>
          </div>
        </section>
      )}

      {/* ==================== SONUÇ KARTLARI VE EKRAN ==================== */}
      {profile && !loading && (
        <main className="space-y-6">
          
          {/* 1. PROFİL KARTI VE METRİKLER */}
          <section id="profile-section" className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl p-5 sm:p-6 shadow-sm space-y-5">
            
            {/* Section Accordion Header */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => setIsProfileOpen((prev) => !prev)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setIsProfileOpen((prev) => !prev);
                }
              }}
              aria-expanded={isProfileOpen}
              className="flex items-center justify-between gap-3 cursor-pointer select-none group"
              title={isProfileOpen ? t.collapseSection : t.expandSection}
            >
              <div className="flex items-center gap-3">
                <img
                  src={profile.avatar_url}
                  alt={profile.name || profile.login}
                  className="w-10 h-10 rounded-lg border border-slate-200 dark:border-slate-800 object-cover shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">
                      {profile.name || profile.login}
                    </h2>
                    <span className="text-xs font-mono text-slate-500">
                      @{profile.login}
                    </span>
                    {profile.hireable && (
                      <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400">
                        Hireable
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {t.profileSectionSubtitle}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={profile.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 transition-colors"
                >
                  <GithubIcon className="w-3.5 h-3.5" />
                  <span>{t.openGithubProfile}</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>

                <div className="p-1.5 rounded-lg text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <ChevronDown
                    className={`w-5 h-5 transition-transform duration-200 ${
                      isProfileOpen ? 'rotate-180 text-slate-900 dark:text-slate-100' : ''
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Collapsible Body */}
            {isProfileOpen && (
              <div className="space-y-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                {/* Bio */}
                {profile.bio && (
                  <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed max-w-2xl">
                    {profile.bio}
                  </p>
                )}

                {/* Meta Etiketleri (Konum, Şirket, Blog, Üyelik Tarihi) */}
                {(profile.location || profile.company || profile.blog || memberSinceFormatted) && (
                  <div className="flex items-center gap-x-4 gap-y-2 flex-wrap text-xs text-slate-500 dark:text-slate-400">
                    {profile.location && (
                      <span className="inline-flex items-center gap-1.5 truncate">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{profile.location}</span>
                      </span>
                    )}

                    {profile.company && (
                      <span className="inline-flex items-center gap-1.5 truncate">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{profile.company}</span>
                      </span>
                    )}

                    {profile.blog && (
                      <a
                        href={profile.blog.startsWith('http') ? profile.blog : `https://${profile.blog}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 truncate max-w-xs transition-colors"
                      >
                        <Link2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{profile.blog.replace(/^https?:\/\//, '')}</span>
                      </a>
                    )}

                    {memberSinceFormatted && (
                      <span className="inline-flex items-center gap-1.5 truncate">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{t.metricMemberSince}: {memberSinceFormatted}</span>
                      </span>
                    )}
                  </div>
                )}

                {/* 6 Hızlı Metrik Kartı Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  
                  {/* 1. Geri Takip Etmeyenler */}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('unfollowers');
                      setIsNetworkOpen(true);
                      document.getElementById('network-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="bg-slate-50 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-100/70 dark:hover:bg-slate-900/90 rounded-lg p-3.5 flex flex-col justify-between text-left transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center justify-between text-rose-600 dark:text-rose-400 mb-1.5">
                      <span className="text-[10px] font-semibold uppercase tracking-wider">{t.metricUnfollowers}</span>
                      <UserX className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-mono text-2xl font-bold text-rose-600 dark:text-rose-400">{unfollowers.length}</span>
                      <p className="text-[10px] text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-400 mt-0.5 truncate transition-colors">{t.metricUnfollowersDesc}</p>
                    </div>
                  </button>

                  {/* 2. Toplam Yıldız Sayısı */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsReposOpen(true);
                      document.getElementById('repositories-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="bg-slate-50 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-100/70 dark:hover:bg-slate-900/90 rounded-lg p-3.5 flex flex-col justify-between text-left transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center justify-between text-amber-500 dark:text-amber-400 mb-1.5">
                      <span className="text-[10px] font-semibold uppercase tracking-wider">{t.metricTotalStars}</span>
                      <Star className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-mono text-2xl font-bold text-slate-900 dark:text-slate-100">{totalStars}</span>
                      <p className="text-[10px] text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-400 mt-0.5 truncate transition-colors">{t.metricTotalStarsDesc}</p>
                    </div>
                  </button>

                  {/* 3. Takipçi Sayısı */}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('fans');
                      setIsNetworkOpen(true);
                      document.getElementById('network-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="bg-slate-50 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-100/70 dark:hover:bg-slate-900/90 rounded-lg p-3.5 flex flex-col justify-between text-left transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 mb-1.5 transition-colors">
                      <span className="text-[10px] font-semibold uppercase tracking-wider">{t.metricFollowers}</span>
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-mono text-2xl font-bold text-slate-900 dark:text-slate-100">{profile.followers}</span>
                      <p className="text-[10px] text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-400 mt-0.5 truncate transition-colors">{t.metricFollowersDesc}</p>
                    </div>
                  </button>

                  {/* 4. Takip Edilen Sayısı */}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('following');
                      setIsNetworkOpen(true);
                      document.getElementById('network-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="bg-slate-50 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-100/70 dark:hover:bg-slate-900/90 rounded-lg p-3.5 flex flex-col justify-between text-left transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 mb-1.5 transition-colors">
                      <span className="text-[10px] font-semibold uppercase tracking-wider">{t.metricFollowing}</span>
                      <UserCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-mono text-2xl font-bold text-slate-900 dark:text-slate-100">{profile.following}</span>
                      <p className="text-[10px] text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-400 mt-0.5 truncate transition-colors">{t.metricFollowingDesc}</p>
                    </div>
                  </button>

                  {/* 5. Karşılıklı Takip */}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('mutuals');
                      setIsNetworkOpen(true);
                      document.getElementById('network-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="bg-slate-50 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-100/70 dark:hover:bg-slate-900/90 rounded-lg p-3.5 flex flex-col justify-between text-left transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 mb-1.5">
                      <span className="text-[10px] font-semibold uppercase tracking-wider">{t.metricMutuals}</span>
                      <HeartHandshake className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-mono text-2xl font-bold text-slate-900 dark:text-slate-100">{mutuals.length}</span>
                      <p className="text-[10px] text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-400 mt-0.5 truncate transition-colors">{t.metricMutualsDesc}</p>
                    </div>
                  </button>

                  {/* 6. Repolar */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsReposOpen(true);
                      document.getElementById('repositories-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="bg-slate-50 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-100/70 dark:hover:bg-slate-900/90 rounded-lg p-3.5 flex flex-col justify-between text-left transition-colors group cursor-pointer"
                    title={t.metricReposDesc}
                  >
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 mb-1.5 transition-colors">
                      <span className="text-[10px] font-semibold uppercase tracking-wider">{t.metricRepos}</span>
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-mono text-2xl font-bold text-slate-900 dark:text-slate-100">{profile.public_repos}</span>
                      <p className="text-[10px] text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-400 mt-0.5 truncate transition-colors">{t.metricReposDesc}</p>
                    </div>
                  </button>

                </div>

                {/* 2. Düzey Hesap & Repo Metrikleri */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                  <div className="p-3 bg-slate-50/70 dark:bg-slate-950/50 border border-slate-200/80 dark:border-slate-800 rounded-lg flex items-center gap-3">
                    <div className="p-2 rounded-md bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 shrink-0">
                      <GitFork className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">{t.metricTotalForks}</span>
                      <span className="font-mono text-base font-bold text-slate-900 dark:text-slate-100">{totalForks}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50/70 dark:bg-slate-950/50 border border-slate-200/80 dark:border-slate-800 rounded-lg flex items-center gap-3">
                    <div className="p-2 rounded-md bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 shrink-0">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">{t.metricGists}</span>
                      <span className="font-mono text-base font-bold text-slate-900 dark:text-slate-100">{profile.public_gists || 0}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50/70 dark:bg-slate-950/50 border border-slate-200/80 dark:border-slate-800 rounded-lg flex items-center gap-3">
                    <div className="p-2 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 shrink-0">
                      <Code2 className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">{t.metricPrimaryLang}</span>
                      <span className="font-mono text-base font-bold text-slate-900 dark:text-slate-100 truncate block">
                        {topLanguage ? topLanguage.language : '—'}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50/70 dark:bg-slate-950/50 border border-slate-200/80 dark:border-slate-800 rounded-lg flex items-center gap-3">
                    <div className="p-2 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 shrink-0">
                      <FolderGit2 className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">{t.metricSources}</span>
                      <span className="font-mono text-base font-bold text-slate-900 dark:text-slate-100">
                        {repoBreakdown.sources} <span className="text-xs text-slate-400 font-normal">/ {repos.length}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Yıllık Commit & Katkı Grafiği Paneli */}
                <div className="p-4 sm:p-5 bg-slate-50/60 dark:bg-slate-950/50 border border-slate-200/80 dark:border-slate-800 rounded-xl space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded-md bg-cyan-100 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400">
                        <Activity className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                          {t.commitActivityTitle}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          {t.commitActivitySubtitle}
                        </p>
                      </div>
                    </div>

                    <a
                      href={`https://github.com/${profile.login}?tab=overview`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors self-start sm:self-auto"
                    >
                      <span>{t.viewOnGithub}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  {/* SVG Grafiği */}
                  <div className="overflow-x-auto py-2 px-1 bg-white/60 dark:bg-slate-900/40 rounded-lg border border-slate-200/60 dark:border-slate-800/80">
                    <img
                      src={`https://ghchart.rshah.org/${theme === 'dark' ? '06b6d4' : '0284c7'}/${profile.login}`}
                      alt={`${profile.login} GitHub Contribution Chart`}
                      className="w-full min-w-[650px] max-h-[140px] object-contain mx-auto select-none"
                      loading="lazy"
                    />
                  </div>
                </div>

              </div>
            )}
          </section>

          {/* 2. ETKİLEŞİMLİ LİSTE VE SEKMELER (TABS & LIST) */}
          <section id="network-section" className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl p-5 sm:p-6 shadow-sm space-y-5">
            
            {/* Section Accordion Header */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => setIsNetworkOpen((prev) => !prev)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setIsNetworkOpen((prev) => !prev);
                }
              }}
              aria-expanded={isNetworkOpen}
              className="flex items-center justify-between gap-3 cursor-pointer select-none group"
              title={isNetworkOpen ? t.collapseSection : t.expandSection}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-colors">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-100">
                      {t.networkSectionTitle}
                    </h3>
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {activeTab === 'unfollowers'
                        ? unfollowers.length
                        : activeTab === 'fans'
                        ? fans.length
                        : activeTab === 'mutuals'
                        ? mutuals.length
                        : following.length}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {t.networkSectionSubtitle}
                  </p>
                </div>
              </div>

              <div className="p-1.5 rounded-lg text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <ChevronDown
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isNetworkOpen ? 'rotate-180 text-slate-900 dark:text-slate-100' : ''
                  }`}
                />
              </div>
            </div>

            {/* Collapsible Body */}
            {isNetworkOpen && (
              <div className="space-y-5 pt-3 border-t border-slate-100 dark:border-slate-800">
                {/* Sekme Butonları (Tabs) */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-100 dark:border-slate-800">
                  <button
                onClick={() => setActiveTab('unfollowers')}
                className={`px-3.5 py-2 rounded-lg font-medium text-xs transition-colors shrink-0 flex items-center gap-2 cursor-pointer ${
                  activeTab === 'unfollowers'
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <UserX className="w-3.5 h-3.5" />
                <span>{t.tabUnfollowers}</span>
                <span className={`px-1.5 py-0.2 text-[10px] font-mono rounded ${
                  activeTab === 'unfollowers'
                    ? 'bg-rose-500 text-white'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}>
                  {unfollowers.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('fans')}
                className={`px-3.5 py-2 rounded-lg font-medium text-xs transition-colors shrink-0 flex items-center gap-2 cursor-pointer ${
                  activeTab === 'fans'
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>{t.tabFans}</span>
                <span className={`px-1.5 py-0.2 text-[10px] font-mono rounded ${
                  activeTab === 'fans'
                    ? 'bg-slate-700 text-white dark:bg-slate-300 dark:text-slate-950'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}>
                  {fans.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('mutuals')}
                className={`px-3.5 py-2 rounded-lg font-medium text-xs transition-colors shrink-0 flex items-center gap-2 cursor-pointer ${
                  activeTab === 'mutuals'
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <HeartHandshake className="w-3.5 h-3.5" />
                <span>{t.tabMutuals}</span>
                <span className={`px-1.5 py-0.2 text-[10px] font-mono rounded ${
                  activeTab === 'mutuals'
                    ? 'bg-slate-700 text-white dark:bg-slate-300 dark:text-slate-950'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}>
                  {mutuals.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('following')}
                className={`px-3.5 py-2 rounded-lg font-medium text-xs transition-colors shrink-0 flex items-center gap-2 cursor-pointer ${
                  activeTab === 'following'
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>{t.tabFollowing}</span>
                <span className={`px-1.5 py-0.2 text-[10px] font-mono rounded ${
                  activeTab === 'following'
                    ? 'bg-slate-700 text-white dark:bg-slate-300 dark:text-slate-950'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}>
                  {following.length}
                </span>
              </button>
            </div>

            {/* Arama, Sıralama ve Dışa Aktar Kontrol Çubuğu */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              
              {/* Canlı Liste İçi Arama */}
              <div className="relative w-full sm:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Filter className="w-3.5 h-3.5" />
                </div>
                <input
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={searchFilter}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchFilter(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 text-xs placeholder-slate-400 focus:outline-none focus:border-slate-400 dark:focus:border-slate-600"
                />
              </div>

              {/* Sıralama ve Aktarma Butonları */}
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="A-Z / Z-A Sırala"
                >
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  <span>{sortOrder === 'asc' ? t.sortAsc : t.sortDesc}</span>
                </button>

                <div className="flex items-center gap-1.5 border-l border-slate-200 dark:border-slate-800 pl-2">
                  <button
                    onClick={() => exportData('csv')}
                    disabled={currentList.length === 0}
                    className="px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="CSV olarak indir"
                  >
                    <Download className="w-3 h-3 text-slate-500" />
                    <span>{t.exportCsv}</span>
                  </button>
                  <button
                    onClick={() => exportData('json')}
                    disabled={currentList.length === 0}
                    className="px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="JSON olarak indir"
                  >
                    <Download className="w-3 h-3 text-slate-500" />
                    <span>{t.exportJson}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* KULLANICI KARTLARI GRID / LİSTESİ */}
            {currentList.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 dark:bg-slate-950/40 rounded-lg border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500 mx-auto flex items-center justify-center">
                  <UserX className="w-5 h-5" />
                </div>
                <h4 className="text-slate-800 dark:text-slate-200 font-semibold text-sm">{t.noUsersTitle}</h4>
                <p className="text-slate-500 text-xs max-w-sm mx-auto">
                  {searchFilter ? t.noUsersMsgSearch : t.noUsersMsgTab}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[600px] overflow-y-auto pr-1">
                {currentList.map((user) => (
                  <div
                    key={user.id || user.login}
                    className="bg-slate-50/50 dark:bg-slate-950/40 hover:bg-white dark:hover:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 rounded-lg p-3 transition-colors flex items-center justify-between gap-2.5"
                  >
                    {/* Profil Resmi & İsim */}
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <img
                        src={user.avatar_url}
                        alt={user.login}
                        className="w-9 h-9 rounded-lg border border-slate-200 dark:border-slate-800 object-cover shrink-0"
                        loading="lazy"
                      />
                      <div className="truncate">
                        <h4 className="font-semibold font-mono text-slate-900 dark:text-slate-200 text-xs truncate">
                          {user.login}
                        </h4>
                        <span className="text-[10px] text-slate-400 truncate block">{t.userGithubBadge}</span>
                      </div>
                    </div>

                    {/* Eylem Butonları */}
                    <div className="flex items-center gap-1 shrink-0">
                      {/* Kullanıcı Adı Kopyala */}
                      <button
                        onClick={() => handleCopyUsername(user.login)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
                        title={t.copyUsername}
                      >
                        {copiedUser === user.login ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>

                      {/* Profile Git Butonu */}
                      <a
                        href={user.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 bg-white dark:bg-slate-800 hover:bg-slate-900 hover:text-white dark:hover:bg-slate-100 dark:hover:text-slate-950 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-md border border-slate-200 dark:border-slate-700 transition-colors inline-flex items-center gap-1"
                      >
                        <span>{t.profileBtn}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
                </div>
              )}

            </div>
          )}

          </section>

          {/* 3. REPOSITORIES SECTION */}
          <RepositorySection
            repos={repos}
            lang={lang}
            isOpen={isReposOpen}
            onToggle={() => setIsReposOpen((prev) => !prev)}
            username={profile.login}
          />

        </main>
      )}

      {/* ==================== FOOTER ALANI ==================== */}
      <footer className="text-center py-6 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 space-y-1">
        <p>WhoDisGit &copy; {new Date().getFullYear()} — {t.footerRights}</p>
        <p className="text-[11px] text-slate-400 dark:text-slate-500">
          {t.footerPrivacy}
        </p>
      </footer>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        theme={theme}
        onThemeChange={setTheme}
        lang={lang}
        onLanguageChange={handleLanguageChange}
      />

    </div>
  );
}
