'use client';

import React, { useRef } from 'react';

import type {
  BaseSuggestionConfig,
  TSuggestionData,
} from '@udecode/plate-suggestion';

import { SuggestionPlugin } from '@udecode/plate-suggestion/react';
import {
  type RenderNodeWrapperProps,
  usePluginOption,
} from '@udecode/plate/react';
import { CornerDownLeftIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { ExtendedSuggestionPlugin } from '@/registry/default/components/editor/plugins/suggestion/ExtendedSuggestionPlugin';

export const SuggestionBelowNodes = ({
  editor,
  element,
}: RenderNodeWrapperProps<BaseSuggestionConfig>) => {
  if (!editor.getApi(SuggestionPlugin).suggestion.isBlockSuggestion(element))
    return;

  const suggestionData = element.suggestion;

  if (!suggestionData?.isLineBreak) return;

  return function Component({ children }: { children: React.ReactNode }) {
    return (
      <React.Fragment>
        {children}
        <SuggestionLineBreak suggestionData={suggestionData} />
      </React.Fragment>
    );
  };
};

function SuggestionLineBreak({
  suggestionData,
}: {
  suggestionData: TSuggestionData;
}) {
  const { type } = suggestionData;
  const isRemove = type === 'remove';
  const isInsert = type === 'insert';

  const activeSuggestionId = usePluginOption(
    ExtendedSuggestionPlugin,
    'activeId'
  );
  const hoverSuggestionId = usePluginOption(
    ExtendedSuggestionPlugin,
    'hoverId'
  );

  const isActive = activeSuggestionId === suggestionData.id;
  const isHover = hoverSuggestionId === suggestionData.id;

  const spanRef = useRef<HTMLSpanElement>(null);

  return (
    <span
      ref={spanRef}
      className={cn(
        'absolute border-b-2 border-b-brand/[.24] bg-brand/[.08] text-justify text-brand/80 no-underline transition-colors duration-200',
        isInsert &&
          (isActive || isHover) &&
          'border-b-brand/[.60] bg-brand/[.13]',
        isRemove &&
          'border-b-gray-300 bg-gray-300/25 text-gray-400 line-through',
        isRemove &&
          (isActive || isHover) &&
          'border-b-gray-500 bg-gray-400/25 text-gray-500 no-underline'
      )}
      style={{
        bottom: 4.5,
        height: 21,
      }}
      contentEditable={false}
    >
      <CornerDownLeftIcon className="mt-0.5 size-4" />
    </span>
  );
}
