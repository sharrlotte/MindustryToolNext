'use client';

import { AxiosInstance } from 'axios';
import React, { ReactNode, Suspense, useMemo } from 'react';



import LoadingSpinner from '@/components/common/loading-spinner';
import NoResult from '@/components/common/no-result';

import useClientApi from '@/hooks/use-client';
import useSearchQuery from '@/hooks/use-search-query';
import { cn } from '@/lib/utils';
import { QuerySchema } from '@/types/schema/search-query';

import { QueryKey, useQuery } from '@tanstack/react-query';

import { z } from 'zod/v4';


type Props<T, P extends QuerySchema> = {
	className?: string;
	queryKey: QueryKey;
	paramSchema: P;
	params?: Omit<z.infer<P>, 'page' | 'size'>;
	loader?: ReactNode;
	noResult?: ReactNode;
	skeleton?: {
		amount: number;
		item: ReactNode | ((index: number) => ReactNode);
	};
	asChild?: boolean;
	initialData?: T[];
	initialParams?: z.infer<P>;
	queryFn: (axios: AxiosInstance, params: z.infer<P>) => Promise<T[]>;
	children: (data: T[]) => ReactNode;
};

const GridPaginationList = <T, P extends QuerySchema>({
	className,
	queryKey,
	paramSchema,
	loader,
	noResult,
	skeleton,
	asChild,
	initialData,
	initialParams,
	params,
	queryFn,
	children,
}: Props<T, P>) => {
	const p = useSearchQuery(paramSchema, params);

	const axios = useClientApi();
	const { data, error, isLoading } = useQuery({
		queryFn: () => queryFn(axios, p),
		queryKey: [p, ...queryKey],
		initialData: JSON.stringify(p) === JSON.stringify(initialParams) ? initialData : undefined,
	});

	const skeletonElements = useMemo(() => {
		if (skeleton)
			return Array(skeleton.amount)
				.fill(1)
				.map((_, index) => (
					<React.Fragment key={index}>
						{typeof skeleton.item === 'function' ? skeleton.item(index) : skeleton.item}
					</React.Fragment>
				));
	}, [skeleton]);

	noResult = useMemo(() => noResult ?? <NoResult className="flex w-full items-center justify-center" />, [noResult]);
	loader = useMemo(
		() =>
			!loader && !skeleton ? (
				<LoadingSpinner key="loading" className="col-span-full flex h-full w-full items-center justify-center" />
			) : undefined,
		[loader, skeleton],
	);

	if (asChild) {
		return (
			<Render
				isLoading={isLoading}
				loader={loader}
				skeletonElements={skeletonElements}
				error={error}
				data={data}
				noResult={noResult}
			>
				{children}
			</Render>
		);
	}

	return (
		<div className="h-full">
			<section
				className={cn(
					'grid w-full grid-cols-[repeat(auto-fill,minmax(min(var(--preview-size),100%),1fr))] justify-center gap-2',
					className,
				)}
			>
				<Suspense fallback={skeletonElements}>
					<Render
						isLoading={isLoading}
						loader={loader}
						skeletonElements={skeletonElements}
						error={error}
						data={data}
						noResult={noResult}
					>
						{children}
					</Render>
				</Suspense>
			</section>
		</div>
	);
};

type RenderProps<T> = {
	isLoading: boolean;
	loader: ReactNode;
	skeletonElements?: React.JSX.Element[];
	error: any;
	data?: T[];
	noResult: ReactNode;
	children: (data: T[]) => ReactNode;
};
function Render<T>({ isLoading, loader, skeletonElements, error, data, noResult, children }: RenderProps<T>) {
	if (isLoading) {
		return loader ? loader : skeletonElements;
	}

	if (error) {
		return (
			<div className="col-span-full flex h-full w-full justify-center">
				<LoadingSpinner message={error?.message} />
			</div>
		);
	}

	if (!data || data.length === 0) {
		return noResult;
	}

	return children(data);
}

export default GridPaginationList;
