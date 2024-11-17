import { Metadata } from 'next';

import { translate } from '@/action/action';
import ServerMaps from '@/app/[locale]/(user)/servers/[id]/maps/page.client';
import { formatTitle } from '@/lib/utils';

export async function generateMetadata(): Promise<Metadata> {
  const title = await translate('map');

  return {
    title: formatTitle(title),
  };
}

export default function Page() {
  return <ServerMaps />;
}
