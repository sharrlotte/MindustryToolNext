import { LanguagesIcon } from 'lucide-react';
import dynamic from 'next/dynamic';
import { Fragment, Suspense, useState } from 'react';

import HighLightTranslation from '@/app/[locale]/(main)/translation/highlight-translation';
import { TranslationCardSkeleton } from '@/app/[locale]/(main)/translation/translation-card.skeleton';
import TranslationStatus from '@/app/[locale]/(main)/translation/translation-status';

import GridPaginationList from '@/components/common/grid-pagination-list';
import { EditIcon } from '@/components/common/icons';
import PaginationNavigator from '@/components/common/pagination-navigator';
import ScrollContainer from '@/components/common/scroll-container';
import Tran from '@/components/common/tran';
import { EllipsisButton } from '@/components/ui/ellipsis-button';
import { toast } from '@/components/ui/sonner';
import { Textarea } from '@/components/ui/textarea';

import useClientApi from '@/hooks/use-client';
import { Locale, locales } from '@/i18n/config';
import { clearTranslationCache } from '@/lib/utils';
import { CreateTranslationRequest, createTranslation, getTranslationAll, getTranslationAllCount } from '@/query/translation';
import { TranslationAll, TranslationAllValue } from '@/types/response/Translation';
import { AllTranslationPaginationQuery } from '@/types/schema/search-query';

import { useMutation } from '@tanstack/react-query';

const DeleteTranslationDialog = dynamic(() => import('@/app/[locale]/(main)/translation/delete-translation.dialog'));

type AllTableProps = {
	tKey?: string;
};

export default function AllTable({ tKey: key }: AllTableProps) {
	return (
		<Fragment>
			<ScrollContainer className="gap-2 flex flex-col">
				<GridPaginationList
					paramSchema={AllTranslationPaginationQuery}
					params={{ key }}
					queryKey={['translations', 'all', key]}
					queryFn={getTranslationAll}
					noResult={<Fragment></Fragment>}
					skeleton={{
						amount: 20,
						item: (index) => <TranslationCardSkeleton key={index} />,
					}}
					asChild
				>
					{(page) => page.map((data) => <AllCard key={data.keyGroup + data.key} translation={data} />)}
				</GridPaginationList>
			</ScrollContainer>
			<div className="mt-auto flex justify-end space-x-2">
				<PaginationNavigator
					numberOfItems={(axios) => getTranslationAllCount(axios, { key: key })}
					queryKey={['translations', 'all', 'total', key]}
				/>
			</div>
		</Fragment>
	);
}

type AllCardProps = {
	translation: TranslationAll;
};

function AllCard({ translation }: AllCardProps) {
	const { key, value, keyGroup } = translation;

	return (
		<div className="flex flex-col gap-1 bg-card p-2 rounded-md border">
			<div className="uppercase">
				{keyGroup}.{key}
			</div>
			{locales.map((locale) => (
				<ValueCard
					key={locale}
					tKey={key}
					keyGroup={keyGroup}
					locale={locale}
					value={
						value[locale] ?? {
							id: '',
							value: key,
							isTranslated: false,
						}
					}
				/>
			))}
		</div>
	);
}

type ValueCardProps = {
	tKey: string;
	keyGroup: string;
	locale: Locale;
	value: TranslationAllValue;
};

function ValueCard({ tKey: key, keyGroup, value, locale }: ValueCardProps) {
	const [currentValue, setCurrentValue] = useState(value);
	const [isEdit, setEdit] = useState(false);
	const axios = useClientApi();

	const { mutate, status } = useMutation({
		mutationFn: (payload: CreateTranslationRequest) => createTranslation(axios, payload),
		onError: (error) => toast.error(<Tran text="upload.fail" />, { description: error?.message }),
		onSuccess: () => clearTranslationCache(),
	});

	const create = () => {
		mutate({
			key,
			keyGroup,
			language: locale,
			value: currentValue?.value ?? key,
		});
	};

	return (
		<div className="w-full flex justify-between text-xs p-2 bg-secondary rounded-md">
			<div className="flex gap-1 items-start w-full" onClick={() => setEdit(true)}>
				{currentValue.isTranslated ? <EditIcon className="size-4" /> : <LanguagesIcon />}
				<Tran className="text-nowrap text-foreground uppercase" text={locale} />
				{isEdit ? ( //
					<Textarea
						className="border-transparent p-0 outline-none ring-0 focus-visible:outline-none focus-visible:ring-0 w-full h-fit min-h-fit"
						autoFocus
						defaultValue={currentValue?.value ?? key}
						onChange={(event) => setCurrentValue((prev) => ({ ...prev, value: event.target.value }))}
						onBlur={() => {
							setEdit(false);
							create();
						}}
					/>
				) : (
					<span className="text-muted-foreground">
						<HighLightTranslation text={currentValue?.value ?? key} />
					</span>
				)}
			</div>
			<div className="flex gap-2 items-center">
				<TranslationStatus status={status} />
				{currentValue.id && (
					<EllipsisButton>
						<Suspense>
							<DeleteTranslationDialog value={{ key, id: currentValue.id }} />
						</Suspense>
					</EllipsisButton>
				)}
			</div>
		</div>
	);
}
