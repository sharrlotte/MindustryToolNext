import Tab from '@/app/[locale]/(user)/users/@modal/[id]/tab';
import getServerAPI from '@/query/config/get-server-api';
import getUser from '@/query/user/get-user';

export default async function Page({ params }: { params: { id: string } }) {
  const axios = await getServerAPI();
  const user = await getUser(axios, params);

  return <Tab user={user} />;
}
