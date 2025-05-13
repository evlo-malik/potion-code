'use client';

import type { UIState } from '@/components/ai/utils/ai.types';

import Link from 'next/link';

import { Icons } from '@/components/ui/icons';

export interface ChatListProps {
  isShared: boolean;
  messages: UIState;
}

export function ChatList({ isShared, messages }: ChatListProps) {
  return messages.length > 0 ? (
    <div className="relative mx-auto grid max-w-2xl auto-rows-max gap-8 px-4">
      {isShared ? null : (
        <>
          <div className="group relative flex items-start md:-ml-12">
            <div className="flex size-[25px] shrink-0 items-center justify-center rounded-lg border bg-background shadow-xs select-none">
              <Icons.warning />
            </div>
            <div className="ml-5 flex-1 space-y-2 overflow-hidden px-1">
              <p className="leading-normal text-muted-foreground">
                Please{' '}
                <Link className="underline underline-offset-4" href="/login">
                  log in
                </Link>{' '}
                or{' '}
                <Link className="underline underline-offset-4" href="/signup">
                  sign up
                </Link>{' '}
                to save and revisit your chat history!
              </p>
            </div>
          </div>
        </>
      )}

      {messages.map((message) => (
        <div key={message.id}>
          {message.spinner}
          {message.display}
          {message.attachments}
        </div>
      ))}
    </div>
  ) : null;
}
