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
  stargazers_count: number;
  html_url: string;
}

export interface ApiError {
  code: number;
  title: string;
  message: string;
}

export type ActiveTab = 'unfollowers' | 'fans' | 'mutuals' | 'following';
export type SortOrder = 'asc' | 'desc';
export type ExportFormat = 'csv' | 'json';
export type ThemeMode = 'dark' | 'light';
