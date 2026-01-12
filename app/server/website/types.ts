import type { ExtendedRecordMap } from 'notion-types'
import type { PostMeta } from '~~/app/server/website/types/PostMeta'

export interface Post {
  meta: PostMeta
  recordMap: ExtendedRecordMap
}
