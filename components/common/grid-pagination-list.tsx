import { AxiosInstance } from 'axios';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { ReactNode, useMemo } from 'react';

import EndOfPage from '@/components/common/end-of-page';
import ErrorSpinner from '@/components/common/error-spinner';
import LoadingSpinner from '@/components/common/loading-spinner';
import NoResult from '@/components/common/no-result';
import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from '@/components/ui/pagination';
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
  end?: ReactNode;
  skeleton?: {
    amount: number;
    item: ReactNode;
  };
  numberOfItems: number;
  getFunc: (axios: AxiosInstance, params: P) => Promise<T[]>;
  children: (data: T, index?: number) => ReactNode;
};

export default function GridPaginationList<T, P extends PaginationQuery>({
  className,
  queryKey,
  params,
  loader,
  noResult,
  end,
  skeleton,
  numberOfItems,
  getFunc,
  children,
}: Props<T, P>) {
  const { data, isLoading, error } = useClientQuery({
    queryFn: (axios) => getFunc(axios, params),
    queryKey: [...queryKey, params],
  });

  const router = useRouter();
  const searchParams = useSearchParams();

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

  end = end ?? <EndOfPage />;

  function handlePageChange(page: number) {
    const path = new URLSearchParams(searchParams);
    path.set('page', page.toString());
    router.replace(`?${path.toString()}`);
  }

  const currentPage = params.page;
  const lastPage = Math.ceil(numberOfItems / params.size);

  const hasNextPage = currentPage < lastPage;
  const hasPrevPage = currentPage > 0;

  let firstNumber = currentPage - 1;
  let secondNumber = currentPage;

  if (firstNumber <= -1) {
    firstNumber += 1;
    secondNumber += 1;
  }

  
  let secondLastNumber = lastPage - 1;
  let lastNumber = lastPage;
  
  if (secondNumber >= secondLastNumber){
    firstNumber = 0
    secondNumber = 1;
  }

  const nextPage = currentPage + 1;
  const previousPage = currentPage - 1;

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
    <>
      <div
        className={cn(
          'overflow-hidden h-full grid w-full grid-cols-[repeat(auto-fit,minmax(min(var(--preview-size),100%),1fr))] justify-center gap-2 overflow-y-auto',
          className,
        )}
      >
        {render()}
      </div>
      <div className="flex justify-end items-end col-span-full">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <Button
                title="0"
                onClick={() => handlePageChange(previousPage)}
                variant="ghost"
                disabled={!hasPrevPage}
              >
                <ChevronLeftIcon className="h-4 w-4" />
                Previous
              </Button>
            </PaginationItem>
            <PaginationItem>
              <Button
                title="prev"
                onClick={() => handlePageChange(firstNumber)}
                variant={firstNumber === currentPage ? 'outline' : 'ghost'}
              >
                {firstNumber}
              </Button>
            </PaginationItem>
            <PaginationItem>
              <Button
                title="prev"
                onClick={() => handlePageChange(secondNumber)}
                variant={secondNumber === currentPage ? 'outline' : 'ghost'}
              >
                {secondNumber}
              </Button>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <Button
                title="prev"
                onClick={() => handlePageChange(secondLastNumber)}
                variant={secondLastNumber === currentPage ? 'outline' : 'ghost'}
              >
                {secondLastNumber}
              </Button>
            </PaginationItem>
            <PaginationItem>
              <Button
                title="prev"
                onClick={() => handlePageChange(lastNumber)}
                variant={lastNumber === currentPage ? 'outline' : 'ghost'}
              >
                {lastNumber}
              </Button>
            </PaginationItem>
            <PaginationItem>
              <Button
                title="0"
                onClick={() => handlePageChange(nextPage)}
                variant="ghost"
                disabled={!hasNextPage}
              >
                Next
                <ChevronRightIcon className="h-4 w-4" />
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </>
  );
}
