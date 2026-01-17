# Agent Guidelines for Musubi

## Build & Development Commands

- **Install**: `pnpm install` (required package manager)
- **Dev**: `pnpm dev` (starts server on localhost:3000)
- **Build**: `pnpm build` (static site generation)
- **Preview**: `pnpm preview` (preview production build)

## Code Style

- **Indentation**: 2 spaces (see .editorconfig)
- **TypeScript**: Enabled, use TypeScript for all new files
- **Imports**: Nuxt auto-imports components, composables, and Vue APIs - no manual imports needed for framework features
- **Components**: Place in `app/components/` for auto-import
- **Naming**: PascalCase for components (e.g., `Navbar.vue`), camelCase for composables

## Framework Conventions

- **Structure**:
  - Use `app/` directory for components, assets, pages, composables
  - Use `app/server/` directory for server-only code (Notion API, database clients)
  - Server code must be imported dynamically inside `useAsyncData` handlers (see pitfalls below)
- **Styling**: TailwindCSS v4 with `@tailwindcss/vite` plugin - use utility classes
- **Config**: Main config in `nuxt.config.ts` using `defineNuxtConfig()`
- **Routes**: Auto-generated from `app/pages/`

## Verification

MANDATORY: Always run verification commands after making changes.

- **Type Checking**: `pnpm check:types` (checks type errors with vue-tsc)
- **Linting**: `pnpm check:lint` (checks linting issues with oxlint)
- **Format Check**: `pnpm check:format` (checks formatting with oxfmt)
- **Build**: `pnpm check:build` (verifies build with test cache)

To auto-fix issues:

- **Fix Lint**: `pnpm fix:lint` (auto-fix linting issues)
- **Fix Format**: `pnpm fix:format` (auto-format code)

**Tip**: Use Bash sub-agents to run commands in parallel for faster verification.

# Common Pitfalls & Best Practices

- **Always use `<a>` instead of `<NuxtLink>` for internal links:** Musubi is a statically generated site where all blog data is fetched at build time during prerendering. Using `<NuxtLink>` enables client-side routing, which bypasses the prerendered HTML and attempts to fetch data at runtime (which won't work since there's no server API). Standard `<a>` tags ensure users receive the fully prerendered pages.

- **Vue SFC block order - `<script>` first pattern:** Always organize Vue Single File Components with the following block order: `<script setup lang="ts">` → `<template>` → `<style>` (if present). This improves readability by presenting the component's logic and data flow before its presentation layer. Template-only components (without script blocks) should remain as-is.

- **Always provide explicit keys to `useAsyncData`:** With `sharedPrerenderData: true` in `nuxt.config.ts`, Nuxt shares async data across prerendered pages. Without an explicit key, `useAsyncData` generates a key based on file path, causing data collision when the same composable is called for different pages. Always pass a unique key (e.g., `useAsyncData(createPostDataKey(slug), async () => {...})`). See `app/utils/keysForUseAsyncData.ts` for key utilities.

- **Minimize data returned from `useAsyncData`:** The data returned from `useAsyncData` is serialized and injected into each page's HTML/payload, increasing page size. Only return the data actually needed for rendering - avoid returning entire objects when only a few fields are used.

- **Never statically import from `app/server/`:** Server-only code lives in `app/server/`. Static imports will bundle server code into the client. Use the inline `import.meta.server` pattern with `neverCallable` to completely eliminate server code from client bundles:

  ```typescript
  // ❌ Bad - Website (and its NotionAPI dependency) bundled into client
  import { Website } from '~~/app/server/website/Website'

  useAsyncData('key', async () => {
    const website = Website.getInstance()
  })

  // ✅ Good - Server code completely tree-shaken from client bundle
  import { neverCallable } from '~/utils/neverCallable'

  useAsyncData(
    'key',
    import.meta.server
      ? async () => {
          const { Website } = await import('~~/app/server/website/Website')
          const website = Website.getInstance()
          // ...
        }
      : neverCallable,
  )
  ```

  **Why inline conditional?** The `import.meta.server` check must be inline (not wrapped in a function) for bundlers to statically analyze and tree-shake the server code path. Keep dynamic imports inside the handler since static imports may include side effects that would still be bundled.

- **Move logic inside `useAsyncData` when possible:** Logic inside `useAsyncData` handlers is removed from the final client output. Move data transformations, filtering, and processing inside the handler rather than in component code to reduce bundle size.
