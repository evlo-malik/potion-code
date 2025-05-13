import * as React from 'react';

import type { SlateElementProps } from '@udecode/plate';

import { SlateElement } from '@udecode/plate';

export const LinkElementStatic = (props: SlateElementProps) => {
  return (
    <SlateElement
      {...props}
      as="a"
      className="font-medium text-primary underline decoration-primary underline-offset-4"
    >
      {props.children}
    </SlateElement>
  );
};
