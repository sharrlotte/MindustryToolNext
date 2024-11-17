import { serverApi } from '@/action/action';
import Me from '@/app/[locale]/(user)/users/@modal/[id]/me';
import Other from '@/app/[locale]/(user)/users/@modal/[id]/other';
import ErrorScreen from '@/components/common/error-screen';
import { isError } from '@/lib/utils';
import { getMe, getUser } from '@/query/user';

type Props = {
  params: Promise<{ id: string }>;
};

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
