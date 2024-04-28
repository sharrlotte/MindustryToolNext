import DeleteButton from '@/components/button/delete-button';
import Preview from '@/components/preview/preview';
import env from '@/constant/env';
import { cn } from '@/lib/utils';
import InternalServerMap from '@/types/response/InternalServerMap';
import React from 'react';

type InternalServerMapCardProps = {
  map: InternalServerMap;
};

export default function InternalServerMapCard({
  map: { name, mapId },
}: InternalServerMapCardProps) {
  return (
    <Preview className={cn('group relative flex flex-col justify-between')}>
      <Preview.Image
        src={`${env.url.image}/maps/${mapId}.png`}
        errorSrc={`${env.url.api}/maps/${mapId}/image`}
        alt={name}
      />
      <Preview.Description>
        <Preview.Header className="h-12">{name}</Preview.Header>
        <Preview.Actions>
          <DeleteButton
            isLoading={false}
            onClick={() => {}}
            description=""
          ></DeleteButton>
        </Preview.Actions>
      </Preview.Description>
    </Preview>
  );
}
