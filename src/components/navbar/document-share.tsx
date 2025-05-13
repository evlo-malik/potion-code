'use client';

import React from 'react';

import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

import { useOrigin } from '@/hooks/useOrigin';
import { useDocumentId } from '@/lib/navigation/routes';
import { useCopyToClipboard } from '@/registry/default/hooks/use-copy-to-clipboard';
import { Button, LinkButton } from '@/registry/default/potion-ui/button';
import { Input } from '@/registry/default/potion-ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/registry/default/potion-ui/popover';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/registry/default/potion-ui/tabs';
import { useUpdateDocumentMutation } from '@/trpc/hooks/document-hooks';
import { useDocumentQueryOptions } from '@/trpc/hooks/query-options';

import { useAuthGuard } from '../auth/useAuthGuard';
import { Icons } from '../ui/icons';

export const DocumentShare = () => {
  const authGuard = useAuthGuard();
  const documentId = useDocumentId();
  const { data: isPublished } = useQuery({
    ...useDocumentQueryOptions(),
    select: (data) => data.document?.isPublished,
  });

  const origin = useOrigin();
  const updateDocument = useUpdateDocumentMutation();
  const { copyToClipboard, isCopied } = useCopyToClipboard();

  const url = `${origin}/preview/${documentId!}`;

  const copyUrl = () => {
    copyToClipboard(url);
  };

  const onPublish = () => {
    const promise = updateDocument.mutateAsync({
      id: documentId!,
      isPublished: true,
    });

    toast.promise(promise, {
      error: 'Failed to publish note!',
      loading: 'Publishing...',
      success: 'Note published.',
    });
  };

  const onUnpublish = () => {
    const promise = updateDocument.mutateAsync({
      id: documentId!,
      isPublished: false,
    });

    toast.promise(promise, {
      error: 'Failed to unpublish note!',
      loading: 'Unpublishing...',
      success: 'Note unpublished.',
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" tooltip="Share or publish to the web">
          Share
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80" align="end" alignOffset={8}>
        <Tabs defaultValue="publish">
          <TabsList>
            <TabsTrigger value="publish">Publish</TabsTrigger>
          </TabsList>

          <TabsContent value="publish">
            {isPublished ? (
              <div className="space-y-4 p-3">
                <div className="relative">
                  <Input
                    className="h-8 w-full flex-1 truncate border bg-muted pr-[32px] pl-2 text-muted-foreground"
                    readOnly
                    value={url}
                  />
                  <Button
                    size="menuAction"
                    variant="menuAction"
                    className="absolute top-1 right-1"
                    disabled={isCopied}
                    onClick={copyUrl}
                  >
                    {isCopied ? (
                      <Icons.check variant="muted" />
                    ) : (
                      <Icons.copyLink variant="muted" />
                    )}
                  </Button>
                </div>
                <div className="flex items-center justify-center gap-x-2 px-3">
                  <Button
                    size="md"
                    variant="outline"
                    className="font-medium"
                    disabled={updateDocument.isPending}
                    onClick={() => authGuard(onUnpublish)}
                  >
                    Unpublish
                  </Button>
                  <LinkButton
                    size="md"
                    variant="brand"
                    href={url}
                    target="_blank"
                  >
                    View site
                  </LinkButton>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-5">
                <p className="font-semibold">Publish to web</p>
                <span className="mt-1 text-sm text-muted-foreground">
                  Share your document with others
                </span>

                <Button
                  variant="brand"
                  className="mt-4 w-full"
                  disabled={updateDocument.isPending}
                  onClick={() => authGuard(onPublish)}
                >
                  Publish
                </Button>
              </div>
            )}
          </TabsContent>

          {/* <TabsContent value="share">
            <div className="space-y-4">
              <div className="flex items-center"></div>
            </div>
          </TabsContent> */}
        </Tabs>
      </PopoverContent>
    </Popover>
  );
};
