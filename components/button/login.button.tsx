'use client';

import { ReactNode } from 'react';

import { LoginIcon } from '@/components/common/icons';
import InternalLink from '@/components/common/internal-link';
import Tran from '@/components/common/tran';

import { cn } from '@/lib/utils';

export default function LoginButton({ className, children }: { className?: string; children?: ReactNode }) {
	return (
		<InternalLink
			className={cn(
				'flex w-full items-center justify-center gap-1 rounded-md bg-brand text-brand-foreground p-2 text-sm',
				className,
			)}
			href="/auth/login"
		>
			{children || (
				<>
					<LoginIcon className="size-5" />
					<Tran text="login" />
				</>
			)}
		</InternalLink>
	);
}
