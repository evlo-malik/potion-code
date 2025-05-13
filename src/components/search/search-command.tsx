'use client';

import React, { useEffect } from 'react';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { useCurrentUser } from '@/components/auth/useCurrentUser';
import { SearchStore, useSearchValue } from '@/components/search/SearchStore';
import { Icons } from '@/components/ui/icons';
import { routes } from '@/lib/navigation/routes';
import { cn } from '@/lib/utils';
import { useMounted } from '@/registry/default/hooks/use-mounted';
import { Button } from '@/registry/default/potion-ui/button';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/registry/default/potion-ui/command';
import { useTRPC } from '@/trpc/react';

import { Chat } from '../chat/chat';

export const SearchCommand = () => {
  const user = useCurrentUser();
  const router = useRouter();

  const { data } = useQuery({
    ...useTRPC().document.search.queryOptions({ q: '' }),
    enabled: !!user.id,
  });

  const mounted = useMounted();

  const isOpen = useSearchValue('isOpen');

  const [isChat, setIsChat] = React.useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        if ((e.target as HTMLDivElement).dataset?.slateEditor) {
          return;
        }

        e.preventDefault();
        SearchStore.actions.toggle();
      }
    };
    document.addEventListener('keydown', down);

    return () => document.removeEventListener('keydown', down);
  }, []);

  const onSelect = (id: string) => {
    router.push(routes.document({ documentId: id }));
    SearchStore.actions.onClose();
  };

  if (!mounted) return null;

  return (
    <CommandDialog
      className={cn(
        '[&_[cmdk-input-wrapper]]:mt-0 [&_[cmdk-input-wrapper]]:border-b [&_[cmdk-input-wrapper]]:py-0'
      )}
      open={isOpen}
      onOpenChange={(value) => {
        SearchStore.set('isOpen', value);
      }}
    >
      {!isChat && (
        <CommandInput variant="search" placeholder="Search a document..." />
      )}

      {isChat ? (
        <div>
          <div className="h-12">
            <Button variant="ghost" onClick={() => setIsChat(false)}>
              <Icons.arrowLeft />
            </Button>
          </div>
          <CommandList className="h-[520px] max-h-none">
            {/* TODO: id */}
            <Chat id="asdasd" />
          </CommandList>
        </div>
      ) : (
        <CommandList className="h-[520px] max-h-none">
          <CommandEmpty className="font-medium text-muted-foreground">
            No results
          </CommandEmpty>
          {/* <CommandGroup heading="Actions">
            <CommandItem
              className="mt-1 cursor-pointer"
              onSelect={() => setIsChat(true)}
              title="Ask Ai in current document"
            >
              <Icons.ai className="mr-2" />
              <span>Ask AI in current document</span>
            </CommandItem>
          </CommandGroup> */}
          <CommandGroup
            heading={`${data?.documents.length ? 'Documents' : ''}`}
          >
            {data?.documents.map((document) => (
              <CommandItem
                key={document.id}
                className="mt-1 cursor-pointer"
                value={`${document.title}`}
                onSelect={() => onSelect(document.id)}
                title={document.title || 'Untitled'}
              >
                {document.icon ? (
                  <p className="mr-2 text-[18px]">{document.icon}</p>
                ) : (
                  <Icons.file className="mr-2" />
                )}
                <span>{document.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      )}
    </CommandDialog>
  );
};
