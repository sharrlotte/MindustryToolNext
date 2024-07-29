import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
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
import useSearchQuery, { PaginationQuery } from '@/hooks/use-search-query';

type Props = {
  numberOfItems: number;
};
export default function PaginationNavigator({ numberOfItems }: Props) {
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

  let secondLastNumber = lastPage - 1;
  let lastNumber = lastPage;

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
            className="px-1"
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
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
              <PaginationEllipsis />
            </DialogTrigger>
            <DialogContent className="p-6">
              <DialogTitle>Select page</DialogTitle>
              <Input
                type="number"
                value={selectedPage}
                onChange={(event) =>
                  setSelectedPage(event.currentTarget.valueAsNumber)
                }
              />
              {(selectedPage < 0 || selectedPage > lastPage) && (
                <span className="text-destructive text-sm">
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
            className="px-1"
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
  );
}
