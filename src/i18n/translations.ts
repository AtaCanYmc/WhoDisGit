export type Language = 'tr' | 'en' | 'es' | 'de' | 'fr';

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
  settingsTitle: string;
  settingsDesc: string;
  themeSection: string;
  languageSection: string;
  closeBtn: string;
  
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
    settingsTitle: 'Ayarlar',
    settingsDesc: 'Görünüm ve dil tercihlerini yönetin',
    themeSection: 'Tema Tercihi',
    languageSection: 'Dil / Language',
    closeBtn: 'Kapat',

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
    settingsTitle: 'Settings',
    settingsDesc: 'Manage appearance and language preferences',
    themeSection: 'Theme Preference',
    languageSection: 'Language / Dil',
    closeBtn: 'Close',

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
  },
  es: {
    heroBadge: 'No Seguidores y Analizador de Perfil de GitHub',
    heroTitleSuffix: 'Git',
    heroSubtitle: 'Detecta al instante quién no te sigue en GitHub, analiza las métricas de tu perfil y gestiona tu balance de seguidores.',
    usernameLabel: 'Usuario de GitHub',
    usernamePlaceholder: 'Ej: octocat',
    patLabel: 'Personal Access Token (PAT)',
    patOptional: '(Opcional)',
    patCreateToken: 'Crear token (read:user)',
    patPlaceholder: 'ghp_xxxxxxxxxxxxxxxxxxxx',
    recentSearches: 'Búsquedas recientes:',
    rememberMe: 'Recordar datos',
    rememberInfoTooltip: 'Tu usuario y PAT opcional se guardan únicamente en el LocalStorage de tu navegador. Jamás se envían ni se comparten con servidores externos.',
    clearRecords: 'Borrar registros',
    analyzeBtn: 'Iniciar análisis',
    analyzingBtn: 'Analizando...',
    fetchingProfile: 'Consultando perfil de GitHub...',
    fetchingFollowers: (page, total) => `Obteniendo seguidores... (Página ${page} / ${total})`,
    fetchingFollowing: (page, total) => `Obteniendo seguidos... (Página ${page} / ${total})`,
    calculatingStars: 'Calculando estrellas totales en repositorios públicos...',
    analysisComplete: '¡Análisis completado con éxito!',
    themeDark: 'Tema Oscuro',
    themeLight: 'Tema Claro',
    settingsTitle: 'Configuración',
    settingsDesc: 'Gestiona tus preferencias de apariencia e idioma',
    themeSection: 'Preferencia de Tema',
    languageSection: 'Idioma / Language',
    closeBtn: 'Cerrar',

    errMissingUsernameTitle: 'Falta el nombre de usuario',
    errMissingUsernameMsg: 'Por favor, ingresa el nombre de usuario de GitHub que deseas analizar.',
    errRateLimitTitle: 'Límite de peticiones excedido',
    errRateLimitMsg: (resetTime) =>
      `Has alcanzado el límite de peticiones de GitHub API.${resetTime ? ` Se restablece a las: ${resetTime}.` : ''} Ingresa un Token de Acceso Personal (PAT) para aumentar tu límite de 60 a 5.000 peticiones/hora.`,
    errUnauthorizedTitle: 'Token no válido (No autorizado)',
    errUnauthorizedMsg: 'El Token de Acceso Personal (PAT) proporcionado no es válido o ha expirado.',
    errUserNotFoundTitle: 'Usuario no encontrado',
    errUserNotFoundMsg: (user) => `No se encontró ningún perfil de GitHub para el usuario "${user}". Por favor verifica la ortografía.`,
    errGenericTitle: 'Error del servidor',
    errGenericMsg: (status) => `La API de GitHub no respondió${status ? ` (HTTP ${status})` : ''}.`,

    openGithubProfile: 'Abrir perfil de GitHub',
    metricUnfollowers: 'No te siguen',
    metricUnfollowersDesc: 'Usuarios que no te siguen',
    metricTotalStars: 'Estrellas',
    metricTotalStarsDesc: 'En repositorios públicos',
    metricFollowers: 'Seguidores',
    metricFollowersDesc: 'Usuarios que te siguen',
    metricFollowing: 'Siguiendo',
    metricFollowingDesc: 'Usuarios que sigues',
    metricMutuals: 'Mutuos',
    metricMutualsDesc: 'Conexiones mutuas',
    metricRepos: 'Repos',
    metricReposDesc: 'Repositorios públicos',

    tabUnfollowers: 'No te siguen',
    tabFans: 'Fans (No sigues)',
    tabMutuals: 'Seguidores mutuos',
    tabFollowing: 'Todos los seguidos',

    searchPlaceholder: 'Buscar usuario...',
    sortAsc: 'A - Z',
    sortDesc: 'Z - A',
    exportCsv: 'CSV',
    exportJson: 'JSON',

    userGithubBadge: 'Usuario de GitHub',
    copyUsername: 'Copiar usuario',
    profileBtn: 'Perfil',
    noUsersTitle: 'No se encontraron usuarios',
    noUsersMsgSearch: 'Ningún usuario coincide con los criterios de búsqueda.',
    noUsersMsgTab: 'No hay usuarios para mostrar en esta pestaña.',

    footerRights: 'Todos los derechos reservados. Desarrollado con GitHub REST API v3.',
    footerPrivacy: 'Los Tokens de Acceso Personal (PAT) se procesan estrictamente en el navegador del usuario y nunca se envían a ningún servidor.'
  },
  de: {
    heroBadge: 'GitHub Entfolger & Profil-Analytics',
    heroTitleSuffix: 'Git',
    heroSubtitle: 'Erkenne sofort GitHub-Nutzer, die dir nicht zurückfolgen, analysiere deine Profilstatistiken und verwalte dein Follower-Gleichgewicht.',
    usernameLabel: 'GitHub-Benutzername',
    usernamePlaceholder: 'z. B. octocat',
    patLabel: 'Personal Access Token (PAT)',
    patOptional: '(Optional)',
    patCreateToken: 'Token erstellen (read:user)',
    patPlaceholder: 'ghp_xxxxxxxxxxxxxxxxxxxx',
    recentSearches: 'Letzte Suchen:',
    rememberMe: 'Daten merken',
    rememberInfoTooltip: 'Dein Benutzername und das optionale PAT werden ausschließlich im LocalStorage deines Browsers gespeichert. Sie werden niemals an externe Server übertragen.',
    clearRecords: 'Einträge löschen',
    analyzeBtn: 'Analyse starten',
    analyzingBtn: 'Analysiere...',
    fetchingProfile: 'GitHub-Profil wird abgefragt...',
    fetchingFollowers: (page, total) => `Follower werden geladen... (Seite ${page} / ${total})`,
    fetchingFollowing: (page, total) => `Gefolgte werden geladen... (Seite ${page} / ${total})`,
    calculatingStars: 'Gesamtanzahl der Sterne in öffentlichen Repositories wird berechnet...',
    analysisComplete: 'Analyse erfolgreich abgeschlossen!',
    themeDark: 'Dunkles Design',
    themeLight: 'Helles Design',
    settingsTitle: 'Einstellungen',
    settingsDesc: 'Erscheinungsbild und Spracheinstellungen verwalten',
    themeSection: 'Design-Einstellung',
    languageSection: 'Sprache / Language',
    closeBtn: 'Schließen',

    errMissingUsernameTitle: 'Benutzername fehlt',
    errMissingUsernameMsg: 'Bitte gib den GitHub-Benutzernamen ein, den du analysieren möchtest.',
    errRateLimitTitle: 'API-Ratenbegrenzung überschritten',
    errRateLimitMsg: (resetTime) =>
      `Dein GitHub-API-Limit wurde erreicht.${resetTime ? ` Limit wird zurückgesetzt um: ${resetTime}.` : ''} Gib ein Personal Access Token (PAT) ein, um dein Limit von 60 auf 5.000 Anfragen/Std. zu erhöhen.`,
    errUnauthorizedTitle: 'Ungültiges Token (Nicht autorisiert)',
    errUnauthorizedMsg: 'Das angegebene Personal Access Token (PAT) ist ungültig oder abgelaufen.',
    errUserNotFoundTitle: 'Benutzer nicht gefunden',
    errUserNotFoundMsg: (user) => `Kein GitHub-Profil für den Benutzernamen "${user}" gefunden. Bitte überprüfe die Schreibweise.`,
    errGenericTitle: 'Serverfehler',
    errGenericMsg: (status) => `GitHub-API hat nicht geantwortet${status ? ` (HTTP ${status})` : ''}.`,

    openGithubProfile: 'GitHub-Profil öffnen',
    metricUnfollowers: 'Entfolger',
    metricUnfollowersDesc: 'Folgen dir nicht zurück',
    metricTotalStars: 'Gesamtsterne',
    metricTotalStarsDesc: 'In öffentlichen Repositories',
    metricFollowers: 'Follower',
    metricFollowersDesc: 'Nutzer, die dir folgen',
    metricFollowing: 'Gefolgt',
    metricFollowingDesc: 'Nutzer, denen du folgst',
    metricMutuals: 'Gegenseitig',
    metricMutualsDesc: 'Gegenseitige Verbindungen',
    metricRepos: 'Repos',
    metricReposDesc: 'Öffentliche Repositories',

    tabUnfollowers: 'Folgen nicht zurück',
    tabFans: 'Fans (Nicht zurückgefolgt)',
    tabMutuals: 'Gegenseitige Follower',
    tabFollowing: 'Alle Gefolgten',

    searchPlaceholder: 'Benutzername suchen...',
    sortAsc: 'A - Z',
    sortDesc: 'Z - A',
    exportCsv: 'CSV',
    exportJson: 'JSON',

    userGithubBadge: 'GitHub-Nutzer',
    copyUsername: 'Benutzernamen kopieren',
    profileBtn: 'Profil',
    noUsersTitle: 'Keine Benutzer gefunden',
    noUsersMsgSearch: 'Keine Benutzer entsprechen deinen Suchkriterien.',
    noUsersMsgTab: 'In diesem Tab sind keine Benutzer vorhanden.',

    footerRights: 'Alle Rechte vorbehalten. Erstellt mit der GitHub REST API v3.',
    footerPrivacy: 'Personal Access Token (PAT) werden ausschließlich im Browser verarbeitet und niemals an einen Server gesendet.'
  },
  fr: {
    heroBadge: 'Désabonnements & Analyse de Profil GitHub',
    heroTitleSuffix: 'Git',
    heroSubtitle: 'Identifiez instantanément les utilisateurs GitHub qui ne vous suivent pas en retour, analysez vos métriques et gérez votre communauté.',
    usernameLabel: 'Nom d\'utilisateur GitHub',
    usernamePlaceholder: 'ex. octocat',
    patLabel: 'Jeton d\'accès personnel (PAT)',
    patOptional: '(Optionnel)',
    patCreateToken: 'Créer un jeton (read:user)',
    patPlaceholder: 'ghp_xxxxxxxxxxxxxxxxxxxx',
    recentSearches: 'Recherches récentes :',
    rememberMe: 'Mémoriser les données',
    rememberInfoTooltip: 'Votre nom d\'utilisateur et votre PAT optionnel sont enregistrés uniquement dans le LocalStorage de votre navigateur. Ils ne sont jamais partagés avec des serveurs tiers.',
    clearRecords: 'Effacer les entrées',
    analyzeBtn: 'Lancer l\'analyse',
    analyzingBtn: 'Analyse en cours...',
    fetchingProfile: 'Récupération du profil GitHub...',
    fetchingFollowers: (page, total) => `Chargement des abonnés... (Page ${page} / ${total})`,
    fetchingFollowing: (page, total) => `Chargement des abonnements... (Page ${page} / ${total})`,
    calculatingStars: 'Calcul du nombre total d\'étoiles des dépôts publics...',
    analysisComplete: 'Analyse terminée avec succès !',
    themeDark: 'Thème Sombre',
    themeLight: 'Thème Clair',
    settingsTitle: 'Paramètres',
    settingsDesc: 'Gérer les préférences d\'affichage et de langue',
    themeSection: 'Préférence de thème',
    languageSection: 'Langue / Language',
    closeBtn: 'Fermer',

    errMissingUsernameTitle: 'Nom d\'utilisateur manquant',
    errMissingUsernameMsg: 'Veuillez saisir le nom d\'utilisateur GitHub à analyser.',
    errRateLimitTitle: 'Limite de requêtes API atteinte',
    errRateLimitMsg: (resetTime) =>
      `Votre limite de requêtes GitHub API a été atteinte.${resetTime ? ` Réinitialisation prévue à : ${resetTime}.` : ''} Renseignez un jeton personnel (PAT) pour passer de 60 à 5 000 requêtes/heure.`,
    errUnauthorizedTitle: 'Jeton invalide (Non autorisé)',
    errUnauthorizedMsg: 'Le jeton d\'accès personnel (PAT) fourni est invalide ou a expiré.',
    errUserNotFoundTitle: 'Utilisateur introuvable',
    errUserNotFoundMsg: (user) => `Aucun profil GitHub trouvé pour le nom d'utilisateur "${user}". Veuillez vérifier l'orthographe.`,
    errGenericTitle: 'Erreur de serveur',
    errGenericMsg: (status) => `L'API GitHub n'a pas répondu${status ? ` (HTTP ${status})` : ''}.`,

    openGithubProfile: 'Ouvrir le profil GitHub',
    metricUnfollowers: 'Désabonnements',
    metricUnfollowersDesc: 'Ne vous suivent pas en retour',
    metricTotalStars: 'Total Étoiles',
    metricTotalStarsDesc: 'Sur les dépôts publics',
    metricFollowers: 'Abonnés',
    metricFollowersDesc: 'Utilisateurs qui vous suivent',
    metricFollowing: 'Abonnements',
    metricFollowingDesc: 'Utilisateurs que vous suivez',
    metricMutuals: 'Réciproques',
    metricMutualsDesc: 'Connexions mutuelles',
    metricRepos: 'Dépôts',
    metricReposDesc: 'Dépôts publics',

    tabUnfollowers: 'Ne suivent pas',
    tabFans: 'Fans (Non suivis)',
    tabMutuals: 'Abonnés mutuels',
    tabFollowing: 'Tous les abonnements',

    searchPlaceholder: 'Rechercher un utilisateur...',
    sortAsc: 'A - Z',
    sortDesc: 'Z - A',
    exportCsv: 'CSV',
    exportJson: 'JSON',

    userGithubBadge: 'Utilisateur GitHub',
    copyUsername: 'Copier l\'identifiant',
    profileBtn: 'Profil',
    noUsersTitle: 'Aucun utilisateur trouvé',
    noUsersMsgSearch: 'Aucun utilisateur ne correspond à vos critères de recherche.',
    noUsersMsgTab: 'Aucun utilisateur à afficher dans cet onglet.',

    footerRights: 'Tous droits réservés. Conçu avec l\'API REST GitHub v3.',
    footerPrivacy: 'Les jetons d\'accès personnels (PAT) sont traités exclusivement dans votre navigateur et ne sont jamais transmis à aucun serveur.'
  }
};
