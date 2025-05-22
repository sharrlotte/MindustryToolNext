'use client';

import React from 'react';

import NotificationDialog from '@/app/[locale]/(main)/notification.dialog';

import ErrorMessage from '@/components/common/error-message';
import { SettingIcon } from '@/components/common/icons';
import InternalLink from '@/components/common/internal-link';
import UserAvatar from '@/components/user/user-avatar';

import { useNavBar } from '@/context/navbar.context';
import { useSession } from '@/context/session.context';
import { isError } from '@/lib/error';
import { cn } from '@/lib/utils';

export default function MediumNavFooter() {
	const { session } = useSession();
	const { visible } = useNavBar();

	if (isError(session)) {
		return <ErrorMessage error={session} />;
	}

	return (
		<div className="mt-auto space-y-1">
			<NotificationDialog />
			<InternalLink
				className={cn('flex justify-center items-center p-1 h-9 rounded-md hover:bg-brand hover:text-brand-foreground', {
					'gap-2 justify-start py-2': visible,
				})}
				href="/users/@me/setting"
				aria-label="Setting"
			>
				<SettingIcon />
			</InternalLink>
			{session && <UserAvatar className="size-10" url="/users/@me" user={session} />}
		</div>
	);
}
