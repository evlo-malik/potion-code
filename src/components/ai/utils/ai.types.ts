import type { AI } from '@/components/ai/actions/actions';
import type { CoreMessage } from 'ai';

export type AIActions = typeof AI;

export type AIState = {
  chatId: string;
  messages: Message[];
  interactions?: string[];
};

export interface Chat extends Record<string, any> {
  id: string;
  createdAt: Date;
  messages: Message[];
  path: string;
  title: string;
  userId: string;
  sharePath?: string;
}

export type Message = {
  id: string;
} & CoreMessage;

export type ServerActionResult<Result> = Promise<
  | Result
  | {
      error: string;
    }
>;

export type UIState = {
  id: string;
  display: React.ReactNode;
  attachments?: React.ReactNode;
  spinner?: React.ReactNode;
}[];
