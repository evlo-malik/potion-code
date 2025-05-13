'use client';

import { ExternalLink } from '@/components/ui/external-link';

export function EmptyScreen() {
  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="flex flex-col gap-2 rounded-2xl bg-zinc-50 p-4 text-sm sm:p-8 sm:text-base">
        <h1 className="inline-block max-w-fit text-2xl font-semibold tracking-tight sm:text-3xl">
          Potion AI
        </h1>
        <p className="leading-normal text-zinc-900">
          This is an open source AI chatbot app template built with{' '}
          <ExternalLink href="https://nextjs.org">Next.js</ExternalLink>, the{' '}
          <ExternalLink href="https://sdk.vercel.ai">
            Vercel AI SDK
          </ExternalLink>
          , and <ExternalLink href="https://ai.google.dev">OpenAI</ExternalLink>
          .
        </p>
        <p className="leading-normal text-zinc-900">
          It uses{' '}
          <ExternalLink href="https://vercel.com/blog/ai-sdk-3-generative-ui">
            React Server Components
          </ExternalLink>{' '}
          with function calling to mix both text with generative UI responses
          from OpenAI. The UI state is synced through the AI SDK so the model is
          always aware of your stateful interactions as they happen in the
          browser.
        </p>
      </div>
    </div>
  );
}
