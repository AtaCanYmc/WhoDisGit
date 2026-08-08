export type Language = 'tr' | 'en';

export interface TranslationSchema {
  heroBadge: string;
  heroTitleSuffix: string;
  heroSubtitle: string;
  usernameLabel: string;
  usernamePlaceholder: string;
  patLabel: string;
  patOptional: string;
  patCreateToken: string;
  patPlaceholder: string;
  recentSearches: string;
  rememberMe: string;
  rememberInfoTooltip: string;
  clearRecords: string;
  analyzeBtn: string;
  analyzingBtn: string;
  fetchingProfile: string;
  fetchingFollowers: (page: number, total: number) => string;
  fetchingFollowing: (page: number, total: number) => string;
  calculatingStars: string;
  analysisComplete: string;
  themeDark: string;
  themeLight: string;
  
  // Errors
  errMissingUsernameTitle: string;
  errMissingUsernameMsg: string;
  errRateLimitTitle: string;
  errRateLimitMsg: (resetTime?: string) => string;
  errUnauthorizedTitle: string;
  errUnauthorizedMsg: string;
  errUserNotFoundTitle: string;
  errUserNotFoundMsg: (user: string) => string;
  errGenericTitle: string;
  errGenericMsg: (status?: number) => string;

  // Profile Card & Metrics
  openGithubProfile: string;
  metricUnfollowers: string;
  metricUnfollowersDesc: string;
  metricTotalStars: string;
  metricTotalStarsDesc: string;
  metricFollowers: string;
  metricFollowersDesc: string;
  metricFollowing: string;
  metricFollowingDesc: string;
  metricMutuals: string;
  metricMutualsDesc: string;
  metricRepos: string;
  metricReposDesc: string;

  // Tabs
  tabUnfollowers: string;
  tabFans: string;
  tabMutuals: string;
  tabFollowing: string;

  // Search & Filters
  searchPlaceholder: string;
  sortAsc: string;
  sortDesc: string;
  exportCsv: string;
  exportJson: string;

  // Card & Empty State
  userGithubBadge: string;
  copyUsername: string;
  profileBtn: string;
  noUsersTitle: string;
  noUsersMsgSearch: string;
  noUsersMsgTab: string;

  // Footer
  footerRights: string;
  footerPrivacy: string;
}

