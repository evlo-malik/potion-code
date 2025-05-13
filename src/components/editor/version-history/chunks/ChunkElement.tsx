import React, { type HTMLAttributes, type ReactNode } from 'react';

import { type PlateElementProps, useEditorPlugin } from '@udecode/plate/react';

import { cn } from '@/lib/utils';

import type { ChunkCollapsedProps } from './types';

import { type ChunkPluginConfig, ChunkPlugin } from './createChunkPlugin';
import { ExpandChunkButton } from './ExpandChunkButton';

// eslint-disable-next-line unicorn/prefer-set-has
const mergeableProps: (keyof HTMLAttributes<HTMLElement>)[] = ['className'];

export const injectNodeProps = (
  children: ReactNode,
  props: HTMLAttributes<HTMLElement>
) =>
  React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      const { attributes } = child.props as PlateElementProps;

      Object.keys(props).forEach((key) => {
        const exists = attributes && key in attributes;
        const mergeable = mergeableProps.includes(key as any);

        if (exists && !mergeable) {
          console.warn('injectNodeProps: Overwriting existing node prop', key);
        }
      });

      return React.cloneElement(child, {
        attributes: {
          ...attributes,
          className: cn(attributes?.className, props.className),
        },
      } as Partial<PlateElementProps>);
    }

    return child;
  });

export const ChunkElement = (injectProps) => {
  const { getOptions } = useEditorPlugin<ChunkPluginConfig>(ChunkPlugin);

  const { children, element } = injectProps;

  if (!element.chunkCollapsed) return children;

  const { blockCount, chunkIndex, showExpandButton } =
    element.chunkCollapsed as ChunkCollapsedProps;

  const mappedChildren = injectNodeProps(children, { className: 'hidden' });

  return (
    <>
      {showExpandButton && (
        <ExpandChunkButton
          onClick={() =>
            getOptions().setExpandedChunks!((prev) => [...prev, chunkIndex])
          }
          blockCount={blockCount}
        />
      )}
      {mappedChildren}
    </>
  );
};
