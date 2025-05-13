'use client';

import * as React from 'react';

import type { DialogProps } from '@radix-ui/react-dialog';

import { type VariantProps, cva } from 'class-variance-authority';
import { Command as CommandPrimitive } from 'cmdk';

import { cn } from '@/lib/utils';

import { Dialog, DialogContent, DialogTitle } from './dialog';
import { inputVariants } from './input';

const commandVariants = cva(
  'flex size-full flex-col rounded-md bg-popover text-popover-foreground focus-visible:outline-hidden',
  {
    defaultVariants: {
      variant: 'default',
    },
    variants: {
      variant: {
        combobox: 'overflow-visible bg-transparent has-data-readonly:w-fit',
        default: 'overflow-hidden',
      },
    },
  }
);

function Command({
  className,
  variant,
  ...props
}: React.ComponentProps<typeof CommandPrimitive> &
  VariantProps<typeof commandVariants>) {
  return (
    <CommandPrimitive
      className={cn(commandVariants({ variant }), className)}
      data-slot="command"
      {...props}
    />
  );
}

function CommandDialog({
  children,
  className,
  ...props
}: DialogProps & { className?: string }) {
  return (
    <Dialog {...props}>
      <DialogContent
        size="4xl"
        className="overflow-hidden p-0 shadow-lg"
        hideClose
      >
        <DialogTitle className="sr-only">Search</DialogTitle>

        <Command
          className={cn(
            '[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]]:px-2 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-input-wrapper]_svg]:size-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:size-5',
            className
          )}
        >
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  );
}

function CommandInput({
  className,
  variant,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Input> &
  VariantProps<typeof inputVariants>) {
  return (
    <div
      className="mt-2 flex w-full items-center px-3 py-1.5"
      data-slot="command-input-wrapper"
      cmdk-input-wrapper=""
    >
      <CommandPrimitive.Input
        className={cn(inputVariants({ variant }), className)}
        data-slot="command-input"
        {...props}
      />
    </div>
  );
}

function CommandList({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.List>) {
  return (
    <CommandPrimitive.List
      className={cn(
        'max-h-[500px] overflow-x-hidden overflow-y-auto py-1.5',
        className
      )}
      data-slot="command-list"
      {...props}
    />
  );
}

function CommandEmpty({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Empty>) {
  return (
    <CommandPrimitive.Empty
      className={cn('py-6 text-center text-sm', className)}
      data-slot="command-empty"
      {...props}
    />
  );
}

function CommandGroup({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      className={cn(
        'overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground',
        className
      )}
      data-slot="command-group"
      {...props}
    />
  );
}

function CommandSeparator({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Separator>) {
  return (
    <CommandPrimitive.Separator
      className={cn('-mx-1 h-px bg-border', className)}
      data-slot="command-separator"
      {...props}
    />
  );
}

export const commandItemVariants = cva(
  'relative mx-1 flex h-[28px] cursor-default items-center rounded-sm px-2 text-sm outline-hidden select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground',
  {
    defaultVariants: {
      variant: 'default',
    },
    variants: {
      variant: {
        default: '',
        menuItem: cn(
          'w-[calc(100%-8px)] min-w-56 px-2.5',
          'cursor-pointer text-accent-foreground no-focus-ring hover:bg-accent focus:bg-accent focus:text-accent-foreground'
        ),
      },
    },
  }
);

function CommandItem({
  className,
  variant,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Item> &
  VariantProps<typeof commandItemVariants>) {
  return (
    <CommandPrimitive.Item
      className={cn(commandItemVariants({ variant }), className)}
      data-slot="command-item"
      {...props}
    />
  );
}

function CommandShortcut({
  className,
  ...props
}: React.ComponentProps<'span'>) {
  return (
    <span
      className={cn(
        'ml-auto text-xs tracking-widest text-muted-foreground',
        className
      )}
      data-slot="command-shortcut"
      {...props}
    />
  );
}

export {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
};
