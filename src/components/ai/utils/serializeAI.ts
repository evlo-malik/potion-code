import type { PlateEditor } from '@udecode/plate/react';

import { deserializeMd, serializeMd } from '@udecode/plate-markdown';

export const serializeAI = (editor: PlateEditor) => {
  return serializeMd(editor as any).trim();
};

export const deserializeAI = (editor: PlateEditor, content: string) => {
  return deserializeMd(editor, content);

  // REVIEW
  // const diffPlugins = [
  //   createDiffPlugin({
  //     component: DiffLeaf,
  //   }),
  //   ...editor.plugins,
  // ] as PlatePlugin[];

  // const diffEditor = createPlateEditor({
  //   plugins: diffPlugins,h
  // });
  // diffEditor.children = nodes;

  // // Later, once we need to parse custom inline nodes
  // // parseInlineNodes(tempEditor, editor)
};
