'use client';

import { InternalServerDetail } from '@/types/response/InternalServerDetail';
import _ from 'lodash';
import React from 'react';
import * as z from 'zod';

type Props = {
  server: InternalServerDetail;
};

const Schema = z.object({
  name: z.string(),
  description: z.string(),
});

export default function InfoEditor({ server }: Props) {
  function onSubmit() {}

  return <div className="rounded-md bg-card p-2 md:rounded-none"></div>;
}
