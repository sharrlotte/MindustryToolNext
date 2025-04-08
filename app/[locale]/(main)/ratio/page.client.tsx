'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';

import { Factory, Value, blocks } from '@/app/[locale]/(main)/ratio/block-data';

import { ChevronsUpDownIcon } from '@/components/common/icons';
import Tran from '@/components/common/tran';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import { MagnifyingGlassIcon } from '@radix-ui/react-icons';

type Tree = {
  factory: Factory;
  children?: Record<string, Tree>;
};

export default function RatioPage() {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState('');

  const [value, setValue] = useState<Tree>();

  function handleSelect(item: Factory) {
    setValue({ factory: item });
    setOpen(false);
  }

  return (
    <div className="flex flex-col items-center justify-center gap-6 overflow-auto p-2">
      <Link className="text-5xl text-brand" href="https://mindustry-calculator.vercel.app/">
        App link
      </Link>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button className="h-12 min-w-[200px] justify-between border-transparent bg-secondary p-2 capitalize shadow-md" title="" role="combobox" variant="outline">
            {value ? (
              <div className="flex items-center justify-start gap-2">
                <Image className="h-8 w-8" src={`/assets/sprite/${value.factory.name}.png`} height={32} width={32} alt={value.factory.name} />
                <Tran text={`ratio.${value.factory.name}`} />
              </div>
            ) : (
              <Tran text="ratio.select-block" />
            )}
            <ChevronsUpDownIcon className="ml-auto size-5 shrink-0" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="z-50 min-w-[200px] bg-card p-0">
          <div className="mt-0.5 divide-y">
            <div className="flex gap-1 p-1">
              <div>
                <MagnifyingGlassIcon className="size-5" />
              </div>
              <input className="border-transparent bg-transparent font-thin outline-hidden" value={filter} placeholder="Search" onChange={(event) => setFilter(event.currentTarget.value)} />
            </div>
            <div className="flex flex-col gap-2 p-1">
              {blocks.map((item) => (
                <Button className="flex items-center justify-start gap-2 text-start capitalize hover:bg-muted" key={item.name} variant="ghost" onClick={() => handleSelect(item)}>
                  <Image className="h-8 w-8" src={`/assets/sprite/${item.name}.png`} height={32} width={32} alt={item.name} />
                  <Tran text={`ratio.${item.name}`} />
                </Button>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
      {value && (
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2 text-start bg-card py-2 border">
            <Image className="h-8 w-8" src={`/assets/sprite/${value.factory.name}.png`} height={32} width={32} alt={value.factory.name} />
            <Tran text={`ratio.${value.factory.name}`} />
          </div>
          <div className="flex justify-evenly gap-2">
            {value.factory.input.map((input, index) => (
              <RequirementCard key={index} input={input} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

type RequirementCardProps = {
  input: Value;
};

function RequirementCard({ input }: RequirementCardProps) {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState('');

  const [value, setValue] = useState<Factory>();

  function handleSelect(item: Factory) {
    setValue(item);
    setOpen(false);
  }

  const filtered = blocks.filter((block) => block.name.includes(filter) && block.output.some((output) => output.name === input.name));

  return (
    <div className="flex flex-col items-center justify-start gap-6 bg-card p-2 border">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button className="h-12 p-0" title="" variant="icon">
            <div className="flex items-center gap-1">
              <Image className="h-8 w-auto" src={`/assets/sprite/${input.icon}-ui.png`} alt={input.name} width={32} height={32} />
              {input.rate}/s
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="z-50 min-w-[200px] bg-card p-0">
          <div className="mt-0.5 divide-y">
            <div className="flex gap-1 p-1">
              <div>
                <MagnifyingGlassIcon className="size-5" />
              </div>
              <input className="border-transparent bg-transparent font-thin outline-hidden" value={filter} placeholder="Search" onChange={(event) => setFilter(event.currentTarget.value)} />
            </div>
            <div className="grid gap-2 p-1">
              {filtered.map((item) => (
                <Button className="flex items-center justify-start gap-2 text-start capitalize hover:bg-muted" key={item.name} variant="ghost" onClick={() => handleSelect(item)}>
                  <Image className="h-8 w-8" src={`/assets/sprite/${item.name}.png`} height={32} width={32} alt={item.name} />
                  <Tran text={`ratio.${item.name}`} />
                </Button>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
      {value && (
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2 text-start">
            <Image className="h-8 w-8" src={`/assets/sprite/${value.name}.png`} height={32} width={32} alt={value.name} />
            <Tran text={`ratio.${value.name}`} />
          </div>
          <div className="flex justify-evenly gap-2">
            {value.input.map((input) => (
              <RequirementCard key={input.name} input={input} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
