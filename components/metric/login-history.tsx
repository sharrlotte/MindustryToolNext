import ErrorScreen from '@/components/common/error-screen';
import ScrollContainer from '@/components/common/scroll-container';
import Tran from '@/components/common/tran';
import MetricWrapper from '@/components/metric/metric-wrapper';

import { serverApi } from '@/action/common';
import { isError } from '@/lib/error';
import { getLoginHistories } from '@/query/login-history';
import { UserLoginHistory } from '@/types/response/UserLoginHistory';

export default function LoginHistory() {
	return (
		<MetricWrapper>
			<LoginTable />
		</MetricWrapper>
	);
}

async function LoginTable() {
	const data = await serverApi((axios) => getLoginHistories(axios, { page: 0, size: 20 }));

	if (isError(data)) {
		return <ErrorScreen error={data} />;
	}

	return (
		<div className="flex min-h-[500px] w-full flex-col gap-2 bg-card p-2">
			<span className="font-bold">
				<Tran text="metric.user-login-history" />
			</span>
			<div>
				<ScrollContainer className="grid h-[450px] gap-2">
					{data.map((history) => (
						<LoginHistoryCard key={history.id} history={history} />
					))}
				</ScrollContainer>
			</div>
		</div>
	);
}

type LoginHistoryCardProps = {
	history: UserLoginHistory;
};

function LoginHistoryCard({ history: { id, counts, ip, userId, client, browser, os } }: LoginHistoryCardProps) {
	const username = userId ?? 'Anonymous';
	const clientType = client === 1000 ? 'web' : 'mod';

	return (
		<span className="flex justify-between gap-8 rounded-sm bg-background p-4" key={id}>
			<div className="grid gap-1">
				<span>
					User {username} ({ip})
				</span>
				<span>
					Client: {clientType} {os && `OS: ${os}`} {browser && `Browser: ${browser}`}
				</span>
			</div>
			<span>Times {counts}</span>
		</span>
	);
}
