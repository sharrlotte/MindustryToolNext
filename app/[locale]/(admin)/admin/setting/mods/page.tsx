'use client';

import Image from 'next/image';

import CreateModDialog from '@/app/[locale]/(admin)/admin/setting/mods/create-mod-dialog';
import DeleteModDialog from '@/app/[locale]/(admin)/admin/setting/mods/delete-mod-dialog';
import UpdateModDialog from '@/app/[locale]/(admin)/admin/setting/mods/update-mod-dialog';

import LoadingSpinner from '@/components/common/router-spinner';
import Tran from '@/components/common/tran';
import { EllipsisButton } from '@/components/ui/ellipsis-button';

import useClientApi from '@/hooks/use-client';
import { getMods } from '@/query/mod';
import { Mod } from '@/types/response/Mod';

import { useQuery } from '@tanstack/react-query';

export default function Page() {
  return (
    <div className="flex flex-col gap-2 w-full h-full overflow-hidden">
      <ModList />
      <div className="flex mt-auto justify-end">
        <CreateModDialog />
      </div>
    </div>
  );
}

function ModList() {
  const axios = useClientApi();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['mods'],
    queryFn: () => getMods(axios),
  });

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-full w-full">
        <LoadingSpinner />
      </div>
    );

  if (isError)
    return (
      <div className="col-span-full flex h-full flex-col w-full items-center text-center justify-center">
        <Tran className="font-semibold" text="error" />
        <p className="text-muted-foreground">{JSON.stringify(error)}</p>
      </div>
    );

  return <section className="overflow-y-auto grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">{data?.map((mod) => <ModCard key={mod.id} mod={mod} />)}</section>;
}

type ModCardProps = {
  mod: Mod;
};

function ModCard({ mod }: ModCardProps) {
  const { name, icon } = mod;

  return (
    <div className="bg-card rounded-md overflow-hidden gap-2 w-full flex justify-between p-2">
      {icon && <Image width={48} height={48} className="size-12 object-cover" src={icon} alt={name} />}
      <h2 className="w-full text-ellipsis overflow-hidden text-wrap">{name}</h2>
      <EllipsisButton variant="ghost">
        <UpdateModDialog mod={mod} />
        <DeleteModDialog mod={mod} />
      </EllipsisButton>
    </div>
  );
}
