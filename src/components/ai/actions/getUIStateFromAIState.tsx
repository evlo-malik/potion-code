import type {
  ExtractData,
  GenerateSuggestionsData,
} from '@/components/ai/actions/tool-schemas';
import type { Chat } from '@/components/ai/utils/ai.types';

import { BotCard, BotMessage, UserMessage } from '@/components/ai/message';
import { ExtractedAttributes } from '@/components/ai/ui/extract-attributes';
import { GenerateSuggestions } from '@/components/ai/ui/generate-suggestions';

import 'server-only';

export const getUIStateFromAIState = (aiState: Chat) => {
  return aiState.messages
    .filter((message) => message.role !== 'system')
    .map((message, index) => ({
      id: `${aiState.chatId}-${index}`,
      display:
        message.role === 'tool' ? (
          message.content.map((tool) => {
            return tool.toolName === 'extractData' ? (
              <BotCard>
                <ExtractedAttributes {...(tool.result as ExtractData)} />
              </BotCard>
            ) : tool.toolName === 'generateSuggestions' ? (
              <BotCard>
                <GenerateSuggestions
                  {...(tool.result as GenerateSuggestionsData)}
                />
              </BotCard>
            ) : null;
          })
        ) : message.role === 'user' ? (
          <UserMessage>{message.content as string}</UserMessage>
        ) : message.role === 'assistant' &&
          typeof message.content === 'string' ? (
          <BotMessage content={message.content} />
        ) : null,
    }));
};