export const translations: Record<Language, TranslationSchema> = {
  tr: {
    heroBadge: 'GitHub Takip Etmeyenler & Profil Analizi',
    heroTitleSuffix: 'Git',
    heroSubtitle: 'Sizi takip etmeyen GitHub kullanıcılarını anında tespit edin, profil istatistiklerinizi analiz edin ve takipçi dengenizi yönetin.',
    usernameLabel: 'GitHub Kullanıcı Adı',
    usernamePlaceholder: 'Örn: octocat',
    patLabel: 'Personal Access Token (PAT)',
    patOptional: '(Opsiyonel)',
    patCreateToken: 'Token Oluştur (read:user)',
    patPlaceholder: 'ghp_xxxxxxxxxxxxxxxxxxxx',
    recentSearches: 'Son Aramalar:',
    rememberMe: 'Bilgileri Hatırla',
    rememberInfoTooltip: 'Girdiğiniz kullanıcı adı ve opsiyonel PAT bilginiz yalnızca tarayıcınızın LocalStorage havuzunda saklanır. Hiçbir sunucuya aktarılmaz veya paylaşılmaz.',
    clearRecords: 'Kayıtları Sil',
    analyzeBtn: 'Analizi Başlat',
    analyzingBtn: 'Analiz Ediliyor...',
    fetchingProfile: 'GitHub profili sorgulanıyor...',
    fetchingFollowers: (page, total) => `Takipçiler çekiliyor... (Sayfa ${page} / ${total})`,
    fetchingFollowing: (page, total) => `Takip Edilenler çekiliyor... (Sayfa ${page} / ${total})`,
    calculatingStars: 'Kamuya açık repoların yıldız sayıları hesaplanıyor...',
    analysisComplete: 'Analiz başarıyla tamamlandı!',
    themeDark: 'Koyu Tema',
    themeLight: 'Açık Tema',

    errMissingUsernameTitle: 'Eksik Kullanıcı Adı',
    errMissingUsernameMsg: 'Lütfen analiz etmek istediğiniz GitHub kullanıcı adını girin.',
    errRateLimitTitle: 'API Limitine Ulaşıldı (Rate Limit Exceeded)',
    errRateLimitMsg: (resetTime) =>
      `GitHub API istek limitiniz doldu.${resetTime ? ` Limit sıfırlanma zamanı: ${resetTime}.` : ''} İstek limitini 60'tan 5.000'e çıkarmak için bir Personal Access Token (PAT) girin.`,
    errUnauthorizedTitle: 'Geçersiz Token (Unauthorized)',
    errUnauthorizedMsg: 'Girdiğiniz Personal Access Token (PAT) geçersiz veya süresi dolmuş.',
    errUserNotFoundTitle: 'Kullanıcı Bulunamadı',
    errUserNotFoundMsg: (user) => `"${user}" kullanıcı adına sahip bir GitHub profili bulunamadı. Lütfen kullanıcı adını kontrol edin.`,
    errGenericTitle: 'Sunucu Hatası',
    errGenericMsg: (status) => `GitHub API yanıt vermedi${status ? ` (HTTP ${status})` : ''}.`,

    openGithubProfile: 'GitHub Profilini Aç',
    metricUnfollowers: 'Unfollowers',
    metricUnfollowersDesc: 'Sizi takip etmeyenler',
    metricTotalStars: 'Toplam Yıldız',
    metricTotalStarsDesc: 'Kamusal repolardaki',
    metricFollowers: 'Takipçi',
    metricFollowersDesc: 'Sizi takip edenler',
    metricFollowing: 'Takip Edilen',
    metricFollowingDesc: 'Sizin takip ettikleriniz',
    metricMutuals: 'Karşılıklı',
    metricMutualsDesc: 'Karşılıklı takipleşme',
    metricRepos: 'Repolar',
    metricReposDesc: 'Kamusal depolar',

    tabUnfollowers: 'Geri Takip Etmeyenler',
    tabFans: 'Sizin Takip Etmedikleriniz',
    tabMutuals: 'Karşılıklı Takip',
    tabFollowing: 'Tüm Takip Edilenler',

    searchPlaceholder: 'Kullanıcı adı ara...',
    sortAsc: 'A - Z',
    sortDesc: 'Z - A',
    exportCsv: 'CSV',
    exportJson: 'JSON',

    userGithubBadge: 'GitHub Kullanıcısı',
    copyUsername: 'Kullanıcı adını kopyala',
    profileBtn: 'Profil',
    noUsersTitle: 'Hiç Kullanıcı Bulunamadı',
    noUsersMsgSearch: 'Arama kriterlerinize uygun kullanıcı eşleşmedi.',
    noUsersMsgTab: 'Bu sekmede görüntülenecek herhangi bir kullanıcı bulunmuyor.',

    footerRights: 'Tüm hakları saklıdır. GitHub REST API v3 kullanılarak oluşturulmuştur.',
    footerPrivacy: 'Personal Access Token (PAT) bilgisi sadece istemci tarafında (tarayıcınızda) işlenir, hiçbir sunucuya gönderilmez.'
  },
  en: {
    heroBadge: 'GitHub Unfollowers & Profile Analytics',
    heroTitleSuffix: 'Git',
    heroSubtitle: 'Instantly identify GitHub users who don\'t follow you back, analyze your profile metrics, and manage your follower balance.',
    usernameLabel: 'GitHub Username',
    usernamePlaceholder: 'e.g. octocat',
    patLabel: 'Personal Access Token (PAT)',
    patOptional: '(Optional)',
    patCreateToken: 'Create Token (read:user)',
    patPlaceholder: 'ghp_xxxxxxxxxxxxxxxxxxxx',
    recentSearches: 'Recent Searches:',
    rememberMe: 'Remember Info',
    rememberInfoTooltip: 'Your username and optional PAT are stored strictly in your browser\'s LocalStorage. They are never sent or shared with any external server.',
    clearRecords: 'Clear Records',
    analyzeBtn: 'Start Analysis',
    analyzingBtn: 'Analyzing...',
    fetchingProfile: 'Fetching GitHub profile...',
    fetchingFollowers: (page, total) => `Fetching followers... (Page ${page} / ${total})`,
    fetchingFollowing: (page, total) => `Fetching following... (Page ${page} / ${total})`,
    calculatingStars: 'Calculating total stargazers across public repos...',
    analysisComplete: 'Analysis completed successfully!',
    themeDark: 'Dark Theme',
    themeLight: 'Light Theme',

    errMissingUsernameTitle: 'Missing Username',
    errMissingUsernameMsg: 'Please enter the GitHub username you wish to analyze.',
    errRateLimitTitle: 'API Rate Limit Exceeded',
    errRateLimitMsg: (resetTime) =>
      `Your GitHub API rate limit has been reached.${resetTime ? ` Limit resets at: ${resetTime}.` : ''} Enter a Personal Access Token (PAT) to increase your limit from 60 to 5,000 requests/hr.`,
    errUnauthorizedTitle: 'Invalid Token (Unauthorized)',
    errUnauthorizedMsg: 'The Personal Access Token (PAT) provided is invalid or expired.',
    errUserNotFoundTitle: 'User Not Found',
    errUserNotFoundMsg: (user) => `No GitHub profile found for username "${user}". Please check the spelling.`,
    errGenericTitle: 'Server Error',
    errGenericMsg: (status) => `GitHub API failed to respond${status ? ` (HTTP ${status})` : ''}.`,

    openGithubProfile: 'Open GitHub Profile',
    metricUnfollowers: 'Unfollowers',
    metricUnfollowersDesc: 'Users not following back',
    metricTotalStars: 'Total Stars',
    metricTotalStarsDesc: 'In public repositories',
    metricFollowers: 'Followers',
    metricFollowersDesc: 'Users following you',
    metricFollowing: 'Following',
    metricFollowingDesc: 'Users you follow',
    metricMutuals: 'Mutuals',
    metricMutualsDesc: 'Mutual connections',
    metricRepos: 'Repos',
    metricReposDesc: 'Public repositories',

    tabUnfollowers: 'Unfollowers',
    tabFans: 'Fans (Not Followed Back)',
    tabMutuals: 'Mutual Followers',
    tabFollowing: 'All Following',

    searchPlaceholder: 'Search username...',
    sortAsc: 'A - Z',
    sortDesc: 'Z - A',
    exportCsv: 'CSV',
    exportJson: 'JSON',

    userGithubBadge: 'GitHub User',
    copyUsername: 'Copy username',
    profileBtn: 'Profile',
    noUsersTitle: 'No Users Found',
    noUsersMsgSearch: 'No users matched your search criteria.',
    noUsersMsgTab: 'There are no users to display in this tab.',

    footerRights: 'All rights reserved. Built using GitHub REST API v3.',
    footerPrivacy: 'Personal Access Token (PAT) information is strictly processed client-side (in your browser) and never sent to any server.'
  }
};
