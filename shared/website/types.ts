import type { ExtendedRecordMap } from 'notion-types'
import type { PostMeta } from '~~/shared/website/types/PostMeta'

export interface Post {
  meta: PostMeta
  recordMap: ExtendedRecordMap
}
