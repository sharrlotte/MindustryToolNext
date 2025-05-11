import { Metadata } from 'next';

import ServerConsolePage from '@/app/[locale]/(main)/servers/[id]/console/page.client';

import ChatInput from '@/components/messages/chat-input';

import { Locale } from '@/i18n/config';
import { getTranslation } from '@/i18n/server';
import { formatTitle, generateAlternate } from '@/lib/utils';

type Props = {
	params: Promise<{
		locale: Locale;
		id: string;
	}>;
};
export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { id, locale } = await params;
	const { t } = await getTranslation(locale);
	const title = t('console');

	return {
		title: formatTitle(title),
		alternates: generateAlternate(`/servers/${id}/console`),
	};
}

export default async function Page({ params }: Props) {
	const { id } = await params;

	return (
		<div className="grid h-full w-full grid-rows-[1fr_auto] overflow-hidden">
			<div className="grid h-full w-full overflow-hidden">
				<div className="flex h-full flex-col gap-1 overflow-x-hidden bg-card rounded-lg">
					<ServerConsolePage />
				</div>
			</div>
			<ChatInput room={`SERVER-${id}`} placeholder="/help" />
		</div>
	);
}
