'use client';

import { AxiosInstance } from 'axios';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import React, { useCallback, useState } from 'react';

import { ChevronLeftIcon, ChevronRightIcon } from '@/components/common/icons';
import Tran from '@/components/common/tran';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem } from '@/components/ui/pagination';

import { useSession } from '@/context/session-context';
import useClientQuery from '@/hooks/use-client-query';
import useSearchQuery from '@/hooks/use-search-query';
import { cn, groupParamsByKey, omit } from '@/lib/utils';
import { PaginationQuerySchema } from '@/query/search-query';

const SizeSelector = dynamic(import('@/components/common/size-selector'), { ssr: false });

type Props = {
  sizes?: number[];
} & (
  | {
      numberOfItems?: string;
    }
  | {
      numberOfItems?: number;
    }
  | {
      numberOfItems?: (axios: AxiosInstance, params?: any) => Promise<number>;
      queryKey: any[];
    }
);

export default function PaginationNavigator({ numberOfItems, sizes = [10, 20, 30, 50, 100], ...rest }: Props) {
  if (typeof numberOfItems === 'function') {
    return <QueryPaginationNavigator numberOfItems={numberOfItems} sizes={sizes} queryKey={(rest as any).queryKey} />;
  }

  if (typeof numberOfItems === 'string') {
    return <PaginationNavigator numberOfItems={(axios, params) => axios.get(numberOfItems, { params }).then((r) => r.data)} sizes={sizes} queryKey={(rest as any).queryKey} />;
  }

  return <PaginationNavigatorInternal numberOfItems={numberOfItems ?? 0} sizes={sizes} />;
}

type QueryPaginationNavigatorProps = {
  numberOfItems: (axios: AxiosInstance, params?: any) => Promise<number>;
  sizes: number[];
  queryKey: any[];
};
function QueryPaginationNavigator({ queryKey, numberOfItems, sizes }: QueryPaginationNavigatorProps) {
  const query = useSearchParams();
  const params = groupParamsByKey(query);

  const { data } = useClientQuery({
    queryKey: [...queryKey, omit(params, 'page', 'sort')],
    queryFn: (axios) => numberOfItems(axios, params),
    placeholderData: 0,
  });

  return <PaginationNavigatorInternal numberOfItems={data ?? 0} sizes={sizes} />;
}

type InternalProps = {
  numberOfItems: number;
  sizes: number[];
};
function PaginationNavigatorInternal({ numberOfItems, sizes }: InternalProps) {
  const [open, setOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState(0);
  const params = useSearchQuery(PaginationQuerySchema);
  const searchParams = useSearchParams();
  const {
    config: { paginationSize },
  } = useSession();

  const handlePageChange = useCallback(
    (page: number) => {
      const containers = document.getElementsByClassName('scroll-container');

      if (containers) {
        for (const container of containers) {
          container.scrollTo({
            top: 0,
            behavior: 'smooth',
          });
        }
      }

      const path = new URLSearchParams(searchParams);
      path.set('page', page.toString());
      window.history.replaceState(null, '', `?${path.toString()}`);
    },
    [searchParams],
  );

  const currentPage = params.page;
  const lastPage = Math.ceil(numberOfItems / paginationSize) - 1;

  const hasNextPage = currentPage < lastPage;
  const hasPrevPage = currentPage > 0;

  const nextPage = currentPage + 1;
  const previousPage = currentPage - 1;

  const handleSelectPage = useCallback(() => {
    if (selectedPage < 0 || selectedPage > lastPage) return;

    handlePageChange(selectedPage);
    setOpen(false);
  }, [handlePageChange, lastPage, selectedPage]);

  return (
    <Pagination className="h-10 bg-card rounded-md">
      <PaginationContent>
        <SizeSelector sizes={sizes} />
        <PaginationItem>
          <Button className="px-2 size-10 py-1 flex" variant="ghost" disabled={!hasPrevPage} onClick={() => handlePageChange(previousPage)}>
            <ChevronLeftIcon className="size-5" />
          </Button>
        </PaginationItem>
        <PaginationItem>
          <Button className={cn(' size-10 w-full min-w-10 h-10 rounded p-0 px-2 py-1 bg-secondary dark:text-foreground', {})} title="prev" onClick={() => handlePageChange(currentPage)} variant="icon">
            {currentPage}
          </Button>
        </PaginationItem>
        <PaginationItem>
          <Dialog open={open} onOpenChange={setOpen}>
            {lastPage > 1 && (
              <DialogTrigger asChild>
                <Button className="p-0 size-10 rounded-none" variant="icon" title="choose">
                  <PaginationEllipsis />
                </Button>
              </DialogTrigger>
            )}
            <DialogContent className="p-6">
              <DialogTitle>
                <Tran text="select-page" />
              </DialogTitle>
              <DialogDescription />
              <Input type="number" value={selectedPage} onChange={(event) => setSelectedPage(event.currentTarget.valueAsNumber)} />
              {(selectedPage < 0 || selectedPage > lastPage) && (
                <span className="text-sm text-destructive">
                  <Tran text="page-constrain" args={{ max: lastPage }} />
                </span>
              )}
              <div className="flex justify-end">
                <Button className="flex size-10" onClick={handleSelectPage} title="Go to page" variant="primary">
                  Go
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </PaginationItem>
        {lastPage > 1 && (
          <PaginationItem>
            <Button
              className={cn('w-full min-w-10 h-10 rounded p-0 px-2 py-1', {
                'bg-secondary text-brand-foreground': lastPage === currentPage,
              })}
              title="prev"
              onClick={() => handlePageChange(lastPage)}
              variant="icon"
            >
              {lastPage}
            </Button>
          </PaginationItem>
        )}
        <PaginationItem>
          <Button className="px-2 size-10  py-1 flex" variant="ghost" disabled={!hasNextPage} onClick={() => handlePageChange(nextPage)}>
            <ChevronRightIcon className="size-5" />
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
