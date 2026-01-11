/**
 * Website class (Singleton)
 * Handles fetching and managing blog data from Notion
 *
 * Use Website.getInstance() to access the shared instance.
 * Constructor is private - direct instantiation is forbidden.
 */

import { NotionDatabasePage } from '~~/shared/notion/NotionDatabasePage'
import { NotionKnotPage } from '~~/shared/notion/NotionKnotPage'
import type { PostMeta } from '~~/shared/website/types/PostMeta'
import type { Post } from '~~/shared/website/types'

export class Website {
  private static instance: Website | null = null
  #databaseId: string
  #databasePage: NotionDatabasePage
  #allKnotPagesPromise?: Promise<NotionKnotPage[]>
  #postPageBySlugPromise?: Promise<Map<string, NotionKnotPage>>
  #contentPageBySlugPromise?: Promise<Map<string, NotionKnotPage>>

  private constructor() {
    const datbasePageId = process.env.NOTION_DATABASE_PAGE_ID || ''

    if (!datbasePageId) {
      throw new Error('NOTION_DATABASE_PAGE_ID environment variable is not set')
    }

    this.#databaseId = datbasePageId
    this.#databasePage = new NotionDatabasePage(datbasePageId)
  }

  // Get the singleton Website instance, so we could share cached data
  static getInstance(): Website {
    if (!Website.instance) {
      Website.instance = new Website()
    }
    return Website.instance
  }

  async #fetchAllKnotPagesCached() {
    if (!this.#allKnotPagesPromise) {
      this.#allKnotPagesPromise = this.#databasePage
        .childPageIds()
        .then((ids) => ids.map((id) => new NotionKnotPage(id)))
    }
    return this.#allKnotPagesPromise
  }

  async #createPostBySlugMap() {
    const map = new Map<string, NotionKnotPage>()
    const pages = await this.#fetchAllKnotPagesCached()
    for (const page of pages) {
      const data = await page.toKnotPageData()
      if (data.type === 'Post') {
        map.set(data.slug, page)
      }
    }
    return map
  }

  async #createContentPageBySlugMap() {
    const map = new Map<string, NotionKnotPage>()
    const pages = await this.#fetchAllKnotPagesCached()
    for (const page of pages) {
      const data = await page.toKnotPageData()
      if (data.type === 'Content') {
        map.set(data.slug, page)
      }
    }
    return map
  }

  #getPostPageBySlugCached() {
    if (!this.#postPageBySlugPromise) {
      this.#postPageBySlugPromise = this.#createPostBySlugMap()
    }
    return this.#postPageBySlugPromise
  }

  #getContentPageBySlugCached() {
    if (!this.#contentPageBySlugPromise) {
      this.#contentPageBySlugPromise = this.#createContentPageBySlugMap()
    }
    return this.#contentPageBySlugPromise
  }

  /**
   * Get list of all published blog posts
   *
   * Caching: First call fetches from Notion, subsequent calls use cache.
   *
   * @returns Array of PostMeta objects sorted by date (newest first)
   * @throws Error if any page has invalid/missing required properties
   */
  async getPostMetaList(): Promise<PostMeta[]> {
    const pages = await this.#fetchAllKnotPagesCached()
    const posts: PostMeta[] = []

    for (const page of pages) {
      const data = await page.toKnotPageData()

      // Skip non-posts and drafts
      if (data.type !== 'Post' || data.status === 'draft') {
        continue
      }

      posts.push({
        pageId: data.pageId,
        title: data.title,
        slug: data.slug,
        date: data.date,
        description: '', // Not in KnotPageData yet
        tags: data.tags,
      })
    }

    // Sort by date (newest first)
    return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  /**
   * Get blog post by slug directly from cache
   *
   * Caching: Reuses cached page instances from getBlogPostList(), no extra API requests.
   *
   * @param slug - Post slug (e.g., my-post)
   * @returns Post with metadata and recordMap
   * @throws Error if blog post with given slug not found
   */
  async getPostBySlug(slug: string): Promise<Post> {
    const postMap = await this.#getPostPageBySlugCached()
    const page = postMap.get(slug)

    if (!page) {
      throw new Error(`Blog post with slug '${slug}' not found in Notion database`)
    }

    const data = await page.toKnotPageData()
    const recordMap = await page.getRecordMap()

    return {
      meta: {
        pageId: data.pageId,
        title: data.title,
        slug: data.slug,
        date: data.date,
        description: '', // Not in KnotPageData yet
        tags: data.tags,
      },
      recordMap,
    }
  }

  /**
   * Get list of all published content pages
   *
   * Caching: First call fetches from Notion, subsequent calls use cache.
   *
   * @returns Array of PostMeta objects sorted by title
   */
  async getContentPages(): Promise<PostMeta[]> {
    const pages = await this.#fetchAllKnotPagesCached()
    const contentPages: PostMeta[] = []

    for (const page of pages) {
      const data = await page.toKnotPageData()

      // Skip non-content pages and drafts
      if (data.type !== 'Content' || data.status === 'draft') {
        continue
      }

      contentPages.push({
        pageId: data.pageId,
        title: data.title,
        slug: data.slug,
        date: data.date,
        description: '',
        tags: data.tags,
      })
    }

    // Sort by title alphabetically
    return contentPages.sort((a, b) => a.title.localeCompare(b.title))
  }

  /**
   * Get a content page by slug
   *
   * @param slug - Page slug (e.g., about)
   * @returns Post with metadata and recordMap
   * @throws Error if content page with given slug not found
   */
  async getContentPageBySlug(slug: string): Promise<Post> {
    const pageMap = await this.#getContentPageBySlugCached()
    const page = pageMap.get(slug)

    if (!page) {
      throw new Error(`Content page with slug '${slug}' not found in Notion database`)
    }

    const data = await page.toKnotPageData()
    const recordMap = await page.getRecordMap()

    return {
      meta: {
        pageId: data.pageId,
        title: data.title,
        slug: data.slug,
        date: data.date,
        description: '',
        tags: data.tags,
      },
      recordMap,
    }
  }

  /**
   * Get the main page ID
   */
  getDatabasePageId(): string {
    return this.#databaseId
  }
}
