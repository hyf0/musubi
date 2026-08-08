# Architecture decisions

Judgments the human actually expressed about architecture — selections, acceptances, rejections. A finished implementation, a passed review, resemblance to a reference, or the absence of an objection is not acceptance. Never invent a rationale: if no reason was given, the entry says so. Entries record the judgment, not the chosen thing's full content — details live in [the target architecture](./architecture.md), linked. Edit entries in place; git keeps history.

## Decided

### Notion schema terminology and type scope

[VOUCHED @hyfdev 2026-08-08]

- **Ruling:** The default Notion Content schema must use unprefixed `Title`, `Slug`, `Status`, `Type`, and `Description` for properties shared by more than one content type, and `Post:Publish date`, `Page:Navigation`, and `Page:Navigation order` for properties owned by one type. The colon is a structural namespace separator with no following whitespace, and the suffix uses Notion-style sentence case. `Description` remains shared by Post and Page and supplies both the visible page summary and page-specific HTML and social-preview description, falling back to Config `Site description` when empty. `Tags` is not part of Musubi's default schema or product-owned content model.
- **Limits:** Arbitrary user-created properties remain outside Musubi's contract. Former `Publish Date`, `Date`, `Show in Navigation`, `ShowInNavigation`, `Navigation Order`, `NavigationOrder`, `Post:publish-date`, `Page:navigation`, and `Page:navigation-order` names must not remain accepted as compatibility aliases.
- **Why:** Yunfei selected a visible `Type:field` convention only for properties that belong to one content type, kept shared fields unprefixed, and removed `Tags` because adding a product-owned field later is easier than removing one after users depend on it. After seeing Notion's inline property descriptions and native sentence-case labels, he selected the compact no-space namespace form as the more professional, elegant, and self-consistent final style.
- **Source:** Yunfei He (@hyfdev), 2026-07-19 original shared-field terminology direction and 2026-08-08 explicit removal, prefixing, shared-Description, inline-description, namespace-spacing, sentence-case, and final field-name decisions during the Notion template review.

### Config language and timezone

[VOUCHED @hyfdev 2026-08-08]

- **Ruling:** The Config key `Lang` must be renamed to `Language`, and the currently unused `Timezone` key must be removed from the v1 template and implementation.
- **Limits:** `Language` continues to accept a BCP 47 language tag and control both the HTML `lang` attribute and date-formatting locale. `Post:Publish date` has calendar-date semantics even when its Notion value also contains a time or range, so publication dates do not require configurable timezone behavior.
- **Why:** Yunfei accepted the more explicit Language label and chose to remove Timezone after confirming that it has no effect on the current date-only publication values; no additional rationale was given.
- **Source:** Yunfei He (@hyfdev), 2026-08-08, explicit decisions during the Notion template review.

### Publication date interpretation

[VOUCHED @hyfdev 2026-08-08]

- **Ruling:** `Post:Publish date` must use the calendar-date portion of the Notion date's start value. If the value includes a time, Musubi ignores the time and offset without converting it to another timezone; if it is a range, Musubi ignores the end. Publication scheduling is not supported: Status alone controls inclusion in a build, while the publication date is display and ordering data.
- **Limits:** A Published Post still requires a start value containing a valid Gregorian calendar date. Ignored time, offset, timezone, and range-end data do not enter Musubi's content model. This does not define a future scheduling feature.
- **Why:** Yunfei wants Musubi to care only about one date even if Notion stores a time or range, with a range interpreted from its start date, and explicitly does not support scheduled publication; no additional rationale was given.
- **Source:** Yunfei He (@hyfdev), 2026-08-08, explicit decisions during the Notion template review.

### Dashboard-only automatic timestamps

[VOUCHED @hyfdev 2026-08-08]

- **Ruling:** The official Notion template must retain Notion's automatic `Created time` and `Last edited time` properties for private Dashboard sorting. They are authoring helpers, not Musubi-owned content properties, and Musubi must neither read nor validate them.
- **Limits:** Users may rename or delete either property without affecting site generation. They must not enter the public content model, checked-in product schema, or required-field documentation; Notion views may sort by them independently of Musubi.
- **Why:** Yunfei uses the automatic timestamps for internal Dashboard sorting and explicitly chose to retain both; no additional rationale was given.
- **Source:** Yunfei He (@hyfdev), 2026-08-08, explicit decision during the Notion template review.

### Config field names and defaults

[VOUCHED @hyfdev 2026-08-08]

