import React from 'react';

import type { PageProps } from '@/lib/navigation/next-types';

import { redirect } from 'next/navigation';

import { isAuth } from '@/components/auth/rsc/auth';
import { Cover } from '@/components/cover/cover';
import { DocumentToolbar } from '@/components/cover/document-toolbar';
import { DocumentEditor } from '@/components/editor/document-editor';
import { PrintPlate } from '@/components/editor/providers/print-plate';
import { HydrateClient, trpc } from '@/trpc/server';

export default async function PrintDocumentPage(
  props: PageProps<{ documentId: string }>
) {
  if (!(await isAuth())) return redirect('/');

  const { documentId } = await props.params;

  void trpc.document.document.prefetch({ id: documentId });

  return (
    <HydrateClient>
      <PrintPlate>
        <div className="flex h-full flex-col">
          <Cover />
          <div className="flex w-full flex-1 flex-col">
            <DocumentToolbar />
            <DocumentEditor mode="print" />
          </div>
        </div>
      </PrintPlate>
    </HydrateClient>
  );
}
