'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

import Tran from '@/components/common/tran';
import { Button, ButtonProps } from '@/components/ui/button';

import { cn } from '@/lib/utils';

export default function BackButton({ className, children, ...props }: Omit<ButtonProps, 'title'>) {
	const router = useRouter();

	if (!children)
		return (
			<Button
				className={cn('gap-1 whitespace-nowrap text-nowrap bg-secondary', className)}
				title="back"
				variant="outline"
				{...props}
				onClick={() => router.back()}
			>
				<ArrowLeft className="size-5" />
				<Tran text="back" />
			</Button>
		);

	return (
		<Button
			className={cn('gap-1 whitespace-nowrap text-nowrap bg-secondary', className)}
			title="back"
			variant="outline"
			{...props}
			onClick={() => router.back()}
		>
			{children}
		</Button>
	);
}
