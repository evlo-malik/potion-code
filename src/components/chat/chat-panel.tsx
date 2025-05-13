import * as React from 'react';

import { toast } from 'sonner';

import { UserMessage } from '@/components/ai/message';
import {
  useMyActions,
  useMyAIState,
  useMyUIState,
} from '@/components/ai/utils/ai-hooks';
import { presetMessages } from '@/components/ai/utils/presetMessages';
import { ButtonScrollToBottom } from '@/components/chat/button-scroll-to-bottom';
import { ChatShareDialog } from '@/components/chat/chat-share-dialog';
import { PromptForm } from '@/components/chat/prompt-form';
import { Icons } from '@/components/ui/icons';
import { nid } from '@/lib/nid';
import { cn } from '@/lib/utils';
import { Button } from '@/registry/default/potion-ui/button';

export interface ChatPanelProps {
  input: string;
  isAtBottom: boolean;
  scrollToBottom: () => void;
  setInput: (value: string) => void;
  id?: string;
  title?: string;
}

export function ChatPanel({
  id,
  input,
  isAtBottom,
  scrollToBottom,
  setInput,
  title,
}: ChatPanelProps) {
  const [aiState] = useMyAIState();
  const [messages, setMessages] = useMyUIState();
  const { submitUserMessage } = useMyActions();
  const [shareDialogOpen, setShareDialogOpen] = React.useState(false);

  return (
    <div className="absolute inset-x-0 bottom-0 bg-white/90 duration-300 ease-in-out lg:in-[.group]:peer-data-[state=open]:pl-[250px] xl:in-[.group]:peer-data-[state=open]:pl-[300px] dark:from-10%">
      <ButtonScrollToBottom
        isAtBottom={isAtBottom}
        scrollToBottom={scrollToBottom}
      />

      <div className="mx-auto sm:max-w-2xl sm:px-4">
        <div className="mb-4 grid gap-2 px-4 sm:grid-cols-2 sm:gap-4 sm:px-0">
          {messages.length === 0 &&
            presetMessages.map((example, index) => (
              <div
                key={example.heading}
                className={cn(
                  'cursor-pointer rounded-2xl bg-zinc-50 p-4 text-zinc-950 transition-colors hover:bg-zinc-100 sm:p-6',
                  index > 1 && 'hidden md:block'
                )}
                onClick={async () => {
                  setMessages((currentMessages) => [
                    ...currentMessages,
                    {
                      id: nid(),
                      display: <UserMessage>{example.message}</UserMessage>,
                    },
                  ]);

                  try {
                    const responseMessage = await submitUserMessage(
                      example.message
                    );

                    setMessages((currentMessages) => [
                      ...currentMessages,
                      responseMessage,
                    ]);
                  } catch (error) {
                    console.error(error);
                    toast(
                      <div className="text-red-600">An error occurred</div>
                    );
                  }
                }}
              >
                <div className="font-medium">{example.heading}</div>
                <div className="text-sm text-zinc-800">
                  {example.subheading}
                </div>
              </div>
            ))}
        </div>

        {messages?.length >= 2 ? (
          <div className="flex h-fit items-center justify-center">
            <div className="flex space-x-2">
              {id && title ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setShareDialogOpen(true)}
                  >
                    <Icons.share className="mr-2" />
                    Share
                  </Button>
                  <ChatShareDialog
                    open={shareDialogOpen}
                    onCopy={() => setShareDialogOpen(false)}
                    onOpenChange={setShareDialogOpen}
                    chat={{
                      id,
                      messages: aiState.messages,
                      title,
                    }}
                    // shareChat={shareChat}
                  />
                </>
              ) : null}
            </div>
          </div>
        ) : null}

        <div className="grid gap-4 sm:pb-4">
          <PromptForm input={input} setInput={setInput} />
        </div>
      </div>
    </div>
  );
}
