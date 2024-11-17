import { Metadata } from 'next';

import { translate } from '@/action/action';
import ServerPluginPage from '@/app/[locale]/(user)/servers/[id]/plugins/page.client';
import { formatTitle } from '@/lib/utils';

export async function generateMetadata(): Promise<Metadata> {
  const title = await translate('plugin');

  return {
    title: formatTitle(title),
  };
}

export default function Page() {
  return <ServerPluginPage />;
}