- **Ruling:** The Config properties are exactly `Help`, `Key`, `Value`, and `Enabled`. Its exact Key options are `Site title`, `Site description`, `Author`, `Site URL`, `Language`, `GitHub`, and `X (Twitter)`. The selected defaults are `Site title = Musubi`, `Site description = A personal website published from Notion.`, `Author = Musubi`, `Site URL = https://example.com/`, and `Language = en`; `GitHub` and `X (Twitter)` have no value by default.
- **Limits:** `Help` and `Key` remain precise descriptions of a constrained Config key/value table rather than being generalized to `Description` and `Setting`. `Enabled` describes stored checkbox state. Yunfei's live Config explicitly supplies `https://musubi.hyf.me/`, so its deployment does not use the Site URL fallback. A disabled or empty required setting resolves its product default, while a disabled or empty optional setting resolves to absence.
- **Why:** Yunfei considers the parenthetical Twitter name clearer than `X` alone, selected Notion-style sentence case and ordinary parenthesis spacing, and explicitly accepted the complete naming review as professional, elegant, and self-consistent.
- **Source:** Yunfei He (@hyfdev), 2026-08-08, explicit defaults, social-name, sentence-case, checkbox-state, and complete Config field-name decisions during the Notion template review.

### Site URL v1 scope and fallback

[VOUCHED @hyfdev 2026-08-08]

- **Ruling:** The Config key for the public website address must be `Site URL`, replacing `Link`. V1 supports only origin-root deployment and does not support a folder base path such as `/xxx-website/`. When Site URL is disabled, absent, or empty, Musubi must resolve the ordinary `https://example.com/` default and continue generating canonical and `og:url` metadata through the same path used for an explicit value.
- **Limits:** Until the owner configures the real public URL, generated metadata intentionally points at the reserved example origin. Supporting a deployment base path later must update the complete router, internal-link, static-asset, Void page-data, output, and metadata pipeline rather than merely permit a pathname in Config. The former `Link` key must be removed during the pre-public cutover rather than retained as an alias.
- **Why:** Yunfei prefers one uniform Config default-resolution path over special omission logic for missing site identity and selected root-only deployment for v1.
- **Source:** Yunfei He (@hyfdev), 2026-08-08, explicit URL naming, fallback, and deployment-scope decisions during the Notion template review.

### Content validation scope

[VOUCHED @hyfdev 2026-08-08]

- **Ruling:** Musubi must ignore values in properties that do not apply to a row's selected Type rather than reject the Published row. It must still reject missing or invalid values required to emit the selected type, invalid Status or Type values, duplicate or conflicting public routes, and other conditions that make deterministic publication impossible.
- **Limits:** Ignoring an inapplicable value does not make that property apply to the type and does not preserve it in Musubi's public model. Applicable values still follow their own contracts, including the selected start-calendar-date interpretation for `Post:Publish date`.
- **Why:** Yunfei considers strict rejection of harmless values in type-inapplicable fields unnecessary; no additional rationale was given.
- **Source:** Yunfei He (@hyfdev), 2026-08-08, explicit decision during the Notion template review.

### Primary navigation v1

[VOUCHED @hyfdev 2026-08-08]

- **Ruling:** The v1 primary navigation must render fixed Home, then fixed Blog, then Published Pages with `Page:Navigation` enabled. `Page:Navigation` is a checkbox. The optional numeric `Page:Navigation order` sorts only enabled Pages: explicit values sort first and ascending, while empty or tied values fall back to Title and then Slug.
- **Limits:** V1 does not place Pages before Home or between Home and Blog and does not model an arbitrary ordered navigation collection. A hidden Page may retain its order, which has no effect until navigation is enabled again. Values on Post and Home rows are ignored under the accepted validation policy.
- **Why:** Yunfei chose the smaller fixed model after the signed global-order proposal failed to handle multiple Pages cleanly; arbitrary placement remains hypothetical, and a future dedicated Navigation model can be added if a real requirement appears.
- **Source:** Yunfei He (@hyfdev), 2026-08-08, explicit decision during the Notion template review.

### Pre-public Notion schema cutover

[VOUCHED @hyfdev 2026-08-08]

