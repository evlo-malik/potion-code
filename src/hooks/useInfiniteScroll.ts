import { useEffect, useRef, useState } from 'react';

import { useSession } from '@/components/auth/useSession';
import { useOnScreen } from '@/hooks/useOnScreen';

export const useInfiniteScroll = ({
  fetchNextPage,
  hasFirstPage,
  hasNextPage,
  isFetched,
  isFetching,
  isPublic,
}: {
  fetchNextPage: any;
  debug?: string;
  hasFirstPage?: boolean;
  hasNextPage?: boolean;
  isFetched?: boolean;
  isFetching?: boolean;
  isPublic?: boolean;
}) => {
  const session = useSession();
  const bottomRef = useRef<HTMLDivElement>(undefined);
  const reachedBottom = useOnScreen(bottomRef);
  const [reachedNextPage, setReachedNextPage] = useState(false);

  useEffect(() => {
    if (
      reachedBottom &&
      ((hasFirstPage && !reachedNextPage) || hasNextPage) &&
      !isFetching
    ) {
      setReachedNextPage(true);

      if (isPublic || !!session) {
        void fetchNextPage();
      }
    }
  }, [
    isFetched,
    reachedBottom,
    isFetching,
    hasNextPage,
    fetchNextPage,
    isPublic,
    session,
    hasFirstPage,
    reachedNextPage,
  ]);

  return {
    bottomRef,
    reachedNextPage,
  };
};
