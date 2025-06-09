'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';

import CreateModDialog from '@/app/[locale]/(main)/admin/setting/mods/create-mod.dialog';

import ErrorMessage from '@/components/common/error-message';
import LoadingSpinner from '@/components/common/loading-spinner';
import { EllipsisButton } from '@/components/ui/ellipsis-button';

import useClientApi from '@/hooks/use-client';
import { getMods } from '@/query/mod';
import { Mod } from '@/types/response/Mod';

import { useQuery } from '@tanstack/react-query';

const DeleteModDialog = dynamic(() => import('@/app/[locale]/(main)/admin/setting/mods/delete-mod.dialog'));
const UpdateModDialog = dynamic(() => import('@/app/[locale]/(main)/admin/setting/mods/update-mod.dialog'));

export default function Page() {
	return (
		<div className="flex flex-col gap-2 w-full h-full overflow-hidden p-2">
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

	if (isError) {
		return <ErrorMessage error={error} />;
	}

	return (
		<section className="overflow-y-auto grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 xl:grid-cols-4 gap-2">
			{data?.map((mod) => <ModCard key={mod.id} mod={mod} />)}
		</section>
	);
}

type ModCardProps = {
	mod: Mod;
};

function ModCard({ mod }: ModCardProps) {
	const { name, icon } = mod;

	return (
		<div className="bg-card rounded-lg overflow-hidden gap-2 w-full flex justify-between items-center p-2 border h-14">
			{icon && (
				<Image
					width={48}
					height={48}
					className="size-12 object-cover overflow-hidden rounded-lg aspect-square shrink-0"
					src={icon}
					alt={name}
				/>
			)}
			<h2 className="w-full text-xl text-ellipsis overflow-hidden text-wrap">{name}</h2>
			<EllipsisButton variant="ghost">
				<UpdateModDialog mod={mod} />
				<DeleteModDialog mod={mod} />
			</EllipsisButton>
		</div>
	);
}
