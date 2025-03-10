'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useDebounceValue } from 'usehooks-ts';

import { SearchIcon, XIcon } from '@/components/common/icons';
import InternalLink from '@/components/common/internal-link';
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
    <motion.div
      className="flex justify-center bg-transparent inset-0 items-center backdrop-blur-md"
      variants={{
        focus: {
          position: 'absolute',
        },
        unfocus: {
          position: 'relative',
        },
      }}
      animate={focus ? 'focus' : 'unfocus'}
    >
      <div className={cn('w-[min(500px,50vw)] relative', { 'border rounded-xl p-8 bg-background/50': focus })}>
        <button
          className="absolute right-2 top-2"
          type="button"
          onClick={() => {
            setFocus(false);
            setQuery('');
          }}
        >
          <XIcon />
        </button>
        <div className="border h-10 rounded-lg px-2 py-0.5 flex items-center w-full">
          <SearchIcon />
          <Input className="w-full border-none" type="text" value={query} onChange={(event) => setQuery(event.currentTarget.value)} onFocus={() => setFocus(true)} />
        </div>
        {data && focus && (
          <div className="grid gap-2 mt-2">
            {data?.map((data) => (
              <InternalLink
                className="hover:bg-brand border-border border p-2 rounded-md hover:border-brand bg-muted/50 cursor-pointer"
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
      </div>
    </motion.div>
  );
}
