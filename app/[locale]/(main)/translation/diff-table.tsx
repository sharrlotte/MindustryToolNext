import { Fragment, useState } from 'react';

import HighLightTranslation from '@/app/[locale]/(main)/translation/highlight-translation';
import { TranslationCardSkeleton } from '@/app/[locale]/(main)/translation/translation-card.skeleton';
import TranslationStatus from '@/app/[locale]/(main)/translation/translation-status';

import CopyButton from '@/components/button/copy.button';
import GridPaginationList from '@/components/common/grid-pagination-list';
import PaginationNavigator from '@/components/common/pagination-navigator';
import Tran from '@/components/common/tran';
import { toast } from '@/components/ui/sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';

import useClientApi from '@/hooks/use-client';
import { Locale } from '@/i18n/config';
import { clearTranslationCache } from '@/lib/utils';
import { CreateTranslationRequest, createTranslation, getTranslationDiff, getTranslationDiffCount } from '@/query/translation';
import { TranslationDiff } from '@/types/response/Translation';
import { TranslationPaginationQuery } from '@/types/schema/search-query';

import { useMutation } from '@tanstack/react-query';

type DiffTableProps = {
	language: Locale;
	target: Locale;
	tKey?: string;
};

export default function DiffTable({ language, target, tKey: key }: DiffTableProps) {
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
					</TableRow>
				</TableHeader>
				<TableBody>
					<GridPaginationList
						paramSchema={TranslationPaginationQuery}
						params={{ language, target, key: key }}
						queryKey={['translations', 'diff', language, target, key]}
						queryFn={getTranslationDiff}
						noResult={<Fragment></Fragment>}
						skeleton={{
							amount: 20,
							item: (index) => <TranslationCardSkeleton key={index} />,
						}}
						asChild
					>
						{(page) => page.map((data) => <DiffCard key={data.id} translation={data} language={target} />)}
					</GridPaginationList>
				</TableBody>
			</Table>
			<div className="mt-auto flex justify-end space-x-2">
				<PaginationNavigator
					numberOfItems={(axios) => getTranslationDiffCount(axios, { language, target, key: key })}
					queryKey={['translations', 'diff', 'total', language, target, key]}
				/>
			</div>
		</Fragment>
	);
}

type DiffCardProps = {
	translation: TranslationDiff;
	language: Locale;
};

function DiffCard({ translation, language }: DiffCardProps) {
	const { key, value, keyGroup } = translation;
	const [currentValue, setCurrentValue] = useState('');

	const axios = useClientApi();
	const [isEdit, setEdit] = useState(false);
	const { mutate, status } = useMutation({
		mutationFn: (payload: CreateTranslationRequest) => createTranslation(axios, payload),
		onError: (error) => toast.error(<Tran text="upload.fail" />, { error }),
		onSuccess: () => clearTranslationCache(),
	});

	const create = () => {
		mutate({
			key,
			keyGroup,
			language,
			value: currentValue,
		});
	};
	// eslint-disable-next-line react-hooks/exhaustive-deps

	return (
		<TableRow>
			<TableCell className="align-top">
				<CopyButton
					className="h-full w-full items-start justify-start overflow-hidden text-wrap p-0 hover:bg-transparent"
					variant="none"
					data={value}
					content={value}
				>
					<HighLightTranslation text={value} />
				</CopyButton>
				<div className="text-muted-foreground">
					<span>{keyGroup}</span>.<span>{key}</span>
				</div>
			</TableCell>
			<TableCell>
				<div className="flex items-center gap-2" onClick={() => setEdit(true)}>
					{isEdit ? ( //
						<Textarea
							className="border-transparent p-0 outline-none ring-0 focus-visible:outline-none focus-visible:ring-0"
							placeholder={currentValue ?? key}
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
		</TableRow>
	);
}
