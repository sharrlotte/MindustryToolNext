'use client';

import { useState } from 'react';
import { useDebounceValue } from 'usehooks-ts';

import { Hidden } from '@/components/common/hidden';
import { SearchIcon } from '@/components/common/icons';
import InternalLink from '@/components/common/internal-link';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

import { cn } from '@/lib/utils';

import { useQuery } from '@tanstack/react-query';

export default function DocSearchBar() {
  const [focus, setFocus] = useState(false);
  const [query, setQuery] = useState('');

  const [value] = useDebounceValue(query, 100);

  const { data } = useQuery({
    queryKey: ['search', value],
    queryFn: async () => {
      const response = await fetch(`/api/v1/docs?q=${value}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return (await response.json()) as { path: string; content: string }[];
    },
  });

  return (
    <Dialog>
      <DialogTrigger className="ml-auto">
        <SearchIcon />
      </DialogTrigger>
      <DialogContent className="p-8 h-full w-full flex flex-col">
        <Hidden>
          <DialogTitle />
          <DialogDescription />
        </Hidden>
        <div className="border h-8 rounded-lg px-2 py-0.5 flex items-center w-full">
          <SearchIcon />
          <Input className={cn('w-0 border-none focus:border-brand', { 'w-full': focus })} type="text" value={query} onChange={(event) => setQuery(event.currentTarget.value)} onFocus={() => setFocus(true)} />
        </div>
        {data && focus && (
          <div className="grid gap-2 mt-2 max-h-dvh overflow-y-auto">
            {data?.map((data) => (
              <InternalLink
                className="hover:bg-brand border-border border p-2 rounded-md hover:border-brand bg-muted/50 cursor-pointer animate-appear"
                key={data.path}
                href={`/docs/${data.path}`}
                onClick={() => {
                  setFocus(false);
                  setQuery('');
                }}
              >
                {data.content}
              </InternalLink>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
