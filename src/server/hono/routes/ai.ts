import { openai } from '@ai-sdk/openai';
import { faker } from '@faker-js/faker';
import { zValidator } from '@hono/zod-validator';
import {
  type Message,
  convertToCoreMessages,
  generateText,
  smoothStream,
  streamText,
} from 'ai';
import { Hono } from 'hono';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { publicMiddlewares } from '../middlewares/auth-middleware';
import { getRatelimit } from '../middlewares/ratelimit-middleware';
import { fakeStreamText } from '../utils/fakeStreamText';

const CHUNKING_REGEXPS = {
  line: /\n+/m,
  list: /.{8}/m,
  word: /\S+\s+/m,
};


export const aiRoutes = new Hono()
  .post(
    '/command',
    ...publicMiddlewares(),
    zValidator(
      'json',
      z.object({ messages: z.array(z.any()), system: z.string().optional() })
    ),
    async (c) => {
      const { messages, system } = await c.req.json();

      const user = c.get('user');

      if (!user?.isAdmin && !(await getRatelimit(c, 'ai/command')).success) {
        return createStreamResponse(fakeStreamText({ streamProtocol: 'data' }));
      }

      // Limit total characters across all messages
      const limitedMessages = limitTotalCharacters(messages, 8000);

      let isInCodeBlock = false;
      let isInTable = false;
      let isInList = false;
      let isInLink = false;

      const result = streamText({
        experimental_transform: smoothStream({
          delayInMs:100,
          chunking: (buffer) => {
            // Check for code block markers
            if (/```[^\s]+/.test(buffer)) {
              isInCodeBlock = true
            }else if(isInCodeBlock && buffer.includes('```') ) {
              isInCodeBlock = false
            }
            // test case: should not deserialize link with markdown syntax
            if (buffer.includes('http')) {
              isInLink = true;
            } else if (buffer.includes('https')) {
              isInLink = true;
            } else if (buffer.includes('\n') && isInLink) {
              isInLink = false;
            }
            if (buffer.includes('*') || buffer.includes('-')) {
              isInList = true;
            } else if (buffer.includes('\n') && isInList) {
              isInList = false;
            }
            // Simple table detection: enter on |, exit on double newline
            if (!isInTable && buffer.includes('|')) {
              isInTable = true;
            } else if (isInTable && buffer.includes('\n\n')) {
              isInTable = false;
            }
  
            // Use line chunking for code blocks and tables, word chunking otherwise
            // Choose the appropriate chunking strategy based on content type
            let match;
  
            if (isInCodeBlock || isInTable || isInLink) {
              // Use line chunking for code blocks and tables
              match = CHUNKING_REGEXPS.line.exec(buffer);
            } else if (isInList) {
              // Use list chunking for lists
              match = CHUNKING_REGEXPS.list.exec(buffer);
            } else {
              // Use word chunking for regular text
              match = CHUNKING_REGEXPS.word.exec(buffer);
            }
            if (!match) {
              return null;
            }
  
            return buffer.slice(0, match.index) + match?.[0];
          },
        }),
        maxTokens: 2048,
        messages: convertToCoreMessages(limitedMessages),
        model: openai('gpt-4o-mini'),
        system: system ? truncateSystemPrompt(system, 12_000) : undefined,
      });

      return result.toDataStreamResponse({
        // fix streaming after deployed
        headers:{
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
          'Content-Type': 'text/event-stream',
          'X-Accel-Buffering': 'no',
        },
      });
    }
  )
  .post(
    '/copilot',
    ...publicMiddlewares(),
    zValidator('json', z.object({ prompt: z.string(), system: z.string() })),
    async (c) => {
      const { prompt, system } = await c.req.json();

      const user = c.get('user');

      if (!user?.isAdmin && !(await getRatelimit(c, 'ai/copilot')).success) {
        return c.json({
          text: faker.lorem.paragraph(1),
        });
      }

      try {
        const result = await generateText({
          abortSignal: c.req.raw.signal,
          maxTokens: 50,
          model: openai('gpt-4o-mini'),
          prompt,
          system,
          temperature: 0.7,
        });

        return c.json(result);
      } catch (error) {
        if (error.name === 'ResponseAborted') {
          // Silently handle the abort
          return c.newResponse(null, 408);
        }

        return c.json({
          error: error.message,
        });
      }
    }
  );

function createStreamResponse(stream: ReadableStream) {
  return new NextResponse(stream, {
    headers: {
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'Content-Type': 'text/event-stream',
      'X-Accel-Buffering': 'no',
    },
  });
}

function limitTotalCharacters(messages: Message[], maxTotalChars: number) {
  let totalChars = 0;
  const limitedMessages: Message[] = [];

  for (let i = messages.length - 1; i >= 0; i--) {
    const msgChars = messages[i].content.length;

    if (totalChars + msgChars > maxTotalChars) break;

    totalChars += msgChars;
    limitedMessages.unshift(messages[i]);
  }

  return limitedMessages;
}

function truncateSystemPrompt(systemPrompt: string, maxChars: number) {
  if (systemPrompt.length <= maxChars) return systemPrompt;

  // Find the position of <Block> and <Selection> tags
  const blockStart = systemPrompt.indexOf('<Block>');
  const selectionStart = systemPrompt.indexOf('<Selection>');

  if (blockStart === -1 || selectionStart === -1) {
    // If tags are not found, simple truncation
    return systemPrompt.slice(0, maxChars - 3) + '...';
  }

  // Preserve the structure and truncate content within tags if necessary
  const prefix = systemPrompt.slice(0, blockStart);
  const blockContent = systemPrompt.slice(blockStart, selectionStart);
  const selectionContent = systemPrompt.slice(selectionStart);

  const availableChars = maxChars - prefix.length - 6; // 6 for '...' in both block and selection
  const halfAvailable = availableChars / 2;

  const truncatedBlock =
    blockContent.length > halfAvailable
      ? blockContent.slice(0, halfAvailable - 3) + '...'
      : blockContent;

  const truncatedSelection =
    selectionContent.length > availableChars - truncatedBlock.length
      ? selectionContent.slice(0, availableChars - truncatedBlock.length - 3) +
        '...'
      : selectionContent;

  return prefix + truncatedBlock + truncatedSelection;
}
