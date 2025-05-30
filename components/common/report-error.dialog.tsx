import dynamic from 'next/dynamic';
import { Suspense } from 'react';

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

const ReportErrorForm = dynamic(() => import('@/components/common/report-error.form'));

export default function ReportErrorDialog() {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<span className="underline text-foreground cursor-pointer">Report Error</span>
			</DialogTrigger>
			<Suspense>
				<DialogContent>
					<ReportErrorForm />
				</DialogContent>
			</Suspense>
		</Dialog>
	);
}
