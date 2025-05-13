// Inspired by Chatbot-UI and modified to fit the needs of this project
// @see https://github.com/mckaywrigley/chatbot-ui/blob/main/components/Chat/ChatMessage.tsx

import type { Message } from 'ai';

import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

import { ChatMessageActions } from '@/components/chat/chat-message-actions';
import { MemoizedReactMarkdown } from '@/components/chat/markdown';
import { CodeBlock } from '@/components/ui/codeblock';
import { Icons } from '@/components/ui/icons';
import { cn } from '@/lib/utils';

export interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message, ...props }: ChatMessageProps) {
  return (
    <div
      className={cn('group relative mb-4 flex items-start md:-ml-12')}
      {...props}
    >
      <div
        className={cn(
          'flex size-8 shrink-0 items-center justify-center rounded-lg border shadow-sm select-none',
          message.role === 'user'
            ? 'bg-background'
            : 'bg-primary text-primary-foreground'
        )}
      >
        {message.role === 'user' ? <Icons.user /> : <Icons.ai />}
      </div>
      <div className="ml-4 flex-1 space-y-2 overflow-hidden px-1">
        <div className="prose prose-p:leading-relaxed prose-pre:p-0 break-words">
          <MemoizedReactMarkdown
            components={{
              code({ children, className, node, ...props }) {
                if (Array.isArray(children) && children.length > 0) {
                  const firstChild = children[0];

                  if (typeof firstChild === 'string') {
                    if (firstChild === '▍') {
                      return (
                        <span className="mt-1 animate-pulse cursor-default">
                          ▍
                        </span>
                      );
                    }

                    children[0] = firstChild.replace('`▍`', '▍');
                  }
                }

                const match = /language-(\w+)/.exec(className || '');

                return match ? (
                  <CodeBlock
                    key={Math.random()}
                    value={String(children).replace(/\n$/, '')}
                    language={match?.[1] || ''}
                    {...props}
                  />
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
              p({ children }) {
                return <p className="mb-2 last:mb-0">{children}</p>;
              },
            }}
            remarkPlugins={[remarkGfm, remarkMath]}
          >
            {message.content}
          </MemoizedReactMarkdown>
        </div>
        <ChatMessageActions message={message} />
      </div>
    </div>
  );
}
