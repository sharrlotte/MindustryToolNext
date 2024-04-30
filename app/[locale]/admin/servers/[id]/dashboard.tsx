'use client';

import ColorText from '@/components/common/color-text';

import { Button } from '@/components/ui/button';
import { useI18n } from '@/locales/client';
import { InternalServerDetail } from '@/types/response/InternalServerDetail';
import React from 'react';

type Props = {
  server: InternalServerDetail;
};

export default function Dashboard({ server }: Props) {
  const t = useI18n();

  const { started, name, description, port, mode } = server;

  return (
    <div className="flex flex-col gap-2">
      <div className="bg-card p-2">
        <ColorText className="text-4xl" text={name} />
      </div>
      <div className="flex flex-1 flex-col gap-1 bg-card p-2">
        <div>
          <span>Description: </span>
          <ColorText text={description} />
        </div>
        <div>
          <span>Port: </span>
          <span>{port}</span>
        </div>
        <div>
          <span>Game mode: </span>
          <span>{mode}</span>
        </div>
      </div>
      <div className="flex flex-row justify-end gap-2 bg-card p-2">
        {started ? (
          <Button className="min-w-20" title="Shutdown" variant="secondary">
            Shutdown
          </Button>
        ) : (
          <Button className="min-w-20" title="Start" variant="primary">
            Start
          </Button>
        )}
      </div>
    </div>
  );
}
