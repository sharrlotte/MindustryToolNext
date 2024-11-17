import { Metadata } from 'next';

import { translate } from '@/action/action';
import ChatPage from '@/app/[locale]/(user)/chat/page.client';
import { formatTitle } from '@/lib/utils';

export async function generateMetadata(): Promise<Metadata> {
  const title = await translate('chat');

  return {
    title: formatTitle(title),
  };
}

export default function Page() {
  return <ChatPage />;
}
