import Image from 'next/image';
import React from 'react';

import useClientApi from '@/hooks/use-client';
import { cn } from '@/lib/utils';
import { getMods } from '@/query/mod';
import { Mod } from '@/types/response/Mod';

import { useQuery } from '@tanstack/react-query';

type Props = {
  value?: Mod;
  onValueSelected: (mod?: Mod) => void;
};

export default function ModFilter({ value, onValueSelected }: Props) {
  const axios = useClientApi();

  const { data } = useQuery({
    queryKey: ['mods'],
    queryFn: () => getMods(axios),
  });

  const mods = data ?? [];
  return (
    <div className="flex gap-2 hover:overflow-x-auto focus:overflow-x-auto overflow-hidden w-full pb-2 h-12">
      {mods.map((mod) => (
        <ModCard key={mod.id} value={value} mod={mod} onValueSelected={(selected) => onValueSelected(selected === value ? undefined : selected)} />
      ))}
    </div>
  );
}

type ModCardProps = {
  mod: Mod;
  value?: Mod;
  onValueSelected: (mod: Mod) => void;
};
function ModCard({ mod, value, onValueSelected }: ModCardProps) {
  return (
    <div
      className={cn('flex gap-1 rounded-full p-1 text-sm text-center items-center cursor-pointer bg-card justify-center border min-w-20 shrink-0 hover:bg-brand hover:text-brand-foreground', {
        'bg-brand text-brand-foreground': value === mod,
      })}
      onClick={() => onValueSelected(mod)}
    >
      {mod.icon && <Image key={mod.icon} width={48} height={48} className="size-8 object-cover rounded-full" src={mod.icon} loader={({ src }) => src} alt="preview" />}
      {mod.name}
    </div>
  );
}
