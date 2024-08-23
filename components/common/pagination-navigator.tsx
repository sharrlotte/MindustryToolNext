import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from '@/components/ui/pagination';
import useSearchQuery from '@/hooks/use-search-query';
import { cn } from '@/lib/utils';
import { PaginationQuery } from '@/query/search-query';

type Props = {
  numberOfItems?: number;
};
export default function PaginationNavigator({ numberOfItems = 0 }: Props) {
  const params = useSearchQuery(PaginationQuery);
  const [open, setOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState(0);
  const router = useRouter();
  const searchParams = useSearchParams();

  function handlePageChange(page: number) {
    const path = new URLSearchParams(searchParams);
    path.set('page', page.toString());
    router.replace(`?${path.toString()}`);
  }

  const currentPage = params.page;
  const lastPage = Math.ceil(numberOfItems / params.size) - 1;

  const hasNextPage = currentPage < lastPage;
  const hasPrevPage = currentPage > 0;

  let firstNumber = currentPage - 1;
  let secondNumber = currentPage;

  if (firstNumber <= -1) {
    firstNumber += 1;
    secondNumber += 1;
  }

  const secondLastNumber = lastPage - 1;
  const lastNumber = lastPage;

  if (secondNumber >= secondLastNumber) {
    firstNumber = 0;
    secondNumber = 1;
  }

  const nextPage = currentPage + 1;
  const previousPage = currentPage - 1;

  function handleSelectPage() {
    if (selectedPage < 0 || selectedPage > lastPage) return;
    handlePageChange(selectedPage);
    setOpen(false);
  }
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <Button
            className="w-full min-w-9 rounded-sm p-0 px-2 py-1"
            title="0"
            onClick={() => handlePageChange(previousPage)}
            variant="icon"
            disabled={!hasPrevPage}
          >
            <ChevronLeftIcon className="size-5" />
          </Button>
        </PaginationItem>
        <PaginationItem>
          <Button
            className={cn('w-full min-w-9 rounded-sm p-0 px-2 py-1', {
              'bg-secondary text-background dark:text-foreground':
                firstNumber === currentPage,
            })}
            title="prev"
            onClick={() => handlePageChange(firstNumber)}
            variant="icon"
          >
            {firstNumber}
          </Button>
        </PaginationItem>
        {lastPage > 1 && (
          <PaginationItem>
            <Button
              className={cn('w-full min-w-9 rounded-sm p-0 px-2 py-1', {
                'bg-secondary text-background dark:text-foreground':
                  secondNumber === currentPage,
              })}
              title="prev"
              onClick={() => handlePageChange(secondNumber)}
              variant="icon"
            >
              {secondNumber}
            </Button>
          </PaginationItem>
        )}
        <PaginationItem>
          <Dialog open={open} onOpenChange={setOpen}>
            {lastPage > 1 && (
              <DialogTrigger asChild>
                <Button className="p-0" variant="icon">
                  <PaginationEllipsis />
                </Button>
              </DialogTrigger>
            )}
            <DialogContent className="p-6">
              <DialogTitle>Select page</DialogTitle>
              <DialogDescription />
              <Input
                type="number"
                value={selectedPage}
                onChange={(event) =>
                  setSelectedPage(event.currentTarget.valueAsNumber)
                }
              />
              {(selectedPage < 0 || selectedPage > lastPage) && (
                <span className="text-sm text-destructive">
                  Page must above 0 and below {lastPage}
                </span>
              )}
              <div className="flex justify-end">
                <Button
                  className="flex"
                  onClick={handleSelectPage}
                  title="Go to page"
                  variant="primary"
                >
                  Go
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </PaginationItem>
        {lastPage > 2 && (
          <PaginationItem>
            <Button
              className={cn('w-full min-w-9 rounded-sm p-0 px-2 py-1', {
                'bg-secondary text-background dark:text-foreground':
                  secondLastNumber === currentPage,
              })}
              title="prev"
              onClick={() => handlePageChange(secondLastNumber)}
              variant="icon"
            >
              {secondLastNumber}
            </Button>
          </PaginationItem>
        )}
        {lastPage > 1 && (
          <PaginationItem>
            <Button
              className={cn('w-full min-w-9 rounded-sm p-0 px-2 py-1', {
                'bg-secondary text-background dark:text-foreground':
                  lastNumber === currentPage,
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
          <Button
            className="w-full min-w-9 rounded-sm p-0 px-2 py-1"
            title="0"
            onClick={() => handlePageChange(nextPage)}
            variant="icon"
            disabled={!hasNextPage}
          >
            <ChevronRightIcon className="size-5" />
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
