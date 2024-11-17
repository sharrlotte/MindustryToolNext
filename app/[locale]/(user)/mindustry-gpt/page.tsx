import { Metadata } from 'next';

import { translate } from '@/action/action';
import GptPage from '@/app/[locale]/(user)/mindustry-gpt/page.client';
import { formatTitle } from '@/lib/utils';

export async function generateMetadata(): Promise<Metadata> {
  const title = await translate('mindustry-gpt');

  return {
    title: formatTitle(title),
  };
}

export default function Page() {
  return <GptPage />;
}
