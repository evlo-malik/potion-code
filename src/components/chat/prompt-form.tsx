'use client';

import * as React from 'react';

import { TextareaAutosize } from '@udecode/plate-caption/react';
import { toast } from 'sonner';

import { UserMessage } from '@/components/ai/message';
import { useMyActions, useMyUIState } from '@/components/ai/utils/ai-hooks';
import { Icons } from '@/components/ui/icons';
import { useEnterSubmit } from '@/hooks/useEnterSubmit';
import { nid } from '@/lib/nid';
import { Button } from '@/registry/default/potion-ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/registry/default/potion-ui/tooltip';

export function PromptForm({
  input,
  setInput,
}: {
  input: string;
  setInput: (value: string) => void;
}) {
  const { formRef, onKeyDown } = useEnterSubmit();
  const inputRef = React.useRef<HTMLTextAreaElement>(null);
  const { submitUserMessage } = useMyActions();
  const [, setMessages] = useMyUIState();

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const fileRef = React.useRef<HTMLInputElement>(null);

  return (
    <form
      ref={formRef}
      onSubmit={async (e: any) => {
        e.preventDefault();

        // Blur focus on mobile
        if (window.innerWidth < 600) {
          e.target.message?.blur();
        }

        const value = input.trim();
        setInput('');

        if (!value) return;

        // Optimistically add user message UI
        setMessages((currentMessages) => [
          ...currentMessages,
          {
            id: nid(),
            display: <UserMessage>{value}</UserMessage>,
          },
        ]);

        try {
          // Submit and get response message
          const responseMessage = await submitUserMessage(value);
          setMessages((currentMessages) => [
            ...currentMessages,
            responseMessage,
          ]);
        } catch {
          toast(
            <div className="text-red-600">
              You have reached your message limit! Please try again later, or{' '}
              <a
                className="underline"
                href="https://vercel.com/templates/next.js/gemini-ai-chatbot"
                rel="noopener noreferrer"
                target="_blank"
              >
                deploy your own version
              </a>
              .
            </div>
          );
        }
      }}
    >
      {/* <input */}
      {/*  className="hidden" */}
      {/*  id="file" */}
      {/*  onChange={async (event) => { */}
      {/*    if (!event.target.files) { */}
      {/*      toast.error('No file selected'); */}

      {/*      return; */}
      {/*    } */}

      {/*    const file = event.target.files[0]; */}

      {/*    if (file.type.startsWith('video/')) { */}
      {/*      const responseMessage = await describeImage(''); */}
      {/*      setMessages((currentMessages) => [ */}
      {/*        ...currentMessages, */}
      {/*        responseMessage, */}
      {/*      ]); */}
      {/*    } else { */}
      {/*      const reader = new FileReader(); */}
      {/*      reader.readAsDataURL(file); */}

      {/*      reader.onloadend = async () => { */}
      {/*        const base64String = reader.result; */}
      {/*        const responseMessage = await describeImage( */}
      {/*          base64String as string */}
      {/*        ); */}
      {/*        setMessages((currentMessages) => [ */}
      {/*          ...currentMessages, */}
      {/*          responseMessage, */}
      {/*        ]); */}
      {/*      }; */}
      {/*    } */}
      {/*  }} */}
      {/*  ref={fileRef} */}
      {/*  type="file" */}
      {/* /> */}

      <div className="relative flex max-h-60 w-full grow flex-col overflow-hidden bg-zinc-100 px-12 sm:rounded-full sm:px-12">
        {/* <Tooltip>
          <TooltipTrigger asChild> */}
        <Button
          size="icon"
          variant="outline"
          className="absolute top-[14px] left-4 size-8 rounded-full bg-background p-0 sm:left-4"
          onClick={() => {
            fileRef.current?.click();
          }}
        >
          <Icons.plus />
        </Button>
        {/* </TooltipTrigger>
          <TooltipContent>Add Attachments</TooltipContent>
        </Tooltip> */}
        <TextareaAutosize
          name="message"
          ref={inputRef}
          className="min-h-[60px] w-full resize-none bg-transparent px-4 py-[1.3rem] placeholder:text-zinc-900 focus-within:outline-hidden sm:text-sm"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Send a message."
          autoComplete="off"
          autoCorrect="off"
          rows={1}
          spellCheck={false}
          tabIndex={0}
          autoFocus
        />
        <div className="absolute top-[13px] right-4 sm:right-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                className="rounded-full bg-transparent text-zinc-950 shadow-none hover:bg-zinc-200"
                disabled={input === ''}
                type="submit"
              >
                <Icons.sendMessage />
                <span className="sr-only">Send message</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Send message</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </form>
  );
}
