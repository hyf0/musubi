import type { MusubiDocument } from '../content/types.ts'
import type { Home, NavigationItem, Page, Post, PublicPageMeta, SiteConfig } from './types.ts'

export type PublicDocument = Omit<MusubiDocument, 'pageLabel'>

interface PublicContent {
  title: string
  slug: string
  route: string
  description: string
  document: PublicDocument
}

export interface PublicPost extends PublicContent {
  type: 'Post'
  date: string
}

export interface PublicStandalonePage extends PublicContent {
  type: 'Page'
}

export interface PublicHome {
  document: PublicDocument
}

export interface PublicSiteShell {
  config: SiteConfig
  navigation: NavigationItem[]
}

export interface HomePageProps {
  config: SiteConfig
  home: PublicHome | null
  posts: PublicPageMeta[]
  hasMorePosts: boolean
}

export interface BlogPageProps {
  config: SiteConfig
  posts: PublicPageMeta[]
}

export interface PostPageProps {
  config: SiteConfig
  page: PublicPost
}

export interface StandalonePageProps {
  config: SiteConfig
  page: PublicStandalonePage
}

function toPublicDocument(document: MusubiDocument): PublicDocument {
  const { pageLabel: _pageLabel, ...publicDocument } = document
  return publicDocument
}

export function toPublicHome(home: Home): PublicHome {
  return {
    document: toPublicDocument(home.document),
  }
}

export function toPublicPost(post: Post): PublicPost {
  return {
    title: post.title,
    slug: post.slug,
    route: post.route,
    type: post.type,
    date: post.date,
    description: post.description,
    document: toPublicDocument(post.document),
  }
}

export function toPublicStandalonePage(page: Page): PublicStandalonePage {
  return {
    title: page.title,
    slug: page.slug,
    route: page.route,
    type: page.type,
    description: page.description,
    document: toPublicDocument(page.document),
  }
}