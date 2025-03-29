import { Metadata } from 'next';
import { cache } from 'react';

import Me from '@/app/[locale]/(main)/users/@modal/[id]/me';
import Other from '@/app/[locale]/(main)/users/@modal/[id]/other';

import ErrorScreen from '@/components/common/error-screen';

import { serverApi } from '@/action/action';
import { formatTitle, isError } from '@/lib/utils';
import { getMe, getUser } from '@/query/user';

type Props = {
  params: Promise<{ id: string }>;
};

const getCachedUser = cache((id: string) => serverApi((axios) => (id === '@me' ? getMe(axios) : getUser(axios, { id }))));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  const user = await getCachedUser(id);

  if (isError(user)) {
    return { title: 'Error' };
  }

  const { name, imageUrl, roles, stats } = user;

  const description = {
    roles: roles.map((role) => role.name).join(', '),
    stats,
  };

  return {
    title: formatTitle(name),
    description: Object.entries(description).join('\n'),
    openGraph: {
      title: name,
      description: roles.map((role) => role.name).join(', '),
      images: imageUrl ?? '',
    },
  };
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  const user = await getCachedUser(id);

  if (isError(user)) {
    return <ErrorScreen error={user} />;
  }

  return id === '@me' ? <Me me={user} /> : <Other user={user} />;
}
