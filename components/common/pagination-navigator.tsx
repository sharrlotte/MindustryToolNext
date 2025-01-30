'use client';

import { AxiosInstance } from 'axios';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';

import ComboBox from '@/components/common/combo-box';
import { ChevronLeftIcon, ChevronRightIcon } from '@/components/common/icons';
import Tran from '@/components/common/tran';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem } from '@/components/ui/pagination';

import { useSession } from '@/context/session-context.client';
import useClientQuery from '@/hooks/use-client-query';
import useSearchQuery from '@/hooks/use-search-query';
import { cn } from '@/lib/utils';
import { PaginationQuerySchema } from '@/query/search-query';

type Props = {
  sizes?: number[];
} & (
  | {
      numberOfItems?: number;
    }
  | {
      numberOfItems?: (axios: AxiosInstance) => Promise<number>;
      queryKey: any[];
    }
);

export default function PaginationNavigator({ numberOfItems, sizes = [10, 20, 30, 50, 100], ...rest }: Props) {
  if (typeof numberOfItems === 'function') {
    return <QueryPaginationNavigator numberOfItems={numberOfItems} sizes={sizes} queryKey={(rest as any).queryKey} />;
  }

  return <PaginationNavigatorInternal numberOfItems={numberOfItems ?? 0} sizes={sizes} />;
}

type QueryPaginationNavigatorProps = {
  numberOfItems: (axios: AxiosInstance) => Promise<number>;
  sizes: number[];
  queryKey: any[];
};
function QueryPaginationNavigator({ queryKey, numberOfItems, sizes }: QueryPaginationNavigatorProps) {
  const { data } = useClientQuery({
    queryKey,
    queryFn: numberOfItems,
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setConfig } = useSession();

  const size = params.size || sizes[0];

  function handleSizeChange(size: number | undefined) {
    setConfig('paginationSize', size ?? 10);

    const path = new URLSearchParams(searchParams);
    path.set('size', (size || sizes[0]).toString());
    router.replace(`?${path.toString()}`);
  }

  function handlePageChange(page: number) {
    const containers = document.getElementsByClassName('pagination-container');

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
    router.replace(`?${path.toString()}`);
  }

  const currentPage = params.page;
  const lastPage = Math.ceil(numberOfItems / params.size) - 1;

  const hasNextPage = currentPage < lastPage;
  const hasPrevPage = currentPage > 0;

  const lastNumber = lastPage;

  const nextPage = currentPage + 1;
  const previousPage = currentPage - 1;

  function handleSelectPage() {
    if (selectedPage < 0 || selectedPage > lastPage) return;

    handlePageChange(selectedPage);
    setOpen(false);
  }

  const nextPath = new URLSearchParams(searchParams);
  nextPath.set('page', nextPage.toString());

  const prevPath = new URLSearchParams(searchParams);
  prevPath.set('page', previousPage.toString());

  return (
    <Pagination className="h-9">
      <PaginationContent>
        <PaginationItem>
          <Button className="w-full min-w-9 rounded-sm p-0 px-2 py-1" title="0" onClick={() => handlePageChange(previousPage)} variant="icon" disabled={!hasPrevPage}>
            <ChevronLeftIcon className="size-5" />
          </Button>
        </PaginationItem>
        <PaginationItem>
          <Button className={cn('w-full min-w-9 rounded-sm p-0 px-2 py-1 bg-secondary dark:text-foreground', {})} title="prev" onClick={() => handlePageChange(currentPage)} variant="icon">
            {currentPage}
          </Button>
        </PaginationItem>
        <PaginationItem>
          <Dialog open={open} onOpenChange={setOpen}>
            {lastPage > 1 && (
              <DialogTrigger asChild>
                <Button className="p-0" variant="icon" title="choose">
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
                <Button className="flex" onClick={handleSelectPage} title="Go to page" variant="primary">
                  Go
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </PaginationItem>
        {lastPage > 1 && (
          <PaginationItem>
            <Button
              className={cn('w-full min-w-9 rounded-sm p-0 px-2 py-1', {
                'bg-secondary text-brand-foreground': lastNumber === currentPage,
              })}
              title="prev"
              onClick={() => handlePageChange(lastNumber)}
              variant="icon"
            >
              {lastNumber}
            </Button>
          </PaginationItem>
        )}
        <PaginationItem>
          <Button className="w-full min-w-9 rounded-sm p-0 px-2 py-1" title="0" onClick={() => handlePageChange(nextPage)} variant="icon" disabled={!hasNextPage}>
            <ChevronRightIcon className="size-5" />
          </Button>
        </PaginationItem>
        <ComboBox
          className="w-20 rounded-sm"
          searchBar={false}
          value={{ label: size.toString(), value: size }}
          values={sizes.map((size) => ({
            label: size.toString(),
            value: size,
          }))}
          onChange={handleSizeChange}
        />
      </PaginationContent>
      <Link href={`?${prevPath.toString()}`} shallow />
      <Link href={`?${nextPath.toString()}`} shallow />
    </Pagination>
  );
}
