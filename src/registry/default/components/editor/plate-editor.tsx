'use client';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { Plate } from '@udecode/plate/react';

import { playgroundValue } from '@/registry/default/example/playground-value';
import { Editor, EditorContainer } from '@/registry/default/potion-ui/editor';
import { TocSidebar } from '@/registry/default/potion-ui/toc-sidebar';

import { copilotPlugins } from './plugins/copilot-plugins';
import { editorPlugins } from './plugins/editor-plugins';
import { useCreateEditor } from './use-create-editor';

export function PlateEditor() {
  const editor = useCreateEditor({
    plugins: [...copilotPlugins, ...editorPlugins],
    value: playgroundValue,
  });

  return (
    <DndProvider backend={HTML5Backend}>
      <Plate editor={editor}>
        <TocSidebar className="top-[130px]" topOffset={30} />

        <EditorContainer>
          <Editor variant="demo" placeholder="Type..." />
        </EditorContainer>
      </Plate>
    </DndProvider>
  );
}
