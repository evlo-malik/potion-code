'use client';

import { useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';

import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useDocumentQueryOptions } from '@/trpc/hooks/query-options';

import { DocumentBanner } from '../navbar/document-banner';
import { PublishedBanner } from '../navbar/published-banner';
import { COVER_GRADIENTS, CoverPopover } from './cover-popover';

export function Cover({ preview }: { preview?: boolean; url?: string | null }) {
  const queryOptions = useDocumentQueryOptions();

  const { data: coverImage } = useQuery({
    ...queryOptions,
    select: (data) => data.document?.coverImage,
  });

  const { data: isArchived } = useQuery({
    ...queryOptions,
    select: (data) => data.document?.isArchived,
  });

  const { data: isPublished } = useQuery({
    ...queryOptions,
    select: (data) => data.document?.isPublished,
  });

  const [imageError, setImageError] = useState(false);

  const banner = isArchived ? (
    <DocumentBanner />
  ) : isPublished ? (
    <PublishedBanner />
  ) : null;

  if (!coverImage) {
    return banner;
  }

  const isGradient = coverImage in COVER_GRADIENTS;

  return (
    <>
      {banner}
      <div
        className={cn(
          'group relative h-[35vh] w-full shrink-0',
          isGradient
            ? COVER_GRADIENTS[coverImage as keyof typeof COVER_GRADIENTS]
            : 'bg-white',
          window.location.toString().includes('preview') ? 'dark:bg-black' : ''
        )}
        data-plate-selectable
      >
        {!isGradient && !imageError && (
          <Image
            className="size-full object-cover select-none"
            onError={() => setImageError(true)}
            alt="cover"
            src={coverImage}
            fill
          />
        )}
        {!preview && (
          <div className="absolute right-5 bottom-5 flex items-center gap-x-2 opacity-0 group-hover:opacity-100">
            <CoverPopover>Change cover</CoverPopover>
          </div>
        )}
      </div>
    </>
  );
}

export function CoverSkeleton() {
  return <Skeleton className="h-[35vh] w-full *:rounded-none" />;
}
