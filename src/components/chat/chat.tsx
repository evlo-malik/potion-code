'use client';

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { useMyAIState, useMyUIState } from '@/components/ai/utils/ai-hooks';
import { ChatList } from '@/components/chat/chat-list';
import { ChatPanel } from '@/components/chat/chat-panel';
import { EmptyScreen } from '@/components/chat/empty-screen';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useScrollAnchor } from '@/hooks/useScrollAnchor';
import { cn } from '@/lib/utils';

export interface ChatProps extends React.ComponentProps<'div'> {
  id?: string;
  // initialMessages?: Message[]
}

export function Chat({ id, className }: ChatProps) {
  const router = useRouter();
  const [input, setInput] = useState('');
  const [messages] = useMyUIState();
  const [aiState] = useMyAIState();

  const [, setNewChatId] = useLocalStorage('newChatId', id);

  // useEffect(() => {
  //   if (session?.user && !path.includes('chat') && messages.length === 1) {
  //     window.history.replaceState({}, '', `/chat/${id}`)
  //   }
  // }, [id, path, session?.user, messages])

  useEffect(() => {
    const messagesLength = aiState.messages?.length;

    if (messagesLength === 2) {
      router.refresh();
    }
  }, [aiState.messages, router]);

  useEffect(() => {
    setNewChatId(id);
  });

  const { isAtBottom, messagesRef, scrollRef, scrollToBottom, visibilityRef } =
    useScrollAnchor();

  return (
    <div
      ref={scrollRef}
      className="group size-full pl-0 lg:peer-data-[state=open]:pl-[250px] xl:peer-data-[state=open]:pl-[300px]"
    >
      <div
        ref={messagesRef}
        className={cn(
          'h-[calc(100%)] overflow-auto pt-4 pb-[200px]',
          className
        )}
      >
        {messages.length > 0 ? (
          <ChatList isShared={false} messages={messages} />
        ) : (
          <EmptyScreen />
        )}
        <div ref={visibilityRef} className="h-px w-full" />
      </div>

      <ChatPanel
        id={id}
        input={input}
        isAtBottom={isAtBottom}
        scrollToBottom={scrollToBottom}
        setInput={setInput}
      />
    </div>
  );
}
