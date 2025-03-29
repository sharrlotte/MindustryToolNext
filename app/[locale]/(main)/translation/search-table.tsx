import { LanguagesIcon } from 'lucide-react';
import dynamic from 'next/dynamic';
import { Fragment, Suspense, useCallback, useState } from 'react';
import { debounce } from 'throttle-debounce';

import HighLightTranslation from '@/app/[locale]/(main)/translation/highlight-translation';
import { TranslationCardSkeleton } from '@/app/[locale]/(main)/translation/translation-card-skeleton';
import TranslationStatus from '@/app/[locale]/(main)/translation/translation-status';

import GridPaginationList from '@/components/common/grid-pagination-list';
import PaginationNavigator from '@/components/common/pagination-navigator';
import Tran from '@/components/common/tran';
import { EllipsisButton } from '@/components/ui/ellipsis-button';
import { toast } from '@/components/ui/sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';

import useClientApi from '@/hooks/use-client';
import { Locale } from '@/i18n/config';
import { TranslationPaginationQuery } from '@/query/search-query';
import { CreateTranslationRequest, createTranslation, getTranslationSearch, getTranslationSearchCount } from '@/query/translation';
import { Translation } from '@/types/response/Translation';

import { useMutation } from '@tanstack/react-query';

const DeleteTranslationDialog = dynamic(() => import('@/app/[locale]/(main)/translation/delete-translation-dialog'));

type SearchTableProps = {
  language: Locale;
  tKey?: string;
  isTranslated: boolean | null;
};

export default function SearchTable({ language, tKey: key, isTranslated }: SearchTableProps) {
  return (
    <Fragment>
      <Table className="table-fixed">
        <TableHeader>
          <TableRow>
            <TableHead>{language && <Tran text={language} />}</TableHead>
            <TableHead className="w-20"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <GridPaginationList
            paramSchema={TranslationPaginationQuery}
            params={{ language, key, target: 'en', isTranslated }}
            queryKey={['translations', 'search', language, key, isTranslated]}
            queryFn={getTranslationSearch}
            noResult={<Fragment></Fragment>}
            skeleton={{
              amount: 20,
              item: (index) => <TranslationCardSkeleton key={index} />,
            }}
            asChild
          >
            {(data) => <SearchCard key={data.id} translation={data} language={language} />}
          </GridPaginationList>
        </TableBody>
      </Table>
      <div className="mt-auto flex justify-end space-x-2">
        <PaginationNavigator numberOfItems={(axios) => getTranslationSearchCount(axios, { language, key: key, isTranslated })} queryKey={['translations', 'search', 'total', language, key, isTranslated]} />
      </div>
    </Fragment>
  );
}

type SearchCardProps = {
  translation: Translation;
  language: Locale;
};

function SearchCard({ translation }: SearchCardProps) {
  const { key, id, value, keyGroup, isTranslated, language: translationLanguage } = translation;

  const axios = useClientApi();
  const [isEdit, setEdit] = useState(false);
  const { mutate, status } = useMutation({
    mutationFn: (payload: CreateTranslationRequest) => createTranslation(axios, payload),
    onError: (error) => toast.error(<Tran text="upload.fail" />, { description: error.message }),
  });

  const create = () => {
    mutate({
      key,
      keyGroup,
      language: translationLanguage,
      value: translation.value,
    });
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleChange = useCallback(debounce(1000, create), []);

  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-2">
          <div className="w-full" onClick={() => setEdit(true)}>
            {isEdit ? ( //
              <Textarea
                className="border-none p-0 outline-none ring-0 focus-visible:outline-none focus-visible:ring-0"
                autoFocus
                defaultValue={value ?? key}
                onChange={(event) => (translation.value = event.target.value)}
                onBlur={() => {
                  setEdit(false);
                  handleChange();
                }}
              />
            ) : (
              <HighLightTranslation text={value ?? key} />
            )}
            <div className="text-muted-foreground text-xs flex items-center gap-2">
              {!isTranslated && <LanguagesIcon />}
              <Tran className="text-nowrap" text={translationLanguage} />
              {keyGroup}.{key}
            </div>
          </div>
          <TranslationStatus status={status} />
        </div>
      </TableCell>
      <TableCell>
        <EllipsisButton variant="ghost">
          <Suspense>
            <DeleteTranslationDialog value={{ key, id }} />
          </Suspense>
        </EllipsisButton>
      </TableCell>
    </TableRow>
  );
}
