import Tab from '@/app/[locale]/users/@modal/me/tab';
import getServerAPI from '@/query/config/get-server-api';
import getMe from '@/query/user/get-me';

export default async function Page() {
  const { axios } = await getServerAPI();
  const me = await getMe(axios);

  return <Tab me={me} />;
}
