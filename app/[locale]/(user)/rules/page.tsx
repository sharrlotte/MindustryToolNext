import { Metadata } from 'next';

import { translate } from '@/action/action';
import RulePage from '@/app/[locale]/(user)/rules/page.client';
import { formatTitle } from '@/lib/utils';

export async function generateMetadata(): Promise<Metadata> {
  const title = await translate('schematic');

  return {
    title: formatTitle(title),
  };
}

export default function Page() {
  return <RulePage />;
}
