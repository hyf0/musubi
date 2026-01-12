# Notion Page Classes

Object-oriented API for working with Notion pages in Musubi.

## Classes

### `NotionNormalPage`

Represents a single Notion page with property access methods.

#### Constructor

```typescript
const page = new NotionNormalPage(pageId: string)
```

- `pageId`: The Notion page ID
- Constructor immediately initiates the API request and stores the promise internally

#### Methods

##### `getProp(propName: string): Promise<string | number | string[] | undefined>`

Get a property value from the page. Returns a union type - caller must narrow the type.

```typescript
const title = await page.getProp('title')
if (typeof title === 'string') {
  console.log(title.toUpperCase())
}

const date = await page.getProp('date')
if (typeof date === 'number') {
  console.log(new Date(date))
}

const tags = await page.getProp('tags')
if (Array.isArray(tags)) {
  console.log(tags.join(', '))
}
```

##### `getPropAsString(propName: string): Promise<string>`

Get property as string with validation. Throws if not a string.

```typescript
const title = await page.getPropAsString('title')
// Guaranteed to be string, or throws Error
```

##### `getPropAsNumber(propName: string): Promise<number>`

Get property as number with validation. Throws if not a number.

```typescript
const timestamp = await page.getPropAsNumber('date')
// Guaranteed to be number, or throws Error
```

##### `getPropAsDate(propName: string): Promise<Date>`

Get property as Date with validation. Converts Notion timestamp to Date object. Throws if not a number timestamp.

```typescript
const date = await page.getPropAsDate('date')
// Guaranteed to be Date object, or throws Error
```

##### `getPropAsTags(propName: string): Promise<string[]>`

Get property as string array (tags/multi_select) with validation. Throws if not a string array.

```typescript
const tags = await page.getPropAsTags('tags')
// Guaranteed to be string[], or throws Error
```

##### `getRecordMap(): Promise<ExtendedRecordMap>`

Get the raw Notion RecordMap for advanced use cases.

```typescript
const recordMap = await page.getRecordMap()
// Access raw Notion data structure
```

##### `getPageId(): string`

Get the page ID.

```typescript
const id = page.getPageId()
```

---

### `NotionCollectionPage`

Represents a Notion database/collection page. Provides methods to access child pages within the collection.

#### Constructor

```typescript
const collection = new NotionCollectionPage(pageId: string)
```

- `pageId`: The Notion database/collection page ID
- Constructor immediately initiates the API request and stores the promise internally

#### Methods

##### `getPageId(): string`

Get the page ID.

```typescript
const id = collection.getPageId()
```

##### `childPageIds(): Promise<string[]>`

Get array of child page IDs in this collection.

```typescript
const ids = await collection.childPageIds()
// Returns array of page IDs: ['page-id-1', 'page-id-2', ...]
```

##### `childPages(): Promise<NotionNormalPage[]>`

Get child pages as `NotionNormalPage` instances. Convenience method.

```typescript
const pages = await collection.childPages()
// Returns array of NotionNormalPage instances

for (const page of pages) {
  const title = await page.getPropAsString('title')
  console.log(title)
}
```

---

## Usage Examples

### Example 1: Get All Blog Posts from Database

```typescript
import { NotionCollectionPage } from '~~/shared/notion/NotionCollectionPage'

const database = new NotionCollectionPage('your-database-id')
const childPages = await database.childPages()

const posts = await Promise.all(
  childPages.map(async (page) => ({
    title: await page.getPropAsString('title'),
    date: await page.getPropAsDate('date'),
    slug: await page.getPropAsString('path'),
    tags: await page.getPropAsTags('tags').catch(() => []), // Fallback to empty array
  }))
)

console.log(posts)
```

### Example 2: Access Single Page Properties

```typescript
import { NotionNormalPage } from '~~/shared/notion/NotionNormalPage'

const page = new NotionNormalPage('your-page-id')

// Using generic getProp with type narrowing
const title = await page.getProp('title')
if (typeof title === 'string') {
  console.log('Title:', title)
}

// Using typed helpers (throws on type mismatch)
try {
  const date = await page.getPropAsDate('date')
  console.log('Published:', date.toLocaleDateString())
} catch (error) {
  console.error('Date property missing or invalid')
}
```

### Example 3: Working with Collections

```typescript
import { NotionCollectionPage } from '~~/shared/notion/NotionCollectionPage'

const database = new NotionCollectionPage('your-database-id')

// Get child page IDs
const childIds = await database.childPageIds()
console.log(`Database has ${childIds.length} pages`)

// Get child pages as NotionNormalPage instances
const pages = await database.childPages()
for (const page of pages) {
  const title = await page.getPropAsString('title')
  console.log('Page title:', title)
}
```

### Example 4: Error Handling

```typescript
import { NotionNormalPage } from '~~/shared/notion/NotionNormalPage'

const page = new NotionNormalPage('your-page-id')

// Safe property access
const title = await page.getProp('title')
if (title === undefined) {
  console.log('Title property does not exist')
} else if (typeof title === 'string') {
  console.log('Title:', title)
}

// Strict property access with error handling
try {
  const tags = await page.getPropAsTags('categories')
  console.log('Categories:', tags)
} catch (error) {
  console.error('Categories property is not a string array:', error.message)
}
```

---

## Type Information

### Return Type of `getProp()`

The `getProp()` method returns a union type:

```typescript
Promise<string | number | string[] | undefined>
```

This means you need to narrow the type before using it:

```typescript
const value = await page.getProp('myProp')

// Type narrowing
if (typeof value === 'string') {
  // value is string here
} else if (typeof value === 'number') {
  // value is number here
} else if (Array.isArray(value)) {
  // value is string[] here
} else {
  // value is undefined here
}
```

### Typed Helper Methods

For convenience, use typed helper methods that validate and throw:

- `getPropAsString()` → `Promise<string>` (throws if not string)
- `getPropAsNumber()` → `Promise<number>` (throws if not number)
- `getPropAsDate()` → `Promise<Date>` (throws if not timestamp)
- `getPropAsTags()` → `Promise<string[]>` (throws if not string array)

---

## Implementation Notes

- **No caching**: These classes do not implement caching. Use external caching mechanisms if needed.
- **Async-first**: All property getters are async and return promises directly.
- **Shared client**: All instances share a single `NotionAPI` client for efficiency.
- **Lazy loading**: The API request is initiated in the constructor. Simply await any method call to wait for data.
- **Error handling**: Typed helper methods throw errors on type mismatches for early failure detection.
- **Promise-based**: All methods return promises - you can await them directly without calling a separate `ready()` method.
