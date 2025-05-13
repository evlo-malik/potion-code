'use client';

import { useEffect } from 'react';

import type { Message } from '@/components/ai/utils/ai.types';

import { useQuery } from '@tanstack/react-query';
import { useEditorRef } from '@udecode/plate/react';

import { useMyAIState } from '@/components/ai/utils/ai-hooks';
import { serializeAI } from '@/components/ai/utils/serializeAI';
import { useDocumentId } from '@/lib/navigation/routes';
import { useDocumentQueryOptions } from '@/trpc/hooks/query-options';

import { useDebouncedEditorVersion } from '../editor/utils';

export function DocumentAIState() {
  const documentId = useDocumentId();

  const found = useQuery({
    ...useDocumentQueryOptions(),
    select: (data) => !!data.document,
  });

  if (documentId && found.data && !found.isLoading)
    return <SingleDocumentAIState />;

  return <MultipleDocumentsAIState />;
}

const SingleDocumentAIState = () => {
  const editor = useEditorRef();
  const [aiState, setAIState] = useMyAIState();
  const debouncedVersion = useDebouncedEditorVersion();

  useEffect(() => {
    const id = 'document';

    const message: Message = {
      id,
      content: `[User is viewing the following document]
${serializeAI(editor)}`,
      role: 'system',
    };

    if (aiState.messages.some((message) => message.id === id)) {
      setAIState({
        ...aiState,
        messages: [
          ...aiState.messages.filter((message) => message.id !== id),
          message,
        ],
      });
    } else {
      setAIState({
        ...aiState,
        messages: [...aiState.messages, message],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedVersion]);

  return null;
};

const MultipleDocumentsAIState = () => {
  // When the user has not opened any document

  return null;
};
