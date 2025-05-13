import * as React from 'react';

import { TextareaAutosize as ReactTextareaAutosize } from '@udecode/plate-caption/react';
import { type VariantProps, cva } from 'class-variance-authority';

import { cn } from '@/lib/utils';

export const textareaVariants = cva(
  cn(
    'resize-none text-sm disabled:cursor-not-allowed disabled:opacity-50',
    'placeholder:text-muted-foreground/80'
  ),
  {
    defaultVariants: {
      variant: 'default',
    },
    variants: {
      variant: {
        ai: 'max-h-[240px] border-transparent bg-transparent py-2',
        default:
          'rounded-md border-[1.5px] border-input bg-muted/80 px-1 pt-1 pb-0.5 read-only:ring-0 focus:border-brand/50 focus:ring-2 focus:ring-brand/30 read-only:focus:border-input',
        equation: 'max-h-[50vh] min-h-[60px] font-mono text-sm',
        equationInline: 'max-h-[50vh] font-mono text-sm',
      },
    },
  }
);

export type TextareaAutosizeProps = React.ComponentProps<
  typeof ReactTextareaAutosize
> &
  VariantProps<typeof textareaVariants>;

export function Textarea({ className, variant, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(textareaVariants({ variant }), className)}
      {...props}
    />
  );
}

export type TextareaProps = React.ComponentProps<'textarea'> &
  VariantProps<typeof textareaVariants>;

export function TextareaAutosize({
  children,
  className,
  variant,
  ...props
}: TextareaAutosizeProps) {
  return (
    <ReactTextareaAutosize
      className={cn(textareaVariants({ variant }), className)}
      autoComplete="off"
      {...props}
    />
  );
}
