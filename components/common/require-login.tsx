'use client';

import { ReactNode } from 'react';

import LoginButton from '@/components/button/login.button';

export default function RequireLogin(): ReactNode {
	return (
		<div className="flex cursor-pointer flex-col items-center justify-center gap-2 p-2 text-sm">
			<LoginButton className="w-fit min-w-[100px]" />
		</div>
	);
}
