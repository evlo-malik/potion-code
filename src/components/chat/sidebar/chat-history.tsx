import * as React from 'react';

import Link from 'next/link';

import { SidebarList } from '@/components/chat/sidebar/sidebar-list';
import { Icons } from '@/components/ui/icons';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/registry/default/potion-ui/button';

export function ChatHistory() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between p-4">
        <h4 className="text-sm font-medium">Chat History</h4>
      </div>
      <div className="mb-2 px-2">
        <Link
          className={cn(
            buttonVariants({ variant: 'outline' }),
            'h-10 w-full justify-start bg-zinc-50 px-4 shadow-none transition-colors hover:bg-zinc-200/40'
          )}
          href="/apps/ai/public"
        >
          <Icons.plus className="-translate-x-2 stroke-2" />
          New Chat
        </Link>
      </div>
      <React.Suspense
        fallback={
          <div className="flex flex-1 flex-col space-y-4 overflow-auto px-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="h-6 w-full shrink-0 animate-pulse rounded-lg bg-zinc-200"
              />
            ))}
          </div>
        }
      >
        <SidebarList />
      </React.Suspense>
    </div>
  );
}
