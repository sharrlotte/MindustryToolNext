import { ChangeEvent, Fragment, useCallback, useState } from 'react';
import { debounce } from 'throttle-debounce';

import HighLightTranslation from '@/app/[locale]/(main)/translation/highlight-translation';
import { TranslationCardSkeleton } from '@/app/[locale]/(main)/translation/translation-card-skeleton';
import TranslationStatus from '@/app/[locale]/(main)/translation/translation-status';

import CopyButton from '@/components/button/copy-button';
import GridPaginationList from '@/components/common/grid-pagination-list';
import PaginationNavigator from '@/components/common/pagination-navigator';
import Tran from '@/components/common/tran';
import { toast } from '@/components/ui/sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';

import useClientApi from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import { Locale } from '@/i18n/config';
import { clearTranslationCache } from '@/lib/utils';
import { TranslationPaginationQuery } from '@/query/search-query';
import { CreateTranslationRequest, createTranslation, getTranslationDiff, getTranslationDiffCount } from '@/query/translation';
import { TranslationDiff } from '@/types/response/Translation';

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
            {(data) => <DiffCard key={data.id} translation={data} language={target} />}
          </GridPaginationList>
        </TableBody>
      </Table>
      <div className="mt-auto flex justify-end">
        <PaginationNavigator numberOfItems={(axios) => getTranslationDiffCount(axios, { language, target, key: key })} queryKey={['translations', 'diff', 'total', language, target, key]} />
      </div>
    </Fragment>
  );
}

type DiffCardProps = {
  translation: TranslationDiff;
  language: Locale;
};

function DiffCard({ translation: { key, value, keyGroup }, language }: DiffCardProps) {
  const axios = useClientApi();
  const [isEdit, setEdit] = useState(false);
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
      language,
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
        <CopyButton className="h-full w-full items-start justify-start overflow-hidden text-wrap p-0 hover:bg-transparent" variant="none" data={value} content={value}>
          <HighLightTranslation text={value} />
        </CopyButton>
        <div className="text-muted-foreground">
          <span>{keyGroup}</span>.<span>{key}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          {isEdit ? ( //
            <Textarea className="border-none p-0 outline-none ring-0 focus-visible:outline-none focus-visible:ring-0" placeholder={value ?? key} onChange={handleChange} onBlur={() => setEdit(false)} />
          ) : (
            <div onClick={() => setEdit(true)}>
              <HighLightTranslation text={value ?? key} />
            </div>
          )}
          <TranslationStatus status={status} />
        </div>
      </TableCell>
    </TableRow>
  );
}
