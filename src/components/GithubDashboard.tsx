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
  Github,
  Sparkles,
  ArrowUpDown,
  Filter,
  Trash2,
  Globe,
  Sun,
  Moon,
  Info
} from 'lucide-react';

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

  const toggleTheme = (): void => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // --- Dil Seçimi Durumu (i18n) ---
  const [lang, setLang] = useState<Language>(() => {
    const savedLang = localStorage.getItem('whodisgit_lang') as Language;
    return savedLang === 'en' || savedLang === 'tr' ? savedLang : 'tr';
  });

  const t = translations[lang];

  const handleLanguageChange = (newLang: Language): void => {
    setLang(newLang);
    localStorage.setItem('whodisgit_lang', newLang);
  };

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
  const [followers, setFollowers] = useState<GithubSimpleUser[]>([]);
  const [following, setFollowing] = useState<GithubSimpleUser[]>([]);

  // UI / Tab & Filtreleme Durumları
  const [activeTab, setActiveTab] = useState<ActiveTab>('unfollowers');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [copiedUser, setCopiedUser] = useState<string | null>(null);

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
          const apiErr: ApiError = {
            code: 403,
            title: t.errRateLimitTitle,
            message: t.errRateLimitMsg(resetTime)
          };
          throw apiErr;
        } else if (res.status === 401) {
          const apiErr: ApiError = {
            code: 401,
            title: t.errUnauthorizedTitle,
            message: t.errUnauthorizedMsg
          };
          throw apiErr;
        }
        const apiErr: ApiError = {
          code: res.status,
          title: t.errGenericTitle,
          message: t.errGenericMsg(res.status)
        };
        throw apiErr;
      }

      const data: GithubSimpleUser[] = await res.json();
      if (!Array.isArray(data) || data.length === 0) break;
      allData = allData.concat(data);

      if (data.length < perPage) break;
    }

    return allData;
  };

  // --- Toplam Yıldız Sayısını Hesaplama ---
  const fetchTotalStars = async (
    userLogin: string,
    totalPublicRepos: number,
    headers: Record<string, string>
  ): Promise<number> => {
    try {
      setStatusMessage(t.calculatingStars);
      const perPage = 100;
      const totalPages = Math.min(Math.ceil(totalPublicRepos / perPage) || 1, 5);
      let starsSum = 0;

      for (let page = 1; page <= totalPages; page++) {
        const res = await fetch(`https://api.github.com/users/${userLogin}/repos?per_page=${perPage}&page=${page}&type=owner`, { headers });
        if (!res.ok) break;
        const repos: GithubRepo[] = await res.json();
        if (!Array.isArray(repos) || repos.length === 0) break;

        starsSum += repos.reduce((acc, repo) => acc + (repo.stargazers_count || 0), 0);
        if (repos.length < perPage) break;
      }
      return starsSum;
    } catch (e) {
      console.warn('Yıldız sayısı hesaplanırken hata oluştu:', e);
      return 0;
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
    setTotalStars(0);
    setStatusMessage(t.fetchingProfile);

    const headers = getHeaders(pat);

    try {
      const userRes = await fetch(`https://api.github.com/users/${cleanUsername}`, { headers });
      
      if (!userRes.ok) {
        if (userRes.status === 404) {
          const apiErr: ApiError = {
            code: 404,
            title: t.errUserNotFoundTitle,
            message: t.errUserNotFoundMsg(cleanUsername)
          };
          throw apiErr;
        } else if (userRes.status === 403) {
          const apiErr: ApiError = {
            code: 403,
            title: t.errRateLimitTitle,
            message: t.errRateLimitMsg()
          };
          throw apiErr;
        } else if (userRes.status === 401) {
          const apiErr: ApiError = {
            code: 401,
            title: t.errUnauthorizedTitle,
            message: t.errUnauthorizedMsg
          };
          throw apiErr;
        }
        const apiErr: ApiError = {
          code: userRes.status,
          title: t.errGenericTitle,
          message: t.errGenericMsg(userRes.status)
        };
        throw apiErr;
      }

      const userData: GithubUser = await userRes.json();
      setProfile(userData);

      const [fetchedFollowers, fetchedFollowing, calculatedStars] = await Promise.all([
        fetchAllPages(`https://api.github.com/users/${cleanUsername}/followers`, userData.followers, 'followers', headers),
        fetchAllPages(`https://api.github.com/users/${cleanUsername}/following`, userData.following, 'following', headers),
        fetchTotalStars(userData.login, userData.public_repos, headers)
      ]);

      setFollowers(fetchedFollowers);
      setFollowing(fetchedFollowing);
      setTotalStars(calculatedStars);

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* ==================== DİL SEÇİCİ & TEMA BUTONU & HERO / HEADER ALANI ==================== */}
      <header className="relative text-center space-y-4 pt-4">
        
        {/* Üst Sağ: Tema (Koyu/Açık) ve Dil Seçici Kontrolleri */}
        <div className="absolute top-0 right-0 flex items-center gap-2">
          
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-lg backdrop-blur-md text-slate-700 dark:text-slate-200 hover:text-cyan-600 dark:hover:text-cyan-400 transition-all cursor-pointer"
            title={theme === 'dark' ? t.themeLight : t.themeDark}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>

          {/* Language Switcher Pill */}
          <div className="flex items-center gap-1 p-1 bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-lg backdrop-blur-md">
            <Globe className="w-4 h-4 text-slate-400 ml-1.5" />
            <button
              onClick={() => handleLanguageChange('tr')}
              className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                lang === 'tr'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              🇹🇷 TR
            </button>
            <button
              onClick={() => handleLanguageChange('en')}
              className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                lang === 'en'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              🇬🇧 EN
            </button>
          </div>
        </div>

        {/* Hero Rozeti */}
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/80 dark:bg-slate-900/90 border border-cyan-500/40 text-cyan-600 dark:text-cyan-400 text-sm font-medium shadow-lg shadow-cyan-500/10 backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-cyan-500 dark:text-cyan-400 animate-pulse" />
          <span>{t.heroBadge}</span>
        </div>

        {/* Başlık */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-cyan-600 dark:from-white dark:via-slate-200 dark:to-cyan-400 bg-clip-text text-transparent">
          WhoDis<span className="text-cyan-500 dark:text-cyan-400">{t.heroTitleSuffix}</span>
        </h1>

        <p className="max-w-2xl mx-auto text-slate-600 dark:text-slate-400 text-base sm:text-lg font-light">
          {t.heroSubtitle}
        </p>
      </header>

      {/* ==================== FORM / INPUT ALANI ==================== */}
      <section className="bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden transition-all">
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <form onSubmit={handleAnalyze} className="space-y-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* 1. GitHub Kullanıcı Adı Input */}
            <div className="space-y-2">
              <label htmlFor="github-username" className="block text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center justify-between">
                <span>{t.usernameLabel} <span className="text-rose-500 dark:text-rose-400">*</span></span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Github className="w-5 h-5" />
                </div>
                <input
                  id="github-username"
                  type="text"
                  placeholder={t.usernamePlaceholder}
                  value={username}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-100/90 dark:bg-slate-950/70 border border-slate-300 dark:border-slate-700/80 rounded-2xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all font-medium"
                  required
                />
              </div>
            </div>

            {/* 2. Personal Access Token (PAT) Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="github-pat" className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                  {t.patLabel} <span className="text-slate-400 text-xs font-normal">{t.patOptional}</span>
                </label>
                <a
                  href="https://github.com/settings/tokens/new?scopes=read:user&description=WhoDisGit"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1 transition-colors"
                >
                  <Key className="w-3 h-3" /> {t.patCreateToken}
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Key className="w-5 h-5" />
                </div>
                <input
                  id="github-pat"
                  type={showPat ? 'text' : 'password'}
                  placeholder={t.patPlaceholder}
                  value={pat}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPat(e.target.value)}
                  className="w-full pl-11 pr-12 py-3.5 bg-slate-100/90 dark:bg-slate-950/70 border border-slate-300 dark:border-slate-700/80 rounded-2xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all font-mono text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPat(!showPat)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                  title={showPat ? 'Gizle' : 'Göster'}
                >
                  {showPat ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Geçmiş Aramalar Hızlı Seçim */}
          {recentSearches.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap pt-1">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t.recentSearches}</span>
              {recentSearches.map((searchedUser) => (
                <button
                  key={searchedUser}
                  type="button"
                  onClick={() => setUsername(searchedUser)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700/60 rounded-xl text-xs text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-300 transition-all group cursor-pointer"
                >
                  <span>@{searchedUser}</span>
                  <span
                    onClick={(e: React.MouseEvent) => removeRecentSearch(searchedUser, e)}
                    className="text-slate-400 hover:text-rose-500 rounded p-0.5"
                    title="Kaldır"
                  >
                    ×
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Alt Seçenekler ve Analiz Butonu */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-200 dark:border-slate-800/80">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-cyan-500 focus:ring-cyan-500/30 bg-white dark:bg-slate-950 cursor-pointer"
                  />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                    {t.rememberMe}
                  </span>
                </label>

                {/* Info Tooltip */}
                <div className="relative group/tooltip inline-flex items-center">
                  <Info className="w-4 h-4 text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 cursor-pointer transition-colors" />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/tooltip:block w-72 p-3 bg-slate-900 dark:bg-slate-800 text-slate-100 dark:text-slate-200 text-xs rounded-2xl shadow-2xl border border-slate-700 dark:border-slate-600 z-30 transition-all leading-relaxed">
                    {t.rememberInfoTooltip}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900 dark:border-t-slate-800"></div>
                  </div>
                </div>
              </div>

              {(localStorage.getItem('whodisgit_username') || localStorage.getItem('whodisgit_pat')) && (
                <button
                  type="button"
                  onClick={handleClearSavedData}
                  className="text-xs text-rose-500 dark:text-rose-400 hover:text-rose-600 dark:hover:text-rose-300 flex items-center gap-1 transition-colors cursor-pointer ml-2"
                  title="Kayıtlı bilgileri temizle"
                >
                  <Trash2 className="w-3.5 h-3.5" /> {t.clearRecords}
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-semibold rounded-2xl shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin text-white" />
                  <span>{t.analyzingBtn}</span>
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  <span>{t.analyzeBtn}</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Yüklenme Durum Çubuğu */}
        {loading && (
          <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800/60 animate-fade-in">
            <div className="flex items-center justify-between text-sm text-cyan-600 dark:text-cyan-400 font-medium mb-2">
              <span className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-cyan-600 dark:text-cyan-400" />
                {statusMessage}
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-950 rounded-full h-2 overflow-hidden">
              <div className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-full w-full animate-pulse"></div>
            </div>
          </div>
        )}
      </section>

      {/* ==================== HATA BİLDİRİM KUTUSU ==================== */}
      {error && (
        <section className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/80 rounded-3xl p-6 shadow-xl backdrop-blur-xl flex items-start gap-4 text-rose-800 dark:text-rose-200 animate-fade-in">
          <div className="p-3 bg-rose-100 dark:bg-rose-900/50 rounded-2xl text-rose-600 dark:text-rose-400 shrink-0">
            {error.code === 403 ? <ShieldAlert className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-lg text-rose-900 dark:text-rose-300">{error.title}</h3>
            <p className="text-sm text-rose-700 dark:text-rose-200/90 leading-relaxed">{error.message}</p>
          </div>
        </section>
      )}

      {/* ==================== SONUÇ KARTLARI VE EKRAN ==================== */}
      {profile && !loading && (
        <main className="space-y-10 animate-fade-in">
          
          {/* 1. PROFİL KARTI VE ÖZET METRİKLER */}
          <section className="bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-8">
            
            {/* Üst Bilgiler: Avatar & Kullanıcı Künyesi */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
              <div className="relative group shrink-0">
                <img
                  src={profile.avatar_url}
                  alt={profile.name || profile.login}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-slate-100 dark:border-slate-800 shadow-xl object-cover"
                />
                <div className="absolute inset-0 rounded-full border-2 border-cyan-500/40 pointer-events-none group-hover:scale-105 transition-transform"></div>
              </div>

              <div className="space-y-2 flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
                      {profile.name || profile.login}
                    </h2>
                    <a
                      href={profile.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-600 dark:text-cyan-400 hover:underline font-medium inline-flex items-center gap-1 text-sm mt-0.5"
                    >
                      @{profile.login} <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <a
                    href={profile.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700/80 inline-flex items-center justify-center gap-2 transition-all self-center sm:self-auto"
                  >
                    <Github className="w-4 h-4" /> {t.openGithubProfile}
                  </a>
                </div>

                {profile.bio && (
                  <p className="text-slate-600 dark:text-slate-300 text-sm max-w-3xl leading-relaxed pt-1 font-normal">
                    {profile.bio}
                  </p>
                )}
              </div>
            </div>

            {/* 6 Hızlı Metrik Kartı Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
              
              {/* 1. Geri Takip Etmeyenler */}
              <div className="bg-gradient-to-br from-rose-100 to-rose-50 dark:from-rose-950/60 dark:to-slate-900 border border-rose-200 dark:border-rose-800/60 rounded-2xl p-4 flex flex-col justify-between shadow-sm">
                <div className="flex items-center justify-between text-rose-600 dark:text-rose-400 mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider">{t.metricUnfollowers}</span>
                  <UserX className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-3xl font-extrabold text-rose-600 dark:text-rose-400">{unfollowers.length}</span>
                  <p className="text-[11px] text-rose-700/80 dark:text-rose-300/70 mt-0.5">{t.metricUnfollowersDesc}</p>
                </div>
              </div>

              {/* 2. Toplam Yıldız Sayısı */}
              <div className="bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-sm">
                <div className="flex items-center justify-between text-amber-500 dark:text-amber-400 mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider">{t.metricTotalStars}</span>
                  <Star className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">{totalStars}</span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{t.metricTotalStarsDesc}</p>
                </div>
              </div>

              {/* 3. Takipçi Sayısı */}
              <div className="bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-sm">
                <div className="flex items-center justify-between text-cyan-600 dark:text-cyan-400 mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider">{t.metricFollowers}</span>
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">{profile.followers}</span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{t.metricFollowersDesc}</p>
                </div>
              </div>

              {/* 4. Takip Edilen Sayısı */}
              <div className="bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-sm">
                <div className="flex items-center justify-between text-indigo-600 dark:text-indigo-400 mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider">{t.metricFollowing}</span>
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">{profile.following}</span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{t.metricFollowingDesc}</p>
                </div>
              </div>

              {/* 5. Karşılıklı Takip */}
              <div className="bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-sm">
                <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider">{t.metricMutuals}</span>
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">{mutuals.length}</span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{t.metricMutualsDesc}</p>
                </div>
              </div>

              {/* 6. Repolar */}
              <div className="bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-sm">
                <div className="flex items-center justify-between text-purple-600 dark:text-purple-400 mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider">{t.metricRepos}</span>
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">{profile.public_repos}</span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{t.metricReposDesc}</p>
                </div>
              </div>

            </div>
          </section>

          {/* 2. ETKİLEŞİMLİ LİSTE VE SEKMELER (TABS & LIST) */}
          <section className="bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
            
            {/* Sekme Butonları (Tabs) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800 scrollbar-none">
              <button
                onClick={() => setActiveTab('unfollowers')}
                className={`px-5 py-3 rounded-2xl font-medium text-sm transition-all shrink-0 flex items-center gap-2.5 cursor-pointer ${
                  activeTab === 'unfollowers'
                    ? 'bg-rose-500/10 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-500/30 dark:border-rose-500/40 shadow-md font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <UserX className="w-4 h-4" />
                <span>{t.tabUnfollowers}</span>
                <span className={`px-2 py-0.5 text-xs rounded-full ${activeTab === 'unfollowers' ? 'bg-rose-500/20 text-rose-800 dark:text-rose-200 font-bold' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                  {unfollowers.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('fans')}
                className={`px-5 py-3 rounded-2xl font-medium text-sm transition-all shrink-0 flex items-center gap-2.5 cursor-pointer ${
                  activeTab === 'fans'
                    ? 'bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-800 dark:text-cyan-300 border border-cyan-500/30 dark:border-cyan-500/40 shadow-md font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                <span>{t.tabFans}</span>
                <span className={`px-2 py-0.5 text-xs rounded-full ${activeTab === 'fans' ? 'bg-cyan-500/20 text-cyan-900 dark:text-cyan-200 font-bold' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                  {fans.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('mutuals')}
                className={`px-5 py-3 rounded-2xl font-medium text-sm transition-all shrink-0 flex items-center gap-2.5 cursor-pointer ${
                  activeTab === 'mutuals'
                    ? 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30 dark:border-emerald-500/40 shadow-md font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <HeartHandshake className="w-4 h-4" />
                <span>{t.tabMutuals}</span>
                <span className={`px-2 py-0.5 text-xs rounded-full ${activeTab === 'mutuals' ? 'bg-emerald-500/20 text-emerald-900 dark:text-emerald-200 font-bold' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                  {mutuals.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('following')}
                className={`px-5 py-3 rounded-2xl font-medium text-sm transition-all shrink-0 flex items-center gap-2.5 cursor-pointer ${
                  activeTab === 'following'
                    ? 'bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-800 dark:text-indigo-300 border border-indigo-500/30 dark:border-indigo-500/40 shadow-md font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>{t.tabFollowing}</span>
                <span className={`px-2 py-0.5 text-xs rounded-full ${activeTab === 'following' ? 'bg-indigo-500/20 text-indigo-900 dark:text-indigo-200 font-bold' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                  {following.length}
                </span>
              </button>
            </div>

            {/* Arama, Sıralama ve Dışa Aktar Kontrol Çubuğu */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              
              {/* Canlı Liste İçi Arama */}
              <div className="relative w-full sm:w-72">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Filter className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={searchFilter}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-100/90 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 text-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                />
              </div>

              {/* Sıralama ve Aktarma Butonları */}
              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="px-3 py-2 bg-slate-100/90 dark:bg-slate-950/80 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-300 text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="A-Z / Z-A Sırala"
                >
                  <ArrowUpDown className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                  <span>{sortOrder === 'asc' ? t.sortAsc : t.sortDesc}</span>
                </button>

                <div className="flex items-center gap-1.5 border-l border-slate-200 dark:border-slate-800 pl-3">
                  <button
                    onClick={() => exportData('csv')}
                    disabled={currentList.length === 0}
                    className="px-3 py-2 bg-slate-100/90 dark:bg-slate-950/80 hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-40 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-300 text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="CSV olarak indir"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>{t.exportCsv}</span>
                  </button>
                  <button
                    onClick={() => exportData('json')}
                    disabled={currentList.length === 0}
                    className="px-3 py-2 bg-slate-100/90 dark:bg-slate-950/80 hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-40 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-300 text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="JSON olarak indir"
                  >
                    <Download className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span>{t.exportJson}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* KULLANICI KARTLARI GRID / LİSTESİ */}
            {currentList.length === 0 ? (
              <div className="text-center py-16 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-200 dark:border-slate-800/60 space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 mx-auto flex items-center justify-center">
                  <UserX className="w-6 h-6" />
                </div>
                <h4 className="text-slate-800 dark:text-slate-300 font-semibold text-base">{t.noUsersTitle}</h4>
                <p className="text-slate-500 dark:text-slate-500 text-xs max-w-sm mx-auto">
                  {searchFilter ? t.noUsersMsgSearch : t.noUsersMsgTab}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[650px] overflow-y-auto pr-1">
                {currentList.map((user) => (
                  <div
                    key={user.id || user.login}
                    className="bg-white dark:bg-slate-950/60 hover:bg-slate-50 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 rounded-2xl p-4 transition-all duration-200 flex items-center justify-between gap-3 group shadow-sm hover:shadow-md"
                  >
                    {/* Profil Resmi & İsim */}
                    <div className="flex items-center gap-3 overflow-hidden">
                      <img
                        src={user.avatar_url}
                        alt={user.login}
                        className="w-11 h-11 rounded-full border border-slate-200 dark:border-slate-700 object-cover shrink-0"
                        loading="lazy"
                      />
                      <div className="truncate">
                        <h4 className="font-semibold text-slate-900 dark:text-slate-200 text-sm truncate group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
                          {user.login}
                        </h4>
                        <span className="text-[11px] text-slate-500 truncate block">{t.userGithubBadge}</span>
                      </div>
                    </div>

                    {/* Eylem Butonları */}
                    <div className="flex items-center gap-1 shrink-0">
                      {/* Kullanıcı Adı Kopyala */}
                      <button
                        onClick={() => handleCopyUsername(user.login)}
                        className="p-2 text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                        title={t.copyUsername}
                      >
                        {copiedUser === user.login ? (
                          <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>

                      {/* Profile Git Butonu */}
                      <a
                        href={user.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700/80 transition-all inline-flex items-center gap-1"
                      >
                        <span>{t.profileBtn}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </section>

        </main>
      )}

      {/* ==================== FOOTER ALANI ==================== */}
      <footer className="text-center py-6 border-t border-slate-200 dark:border-slate-800/80 text-xs text-slate-500 space-y-2">
        <p>WhoDisGit &copy; {new Date().getFullYear()} — {t.footerRights}</p>
        <p className="text-[11px] text-slate-500 dark:text-slate-600">
          {t.footerPrivacy}
        </p>
      </footer>

    </div>
  );
}
