import { Metadata } from 'next';

import { getCachedServer } from '@/app/[locale]/(main)/servers/[id]/(dashboard)/action';

import Tran from '@/components/common/tran';
import Divider from '@/components/ui/divider';

import env from '@/constant/env';
import { isError } from '@/lib/error';
import { formatTitle, generateAlternate } from '@/lib/utils';

import ServerAdminList from './server-admin-list';

type Props = {
	params: Promise<{ id: string; locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { id } = await params;
	const server = await getCachedServer(id);

	if (isError(server)) {
		return { title: 'Error' };
	}

	const { name, description } = server;

	return {
		title: formatTitle(name),
		description,
		openGraph: {
			title: formatTitle(name),
			description,
			images: `${env.url.api}/servers/${id}/image`,
		},
		alternates: generateAlternate(`/servers/${id}/admin`),
	};
}

export default async function Page({ params }: Props) {
	const { id } = await params;

	return (
		<div className="bg-card rounded-md p-4 space-y-2 h-full overflow-hidden flex flex-col">
			<div className="flex gap-2 flex-col">
				<h1 className="text-xl">
					<Tran asChild text="admin" />
				</h1>
				<p className="text-muted-foreground text-sm">
					<Tran asChild text="server.admin-description" />
				</p>
			</div>
			<Divider />
			<ServerAdminList id={id} />
		</div>
	);
}
