'use client';

import * as React from 'react';

import { useMediaState } from '@udecode/plate-media/react';
import { ResizableProvider } from '@udecode/plate-resizable';
import {
  type PlateElementProps,
  PlateElement,
  withHOC,
} from '@udecode/plate/react';

import { Caption, CaptionTextarea } from './caption';

export const MediaAudioElement = withHOC(
  ResizableProvider,
  function MediaAudioElement(props: PlateElementProps) {
    const { align = 'center', readOnly, unsafeUrl } = useMediaState();

    return (
      <PlateElement className="mb-1" {...props}>
        <figure className="group relative" contentEditable={false}>
          <div className="h-16">
            <audio className="size-full" src={unsafeUrl} controls />
          </div>

          <Caption style={{ width: '100%' }} align={align}>
            <CaptionTextarea
              className="h-20"
              readOnly={readOnly}
              placeholder="Write a caption..."
            />
          </Caption>
        </figure>
        {props.children}
      </PlateElement>
    );
  }
);
