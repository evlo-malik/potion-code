import { useEffect, useState } from 'react';

import { type StreamableValue, readStreamableValue } from 'ai/rsc';

export const useStreamableText = (
  content: StreamableValue<string> | string
) => {
  const [rawContent, setRawContent] = useState(
    typeof content === 'string' ? content : ''
  );

  useEffect(() => {
    void (async () => {
      if (typeof content === 'object') {
        let value = '';

        for await (const delta of readStreamableValue(content)) {
          if (typeof delta === 'string') {
            setRawContent((value = value + delta));
          }
        }
      }
    })();
  }, [content]);

  return rawContent;
};
