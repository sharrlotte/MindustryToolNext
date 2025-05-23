import { useState } from 'react';
import { useInterval } from 'usehooks-ts';

import Tran from '@/components/common/tran';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type RelativeTimeProps = {
	className?: string;
	date: Date;
};

export function RelativeTime({ className, date }: RelativeTimeProps) {
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger className="w-fit p-0">
					<RelativeTimeInternal className={className} date={date} />
				</TooltipTrigger>
				<TooltipContent>{date.toLocaleString()}</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
function RelativeTimeInternal({ className, date }: RelativeTimeProps) {
	const [currentTime, setCurrentTime] = useState(Date.now());
	const target = typeof date === 'number' ? date : date.getTime();
	const delta = Math.floor((currentTime - target) / 1000); // Difference in seconds
	const tick = delta < 60 ? 1000 : 1000 * 60;

	useInterval(() => setCurrentTime(Date.now()), tick);

	if (delta < 60) {
		return <Tran className={className} text="second-ago" args={{ second: delta < 0 ? 0 : delta }} />;
	}

	if (delta < 3600) {
		const minute = Math.floor(delta / 60);
		return <Tran className={className} text="minute-ago" args={{ minute }} />;
	}

	if (delta < 86400) {
		const hour = Math.floor(delta / 3600);
		return <Tran className={className} text="hour-ago" args={{ hour }} />;
	}

	if (delta < 604800) {
		const day = Math.floor(delta / 86400);
		return <Tran className={className} text="day-ago" args={{ day }} />;
	}

	if (delta < 2592000) {
		const week = Math.floor(delta / 604800);
		return <Tran className={className} text="week-ago" args={{ week }} />;
	}

	if (delta < 31536000) {
		const month = Math.floor(delta / 2592000);
		return <Tran className={className} text="month-ago" args={{ month }} />;
	}

	const year = Math.floor(delta / 31536000);
	return <Tran className={className} text="year-ago" args={{ year }} />;
}
