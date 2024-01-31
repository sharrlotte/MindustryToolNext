import { ItemRequirement } from '@/types/response/ItemRequirement';
import Image from 'next/image';
import React from 'react';

interface ItemRequirementCardProps {
  requirement: ItemRequirement[];
}

export default function ItemRequirementCard({
  requirement,
}: ItemRequirementCardProps) {
  if (!requirement) return <></>;

  return <></>;
  // return (
  // 	<section className=' flex flex-row flex-wrap gap-2'>
  // 		{requirement.map((r, index) => (
  // 			<span key={index} className='flex flex-row justify-center items-center'>
  // 				<Image className='h-4 w-4' src={`/assets/images/items/item-${r.name}.png`} alt={r.name} />
  // 				<span> {r.amount} </span>
  // 			</span>
  // 		))}
  // 	</section>
  // );
}
