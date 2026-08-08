# Notion v1 Schema Contract

## Status

This is the selected pre-public Notion v1 contract. It was applied on 2026-08-08 to the implementation, the Musubi-owned Dashboard, the separate hyf.me Dashboard, and the checked-in Published-content snapshot after Yunfei explicitly authorized the two live migrations.

## Objective

Freeze one small, explicit Notion v1 contract before Musubi is public, then update the implementation, Yunfei's workspace, the checked-in snapshot, and the duplicable template in one coordinated cutover. The final implementation must not retain pre-public field aliases or removed model branches merely to ease this one migration.

Musubi owns only the properties named in this contract. Extra user-created Database properties are ignored and are not compatibility inputs, public metadata, or fields Musubi may reinterpret later without a new decision. Config remains fully product-owned and rejects unknown settings.

## Cutover evidence

- At cutover, the Musubi-owned Database contained 26 rows: one Published Home, one Draft Page, seven Draft Posts, and 17 Published Posts. Its 24 Posts used single date-only publication values. The hyf.me Database contained nine rows: one Published Home, two Draft Pages, one Draft Post, and five Published Posts.
- Before migration, 22 Musubi-owned rows used `Tags`, but the website had no tag rendering, filtering, route, or reader-visible behavior. No hyf.me row used Tags. Neither Database enabled Page navigation or supplied a navigation order.
- Complete private Notion backups of both Dashboards were created and verified before destructive changes. The backups retain the removed Tag values and former Config rows.
- Both live Databases now carry the eight project-owned properties below plus `Created time` and `Last edited time`. Both live Config data sources now contain exactly the selected seven enabled rows, with each site's prior values preserved under the renamed keys.
- Historical content-field, type-value, Config-key, and environment aliases were removed from the implementation in the same cutover rather than becoming v1 compatibility behavior.

## Database schema

The Musubi-owned ingestion contract has exactly these eight properties and omits `Tags`. Both live Dashboards and the duplicable template additionally retain Notion's automatic `Created time` and `Last edited time` properties as private sorting helpers; Musubi never reads or validates them, and users may safely rename or delete them.

| Property                | Notion type | Applies to       | Contract                                                                                                       |
| ----------------------- | ----------- | ---------------- | -------------------------------------------------------------------------------------------------------------- |
| `Title`                 | `title`     | Post, Page, Home | Required and nonempty when Published.                                                                          |
| `Slug`                  | `rich_text` | Post, Page       | Required when Published; one explicit valid URL segment. Ignored for Home.                                     |
| `Post:Publish date`     | `date`      | Post             | Required when Published. Uses only the calendar date in the start value; ignores time and range end.           |
| `Status`                | `select`    | Post, Page, Home | Exactly `Draft` or `Published`; required even while a row is incomplete.                                       |
| `Type`                  | `select`    | Post, Page, Home | Exactly `Post`, `Page`, or `Home`; `Content` is not a v1 value.                                                |
| `Description`           | `rich_text` | Post, Page       | Optional visible lede for Post and Page, list summary for Post, and page-specific HTML and social description. |
| `Page:Navigation`       | `checkbox`  | Page             | Includes a Published Page after the fixed Home and Blog items. Ignored for Post and Home.                      |
| `Page:Navigation order` | `number`    | Page             | Optional order among enabled Pages only. Ignored for Post and Home.                                            |

Draft rows may leave content fields incomplete, but every row must have a valid Status so a build never guesses whether the row is public. Published rows must supply the values required to emit their selected Type. Values in type-inapplicable properties are ignored rather than rejected or copied into Musubi's public model.

The Database schema itself is validated, not only row values: Status has exactly Draft and Published options; Type has exactly Post, Page, and Home options; and every project-owned property has the accepted type. Extra user-owned Database properties remain allowed and ignored.

### Published type matrix

| Property                | Post                                   | Page            | Home                                                                |
| ----------------------- | -------------------------------------- | --------------- | ------------------------------------------------------------------- |
| `Title`                 | Required                               | Required        | Required as the Notion row identity; not rendered as a Home heading |
| `Slug`                  | Required                               | Required        | Ignored                                                             |
| `Post:Publish date`     | Required; uses the start calendar date | Ignored         | Ignored                                                             |
| `Description`           | Optional                               | Optional        | Ignored                                                             |
| `Page:Navigation`       | Ignored                                | True or false   | Ignored                                                             |
| `Page:Navigation order` | Ignored                                | Optional number | Ignored                                                             |

Slugs remain explicit, Unicode-capable, NFC-normalized, case-insensitively unique, and limited to one raw path segment. `Post:Publish date` is display and ordering data; Status controls whether a row is included, and publication scheduling is outside v1.

A valid `Post:Publish date` has a start value whose leading `YYYY-MM-DD` is a real Gregorian calendar date. Musubi preserves that literal calendar date without timezone conversion. Any following time or offset and any range end are ignored and do not enter the content model.

## Navigation

V1 uses the fixed sequence `Home → Blog → enabled Pages`. `Page:Navigation` is a checkbox, and disabling it removes only the navigation entry while preserving the Page's direct route. `Page:Navigation order` is optional and compares only enabled Pages: explicit numbers sort first and ascending; empty or tied values fall back to Title and then Slug. A hidden Page may retain its order for later reuse. Values on Post and Home rows are ignored under the accepted validation policy.

V1 deliberately does not place Pages before Home or between Home and Blog. If a real arbitrary-placement requirement appears later, it should reopen the model as an ordered Navigation collection rather than encode fixed anchors into magic numeric ranges.

