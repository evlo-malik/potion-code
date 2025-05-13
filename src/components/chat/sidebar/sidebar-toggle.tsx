'use client';

import * as React from 'react';

import { useSidebar } from '@/components/chat/sidebar/use-sidebar';
import { Icons } from '@/components/ui/icons';
import { Button } from '@/registry/default/potion-ui/button';

export function SidebarToggle() {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      variant="ghost"
      className="-ml-2 hidden size-9 p-0 lg:flex"
      onClick={() => {
        toggleSidebar();
      }}
    >
      <Icons.sidebar className="size-6" />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
}
