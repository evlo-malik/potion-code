import React from 'react';

import { AI } from '@/components/ai/actions/actions';
import { DocumentAIState } from '@/components/ai/document-ai-state';
import { nid } from '@/lib/nid';

export const AIProvider = ({ children }: React.PropsWithChildren) => {
  const id = nid();

  return (
    <AI initialAIState={{ chatId: id, interactions: [], messages: [] }}>
      <DocumentAIState />
      {children}
    </AI>
  );
};
