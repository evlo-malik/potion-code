'use client';

import * as React from 'react';

import { useMediaState } from '@udecode/plate-media/react';
import { ResizableProvider } from '@udecode/plate-resizable';
import {
  type PlateElementProps,
  PlateElement,
  useReadOnly,
  withHOC,
} from '@udecode/plate/react';
import { FileUpIcon } from 'lucide-react';

import { BlockActionButton } from './block-context-menu';
import { Caption, CaptionTextarea } from './caption';

export const MediaFileElement = withHOC(
  ResizableProvider,
  function MediaFileElement(props: PlateElementProps) {
    const readOnly = useReadOnly();
    const { name, unsafeUrl } = useMediaState();

    const onDownload = () => {
      window.open(unsafeUrl);
    };

    return (
      <PlateElement className="my-px rounded-sm" {...props}>
        <div
          className="group relative m-0 flex cursor-pointer items-center rounded px-0.5 py-[3px] transition-bg-ease hover:bg-muted"
          onClick={onDownload}
          contentEditable={false}
          role="button"
        >
          <div className="flex items-center gap-1 p-1">
            <FileUpIcon className="size-5" />
            <div>{name}</div>
          </div>

          <Caption align="left">
            <CaptionTextarea
              className="text-left"
              readOnly={readOnly}
              placeholder="Write a caption..."
            />
          </Caption>

          <BlockActionButton className="top-1/2 -translate-y-1/2" />
        </div>

        {props.children}
      </PlateElement>
    );
  }
);
