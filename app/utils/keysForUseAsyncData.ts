// Layout keys
export const NAVBAR_DATA_KEY = 'navbar-data'
export const FOOTER_DATA_KEY = 'footer-data'

// Page keys
export const HOME_PAGE_DATA_KEY = 'home-page-data'
export const createPostPageDataKey = (slug: string) => `post-page-${slug}`
export const createContentPageDataKey = (slug: string) => `content-page-${slug}`

// Notion page key
export const createNotionPageKey = (pageId: string) => `notion-page-${pageId}`
