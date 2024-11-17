import { Metadata } from 'next';

import { translate } from '@/action/action';
import TranslationPage from '@/app/[locale]/(admin)/translation/page.client';
import { formatTitle } from '@/lib/utils';

export async function generateMetadata(): Promise<Metadata> {
  const title = await translate('translation');

  return {
    title: formatTitle(title),
  };
}

export default function Page() {
  return <TranslationPage />;
}