## Content property descriptions

The Database properties carry immediate one-line help in Notion:

| Property                | Description                                                                                                               |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `Title`                 | `Published title. Required for Post, Page, and Home.`                                                                     |
| `Slug`                  | `URL segment for Post and Page. Leave empty for Home.`                                                                    |
| `Post:Publish date`     | `Post only. Required when Published; Musubi uses the start date and ignores any time or range end.`                       |
| `Status`                | `Draft is private. Published is included in the next build.`                                                              |
| `Type`                  | `Post publishes under /blog, Page at /:slug, and Home adds optional content to /.`                                        |
| `Description`           | `Optional summary shown for Post and Page and used for that page's search and social-preview description.`                |
| `Page:Navigation`       | `Page only. Enable to show this Published Page after Home and Blog.`                                                      |
| `Page:Navigation order` | `Page only. Optional order among enabled Pages; lower numbers appear first and empty values appear after numbered Pages.` |
| `Created time`          | `Created automatically by Notion. Used only for private sorting and ignored by Musubi.`                                   |
| `Last edited time`      | `Updated automatically by Notion. Used only for private sorting and ignored by Musubi.`                                   |

## Config schema

The Config schema retains all four existing properties because each has a separate authoring role:

| Property  | Notion type | Contract                                                                                                    |
| --------- | ----------- | ----------------------------------------------------------------------------------------------------------- |
| `Help`    | `title`     | Human explanation and Notion's required title property.                                                     |
| `Key`     | `select`    | Constrained product-owned setting name. Users select an existing key rather than typing an arbitrary one.   |
| `Value`   | `rich_text` | Stored setting value.                                                                                       |
| `Enabled` | `checkbox`  | When false, ignores the stored Value and resolves the key's default or absence without deleting that Value. |

The Config properties carry these one-line descriptions in Notion:

| Property  | Description                                                                      |
| --------- | -------------------------------------------------------------------------------- |
| `Help`    | `What this setting controls.`                                                    |
| `Key`     | `Musubi setting name. Use one row for each supported key.`                       |
| `Value`   | `Setting value. Leave empty to use the default or omit an optional setting.`     |
| `Enabled` | `Use Value when enabled; otherwise use the default or omit an optional setting.` |

V1 uses the following seven rows. The Help column supplies the exact title text for each row:

| Key                | Help                                                                                       |
| ------------------ | ------------------------------------------------------------------------------------------ |
| `Site title`       | `Site name used in the browser title and site header.`                                     |
| `Site description` | `Default search and social-preview description when content has no Description.`           |
| `Author`           | `Name shown in the footer.`                                                                |
| `Site URL`         | `Public origin used for canonical URLs, Open Graph URLs, and same-origin link detection.`  |
| `Language`         | `BCP 47 language tag used for HTML language and date formatting, for example en or zh-CN.` |
| `GitHub`           | `Optional GitHub URL shown in navigation.`                                                 |
| `X (Twitter)`      | `Optional X/Twitter URL shown in navigation.`                                              |

The selected resolution rule treats a disabled row or an enabled row with an empty Value as providing no explicit value. A key with a product default then uses that default; an optional feature without a nonempty default is absent. Disabling is still useful because it preserves the stored text for later re-enabling, whereas clearing Value removes it. Unknown or duplicate enabled keys and invalid enabled nonempty values fail the build.

| Key                | Default                                     |
| ------------------ | ------------------------------------------- |
| `Site title`       | `Musubi`                                    |
| `Site description` | `A personal website published from Notion.` |
| `Author`           | `Musubi`                                    |
| `Site URL`         | `https://example.com/`                      |
| `Language`         | `en`                                        |
| `GitHub`           | Absent                                      |
| `X (Twitter)`      | Absent                                      |

The Musubi-owned live Config explicitly supplies and enables `https://musubi.hyf.me/`, while the hyf.me Config supplies and enables `https://hyf.me/`. The migration renames each key without replacing either value, so neither deployment uses the generic Site URL fallback. The fallback keeps canonical and `og:url` generation on one ordinary code path while avoiding a real owner's domain in public duplicates.

V1 accepts only an origin-root site URL with no non-root pathname, query, or fragment. Folder deployment is out of scope because it would also require base-aware routing, internal links, assets, Void page data, output verification, and deployment behavior.

`Created time` and `Last edited time` remain in the official template as zero-maintenance properties for private Notion sorting. They are deliberately outside the Musubi-owned schema, so their names and presence are not part of the ingestion contract.

## Acceptance fixture

Tests use a synthetic acceptance fixture covering multiple enabled Pages with explicit, omitted, and tied orders, a direct route for a hidden Page, fixed Home and Blog positions, and publication dates supplied as a plain date, a date-time, and a range.

## Applied cutover

On 2026-08-08, both complete live Dashboards were copied into verified private Notion backups before the authorized migration. The content-specific properties were renamed without changing their values; `Tags` was removed; both automatic timestamp properties were retained or added; every property received its selected one-line description; `Link` and `Lang` became `Site URL` and `Language`; and `Timezone` was removed from both live Config data sources while its former row remained recoverable in the private backup. A final coordinated naming pass then applied the no-space namespace, sentence case, `Enabled`, and ordinary `X (Twitter)` spacing selected in this contract.

The checked-in Published-content snapshot was migrated with the same property renames, Config changes, and removals. Formatting, linting, type checks, 155 tests, complete static generation of all 18 Published pages, final artifact verification, and direct inspection of generated navigation and metadata all passed against that snapshot.