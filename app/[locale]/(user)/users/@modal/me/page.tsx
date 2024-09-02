import Tab from '@/app/[locale]/(user)/users/@modal/me/tab';
import getServerApi from '@/query/config/get-server-api';
import { getMe } from '@/query/user';

export default async function Page() {
  const axios = await getServerApi();
  const me = await getMe(axios);

  return <Tab me={me} />;
}
