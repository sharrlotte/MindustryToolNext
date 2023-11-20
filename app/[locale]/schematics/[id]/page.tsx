import PreviewCard from '@/components/preview/preview-card';
import React from 'react';

export default function Page({ params }: { params: { id: string } }) {
	const { id } = params;

	return (
		<div className='p-4 grid grid-cols-[repeat(auto-fill,var(--preview-size))] w-full gap-4 justify-center'>
			<PreviewCard className='flex justify-center items-center'>{id}</PreviewCard>
		</div>
	);
}
