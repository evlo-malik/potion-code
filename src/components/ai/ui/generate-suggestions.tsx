'use client';

import { useCallback, useEffect, useState } from 'react';

import type { GenerateSuggestionsData } from '@/components/ai/actions/tool-schemas';

import { useEditorRef } from '@udecode/plate/react';

import { useAIEditorActions } from '@/components/ai/ui/useAIEditorActions';
import {
  searchRange,
  selectByText,
  useDebouncedEditorVersion,
} from '@/components/editor/utils';
import { Label } from '@/components/ui/label';
import { Button } from '@/registry/default/potion-ui/button';

export const GenerateSuggestions = ({
  replaceSuggestions,
}: GenerateSuggestionsData) => {
  const editor = useEditorRef();
  const editorActions = useAIEditorActions();
  const version = useDebouncedEditorVersion();

  const findSuggestionRanges = useCallback(() => {
    return replaceSuggestions.map((suggestion) => {
      const range = searchRange(editor as any, suggestion.oldValue);

      if (!range) {
        return null;
      }

      return range;
    });
  }, [editor, replaceSuggestions]);

  const [suggestionRanges, setSuggestionRanges] = useState(
    findSuggestionRanges()
  );

  useEffect(() => {
    setSuggestionRanges(findSuggestionRanges());
  }, [findSuggestionRanges, version]);

  return (
    <div className="grid gap-4">
      <p>
        I have generated some suggestions for you to review and apply to the
        document.
      </p>
      <div className="grid gap-4 rounded-2xl border border-zinc-200 bg-white p-4 sm:p-6">
        {replaceSuggestions.map((suggestion, index) => (
          <div key={suggestion.oldValue} className="space-y-3">
            <div className="space-y-1">
              <Label>From</Label>
              <div
                className="cursor-pointer"
                onClick={() => {
                  selectByText(editor as any, suggestion.oldValue);
                }}
              >
                {suggestion.oldValue}
              </div>
            </div>

            <div className="space-y-1">
              <Label>To</Label>
              <div>
                {suggestion.newValue.length > 0
                  ? suggestion.newValue
                  : '(Empty)'}
              </div>
            </div>

            <div className="flex gap-2">
              <>
                <Button
                  disabled={!suggestionRanges[index]}
                  onClick={() => {
                    editorActions.replaceSelection(
                      suggestion.oldValue,
                      suggestion.newValue
                    );
                    setSuggestionRanges(findSuggestionRanges());
                  }}
                >
                  Apply directly
                </Button>
                <Button
                  disabled={!suggestionRanges[index]}
                  onClick={() => {
                    editorActions.replaceSelectionSuggestion(
                      suggestion.oldValue,
                      suggestion.newValue
                    );
                    setSuggestionRanges(findSuggestionRanges());
                  }}
                >
                  Add suggestion
                </Button>
              </>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// export const Destinations = ({ destinations }: { destinations: string[] }) => {
//   const { submitUserMessage } = useMyActions()
//   const [, setMessages] = useMyUIState()
//
//   return (
//     <div className="grid gap-4">
//       <p>
//         Here is a list of holiday destinations based on the books you have read.
//         Choose one to proceed to booking a flight.
//       </p>
//       <div className="flex flex-col sm:flex-row items-start gap-2">
//         {destinations.map(destination => (
//           <button
//             className="flex items-center gap-2 px-3 py-2 text-sm transition-colors bg-zinc-50 hover:bg-zinc-100 rounded-xl cursor-pointer"
//             key={destination}
//             onClick={async () => {
//               const response = await submitUserMessage(
//                 `I would like to fly to ${destination}, proceed to choose flights.`
//               )
//               setMessages((currentMessages: any[]) => [
//                 ...currentMessages,
//                 response
//               ])
//             }}
//           >
//             {destination}
//           </button>
//         ))}
//       </div>
//     </div>
//   )
// }
