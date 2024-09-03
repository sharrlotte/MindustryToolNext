'use client';

import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import React from 'react';

import ColorText from '@/components/common/color-text';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import useClientApi from '@/hooks/use-client';
import { cn } from '@/lib/utils';
import { useExpandServerNav } from '@/zustand/expand-nav';

import { CaretSortIcon } from '@radix-ui/react-icons';
import { useQuery } from '@tanstack/react-query';
import { getInternalServers } from '@/query/server';

export default function SidebarToggle() {
  const { id } = useParams();
  const pathname = usePathname();
  const { expand, setExpand } = useExpandServerNav();
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(id);
  const axios = useClientApi();

  const { data } = useQuery({
    queryFn: () => getInternalServers(axios),
    queryKey: ['servers'],
  });

  const servers = data ?? [];
  const serverId = id as string;

  return (
    <div className="flex h-9 w-full items-center justify-center">
      <div
        className={cn(
          'flex cursor-pointer items-center justify-center p-2 transition-transform duration-200 hover:rounded-sm hover:bg-brand hover:text-white',
          {
            'rotate-180': !expand,
          },
        )}
        onClick={() => setExpand(!expand)}
      >
        <ChevronRight className="size-5" />
      </div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          aria-expanded={open}
          className={cn(
            'flex w-full flex-row items-center justify-between overflow-hidden p-0 pl-2 font-bold',
            {
              'w-0 p-0': !expand,
            },
          )}
        >
          {value ? (
            <ColorText
              text={servers.find((server) => server.id === value)?.name}
            />
          ) : (
            ''
          )}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </PopoverTrigger>
        <PopoverContent className="grid w-[200px] gap-1 p-2">
          {servers.map(({ id, name }) => (
            <Link
              key={id}
              href={pathname.replace(serverId, id)}
              onClick={() => setValue(id)}
            >
              <ColorText text={name} className="text-sm" />
            </Link>
          ))}
        </PopoverContent>
      </Popover>
    </div>
  );
}
