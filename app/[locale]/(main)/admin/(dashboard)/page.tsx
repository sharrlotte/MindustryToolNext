import { Metadata } from 'next';
import React, { Suspense } from 'react';

import SessionList from '@/app/[locale]/(main)/admin/(dashboard)/session-list';

import ScrollContainer from '@/components/common/scroll-container';
import LoginHistory from '@/components/metric/login-history';
import LoginLog from '@/components/metric/login-log';
import { Skeleton } from '@/components/ui/skeleton';

import { Locale } from '@/i18n/config';
import { getTranslation } from '@/i18n/server';
import { cn, formatTitle, generateAlternate } from '@/lib/utils';

export const experimental_ppr = true;

const NUMBER_OF_DAY = 15;

type Props = {
	params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { locale } = await params;
	const { t } = await getTranslation(locale);
	const title = t('dashboard');

	return {
		title: formatTitle(title),
		alternates: generateAlternate('/admin'),
	};
}

export default async function Page() {
	const start = new Date();
	const end = new Date();

	end.setDate(new Date().getDate() + 1);
	end.setUTCHours(23, 59, 59, 999);

	start.setDate(new Date().getDate() - NUMBER_OF_DAY);

	return (
		<ScrollContainer className="flex h-full w-full flex-col gap-2 bg-background p-2">
			<iframe
				className="h-dvh min-h-dvh"
				src="https://analytic.mindustry-tool.com/public-dashboards/190fdc3cadd341d69076c1902a9ca7a9"
			></iframe>
			<div className="flex w-full flex-wrap gap-2">
				<div className="grid w-full grid-cols-1 gap-2 md:grid-cols-2">
					<Suspense fallback={<ChartSkeleton />}>
						<LoginLog />
					</Suspense>
					<Suspense fallback={<ChartSkeleton />}>
						<LoginHistory />
					</Suspense>
				</div>
				<div className="relative grid w-full bg-card p-2">
					<Suspense>
						<SessionList />
					</Suspense>
				</div>
			</div>
		</ScrollContainer>
	);
}

function ChartSkeleton({ className }: { className?: string }) {
	return (
		<div className={cn('flex aspect-video h-full w-full flex-col gap-2 bg-card', className)}>
			<Skeleton className="h-full w-full" />
		</div>
	);
}
