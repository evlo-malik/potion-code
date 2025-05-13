import { CaptionPlugin } from '@udecode/plate-caption/react';
import { ImagePlugin } from '@udecode/plate-media/react';

import { ImageElement } from '@/registry/default/potion-ui/image-element';
import { ImagePreview } from '@/registry/default/potion-ui/image-preview';

export const mediaToolbarPlugins = [
  ImagePlugin.extend({
    render: {
      afterEditable: ImagePreview,
      node: ImageElement,
    },
  }),
  CaptionPlugin.configure({
    options: { plugins: [ImagePlugin] },
  }),
] as const;
