import type { TText } from '@udecode/plate';
import type { DiffOperation } from '@udecode/plate-diff';

import { type PlateLeafProps, PlateLeaf } from '@udecode/plate/react';

import { describeUpdate } from './describeUpdate';

const diffOperationColors: Record<DiffOperation['type'], string> = {
  delete: 'bg-red-200',
  insert: 'bg-green-200',
  update: 'bg-blue-200',
};

export function DiffLeaf(
  props: PlateLeafProps<TText & { diffOperation: DiffOperation }>
) {
  const diffOperation = props.leaf.diffOperation;

  const Component = {
    delete: 'del',
    insert: 'ins',
    update: 'span',
  }[diffOperation.type] as any;

  return (
    <PlateLeaf
      {...props}
      as={Component}
      className={diffOperationColors[diffOperation.type]}
      attributes={{
        ...props.attributes,
        title:
          diffOperation.type === 'update'
            ? describeUpdate(diffOperation)
            : undefined,
      }}
    ></PlateLeaf>
  );
}
