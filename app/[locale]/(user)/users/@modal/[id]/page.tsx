import { Metadata } from 'next';

import Me from '@/app/[locale]/(user)/users/@modal/[id]/me';
import Other from '@/app/[locale]/(user)/users/@modal/[id]/other';

import ErrorScreen from '@/components/common/error-screen';

import { serverApi } from '@/action/action';
import { formatTitle, isError } from '@/lib/utils';
import { getMe, getUser } from '@/query/user';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  if (id === '@me') {
    const me = await serverApi((axios) => getMe(axios));

    if (isError(me)) {
      return { title: 'Error' };
    }

    const { name, imageUrl, roles, stats } = me;

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

  const user = await serverApi((axios) => getUser(axios, { id }));

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

  if (id === '@me') {
    const me = await serverApi((axios) => getMe(axios));

    if (isError(me)) {
      return <ErrorScreen error={me} />;
    }

    return <Me me={me} />;
  }

  const user = await serverApi((axios) => getUser(axios, { id }));

  if (isError(user)) {
    return <ErrorScreen error={user} />;
  }

  return <Other user={user} />;
}
