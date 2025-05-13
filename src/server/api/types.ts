import type { RouterOutputs } from '@/server/api/root';

export type RouterCommentItem =
  RouterOutputs['comment']['discussions']['discussions'][0]['comments'][0];

export type RouterDiscussionItem =
  RouterOutputs['comment']['discussions']['discussions'][0];

export type RouterDocumentVersionItem =
  RouterOutputs['version']['documentVersions']['versions'][0];
