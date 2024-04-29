import InfoEditor from '@/app/[locale]/admin/servers/[id]/info-editor';
import getServerAPI from '@/query/config/get-server-api';
import getInternalServer from '@/query/server/get-internal-server';
import _ from 'lodash';
import React from 'react';

type PageProps = {
  params: { id: string };
};

export default async function Page({ params: { id } }: PageProps) {
  const { axios } = await getServerAPI();

  const server = await getInternalServer(axios, { id });

  return <InfoEditor server={server} />;
}
