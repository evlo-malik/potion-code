import type { AIState, Chat, UIState } from '@/components/ai/utils/ai.types';

import { createAI, getAIState } from 'ai/rsc';

import { submitUserMessage } from '@/components/ai/actions/submitUserMessage';
import { auth } from '@/components/auth/rsc/auth';
import { nid } from '@/lib/nid';

import { getUIStateFromAIState } from './getUIStateFromAIState';

import 'server-only';

const actions = {
  submitUserMessage,
};

export const AI = createAI<AIState, UIState, typeof actions>({
  actions,
  initialAIState: { chatId: nid(), interactions: [], messages: [] },
  initialUIState: [],
  onGetUIState: async () => {
    'use server';

    const session = await auth();

    if (session?.user) {
      const aiState = getAIState() as Chat;

      if (aiState) {
        return getUIStateFromAIState(aiState as any);
      }
    } else {
      return;
    }
  },
  onSetAIState: async ({ state }) => {
    'use server';

    const session = await auth();

    if (session?.user) {
      const { chatId, messages } = state;

      const createdAt = new Date();
      const userId = session.user.id as string;
      const path = `/chat/${chatId}`;

      const firstMessageContent = messages[0].content as string;
      const title = firstMessageContent.slice(0, 100);

      const chat: Chat = {
        id: chatId,
        createdAt,
        messages: messages as any,
        path,
        title,
        userId,
      };

      console.info('chat', chat);
      // await saveChat(chat);
    } else {
      return;
    }
  },
});
