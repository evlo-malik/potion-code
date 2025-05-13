import { BlockDiscussion } from '../../ui/block-discussion';
import { AfterEditableComments } from '../../ui/floating-discussion';
import { ExtendedCommentsPlugin } from './ExtendedCommentsPlugin';

export const commentsPlugin = ExtendedCommentsPlugin.extend({
  render: {
    aboveNodes: BlockDiscussion as any,
    afterEditable: AfterEditableComments as any,
  },
});
