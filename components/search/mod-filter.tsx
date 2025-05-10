import Image from 'next/image';
import React from 'react';

import useClientApi from '@/hooks/use-client';
import { cn } from '@/lib/utils';
import { getMods } from '@/query/mod';
import { Mod } from '@/types/response/Mod';

import { useQuery } from '@tanstack/react-query';

type Props =
	| {
			multiple?: false;
			value?: Mod;
			onValueSelected: (mod?: Mod) => void;
	  }
	| {
			multiple: true;
			value: Mod[];
			onValueSelected: (mods: Mod[]) => void;
	  };

export default function ModFilter({ multiple, value, onValueSelected }: Props) {
	const axios = useClientApi();

	const { data } = useQuery({
		queryKey: ['mods'],
		queryFn: () => getMods(axios),
	});

	const mods = data ?? [];
	return (
		<div className="flex gap-2 hover:overflow-x-auto focus:overflow-x-auto overflow-hidden w-full pb-2 h-12">
			{mods.map((mod) => (
				<ModCard
					key={mod.id}
					isSelected={multiple ? value?.some((v) => v.id === mod.id) : value?.id === mod.id}
					mod={mod}
					onValueSelected={(selected) =>
						multiple ? onValueSelected([...value, selected]) : onValueSelected(value?.id === selected.id ? undefined : selected)
					}
				/>
			))}
		</div>
	);
}

type ModCardProps = {
	mod: Mod;
	isSelected: boolean;
	onValueSelected: (mod: Mod) => void;
};
function ModCard({ mod, isSelected, onValueSelected }: ModCardProps) {
	return (
		<div
			className={cn(
				'flex gap-1 rounded-full bg-secondary p-1 pr-2 text-sm text-center items-center cursor-pointer justify-center border min-w-20 shrink-0 hover:bg-brand hover:text-brand-foreground',
				{
					'bg-brand text-brand-foreground': isSelected,
				},
			)}
			onClick={() => onValueSelected(mod)}
		>
			{mod.icon && (
				<Image
					key={mod.icon}
					width={48}
					height={48}
					className="size-8 object-cover rounded-full"
					src={mod.icon}
					loader={({ src }) => src}
					alt="preview"
				/>
			)}
			{mod.name}
		</div>
	);
}
