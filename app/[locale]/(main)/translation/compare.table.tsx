import dynamic from 'next/dynamic';
import { Fragment, useState } from 'react';

import HighLightTranslation from '@/app/[locale]/(main)/translation/highlight-translation';
import { TranslationCardSkeleton } from '@/app/[locale]/(main)/translation/translation-card.skeleton';
import TranslationStatus from '@/app/[locale]/(main)/translation/translation-status';

import CopyButton from '@/components/button/copy.button';
import GridPaginationList from '@/components/common/grid-pagination-list';
import PaginationNavigator from '@/components/common/pagination-navigator';
import Tran from '@/components/common/tran';
import { EllipsisButton } from '@/components/ui/ellipsis-button';
import { toast } from '@/components/ui/sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';

import useClientApi from '@/hooks/use-client';
import { Locale } from '@/i18n/config';
import { CreateTranslationRequest, createTranslation, getTranslationCompare, getTranslationCompareCount } from '@/query/translation';
import { TranslationCompare } from '@/types/response/Translation';
import { TranslationPaginationQuery } from '@/types/schema/search-query';

import { useMutation } from '@tanstack/react-query';

const DeleteTranslationDialog = dynamic(() => import('@/app/[locale]/(main)/translation/delete-translation.dialog'));

type CompareTableProps = {
	language: Locale;
	target: Locale;
	tKey?: string;
};

export default function CompareTable({ language, target, tKey: key }: CompareTableProps) {
	return (
		<Fragment>
			<Table className="table-fixed">
				<TableHeader>
					<TableRow>
						<TableHead>
							<Tran text={language} />
						</TableHead>
						<TableHead>
							<Tran text={target} />
						</TableHead>

						<TableHead className="w-20"></TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					<GridPaginationList
						paramSchema={TranslationPaginationQuery}
						params={{ language, target, key: key }}
						queryKey={['translations', 'compare', language, target, key]}
						queryFn={getTranslationCompare}
						noResult={<Fragment></Fragment>}
						skeleton={{
							amount: 20,
							item: (index) => <TranslationCardSkeleton key={index} />,
						}}
						asChild
					>
						{(data) => <CompareCard key={data.id} translation={data} language={language} target={target} />}
					</GridPaginationList>
				</TableBody>
			</Table>
			<div className="mt-auto flex justify-end space-x-2">
				<PaginationNavigator numberOfItems={(axios) => getTranslationCompareCount(axios, { language, target, key: key })} queryKey={['translations', 'compare', 'total', language, target, key]} />
			</div>
		</Fragment>
	);
}

type CompareCardProps = {
	translation: TranslationCompare;
	language: Locale;
	target: Locale;
};

function CompareCard({ translation, language, target }: CompareCardProps) {
	const { key, id, value, keyGroup } = translation;
	const [currentValue, setCurrentValue] = useState(value[language]);

	const [isEdit, setEdit] = useState(false);
	const axios = useClientApi();
	const { mutate, status } = useMutation({
		mutationFn: (payload: CreateTranslationRequest) => createTranslation(axios, payload),
		onError: (error) => toast.error(<Tran text="upload.fail" />, { description: error.message }),
	});

	const create = () => {
		mutate({
			key,
			keyGroup,
			language: target,
			value: currentValue,
		});
	};

	return (
		<TableRow>
			<TableCell className="align-top">
				<CopyButton className="h-full w-full items-start justify-start overflow-hidden text-wrap p-0 hover:bg-transparent" variant="none" data={value[language]} content={value[language]}>
					<HighLightTranslation text={value[language]} />
				</CopyButton>
				<div className="text-muted-foreground">
					<span>{keyGroup}</span>.<span>{key}</span>
				</div>
			</TableCell>
			<TableCell>
				<div className="flex items-center gap-2" onClick={() => setEdit(true)}>
					{isEdit ? ( //
						<Textarea
							className="min-h-full border-transparent p-0 outline-none ring-0 focus-visible:outline-none focus-visible:ring-0"
							defaultValue={currentValue ?? key}
							onChange={(event) => setCurrentValue(event.target.value)}
							onBlur={() => {
								setEdit(false);
								create();
							}}
						/>
					) : (
						<HighLightTranslation text={currentValue ?? key} />
					)}
					<TranslationStatus status={status} />
				</div>
			</TableCell>
			<TableCell className="flex justify-center">
				<EllipsisButton variant="ghost">
					<DeleteTranslationDialog value={{ key, id }} />
				</EllipsisButton>
			</TableCell>
		</TableRow>
	);
}
