'use client';

import * as React from 'react';

import { Icons } from '@/components/ui/icons';
import { cn } from '@/lib/utils';
import { type ButtonProps, Button } from '@/registry/default/potion-ui/button';

export function ButtonScrollToBottom({
  className,
  isAtBottom,
  scrollToBottom,
  ...props
}: {
  isAtBottom: boolean;
  scrollToBottom: () => void;
} & Partial<ButtonProps>) {
  return (
    <Button
      size="icon"
      variant="outline"
      className={cn(
        'absolute -top-10 right-4 z-10 bg-background transition-opacity duration-300 sm:right-8 md:top-2',
        isAtBottom ? 'opacity-0' : 'opacity-100',
        className
      )}
      onClick={() => scrollToBottom()}
      {...props}
    >
      <Icons.arrowDown />
      <span className="sr-only">Scroll to bottom</span>
    </Button>
  );
}
