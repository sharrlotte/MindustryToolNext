'use client';

import { Suspense } from 'react';

import Tran from '@/components/common/tran';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

import dynamic from 'next/dynamic';

const ReportErrorForm = dynamic(() => import('@/components/common/report-error.form'));

export default function ReportErrorDialog({ children }: { children?: React.ReactNode }) {
	return (
		<Dialog>
			<DialogTrigger asChild>
				{children || (
					<span className="underline text-foreground cursor-pointer">
						<Tran text="report-error" />
					</span>
				)}
			</DialogTrigger>
			<Suspense>
				<DialogContent>
					<ReportErrorForm />
				</DialogContent>
			</Suspense>
		</Dialog>
	);
}
