'use client';

import ErrorMessage from '@/components/common/error-message';
import InternalLink from '@/components/common/internal-link';
import { Skeleton } from '@/components/ui/skeleton';
import ColorAsRole from '@/components/user/color-as-role';
import UserAvatar from '@/components/user/user-avatar';

import useUser from '@/hooks/use-user';
import { findBestRole } from '@/lib/utils';

export default function AuthorCard({ id }: { id: string }) {
	const { data, isLoading, isError, error } = useUser(id);

	if (isLoading) {
		return (
			<div className="flex overflow-hidden gap-2 items-center h-10 min-h-10">
				<Skeleton className="rounded-full size-8" />
				<div className="space-y-1">
					<Skeleton className="w-32 h-3" />
					<Skeleton className="w-20 h-3" />
				</div>
			</div>
		);
	}

	if (isError) {
		return <ErrorMessage error={error} />;
	}

	if (!data) {
		return;
	}

	const { name, roles } = data;

	return (
		<div className="flex gap-2 min-h-10">
			<UserAvatar user={data} url />
			<InternalLink className="flex flex-col gap-0 cursor-pointer hover:underline" href={`/users/${data.id}`} prefetch={false}>
				<span>{name}</span>
				<ColorAsRole className="text-xs font-semibold capitalize" roles={roles}>
					{findBestRole(roles)?.name}
				</ColorAsRole>
			</InternalLink>
		</div>
	);
}
