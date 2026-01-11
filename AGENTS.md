# Agent Guidelines for Musubi

## Build & Development Commands

- **Install**: `pnpm install` (required package manager)
- **Dev**: `pnpm dev` (starts server on localhost:3000)
- **Build**: `pnpm build` (production build)
- **Preview**: `pnpm preview` (preview production build)
- **Generate**: `pnpm generate` (static site generation)
- **Note**: No test or lint commands configured yet

## Code Style

- **Indentation**: 2 spaces (see .editorconfig)
- **TypeScript**: Enabled, use TypeScript for all new files
- **Imports**: Nuxt auto-imports components, composables, and Vue APIs - no manual imports needed for framework features
- **Components**: Place in `app/components/` for auto-import
- **Naming**: PascalCase for components (e.g., `Navbar.vue`), camelCase for composables

## Framework Conventions

- **Structure**:
  - Use `app/` directory for components, assets, pages, composables
  - Use `shared/` directory for shared business logic and utilities
  - Import from `shared/` using `~~/shared` alias (e.g., `import { Website } from '~~/shared/website/Website'`)
- **Styling**: TailwindCSS v4 with `@tailwindcss/vite` plugin - use utility classes
- **Config**: Main config in `nuxt.config.ts` using `defineNuxtConfig()`
- **Routes**: Auto-generated from `app/pages/`

## Verification

MANDATORY: Always run verification commands after making changes.

- **Type Checking**: `pnpm typecheck` (checks type errors)
- **Linting**: `pnpm lint` (checks linting issues)
- **Formatting**: `pnpm format` (formats code according to style guidelines)

# Common Pitfalls & Best Practices

- **Always use `<a>` instead of `<NuxtLink>` for internal links:** Musubi is a statically generated site where all blog data is fetched at build time during prerendering. Using `<NuxtLink>` enables client-side routing, which bypasses the prerendered HTML and attempts to fetch data at runtime (which won't work since there's no server API). Standard `<a>` tags ensure users receive the fully prerendered pages.

- **Vue SFC block order - `<script>` first pattern:** Always organize Vue Single File Components with the following block order: `<script setup lang="ts">` → `<template>` → `<style>` (if present). This improves readability by presenting the component's logic and data flow before its presentation layer. Template-only components (without script blocks) should remain as-is.
