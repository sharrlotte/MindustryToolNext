import dynamic from 'next/dynamic';
import { ChangeEvent, Fragment, useCallback, useState } from 'react';
import { debounce } from 'throttle-debounce';

import HighLightTranslation from '@/app/[locale]/(main)/translation/highlight-translation';
import { TranslationCardSkeleton } from '@/app/[locale]/(main)/translation/translation-card-skeleton';
import TranslationStatus from '@/app/[locale]/(main)/translation/translation-status';

import CopyButton from '@/components/button/copy-button';
import GridPaginationList from '@/components/common/grid-pagination-list';
import PaginationNavigator from '@/components/common/pagination-navigator';
import Tran from '@/components/common/tran';
import { EllipsisButton } from '@/components/ui/ellipsis-button';
import { toast } from '@/components/ui/sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';

import useClientApi from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import { Locale } from '@/i18n/config';
import { clearTranslationCache } from '@/lib/utils';
import { TranslationPaginationQuery } from '@/query/search-query';
import { CreateTranslationRequest, createTranslation, getTranslationCompare, getTranslationCompareCount } from '@/query/translation';
import { TranslationCompare } from '@/types/response/Translation';

import { useMutation } from '@tanstack/react-query';

const DeleteTranslationDialog = dynamic(() => import('@/app/[locale]/(main)/translation/delete-translation-dialog'));

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
      <div className="mt-auto flex justify-end">
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

function CompareCard({ translation: { key, id, value, keyGroup }, language, target }: CompareCardProps) {
  const [isEdit, setEdit] = useState(false);
  const axios = useClientApi();
  const { invalidateByKey } = useQueriesData();
  const { mutate, status } = useMutation({
    mutationFn: (payload: CreateTranslationRequest) => createTranslation(axios, payload),
    onError: (error) => toast.error(<Tran text="upload.fail" />, { description: error.message }),
    onSettled: () => {
      invalidateByKey(['translations']);
      clearTranslationCache();
    },
  });

  const create = (event: ChangeEvent<HTMLTextAreaElement>) => {
    mutate({
      key,
      keyGroup,
      language: target,
      value: event.target.value,
    });
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleChange = useCallback(
    debounce(1000, (event: ChangeEvent<HTMLTextAreaElement>) => create(event)),
    [],
  );

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
        <div className="flex items-center gap-2">
          {isEdit ? ( //
            <Textarea className="min-h-full border-none p-0 outline-none ring-0 focus-visible:outline-none focus-visible:ring-0" defaultValue={value[target] ?? key} onChange={handleChange} onBlur={() => setEdit(false)} />
          ) : (
            <div onClick={() => setEdit(true)}>
              <HighLightTranslation text={value[target]} />
            </div>
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
