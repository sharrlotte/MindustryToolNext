import { Metadata } from 'next';

import { translate } from '@/action/action';
import LogPage from '@/app/[locale]/(admin)/logs/page.client';
import { formatTitle } from '@/lib/utils';

export async function generateMetadata(): Promise<Metadata> {
  const title = await translate('log');

  return {
    title: formatTitle(title),
  };
}

export default function Page() {
  return <LogPage />;
}
