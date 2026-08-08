import { describe, expect, it } from 'vite-plus/test'

import { NOTION_SNAPSHOT_SCHEMA_VERSION, type NotionDataSnapshot } from '../notion-data/types.ts'
import { createSite, normalizeNotionContentType } from './create.ts'
import { primaryNavigationItems } from './navigation.ts'

describe('Notion content type', () => {
  it('accepts only the selected Post, Page, and Home values', () => {
    expect(normalizeNotionContentType('Page', 'Page row')).toBe('Page')
    expect(normalizeNotionContentType('Post', 'Post row')).toBe('Post')
    expect(normalizeNotionContentType('Home', 'Home row')).toBe('Home')
  })

  it.each(['Content', 'Article', undefined])('rejects removed or invalid Type value %s', (type) => {
    expect(() => normalizeNotionContentType(type, 'Database row 3')).toThrow(
      'Database row 3.Type must be Post, Page, or Home',
    )
  })
})

describe('Notion workspace schema', () => {
  it('accepts the exact Musubi fields while ignoring automatic and user-owned properties', async () => {
    const value = snapshot()
    const contentSource = value.config.contentDataSource as { properties: Record<string, unknown> }
    contentSource.properties['Created time'] = property('created_time')
    contentSource.properties['Last edited time'] = property('last_edited_time')
    contentSource.properties.Notes = property('rich_text')

    const site = await createSite(value)

    expect(site.posts).toEqual([])
    expect(site.pages).toEqual([])
  })

  it.each(['Post:publish-date', 'Publish Date', 'Date'])(
    'does not accept removed date property %s',
    async (name) => {
      const value = snapshot()
      const contentSource = value.config.contentDataSource as {
        properties: Record<string, unknown>
      }
      delete contentSource.properties['Post:Publish date']
      contentSource.properties[name] = property('date')

      await expect(createSite(value)).rejects.toThrow(
        'is missing required Post:Publish date (date) property',
      )
    },
  )

  it.each([
    ['Page:navigation', 'Page:Navigation', 'checkbox'],
    ['Page:navigation-order', 'Page:Navigation order', 'number'],
  ])('does not accept removed Page property %s in place of %s', async (removed, current, type) => {
    const value = snapshot()
    const contentSource = value.config.contentDataSource as { properties: Record<string, unknown> }
    delete contentSource.properties[current]
    contentSource.properties[removed] = property(type)

    await expect(createSite(value)).rejects.toThrow(
      `is missing required ${current} (${type}) property`,
    )
  })

  it('requires exact Status, Type, and Config Key options', async () => {
    const value = snapshot()
    const contentSource = value.config.contentDataSource as { properties: Record<string, unknown> }
    contentSource.properties.Type = selectSchema(['Post', 'Page', 'Home', 'Content'])

    await expect(createSite(value)).rejects.toThrow(
      'Type must define exactly these options: Post, Page, Home',
    )
  })

  it('rejects extra product-owned Config properties', async () => {
    const value = snapshot()
    const configSource = value.config.configDataSource as { properties: Record<string, unknown> }
    configSource.properties.Timezone = property('rich_text')

    await expect(createSite(value)).rejects.toThrow(
      'config.json.configDataSource must contain exactly Enabled, Help, Key, Value',
    )
  })

  it('does not accept the former Enable Config property', async () => {
    const value = snapshot()
    const configSource = value.config.configDataSource as { properties: Record<string, unknown> }
    delete configSource.properties.Enabled
    configSource.properties.Enable = property('checkbox')

    await expect(createSite(value)).rejects.toThrow(
      'config.json.configDataSource is missing required Enabled (checkbox) property',
    )
  })
})

describe('Notion row interpretation', () => {
  it('uses the Post date start and ignores its time, offset, and range end', async () => {
    const value = snapshot()
    value.pages.push(
      pageSnapshot({
        type: 'Post',
        date: {
          start: '2026-08-08T23:30:00-07:00',
          end: '2026-08-10T09:00:00-07:00',
          time_zone: 'America/Los_Angeles',
        },
      }),
    )

    const site = await createSite(value)

    expect(site.posts[0]?.date).toBe('2026-08-08')
  })

  it('does not inspect type-inapplicable Post and Page values', async () => {
    const value = snapshot()
    value.pages.push(
      pageSnapshot({
        type: 'Page',
        date: { start: 42 },
        navigation: true,
        navigationOrder: 1,
      }),
      pageSnapshot({
        id: '22222222-2222-2222-2222-222222222222',
        title: 'Post',
        slug: 'post',
        type: 'Post',
        date: { start: '2026-08-08' },
        navigationOrder: Number.NaN,
      }),
    )

    const site = await createSite(value)

    expect(site.pages[0]).toMatchObject({ showInNavigation: true, navigationOrder: 1 })
    expect(site.posts[0]?.date).toBe('2026-08-08')
  })
})

