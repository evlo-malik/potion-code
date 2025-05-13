'use client';

import { AIChatPlugin } from '@udecode/plate-ai/react';
import {
  type PlateTextProps,
  PlateText,
  usePluginOption,
} from '@udecode/plate/react';

import { cn } from '@/lib/utils';

export function AILeaf(props: PlateTextProps) {
  const streaming = usePluginOption(AIChatPlugin, 'streaming');
  const streamingLeaf = props.editor
    .getApi(AIChatPlugin)
    .aiChat.node({ streaming: true });

  const isLast = streamingLeaf?.[0] === props.text;

  return (
    <PlateText
      className={cn(
        'border-b-2 border-b-brand/10 bg-brand/5 text-[rgb(17,96,174)]',
        'transition-all duration-200 ease-in-out',
        isLast &&
          streaming &&
          'after:ml-1.5 after:inline-block after:h-3 after:w-3 after:rounded-full after:bg-primary after:align-middle after:content-[""]'
      )}
      {...props}
    />
  );
}
