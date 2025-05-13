import React from 'react';

import type { Value } from '@udecode/plate';

import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';

import { VersionPlate } from '@/components/editor/providers/version-plate';
import { popModal } from '@/components/modals';
import { Icons } from '@/components/ui/icons';
import { useDocumentId } from '@/lib/navigation/routes';
import { cn } from '@/lib/utils';
import { Button } from '@/registry/default/potion-ui/button';
import {
  DialogContent,
  DialogTitle,
} from '@/registry/default/potion-ui/dialog';
import { useUpdateDocumentMutation } from '@/trpc/hooks/document-hooks';
import { useDocumentVersionsQueryOptions } from '@/trpc/hooks/query-options';
import { api, useTRPC } from '@/trpc/react';

export function VersionHistoryModal({
  activeVersionId: initialVersionId,
}: {
  activeVersionId: number | string;
}) {
  const [activeVersionId, setActiveVersionId] =
    React.useState(initialVersionId);
  const versions = useQuery(useDocumentVersionsQueryOptions());

  const activeVersion = React.useMemo(() => {
    return versions.data?.versions.find(
      (version, index) =>
        version?.id === activeVersionId || index + 1 === activeVersionId
    );
  }, [activeVersionId, versions.data?.versions]);

  const documentId = useDocumentId();
  const updateDocument = useUpdateDocumentMutation();

  const onRestoreVersion = async () => {
    if (!documentId || !activeVersionId) return;

    // TODO: loading toast
    await updateDocument.mutateAsync({
      id: documentId,
      contentRich: activeVersion?.contentRich,
    });

    window.location.reload();
    popModal();
  };

  const trpc = useTRPC();
  const hasVersions =
    versions.data?.versions && versions.data.versions.length > 0;

  const createVersion = api.version.createVersion.useMutation({
    onSuccess: () => {
      void trpc.version.documentVersions.invalidate({ documentId });
    },
  });

  return (
    <DialogContent className="flex h-[calc(100vh-130px)] flex-row gap-0 p-0 md:max-w-[calc(100vw-200px)]">
      <DialogTitle className="sr-only">Version history</DialogTitle>

      <div className="relative flex grow flex-col">
        {activeVersion ? (
          <>
            <div className="flex h-[45px] items-center gap-2 pt-2.5 pl-4">
              <Icons.document className="size-5 shrink-0 text-muted-foreground" />
              <h2 className="w-full truncate text-muted-foreground">
                {activeVersion.title}
              </h2>
            </div>

            <div className="h-[calc(100%-45px)] overflow-y-auto px-8">
              <h1 className="mb-2 flex h-[135px] items-end text-[40px] leading-none font-bold">
                {activeVersion.title}
              </h1>

              <VersionPlate
                id={activeVersion.id}
                value={activeVersion.contentRich as Value}
              />
            </div>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
            <Icons.history className="size-8 text-muted-foreground/50" />
            <p className="text-sm">
              This page does not have any snapshots yet.
            </p>
            <Button
              variant="brand"
              disabled={createVersion.isPending}
              onClick={() => {
                createVersion.mutate({ documentId });
              }}
            >
              Save version
            </Button>
          </div>
        )}
      </div>

      <div className="flex w-[17rem] shrink-0 flex-col justify-between border-l pt-3">
        <div className="pr-2 pl-4 text-base font-semibold">Version history</div>

        <div className="grow overflow-x-auto px-2 pt-1.5">
          {versions.data?.versions.map(
            (version) =>
              version && (
                <div
                  key={version.id}
                  className={cn(
                    'mb-1 flex h-14 cursor-pointer flex-col justify-between rounded-sm p-2 hover:bg-accent',
                    activeVersion?.id === version.id && 'bg-accent'
                  )}
                  onClick={() => {
                    setActiveVersionId(version.id);
                  }}
                  role="button"
                >
                  <div className="text-sm">
                    {format(version.createdAt, 'MMM d, yyyy, h:mm a')}
                  </div>
                  <div className="text-xs text-gray-500">
                    {version.username}
                  </div>
                </div>
              )
          )}
        </div>

        <div className="flex justify-end border-t p-3">
          <Button
            size="md"
            variant="brand"
            disabled={updateDocument.isPending || !hasVersions}
            onClick={() => onRestoreVersion()}
          >
            Restore
          </Button>
        </div>
      </div>
    </DialogContent>
  );
}
