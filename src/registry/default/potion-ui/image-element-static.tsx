import * as React from 'react';

import type { TCaptionElement } from '@udecode/plate-caption';
import type { TImageElement } from '@udecode/plate-media';

import { type SlateElementProps, NodeApi, SlateElement } from '@udecode/plate';

export function ImageElementStatic(
  props: SlateElementProps<TImageElement & TCaptionElement & { width: number }>
) {
  const { align = 'center', caption, url, width } = props.element;

  return (
    <SlateElement className="py-2.5" {...props}>
      <figure className="group relative m-0 inline-block">
        <div
          className="relative max-w-full min-w-[92px]"
          style={{ textAlign: align }}
        >
          <div className="inline-block" style={{ width }}>
            <img
              className="w-full max-w-full cursor-default rounded-sm object-cover px-0"
              alt={(props.attributes as any).alt}
              src={url}
            />
            {caption && (
              <figcaption className="mx-auto mt-2 h-[24px] max-w-full">
                {NodeApi.string(caption[0])}
              </figcaption>
            )}
          </div>
        </div>
      </figure>
      {props.children}
    </SlateElement>
  );
}
