import Me from '@/app/[locale]/(user)/users/@modal/[id]/me';
import Other from '@/app/[locale]/(user)/users/@modal/[id]/other';
import getServerApi from '@/query/config/get-server-api';
import { getMe, getUser } from '@/query/user';

type Props = {
  params: { id: string };
};

export default async function Page({ params: { id } }: Props) {
  const axios = await getServerApi();

  if (id === '@me') {
    const me = await getMe(axios);

    return <Me me={me} />;
  }

  const user = await getUser(axios, { id });

  return <Other user={user} />;
}
