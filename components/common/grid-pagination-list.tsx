import { AxiosInstance } from 'axios';
import React, { ReactNode, useMemo } from 'react';

import ErrorSpinner from '@/components/common/error-spinner';
import LoadingSpinner from '@/components/common/loading-spinner';
import NoResult from '@/components/common/no-result';
import useClientQuery from '@/hooks/use-client-query';
import { cn } from '@/lib/utils';
import { PaginationQuery } from '@/types/data/pageable-search-schema';

import { QueryKey } from '@tanstack/react-query';

type Props<T, P> = {
  className?: string;
  queryKey: QueryKey;
  params: P;
  loader?: ReactNode;
  noResult?: ReactNode;
  skeleton?: {
    amount: number;
    item: ReactNode;
  };
  getFunc: (axios: AxiosInstance, params: P) => Promise<T[]>;
  children: (data: T, index?: number) => ReactNode;
};

export default function GridPaginationList<T, P extends PaginationQuery>({
  className,
  queryKey,
  params,
  loader,
  noResult,
  skeleton,
  getFunc,
  children,
}: Props<T, P>) {
  const { data, isLoading, error } = useClientQuery({
    queryFn: (axios) => getFunc(axios, params),
    queryKey: [...queryKey, params],
  });

  const skeletonElements = useMemo(() => {
    if (skeleton)
      return Array(skeleton.amount)
        .fill(1)
        .map((_, index) => (
          <React.Fragment key={index}>{skeleton.item}</React.Fragment>
        ));
  }, [skeleton]);

  noResult = noResult ?? (
    <NoResult className="flex w-full items-center justify-center" />
  );

  if (!loader && !skeleton) {
    loader = (
      <LoadingSpinner
        key="loading"
        className="col-span-full flex h-full w-full items-center justify-center absolute inset-0"
      />
    );
  }

  function render() {
    if (isLoading) {
      return loader ? loader : skeletonElements;
    }

    if (error) {
      return (
        <div className="flex w-full h-full justify-center col-span-full">
          <ErrorSpinner message={error?.message} />
        </div>
      );
    }

    if (!data) {
      return noResult;
    }

    return data.map((item, index) => children(item, index));
  }

  return (
    <div className="h-full overflow-auto">
      <div
        className={cn(
          'grid w-full grid-cols-[repeat(auto-fill,minmax(min(var(--preview-size),100%),1fr))] justify-center gap-2 pr-2',
          className,
        )}
      >
        {render()}
      </div>
    </div>
  );
}
