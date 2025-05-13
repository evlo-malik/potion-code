'use client';

import * as React from 'react';

import type { Chat } from '@/components/ai/utils/ai.types';

import { Button } from '@/registry/default/potion-ui/button';
import {
  type DialogProps,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/registry/default/potion-ui/dialog';
import { Spinner } from '@/registry/default/potion-ui/spinner';

interface ChatShareDialogProps extends DialogProps {
  chat: Pick<Chat, 'id' | 'messages' | 'title'>;
  onCopy: () => void;
}

export function ChatShareDialog({
  chat,
  onCopy,
  ...props
}: ChatShareDialogProps) {
  // const { copyToClipboard } = useCopyToClipboard({ timeout: 1000 });
  const [isSharePending] = React.useTransition();

  // const copyShareLink = React.useCallback(
  //   async (chat: Chat) => {
  //     if (!chat.sharePath) {
  //       return toast.error('Could not copy share link to clipboard');
  //     }

  //     const url = new URL(window.location.href);
  //     url.pathname = chat.sharePath;
  //     copyToClipboard(url.toString());
  //     onCopy();
  //     toast.success('Share link copied to clipboard');
  //   },
  //   [copyToClipboard, onCopy]
  // );

  return (
    <Dialog {...props}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share link to chat</DialogTitle>
          <DialogDescription>
            Anyone with the URL will be able to view the shared chat.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-1 rounded-lg border p-4 text-sm">
          <div className="font-medium">{chat.title}</div>
          <div className="text-muted-foreground">
            {chat.messages.length} messages
          </div>
        </div>
        <DialogFooter className="items-center">
          <Button
            disabled={isSharePending}
            onClick={() => {
              // startShareTransition(async () => {
              //   const result = await shareChat(chat.id);
              //   if (result && 'error' in result) {
              //     toast.error(result.error);
              //     return;
              //   }
              //   void copyShareLink(result);
              // });
            }}
          >
            {isSharePending ? (
              <>
                <Spinner className="mr-2" />
                Copying...
              </>
            ) : (
              <>Copy link</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
