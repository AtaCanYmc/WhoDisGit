/**
 * WhoDisGit - TypeScript Tip Tanımlamaları
 */

export type { Language } from '../i18n/translations';

export interface GithubUser {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
  name?: string | null;
  bio?: string | null;
  location?: string | null;
  company?: string | null;
  blog?: string | null;
  followers: number;
  following: number;
  public_repos: number;
  public_gists?: number;
  created_at?: string;
  hireable?: boolean | null;
}

export interface GithubSimpleUser {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
}

export interface GithubRepo {
  id: number;
  name: string;
  full_name?: string;
  description?: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count?: number;
  language?: string | null;
  fork?: boolean;
  created_at?: string;
  updated_at?: string;
}

export type RepoSortOption = 'stars' | 'forks' | 'updated' | 'name';

export interface ApiError {
  code: number;
  title: string;
  message: string;
  rateLimitReset?: number; // Unix timestamp in seconds
}

export type ActiveTab = 'unfollowers' | 'fans' | 'mutuals' | 'following' | 'snapshot_lost' | 'snapshot_gained';
export type SortOrder = 'asc' | 'desc';
export type ExportFormat = 'csv' | 'json' | 'md' | 'ndjson';
export type ThemeMode = 'dark' | 'light';

export interface NetworkSnapshot {
  timestamp: string; // ISO string
  username: string;
  followers: GithubSimpleUser[];
  following: GithubSimpleUser[];
}

export interface SnapshotDiff {
  previousTimestamp: string;
  newFollowers: GithubSimpleUser[];
  lostFollowers: GithubSimpleUser[];
  newFollowing: GithubSimpleUser[];
  lostFollowing: GithubSimpleUser[];
}
