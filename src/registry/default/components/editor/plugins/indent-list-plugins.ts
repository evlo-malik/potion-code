'use client';

import { BlockquotePlugin } from '@udecode/plate-block-quote/react';
import { CodeBlockPlugin } from '@udecode/plate-code-block/react';
import { HEADING_LEVELS } from '@udecode/plate-heading';
import { IndentListPlugin } from '@udecode/plate-indent-list/react';
import { IndentPlugin } from '@udecode/plate-indent/react';
import { TogglePlugin } from '@udecode/plate-toggle/react';
import { ParagraphPlugin } from '@udecode/plate/react';

import {
  TodoLi,
  TodoMarker,
} from '@/registry/default/potion-ui/indent-todo-marker';

export const indentListPlugins = [
  IndentPlugin.extend({
    inject: {
      targetPlugins: [
        ...HEADING_LEVELS,
        ParagraphPlugin.key,
        BlockquotePlugin.key,
        CodeBlockPlugin.key,
        TogglePlugin.key,
      ],
    },
  }),
  IndentListPlugin.extend({
    inject: {
      targetPlugins: [
        ...HEADING_LEVELS,
        ParagraphPlugin.key,
        BlockquotePlugin.key,
        CodeBlockPlugin.key,
        TogglePlugin.key,
      ],
    },
    options: {
      listStyleTypes: {
        todo: {
          liComponent: TodoLi,
          markerComponent: TodoMarker,
          type: 'todo',
        },
      },
    },
  }),
];