- **Ruling:** Before Musubi is public, settle the complete Notion schema first and then update the implementation, both of Yunfei's live Dashboards, and the checked-in snapshot together in one clean cutover; do not keep legacy field aliases merely to avoid this one-time migration. That cutover was authorized and completed on 2026-08-08 after verified private backups of both Dashboards were created.
- **Limits:** This governs the pre-public project and does not decide a compatibility policy for a future important public product. Removed live values remain recovery data in the private backups, not compatibility inputs accepted by the implementation.
- **Why:** Yunfei wants to avoid permanent compatibility complexity in a project that primarily serves him and therefore wants the Notion field design treated carefully before public release.
- **Source:** Yunfei He (@hyfdev), 2026-08-08, explicit correction during the Notion template review followed by explicit authorization to delete the selected fields and migrate both Dashboards directly.

### User-facing Notion page inputs

- **Ruling:** The two visible Notion database pages must be named `Database` and `Config`. Musubi's public environment contract must accept `NOTION_DB_PAGE_ID` and `NOTION_CONFIG_PAGE_ID` for those pages; `scripts/notion/` must resolve the sole data source inside each page before querying it. Internal code may continue to use `content` for the Post, Page, and optional Home domain.
- **Limits:** Each page must contain exactly one data source. Zero or multiple data sources stop refresh with a direct error. Data-source IDs remain private implementation details and must not become user configuration.
- **Why:** From the user's perspective, setup consists of connecting two Notion pages. Naming the first page `Database` makes its relationship to `NOTION_DB_PAGE_ID` direct and avoids making `DB` look like an unrelated internal identifier. Exposing Notion's internal data-source layer adds an unnecessary concept and makes setup harder to understand.
- **Source:** Yunfei He (@hyfdev), 2026-07-19, explicit correction during the Cloudflare setup discussion.

### Checked-in Notion snapshot boundary

- **Ruling:** Notion remains the sole canonical editing source. Musubi must keep one checked-in snapshot of fetched Published Notion data — one Config Data JSON file and one Page Data JSON file per Published Notion page — as real, offline-reproducible input for development and checks; a production build refreshes the same on-disk shape from Notion before rendering.
- **Limits:** Filtering Draft rows is the explicit ingestion exception: otherwise, the code that fetches and stores the snapshot must not add Musubi business or rendering rules. “Notion page” includes rows that Musubi later treats as a Post, Page, or optional Home. The checked-in copy need not mirror every editorial-only Notion change. Refresh and commit it when a change needs a new Notion input sample, changes the snapshot schema, or intentionally updates the data used for offline verification; do not hand-edit it into synthetic test data. This decision governs neither the containing directory, page filename key, body representation, media and attachment policy, nor the exact refresh algorithm. Changing Git tracking, file granularity, which builds may fetch Notion, or the no-Musubi-rules ingestion boundary reopens this decision.
- **Why:** Yunfei wants the directory structure to make the separation between Notion fetching and Musubi rendering visible, wants local development and checks to run quickly without repeatedly fetching Notion, and prefers page-local Git diffs over rewriting one aggregate Page Data file when the checked-in copy changes. Production freshness still comes from Notion at build time, not from treating Git as a second content authority.
- **Source:** Yunfei He (@hyfdev), 2026-07-18 original data-boundary direction; 2026-07-24 explicit clarification that the checked-in snapshot primarily supports fast local development and testing rather than acting as the product's content authority.

### Notion code and snapshot locations

- **Ruling:** Notion retrieval must be managed outside the application framework under `scripts/notion/`, with `index.ts` as its entry point; the framework-neutral Notion Data file contract and pure ID normalization must live under `src/shared/notion-data/`; the one checked-in offline snapshot must live under `.musubi/notion-data-snapshot/` as `config.json` plus one JSON file per Published Notion page in `pages/`, and the site build must consume those files directly without a second aggregated content JSON such as `.musubi/site.json`.
- **Limits:** `scripts/notion/` may split retrieval implementation details into more files as it grows. `src/shared/` is ordinary Musubi source rather than a separate Void file-based convention; `src/shared/notion-data/` may contain only the persisted data contract and pure helpers required by both its producer and consumer. It must not import the Notion SDK, perform network or filesystem access, or become application-framework source. This decision does not choose the stable page filename key, the exact JSON schema, or other internal filenames. Changing either subsystem root, moving Notion retrieval into the application framework, making the application depend on retrieval implementation, or reintroducing a second aggregate reopens this decision.
- **Why:** Yunfei wants the Notion Data subsystem, including its code, managed independently from the application framework and selected the concise `scripts/notion/` name plus the shared `.musubi/` data root. A neutral contract lets the producer and consumer agree on persisted data without making Void depend on the retrieval tool. The site build can perform Musubi-specific conversion in memory, so persisting a second aggregated content JSON would duplicate the same content boundary without being needed.
- **Source:** Yunfei He (@hyfdev), 2026-07-18 original location decision and 2026-07-23 explicit clarification that Notion and font tooling stay independent from Void source.

