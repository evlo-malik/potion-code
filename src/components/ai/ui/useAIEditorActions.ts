import type { TRange } from '@udecode/plate';

import { SuggestionPlugin } from '@udecode/plate-suggestion/react';
import { useEditorPlugin } from '@udecode/plate/react';

import { selectByText } from '@/components/editor/utils';

export const useAIEditorActions = () => {
  const { editor, setOption } = useEditorPlugin(SuggestionPlugin);

  return {
    replaceSelection: (find: string, replace: string) => {
      let range: TRange | null;

      while (true) {
        range = selectByText(editor as any, find);

        if (!range) break;

        editor.tf.delete();
        editor.tf.insertText(replace);
      }
    },
    replaceSelectionSuggestion: (find: string, replace: string) => {
      let range: TRange | null;

      while (true) {
        range = selectByText(editor as any, find);

        if (!range) {
          setTimeout(() => {
            selectByText(editor as any, replace);
          }, 0);

          break;
        }

        setOption('isSuggesting', true);
        editor.tf.delete();
        editor.tf.insertText(replace);
        setOption('isSuggesting', false);
        editor.history.undos = [];
        editor.history.redos = [];
        editor.operations = [];
      }
    },
  };
};
