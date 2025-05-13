'use client';

import type { Message } from 'ai';

import { Icons } from '@/components/ui/icons';
import { cn } from '@/lib/utils';
import { useCopyToClipboard } from '@/registry/default/hooks/use-copy-to-clipboard';
import { Button } from '@/registry/default/potion-ui/button';

interface ChatMessageActionsProps extends React.ComponentProps<'div'> {
  message: Message;
}

export function ChatMessageActions({
  className,
  message,
  ...props
}: ChatMessageActionsProps) {
  const { copyToClipboard, isCopied } = useCopyToClipboard({ timeout: 2000 });

  const onCopy = () => {
    if (isCopied) return;

    copyToClipboard(message.content);
  };

  return (
    <div
      className={cn(
        'flex items-center justify-end transition-opacity group-hover:opacity-100 md:absolute md:-top-2 md:-right-10 md:opacity-0',
        className
      )}
      {...props}
    >
      <Button size="icon" variant="ghost" onClick={onCopy}>
        {isCopied ? <Icons.check /> : <Icons.copy />}
        <span className="sr-only">Copy message</span>
      </Button>
    </div>
  );
}
