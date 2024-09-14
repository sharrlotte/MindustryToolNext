'use client';

import { cn } from '@/lib/utils';
import { ChevronUpDownIcon } from '@heroicons/react/24/outline';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import Tran from '@/components/common/tran';
import Image from 'next/image';

const items = ['coal', 'graphite', 'sand', 'silicon'] as const;

type Item = (typeof items)[number];

const liquids = ['water', 'oil'] as const;

type Liquid = (typeof liquids)[number];

type Type = Item | Liquid;

type Value = {
  name: Type;
  icon: string;
  rate: number; // Per sec
};

// Liquid boost
// Overdrive
// Power

export type Factory = {
  name: string;
  input: Value[];
  output: Value[];
};

export const blocks: Factory[] = [
  {
    name: 'graphite-press',
    input: [
      {
        name: 'coal',
        icon: 'item-coal',
        rate: 1.33,
      },
    ],
    output: [
      {
        name: 'graphite',
        icon: 'item-graphite',
        rate: 0.66,
      },
    ],
  },
  {
    name: 'multi-press',
    input: [
      {
        name: 'coal',
        icon: 'item-coal',
        rate: 3,
      },
      {
        name: 'water',
        icon: 'liquid-water',
        rate: 6,
      },
    ],
    output: [
      {
        name: 'graphite',
        icon: 'item-graphite',
        rate: 4,
      },
    ],
  },
  {
    name: 'silicon-smelter',
    input: [
      {
        name: 'coal',
        icon: 'item-coal',
        rate: 1.5,
      },
      {
        name: 'sand',
        icon: 'item-sand',
        rate: 3,
      },
    ],
    output: [
      {
        name: 'silicon',
        icon: 'item-silicon',
        rate: 1.5,
      },
    ],
  },
  {
    name: 'coal-centrifuge',
    input: [
      {
        name: 'oil',
        icon: 'liquid-oil',
        rate: 6,
      },
    ],
    output: [
      {
        name: 'coal',
        icon: 'item-coal',
        rate: 2,
      },
    ],
  },
];

type BlockProps = {
  factory: Factory;
};

export function Block({ factory }: BlockProps) {
  const { name } = factory;

  return (
    <>
      <Tran text={`ratio.${name}`} />
      <Image
        className="h-8 w-8"
        src={`/assets/sprite/${name}.png`}
        height={32}
        width={32}
        alt={name}
      />
    </>
  );
}

export function BlockCard({ factory }: BlockProps) {
  const { name } = factory;

  return (
    <div className="flex items-center justify-start gap-2 text-start">
      <Image
        className="h-8 w-8"
        src={`/assets/sprite/${name}.png`}
        height={32}
        width={32}
        alt={name}
      />
      <Tran text={`ratio.${name}`} />
    </div>
  );
}

type RequirementCardProps = {
  input: Value;
};

export function RequirementCard({ input }: RequirementCardProps) {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState('');

  const [value, setValue] = useState<Factory>();

  function handleSelect(item: Factory) {
    setValue(item);
    setOpen(false);
  }

  const filtered = blocks.filter(
    (block) =>
      block.name.includes(filter) &&
      block.output.some((output) => output.name === input.name),
  );

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button className="h-12 p-0" title="" variant="icon">
            <div className="flex items-center gap-1">
              <Image
                className="h-8 w-auto"
                src={`/assets/sprite/${input.icon}-ui.png`}
                alt={input.name}
                width={32}
                height={32}
              />
              {input.rate}/s
            </div>
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
              {filtered.map((item) => (
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
