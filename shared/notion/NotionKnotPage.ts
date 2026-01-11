import { NotionStandalonePage } from './NotionStandalonePage'

export interface KnotPageData {
  pageId: string
  title: string
  slug: string
  date: string // ISO date string (YYYY-MM-DD)
  status: 'published' | 'draft'
  type: 'Post' | 'Content'
  tags: string[]
}

export class NotionKnotPage extends NotionStandalonePage {
  constructor(pageId: string) {
    super(pageId)
  }

  async toKnotPageData(): Promise<KnotPageData> {
    const [title, slug, date, status, type, tags] = await Promise.all([
      this.getPropAsString('Title'),
      this.getPropAsString('Slug'),
      this.getPropAsDate('Date'),
      this.getPropAsString('Status'),
      this.getPropAsString('Type'),
      this.getPropAsTags('Tags'),
    ])

    if (status !== 'published' && status !== 'draft') {
      throw new Error(`Invalid status "${status}", expected "published" or "draft"`)
    }

    if (type !== 'Post' && type !== 'Content') {
      throw new Error(`Invalid type "${type}", expected "Post" or "Content"`)
    }

    return {
      pageId: this.getPageId(),
      title,
      slug,
      date: date.toISOString().split('T')[0] as string,
      status,
      type,
      tags,
    }
  }
}
