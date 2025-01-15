'use client';

import { AxiosInstance } from 'axios';
import React from 'react';

import Tran from '@/components/common/tran';

import useClientQuery from '@/hooks/use-client-query';
import { omit } from '@/lib/utils';

type Props = {
  params: any;
  queryFn: (axios: AxiosInstance, params: any) => Promise<number>;
};

export default function FoundCount({ queryFn, params }: Props) {
  const { data } = useClientQuery({
    queryKey: ['schematics', 'total', omit(params, 'page', 'size', 'sort')],
    queryFn: (axios) => queryFn(axios, params),
    placeholderData: 0,
  });

  return <Tran className="text-muted-foreground" text="found" args={{ number: data }} />;
}
