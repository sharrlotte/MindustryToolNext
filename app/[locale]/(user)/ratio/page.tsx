'use client';

import { ChevronUpDownIcon } from '@heroicons/react/24/outline';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  BlockCard,
  blocks,
  Factory,
  RequirementCard,
} from '@/app/[locale]/(user)/ratio/block';
import Tran from '@/components/common/tran';

export default function Page() {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState('');

  const [value, setValue] = useState<Factory>();

  function handleSelect(item: Factory) {
    setValue(item);
    setOpen(false);
  }

  return (
    <div className="flex overflow-auto flex-col items-center justify-center gap-6 p-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            className="h-12 min-w-[200px] justify-between border-none bg-secondary p-2 capitalize shadow-md"
            title=""
            role="combobox"
            variant="outline"
          >
            {value ? (
              <div>
                <BlockCard factory={value} />
              </div>
            ) : (
              <Tran text="ratio.select-block" />
            )}
            <ChevronUpDownIcon className="ml-auto size-5 shrink-0" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="z-50 w-[200px] bg-card p-0">
          <div className="mt-0.5 divide-y">
            <div className="flex gap-1 p-1">
              <div>
                <MagnifyingGlassIcon className="size-5" />
              </div>
              <input
                className="border-none bg-transparent font-thin outline-none"
                value={filter}
                placeholder="Search"
                onChange={(event) => setFilter(event.currentTarget.value)}
              />
            </div>
            <div className="grid gap-2 p-1">
              {blocks.map((item) => (
                <Button
                  className="flex justify-start capitalize hover:bg-muted"
                  key={item.name}
                  variant="ghost"
                  onClick={() => handleSelect(item)}
                >
                  <BlockCard factory={item} />
                </Button>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {value && (
        <div className="space-y-2">
          <BlockCard factory={value} />
          <div className="flex justify-evenly">
            {value.input.map((input, index) => (
              <RequirementCard key={index} input={input} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
