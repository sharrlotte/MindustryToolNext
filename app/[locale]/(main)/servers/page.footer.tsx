'use client';

import CreateServerDialog from '@/app/[locale]/(main)/servers/create-server.dialog';

import InternalLink from '@/components/common/internal-link';
import RequireLogin from '@/components/common/require-login';
import Tran from '@/components/common/tran';

import { useSession } from '@/context/session.context';
import ProtectedElement from '@/layout/protected-element';

export default function ServerFooter({ create }: { create?: boolean }) {
	const { session } = useSession();

	return (
		<footer className="flex w-full justify-end gap-2">
			<ProtectedElement session={session} filter={true} alt={<RequireLogin />}>
				<InternalLink variant="button-secondary" href="/server-managers">
					<Tran text="server-manager" />
				</InternalLink>
				<CreateServerDialog defaultOpen={!!create} />
			</ProtectedElement>
		</footer>
	);
}
