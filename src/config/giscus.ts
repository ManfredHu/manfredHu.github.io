// Giscus configuration.
//
// To enable comments:
//   1) Enable Discussions on your repo: https://github.com/ManfredHu/manfredHu.github.io/settings
//   2) Install the giscus GitHub App: https://github.com/apps/giscus
//   3) Go to https://giscus.app and fill in the repo to get `repoId` and `categoryId`.
//   4) Replace the placeholder values below.
//
// If `repoId` or `categoryId` is left blank, the Comments component renders nothing
// (no UI, no network requests).

export interface GiscusConfig {
  repo: `${string}/${string}`
  repoId: string
  category: string
  categoryId: string
  mapping: 'pathname' | 'url' | 'title' | 'og:title' | 'specific' | 'number'
  strict: '0' | '1'
  reactionsEnabled: '0' | '1'
  emitMetadata: '0' | '1'
  inputPosition: 'top' | 'bottom'
  theme: string
  lang: string
}

export const giscusConfig: GiscusConfig = {
  repo: 'ManfredHu/manfredHu.github.io',
  repoId: 'MDEwOlJlcG9zaXRvcnk0OTk1MDUyMQ==',
  category: 'Announcements',
  categoryId: 'DIC_kwDOAvovOc4C-Df1',
  mapping: 'pathname',
  strict: '0',
  reactionsEnabled: '1',
  emitMetadata: '0',
  inputPosition: 'top',
  // Catppuccin Mocha matches the site's dark theme.
  theme: 'catppuccin_mocha',
  lang: 'zh-CN',
}

export function isGiscusConfigured(): boolean {
  return Boolean(giscusConfig.repoId && giscusConfig.categoryId)
}
