'use client';

import React from 'react';

import NotificationDialog from '@/app/[locale]/(main)/notification.dialog';

import { SettingIcon } from '@/components/common/icons';
import InternalLink from '@/components/common/internal-link';
import Divider from '@/components/ui/divider';
import UserAvatar from '@/components/user/user-avatar';

import { useNavBar } from '@/context/navbar.context';
import { useSession } from '@/context/session.context';
import { cn } from '@/lib/utils';

export default function MediumNavFooter() {
	const { session } = useSession();
	const { visible } = useNavBar();

	return (
		<div className="space-y-1 mt-auto">
			<Divider />
			<NotificationDialog />
			<InternalLink
				className={cn('flex h-10 items-center justify-center rounded-md p-1 hover:bg-brand hover:text-brand-foreground', {
					'justify-start gap-2 py-2': visible,
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
