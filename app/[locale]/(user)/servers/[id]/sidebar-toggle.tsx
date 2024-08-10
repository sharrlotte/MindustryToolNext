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
import useClientAPI from '@/hooks/use-client';
import { cn } from '@/lib/utils';
import getInternalServers from '@/query/server/get-internal-servers';
import { useExpandServerNav } from '@/zustand/expand-nav';

import { CaretSortIcon } from '@radix-ui/react-icons';
import { useQuery } from '@tanstack/react-query';

export default function SidebarToggle() {
  const { id } = useParams();
  const pathname = usePathname();
  const { expand, setExpand } = useExpandServerNav();
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(id);
  const axios = useClientAPI();

  const { data } = useQuery({
    queryFn: () => getInternalServers(axios),
    queryKey: ['internal-servers'],
  });

  const servers = data ?? [];
  const serverId = id as string;

  return (
    <div className="flex justify-center items-center w-full">
      <div
        className={cn(
          'flex justify-center p-2 items-center cursor-pointer hover:rounded-sm hover:bg-brand hover:text-white transition-transform duration-200',
          {
            'rotate-180': !expand,
          },
        )}
        onClick={() => setExpand(!expand)}
      >
        <ChevronRight className="w-5 h-5" />
      </div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          aria-expanded={open}
          className={cn(
            'justify-between w-full overflow-hidden p-0 pl-2 flex flex-row items-center font-bold',
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
        <PopoverContent className="w-[200px] grid p-2 gap-1">
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
