import Tran from '@/components/common/tran';

export default function ReportErrorForm() {
	return (
		<div className="flex flex-col gap-4">
			<a
				className="h-9 flex-1 text-nowrap rounded-md text-sm border border-border justify-center items-center px-4 py-2"
				href="https://discord.gg/DCX5yrRUyp"
				target="_blank"
				rel="noopener noreferrer"
			>
				<Tran text="report-error-at" />
			</a>
			<label htmlFor="error-report" className="text-sm font-medium text-gray-900">
				Report Error
			</label>
		</div>
	);
}
