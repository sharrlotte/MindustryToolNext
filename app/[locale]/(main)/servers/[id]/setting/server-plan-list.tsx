'use client';

import { CpuIcon, MemoryStickIcon } from 'lucide-react';

import ErrorMessage from '@/components/common/error-message';
import LoadingSpinner from '@/components/common/loading-spinner';
import Tran from '@/components/common/tran';
import { Badge } from '@/components/ui/badge';
import Divider from '@/components/ui/divider';
import { Skeleton } from '@/components/ui/skeleton';
import Skeletons from '@/components/ui/skeletons';
import { toast } from '@/components/ui/sonner';

import { revalidate } from '@/action/common';
import { useSession } from '@/context/session.context';
import useClientApi from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import { cn, hasAccess } from '@/lib/utils';
import { getServerPlans, updateServerPlan } from '@/query/server';
import Server from '@/types/response/Server';
import { ServerPlan } from '@/types/response/ServerPlan';

import { useMutation, useQuery } from '@tanstack/react-query';

type Props = {
	server: Server;
};

const colors = [
	{
		text: 'text-card-foreground',
		border: 'border-border',
		bg: 'bg-card',
		textAll: '',
	},
	{
		text: 'text-green-400',
		border: 'border-green-700',
		bg: 'bg-green-900',
		textAll: 'text-white',
	},
	{
		text: 'text-blue-400',
		border: 'border-blue-700',
		bg: 'bg-blue-900',
		textAll: 'text-white',
	},
];

export default function ServerPlanList({ server }: Props) {
	return (
		<div className="p-4 gap-4 flex-col flex">
			<div>
				<h2 className="text-xl">
					<Tran text="server.plan" asChild />
				</h2>
				<p className="text-muted-foreground">
					<Tran text="server.plan-description" defaultValue="Contact admin if you need a higher plan" asChild />
				</p>
			</div>
			<Divider />
			<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
				<Plans server={server} />
			</div>
		</div>
	);
}

function Plans({ server }: { server: Server }) {
	const axios = useClientApi();
	const { data, isLoading, isError, error } = useQuery({
		queryKey: ['server', 'plan'],
		queryFn: () => getServerPlans(axios),
	});

	if (isError) {
		return <ErrorMessage error={error} />;
	}

	if (isLoading) {
		return (
			<Skeletons number={3}>
				<Skeleton className="rounded-lg border" />
			</Skeletons>
		);
	}

	return data?.map((plan, index) => (
		<PlanCard key={plan.id} index={index} serverId={server.id} isSelected={server.planId === plan.id} plan={plan} />
	));
}

function PlanCard({
	serverId,
	plan: { id, name, cpu, ram },
	isSelected,
	index,
}: {
	serverId: string;
	index: number;
	isSelected: boolean;
	plan: ServerPlan;
}) {
	const { bg, text, border, textAll } = colors[Math.min(index, colors.length - 1)];
	const { session } = useSession();

	const canAccess = hasAccess(session, {
		authority: 'UPDATE_SERVER',
	});

	const { invalidateByKey } = useQueriesData();
	const axios = useClientApi();

	const { mutate, isPending } = useMutation({
		mutationFn: async () => updateServerPlan(axios, serverId, id),
		onError: (error) => toast.error(<Tran text="update.fail" />, { error }),
		onSettled: () => {
			invalidateByKey(['server']);
			revalidate({ path: '/[locale]/(main)/servers' });
		},
	});

	return (
		<button
			className={cn(
				'rounded-lg border p-4 grid gap-2 relative',
				border,
				bg,
				textAll,
				isSelected ? 'opacity-100' : 'opacity-50',
				canAccess ? 'cursor-pointer hover:opacity-100 hover:-translate-y-2 transition-all duration-300' : 'cursor-not-allowed',
			)}
			disabled={isPending || !hasAccess || isSelected}
			onClick={() => mutate()}
		>
			{isSelected && (
				<div className="absolute top-1 right-2">
					<Badge variant="special">
						<Tran text="server.plan-selected" asChild />
					</Badge>
				</div>
			)}
			{isPending ? (
				<LoadingSpinner />
			) : (
				<>
					<span className={cn('font-semibold text-xl text-start', text)}>{name}</span>
					<div className="flex justify-between items-center gap-4">
						<div className="flex gap-1 items-center">
							<CpuIcon className="size-4" />
							<Tran text="server.cpu" />
						</div>
						<div className="flex gap-1 items-center">
							<span>{cpu}</span>
							<span>vCpu</span>
						</div>
					</div>
					<div className="flex justify-between items-center gap-4">
						<div className="flex gap-1 items-center">
							<MemoryStickIcon className="size-4" />
							<Tran text="server.ram" />
						</div>
						<div className="flex gap-1 items-center">
							<span>{ram}</span>
							<span>MB</span>
						</div>
					</div>
				</>
			)}
		</button>
	);
}
