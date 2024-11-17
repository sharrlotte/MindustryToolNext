import { Metadata } from 'next';

import { translate } from '@/action/action';
import RatioPage from '@/app/[locale]/(user)/ratio/page.client';
import { formatTitle } from '@/lib/utils';

export async function generateMetadata(): Promise<Metadata> {
  const title = await translate('ratio');

  return {
    title: formatTitle(title),
  };
}

export default function Page() {
  return <RatioPage />;
}