describe('v1 acceptance fixture', () => {
  it('connects date interpretation, routability, and the complete primary navigation order', async () => {
    const value = snapshot()
    value.pages.push(
      pageSnapshot({
        id: '00000000-0000-4000-8000-000000000001',
        title: 'Home row',
        slug: 'ignored-home-slug',
        type: 'Home',
        date: { start: 'not inspected' },
      }),
      pageSnapshot({
        id: '00000000-0000-4000-8000-000000000002',
        title: 'Plain date',
        slug: 'plain-date',
        type: 'Post',
        date: { start: '2026-08-10' },
      }),
      pageSnapshot({
        id: '00000000-0000-4000-8000-000000000003',
        title: 'Date time',
        slug: 'date-time',
        type: 'Post',
        date: { start: '2026-08-09T23:30:00-07:00' },
      }),
      pageSnapshot({
        id: '00000000-0000-4000-8000-000000000004',
        title: 'Date range',
        slug: 'date-range',
        type: 'Post',
        date: { start: '2026-08-08', end: '2026-08-12', time_zone: null },
      }),
      pageSnapshot({
        id: '00000000-0000-4000-8000-000000000005',
        title: 'Ordered two',
        slug: 'ordered-two',
        type: 'Page',
        date: null,
        navigation: true,
        navigationOrder: 2,
      }),
      pageSnapshot({
        id: '00000000-0000-4000-8000-000000000006',
        title: 'Beta',
        slug: 'beta',
        type: 'Page',
        date: null,
        navigation: true,
        navigationOrder: 1,
      }),
      pageSnapshot({
        id: '00000000-0000-4000-8000-000000000007',
        title: 'Alpha',
        slug: 'alpha',
        type: 'Page',
        date: null,
        navigation: true,
        navigationOrder: 1,
      }),
      pageSnapshot({
        id: '00000000-0000-4000-8000-000000000008',
        title: 'Unordered',
        slug: 'unordered',
        type: 'Page',
        date: null,
        navigation: true,
      }),
      pageSnapshot({
        id: '00000000-0000-4000-8000-000000000009',
        title: 'Hidden',
        slug: 'hidden',
        type: 'Page',
        date: null,
        navigationOrder: -100,
      }),
    )

    const site = await createSite(value)

    expect(site.posts.map(({ date }) => date)).toEqual(['2026-08-10', '2026-08-09', '2026-08-08'])
    expect(site.byRoute.has('/hidden')).toBe(true)
    expect(site.routes.slice(0, 2)).toEqual(['/', '/blog'])
    expect(primaryNavigationItems(site.navigation)).toEqual([
      { title: 'Home', route: '/', lang: 'en' },
      { title: 'Blog', route: '/blog', lang: 'en' },
      { title: 'Alpha', route: '/alpha' },
      { title: 'Beta', route: '/beta' },
      { title: 'Ordered two', route: '/ordered-two' },
      { title: 'Unordered', route: '/unordered' },
    ])
  })
})

function property(type: string): { type: string } {
  return { type }
}

function selectSchema(options: string[]): {
  type: 'select'
  select: { options: { name: string }[] }
} {
  return { type: 'select', select: { options: options.map((name) => ({ name })) } }
}

function snapshot(): NotionDataSnapshot {
  return {
    configFilename: 'config.json',
    config: {
      schemaVersion: NOTION_SNAPSHOT_SCHEMA_VERSION,
      notionApiVersion: '2026-03-11',
      contentDataSource: {
        object: 'data_source',
        properties: {
          Title: property('title'),
          Slug: property('rich_text'),
          'Post:Publish date': property('date'),
          Status: selectSchema(['Draft', 'Published']),
          Type: selectSchema(['Post', 'Page', 'Home']),
          Description: property('rich_text'),
          'Page:Navigation': property('checkbox'),
          'Page:Navigation order': property('number'),
        },
      },
      configDataSource: {
        object: 'data_source',
        properties: {
          Help: property('title'),
          Key: selectSchema([
            'Site title',
            'Site description',
            'Author',
            'Site URL',
            'Language',
            'GitHub',
            'X (Twitter)',
          ]),
          Value: property('rich_text'),
          Enabled: property('checkbox'),
        },
      },
      configRows: [],
    },
    pages: [],
  }
}

interface PageOptions {
  id?: string
  title?: string
  slug?: string
  type: 'Post' | 'Page' | 'Home'
  date: unknown
  navigation?: boolean
  navigationOrder?: unknown
}

function pageSnapshot({
  id = '11111111-1111-1111-1111-111111111111',
  title = 'About',
  slug = 'about',
  type,
  date,
  navigation = false,
  navigationOrder = null,
}: PageOptions): NotionDataSnapshot['pages'][number] {
  const richText = (value: string) => (value ? [{ plain_text: value }] : [])
  return {
    filename: `pages/${id}.json`,
    data: {
      schemaVersion: NOTION_SNAPSHOT_SCHEMA_VERSION,
      notionApiVersion: '2026-03-11',
      page: {
        object: 'page',
        id,
        properties: {
          Title: { type: 'title', title: richText(title) },
          Slug: { type: 'rich_text', rich_text: richText(slug) },
          'Post:Publish date': { type: 'date', date },
          Status: { type: 'select', select: { name: 'Published' } },
          Type: { type: 'select', select: { name: type } },
          Description: { type: 'rich_text', rich_text: [] },
          'Page:Navigation': { type: 'checkbox', checkbox: navigation },
          'Page:Navigation order': { type: 'number', number: navigationOrder },
        },
      },
      markdown: {
        object: 'page_markdown',
        id,
        markdown: '',
        truncated: false,
        unknown_block_ids: [],
      },
      unknownBlocks: [],
    },
  }
}