### Font code and working-data locations

[VOUCHED @hyfdev 2026-07-18]

- **Ruling:** Font subsystem code must live under `scripts/font/`, and all repository-local font inputs, caches, and other working data must live under the Git-ignored `.musubi/font/`.
- **Limits:** This decision does not choose the internal files or subdirectories under either root, nor the final public font-output paths. Changing either root or tracking private font working data in Git reopens this decision.
- **Why:** Yunfei selected concise domain directory names and the shared `.musubi/` root; no additional rationale was given.
- **Source:** Yunfei He (@hyfdev), 2026-07-18, explicit direction during the Musubi architecture discussion.

### Snapshot consumption and rendering flow

- **Ruling:** Void build-time loaders must read `.musubi/notion-data-snapshot/` through `src/server/site/`, consume its framework-neutral contract from `src/shared/notion-data/`, use pure code under `src/shared/site/` and `src/shared/content/` to create one in-memory `Site` containing `SiteConfig`, `Post`, `Page`, and optional `Home` values, pass only explicitly public slices through global middleware and page loaders, and keep Vue components responsible only for presentation.
- **Limits:** Production generation caches one `Site` per Node process, while development recreates it after snapshot files change. Derived routes, navigation, Home entries, Blog ordering, and parsed documents remain in memory and are never written as a second aggregate. `src/shared/site/public.ts` strips internal source and page labels before serialization. Internal helper files may split without reopening this decision if these boundaries remain intact. Persisting an aggregate site model, reading the snapshot in browser code, accessing Notion from this flow, publishing loaders as a runtime content API, or allowing repeated SSG loader execution to perform side effects reopens it. X, media, and font network work are outside this decision.
- **Why:** Yunfei approved migrating Musubi from Nuxt to Void Framework while preserving the existing Notion snapshot and static-publication boundaries.
- **Source:** Yunfei He (@hyfdev), 2026-07-23, explicit migration approval; earlier data-boundary acceptance on 2026-07-18.

### Snapshot content and refresh

[VOUCHED @hyfdev 2026-07-18]

- **Ruling:** `config.json` must preserve the Config data-source schema and raw rows, while each `pages/<notion-page-id>.json` must preserve one Published page response, its Notion Markdown response, and any retrieved unknown blocks together with an explicit snapshot schema version and Notion API version; refreshes must format deterministically, query the complete current Published roster, reuse an unchanged page only when its Notion identity, last-edited time, API version, and snapshot format still match, and replace the snapshot only after the complete refresh succeeds.
- **Limits:** Stable Notion page IDs, not slugs, name Page Data files. Volatile fetch timestamps must not create Git diffs. A failed refresh keeps the prior snapshot on disk but fails the invoking command rather than publishing stale data. This decision does not require Notion-hosted media bytes to be persisted locally, and internal JSON field names may change only with a schema-version migration.
- **Why:** Yunfei accepted the reviewed snapshot and refresh packet as presented; no additional rationale was given.
- **Source:** Yunfei He (@hyfdev), 2026-07-18, explicit acceptance during the Musubi architecture discussion.

### Notion media remains remote initially

[VOUCHED @hyfdev 2026-07-18]

- **Ruling:** The initial architecture must preserve image and attachment URLs in Notion Data and render them remotely without downloading, caching, rewriting, or Git-tracking their bytes.
- **Limits:** Notion-hosted URLs returned by the official Markdown API may expire; this is an accepted initial limitation to revisit only after it causes a concrete problem. External media follows the same direct-URL behavior. This ruling does not preclude a later measured change to a build cache, static asset copy, proxy, or external media host.
- **Why:** Yunfei rejected adding asset persistence merely to anticipate URL expiry, preferred the simpler behavior used from a reader's perspective by existing Notion starters, and explicitly chose to handle an expiry problem only if it occurs.
- **Source:** Yunfei He (@hyfdev), 2026-07-18, explicit correction immediately after vouching the architecture packet.

### X data stays a URL

[VOUCHED @hyfdev 2026-07-18]

- **Ruling:** Notion Data and the static build must keep an X embed as its source URL only; Notion refresh and site generation must not request X metadata, oEmbed, rendered HTML, or dimensions.
- **Limits:** The static renderer must retain a usable link. A future browser-only enhancement may be considered separately, but it cannot change the snapshot contract or make X availability a publication requirement.
- **Why:** Yunfei selected the simplest X boundary after rejecting build-time requests and height calculation.
- **Source:** Yunfei He (@hyfdev), 2026-07-18, explicit acceptance during the Musubi architecture discussion.

