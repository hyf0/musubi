import type { NavigationItem } from './types.ts'

export interface PrimaryNavigationItem extends NavigationItem {
  lang?: 'en'
}

const fixedPrimaryNavigation: readonly PrimaryNavigationItem[] = [
  { title: 'Home', route: '/', lang: 'en' },
  { title: 'Blog', route: '/blog', lang: 'en' },
]

export function primaryNavigationItems(
  pageItems: readonly NavigationItem[],
): PrimaryNavigationItem[] {
  return [...fixedPrimaryNavigation, ...pageItems]
}