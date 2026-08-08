import { describe, expect, it } from 'vite-plus/test'
import { buildRouteManifest } from './routes.ts'
import type { SourceContentRow } from './types.ts'

describe('Page navigation defaults', () => {
  it('keeps a published Page routable without promoting it to the default navigation', () => {
    const manifest = buildRouteManifest([page()])

    expect(manifest.routes).toContain('/about')
    expect(manifest.navigation).toEqual([])
  })

  it('shows a Page when its source explicitly enables navigation', () => {
    const manifest = buildRouteManifest([page({ showInNavigation: true })])

    expect(manifest.navigation).toEqual([{ title: 'About', route: '/about' }])
  })

  it('sorts numbered Pages first and uses Title then Slug for empty and tied orders', () => {
    const manifest = buildRouteManifest([
      page({ title: 'Unordered', slug: 'unordered', showInNavigation: true }),
      page({ title: 'Zulu', slug: 'zulu', showInNavigation: true, navigationOrder: 1 }),
      page({ title: 'Alpha', slug: 'alpha-b', showInNavigation: true, navigationOrder: 1 }),
      page({ title: 'Alpha', slug: 'alpha-a', showInNavigation: true, navigationOrder: 1 }),
      page({ title: 'First', slug: 'first', showInNavigation: true, navigationOrder: -1 }),
      page({ title: 'Hidden', slug: 'hidden', navigationOrder: -100 }),
    ])

    expect(manifest.navigation).toEqual([
      { title: 'First', route: '/first' },
      { title: 'Alpha', route: '/alpha-a' },
      { title: 'Alpha', route: '/alpha-b' },
      { title: 'Zulu', route: '/zulu' },
      { title: 'Unordered', route: '/unordered' },
    ])
  })

  it('rejects a non-finite Page:Navigation order', () => {
    expect(() =>
      buildRouteManifest([page({ showInNavigation: true, navigationOrder: Number.NaN })]),
    ).toThrow('Page:Navigation order must be a finite number')
  })
})

describe('Post publishing metadata', () => {
  it('names a missing date with the canonical Post:Publish date term', () => {
    expect(() => buildRouteManifest([post()])).toThrow(
      'Content row 1 ("Post"): Published Post requires Post:Publish date',
    )
  })

  it.each([
    ['2026-08-08', '2026-08-08'],
    ['2026-08-08T23:30:00-07:00', '2026-08-08'],
  ])('uses only the literal start calendar date from %s', (value, expected) => {
    const manifest = buildRouteManifest([post({ date: value })])
    expect(manifest.posts[0]?.date).toBe(expected)
  })

  it.each(['2026-02-29', '2026-13-01', '0000-01-01', '2026-08-08 12:00:00'])(
    'rejects invalid start date %s',
    (date) => {
      expect(() => buildRouteManifest([post({ date })])).toThrow(
        'Post:Publish date start must begin with a valid YYYY-MM-DD calendar date',
      )
    },
  )

  it('does not treat a future publication date as scheduling', () => {
    const manifest = buildRouteManifest([post({ date: '9999-12-31' })])
    expect(manifest.posts).toHaveLength(1)
  })

  it('ignores Page navigation values on a Post', () => {
    const manifest = buildRouteManifest([
      post({ date: '2026-08-08', showInNavigation: true, navigationOrder: Number.NaN }),
    ])
    expect(manifest.navigation).toEqual([])
  })
})

describe('Home routing', () => {
  it('keeps the generated Home when no Home row is published', () => {
    const manifest = buildRouteManifest([page()])

    expect(manifest.home).toBeUndefined()
    expect(manifest.entries.find((entry) => entry.route === '/')?.sourceLabel).toBe(
      'generated recent-Post Home',
    )
  })

  it('routes a published Home row to `/` without consuming a path segment', () => {
    const manifest = buildRouteManifest([home(), page()])

    expect(manifest.home?.route).toBe('/')
    expect(manifest.home?.slug).toBe('')
    expect(manifest.routes).toEqual(['/', '/blog', '/about'])
    expect(manifest.entries.find((entry) => entry.route === '/')).toMatchObject({
      kind: 'home',
      outputFile: 'index.html',
      sourceLabel: 'Content row 1 ("Home")',
    })
  })

  it('uses Void static output filenames for generated routes', () => {
    const manifest = buildRouteManifest([page(), post({ date: '2026-07-23' })])

    expect(manifest.entries.map(({ route, outputFile }) => [route, outputFile])).toEqual([
      ['/', 'index.html'],
      ['/blog', 'blog.html'],
      ['/blog/post', 'blog/post.html'],
      ['/about', 'about.html'],
    ])
  })

  it('keeps Void asset and page-data namespaces unavailable to top-level Pages', () => {
    expect(() => buildRouteManifest([page({ slug: 'assets' })])).toThrow(
      'occupies a reserved Page route namespace',
    )
    expect(() => buildRouteManifest([page({ slug: '_void' })])).toThrow(
      'occupies a reserved Page route namespace',
    )
  })

  it('rejects a public file that would hide a generated route', () => {
    expect(() => buildRouteManifest([page()], ['about'])).toThrow(
      'public/about conflicts with Content row 1 ("About"): public URL "/about"',
    )
    expect(() => buildRouteManifest([page()], ['about.html'])).toThrow(
      'public/about.html conflicts with Content row 1 ("About"): public URL "/about"',
    )
  })

  it('keeps Home out of the Page routes and the navigation', () => {
    const manifest = buildRouteManifest([home({ showInNavigation: true }), page()])

    expect(manifest.standalonePages.map((entry) => entry.route)).toEqual(['/about'])
    expect(manifest.navigation).toEqual([])
  })

  it('ignores fields that do not apply to Home', () => {
    const manifest = buildRouteManifest([
      home({ slug: 'ignored', date: 'not-a-date', showInNavigation: true, navigationOrder: 1 }),
    ])
    expect(manifest.home).toMatchObject({ slug: '', date: undefined, showInNavigation: false })
    expect(manifest.navigation).toEqual([])
  })

  it('rejects a second published Home row', () => {
    expect(() =>
      buildRouteManifest([home(), home({ sourceLabel: 'Content row 2 ("Landing")' })]),
    ).toThrow('Only one Published Home may exist, found 2')
  })

  it('ignores a Home row that is still a draft', () => {
    const manifest = buildRouteManifest([home({ status: 'Draft' }), page()])

    expect(manifest.home).toBeUndefined()
  })

  it('does not require Post:Publish date for Home', () => {
    expect(() => buildRouteManifest([home()])).not.toThrow()
  })

  it('ignores Post:Publish date on Page', () => {
    expect(() => buildRouteManifest([page({ date: 'not-a-date' })])).not.toThrow()
  })
})

function page(overrides: Partial<SourceContentRow> = {}): SourceContentRow {
  return {
    sourceLabel: 'Content row 1 ("About")',
    title: 'About',
    slug: 'about',
    status: 'Published',
    type: 'Page',
    description: '',
    ...overrides,
  }
}

function post(overrides: Partial<SourceContentRow> = {}): SourceContentRow {
  return {
    sourceLabel: 'Content row 1 ("Post")',
    title: 'Post',
    slug: 'post',
    status: 'Published',
    type: 'Post',
    description: '',
    ...overrides,
  }
}

function home(overrides: Partial<SourceContentRow> = {}): SourceContentRow {
  return {
    sourceLabel: 'Content row 1 ("Home")',
    title: 'Home',
    slug: '',
    status: 'Published',
    type: 'Home',
    description: '',
    ...overrides,
  }
}