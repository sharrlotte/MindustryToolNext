import Image from 'next/image';
import React from 'react';

import useClientApi from '@/hooks/use-client';
import { getMods } from '@/query/mod';
import { Mod } from '@/types/response/Mod';

import { useQuery } from '@tanstack/react-query';

export default function ModFilter() {
  const axios = useClientApi();

  const { data } = useQuery({
    queryKey: ['mods'],
    queryFn: () => getMods(axios),
  });

  const mods = data ?? [];
  return (
    <div className="flex gap-2 hover:overflow-x-auto focus:overflow-x-auto overflow-hidden w-full pb-2">
      {mods.map((mod) => (
        <ModCard key={mod.id} mod={mod} />
      ))}
    </div>
  );
}

type ModCardProps = {
  mod: Mod;
};
function ModCard({ mod }: ModCardProps) {
  return (
    <div className="flex gap-1 rounded-full p-2 text-sm text-center items-center justify-center border min-w-20 shrink-0">
      {mod.icon && <Image key={mod.icon} width={48} height={48} className="size-8 object-cover rounded-full" src={mod.icon} loader={({ src }) => src} alt="preview" />}
      {mod.name}
    </div>
  );
}
