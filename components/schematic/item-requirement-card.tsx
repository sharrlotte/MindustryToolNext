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

  return (
    <section className=" flex flex-row flex-wrap gap-2">
      {requirement.map((r, index) => (
        <span key={index} className="flex flex-row items-center justify-center">
          <Image
            className="h-6 w-6"
            width={24}
            height={24}
            src={`/assets/items/item-${r.name}.png`}
            alt={r.name}
          />
          <span> {r.amount} </span>
        </span>
      ))}
    </section>
  );
}