### User-facing task and network boundary

- **Ruling:** Musubi must expose `notion:setup` to create or refresh Notion Data, `font:setup` / `font:build` for pinned Charter, JetBrains Mono, optional Tsanger sources, and generated web fonts, `site:build` for the offline static site pipeline from the on-disk snapshot (brand check, font setup, font build, Void build, finalize, artifact), package entry `build` as `notion:setup` then `site:build`, package entry `dev` for local development from existing Notion Data, and `ready` for the complete local quality gate including `site:build`.
- **Limits:** `package.json` scripts are only lifecycle hooks (`postinstall`, `prepare`) and thin entries (`dev`, `build`, `preview`). All composable steps are Vite+ tasks under `vp run`. `vp dev` is the Vite+ built-in development command and is not Musubi's application entry. `generate` and `production` must not be user-facing Musubi task names; Void's Vite build remains an implementation detail inside `site:build`. `dev`, `site:build`, and `ready` must not access Notion. `font:setup` runs from postinstall, dev, and site:build; missing required Charter or JetBrains Mono source files and an attempted Tsanger setup must download successfully or fail with a clear error. `MUSUBI_TSANGER_SETUP=0` may skip only the Tsanger download attempt; it does not clear an existing Tsanger cache—use `font:setup -- --clear` when those sources must not be used. Full upstream sources stay out of Git and public artifacts.
- **Why:** Yunfei rejected mixing `build` with a misnamed `check:build`, selected `site:build` for the offline pipeline and `build` as content refresh plus that pipeline, required package scripts to stay minimal so orchestration lives in Vite+ tasks, and required font setup to fail loudly on download errors rather than soft-continue.
- **Source:** Yunfei He (@hyfdev), 2026-07-18 original task-boundary corrections; 2026-07-20 session refined task names (`site:build`), package/task split, and fail-hard `font:setup`. Prior vouch stamp removed after those wording changes pending re-vouch.

### Void Framework without Void Platform

- **Ruling:** Musubi must use Void Framework for its application and static-generation layer while continuing to deploy directly to Cloudflare; adopting Void Framework must not require Void Platform.
- **Limits:** The initial migration pins the public `void` and `@void/vue` packages at `0.10.10`, preserves Vue components and the accepted visual result, and keeps runtime rendering and ISR out of scope. A future runtime or ISR requirement reopens where Notion-derived data lives because a deployed Worker cannot read the build machine's snapshot directory.
- **Why:** Yunfei wants to migrate Musubi to Void Framework, keep Cloudflare deployment, consider future architectural change without solving hypothetical ISR now, and proceed once the public npm release was shown to support the current static site.
- **Source:** Yunfei He (@hyfdev), 2026-07-22 to 2026-07-23, explicit framework, deployment, scope, and implementation decisions.

### Static deployment target

- **Ruling:** The maintained Musubi example must generate its Wrangler configuration as part of the static build and use it to deploy `dist/client` through Cloudflare Workers Static Assets, not Cloudflare Pages, Void Platform, or a runtime Worker.
- **Limits:** The build generates the Git-ignored root `wrangler.json`, where Wrangler discovers it directly, and the configuration currently names the `musubi` Worker and selects only `dist/client` for deployment. This is a temporary explicit deployment target, not a derived application identity; using a differently named Worker requires revisiting it. The required compatibility date and the explicit 404 and URL handling remain generated. The Worker has no `main`, assets binding, runtime Notion credentials, or server process. `dist/ssr` remains a local build artifact and may remain on disk.
- **Why:** Yunfei rejected Pages because it is being retired in favor of Workers, selected Workers explicitly, required the Void migration to keep Cloudflare deployment, wants the Wrangler configuration to be a build result rather than independently maintained source, and chose to hardcode `musubi` for now after reviewing the generic deployment-name alternatives. Wrangler routing remains necessary for a visible 404 and slashless canonical URLs.
- **Source:** Yunfei He (@hyfdev), 2026-07-19 Cloudflare direction, 2026-07-23 Void migration, static-output, generated-root-Wrangler-configuration, and retained-build-artifact decisions, and 2026-07-24 explicit temporary `musubi` target after reviewing [Cloudflare PR #1](https://github.com/hyfdev/musubi/pull/1); verified locally with Wrangler 4.112.0 root configuration discovery and name behavior.

## Open