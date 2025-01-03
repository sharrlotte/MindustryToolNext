'use client';

import { AxiosInstance } from 'axios';
import React, { ReactNode, useMemo } from 'react';

import LoadingSpinner from '@/components/common/loading-spinner';
import NoResult from '@/components/common/no-result';
import RouterSpinner from '@/components/common/router-spinner';

import useClientQuery from '@/hooks/use-client-query';
import { cn } from '@/lib/utils';

import { QueryKey } from '@tanstack/react-query';
import { PaginationQuery } from '@/query/search-query';

type Props<T, P> = {
  className?: string;
  queryKey: QueryKey;
  params: P;
  loader?: ReactNode;
  noResult?: ReactNode;
  skeleton?: {
    amount: number;
    item: ReactNode | ((index: number) => ReactNode);
  };
  asChild?: boolean;
  initialData?: T[];
  queryFn: (axios: AxiosInstance, params: P) => Promise<T[]>;
  children: (data: T, index: number) => ReactNode;
};

export default function GridPaginationList<T, P extends PaginationQuery>({ className, queryKey, params, loader, noResult, skeleton, asChild, initialData, queryFn, children }: Props<T, P>) {
  const { data, error, isLoading } = useClientQuery({
    queryFn: (axios) => queryFn(axios, params),
    queryKey: [...queryKey, params],
    initialData,
  });

  const skeletonElements = useMemo(() => {
    if (skeleton)
      return Array(skeleton.amount)
        .fill(1)
        .map((_, index) => <React.Fragment key={index}>{typeof skeleton.item === 'function' ? skeleton.item(index) : skeleton.item}</React.Fragment>);
  }, [skeleton]);

  noResult = noResult ?? <NoResult className="flex w-full items-center justify-center" />;

  if (!loader && !skeleton) {
    loader = <LoadingSpinner key="loading" className="absolute inset-0 col-span-full flex h-full w-full items-center justify-center" />;
  }

  function render() {
    if (isLoading) {
      return loader ? loader : skeletonElements;
    }

    if (error) {
      return (
        <div className="col-span-full flex h-full w-full justify-center">
          <RouterSpinner message={error?.message} />
        </div>
      );
    }

    if (!data) {
      return noResult;
    }

    return data.map((item, index) => children(item, index));
  }

  if (asChild) {
    return render();
  }

  return (
    <div className="pagination-container h-full">
      <div className={cn('grid w-full grid-cols-[repeat(auto-fill,minmax(min(var(--preview-size),100%),1fr))] justify-center gap-2', className)}>{render()}</div>
    </div>
  );
}
