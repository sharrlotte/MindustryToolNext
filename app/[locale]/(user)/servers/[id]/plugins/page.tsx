import { Metadata } from 'next';

import AddPluginDialog from '@/app/[locale]/(user)/servers/[id]/plugins/add-plugin-dialog';
import ServerPluginPage from '@/app/[locale]/(user)/servers/[id]/plugins/page.client';

import { Locale } from '@/i18n/config';
import { getTranslation } from '@/i18n/server';
import { formatTitle } from '@/lib/utils';

type Props = {
  params: Promise<{
    locale: Locale;
    id: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const { t } = await getTranslation(locale);
  const title = await t('plugin');

  return {
    title: formatTitle(title),
  };
}

export default async function Page({ params }: Props) {
  const { id } = await params;

  return (
    <div className="flex flex-col gap-2 overflow-hidden h-full">
      <div className=" flex h-14 items-center justify-end bg-card rounded-md p-2">
        <AddPluginDialog serverId={id} />
      </div>
      <ServerPluginPage id={id} />
    </div>
  );
}
