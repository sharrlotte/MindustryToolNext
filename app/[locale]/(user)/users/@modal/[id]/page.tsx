import Tab from '@/app/[locale]/(user)/users/@modal/[id]/tab';
import getServerApi from '@/query/config/get-server-api';
import { getUser } from '@/query/user';

export default async function Page({ params }: { params: { id: string } }) {
  const axios = await getServerApi();
  const user = await getUser(axios, params);

  return <Tab user={user} />;
}
