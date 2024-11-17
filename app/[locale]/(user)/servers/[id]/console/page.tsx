import { Metadata } from 'next';

import { translate } from '@/action/action';
import ServerConsolePage from '@/app/[locale]/(user)/servers/[id]/console/page.client';
import { formatTitle } from '@/lib/utils';

export async function generateMetadata(): Promise<Metadata> {
  const title = await translate('console');

  return {
    title: formatTitle(title),
  };
}

export default function Page() {
  return <ServerConsolePage />;
}
