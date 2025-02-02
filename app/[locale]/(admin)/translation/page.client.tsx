'use client';

import dynamic from 'next/dynamic';
import { ChangeEvent, Fragment, useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { debounce } from 'throttle-debounce';

import CopyButton from '@/components/button/copy-button';
import DeleteButton from '@/components/button/delete-button';
import ComboBox from '@/components/common/combo-box';
import GridPaginationList from '@/components/common/grid-pagination-list';
import { Hidden } from '@/components/common/hidden';
import PaginationNavigator from '@/components/common/pagination-navigator';
import Tran from '@/components/common/tran';
import { SearchBar, SearchInput } from '@/components/search/search-input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { EllipsisButton } from '@/components/ui/ellipsis-button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';

import useClientApi from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import { useI18n } from '@/i18n/client';
import { Locale, locales } from '@/i18n/config';
import { TranslationPaginationQuery } from '@/query/search-query';
import {
  CreateTranslationRequest,
  CreateTranslationSchema,
  createTranslation,
  deleteTranslation,
  getTranslationCompare,
  getTranslationCompareCount,
  getTranslationDiff,
  getTranslationDiffCount,
  getTranslationSearch,
  getTranslationSearchCount,
} from '@/query/translation';
import { Translation, TranslationCompare, TranslationDiff } from '@/types/response/Translation';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';

const translateModes = ['search', 'diff', 'compare'] as const;
type TranslateMode = (typeof translateModes)[number];

const defaultState: {
  isTranslated: boolean | null;
  target: Locale;
  language: Locale;
  mode: TranslateMode;
  key: string;
} = {
  target: 'vi',
  language: 'en',
  mode: 'search',
  key: '',
  isTranslated: null,
};

export default function TranslationPage() {
  const [{ language, target, mode, key, isTranslated }, _setState] = useState(defaultState);
  const { t } = useI18n();

  const setState = useCallback((value: Partial<typeof defaultState>) => _setState((prev) => ({ ...prev, ...value })), []);

  return (
    <Fragment>
      <div className="hidden h-full flex-col gap-2 p-2 landscape:flex overflow-y-auto">
        <div className="flex items-center gap-2">
          <ComboBox<TranslateMode>
            className="h-10"
            searchBar={false}
            value={{
              label: t(mode),
              value: mode as TranslateMode,
            }}
            values={translateModes.map((value) => ({
              label: t(value),
              value,
            }))}
            onChange={(mode) => setState({ mode: mode ?? 'compare' })}
          />
          <ComboBox
            className="h-10"
            searchBar={false}
            value={{ label: isTranslated + '', value: isTranslated }}
            values={[null, true, false].map((value) => ({
              label: value + '',
              value: value,
            }))}
            onChange={(value) => setState({ isTranslated: value })}
          />
          {mode === 'search' ? (
            <ComboBox<Locale>
              className="h-10"
              searchBar={false}
              value={{ label: t(target), value: target as Locale }}
              values={locales.map((locale) => ({
                label: t(locale),
                value: locale,
              }))}
              onChange={(target) => setState({ target: target ?? 'en' })}
            />
          ) : (
            <>
              {'=>'}
              <ComboBox<Locale>
                className="h-10"
                searchBar={false}
                value={{ label: t(target), value: target as Locale }}
                values={locales.map((locale) => ({
                  label: t(locale),
                  value: locale,
                }))}
                onChange={(target) => setState({ target: target ?? 'en' })}
              />
            </>
          )}

          <SearchBar>
            <SearchInput placeholder={t('translation.search-by-key')} value={key} onChange={(event) => setState({ key: event.currentTarget.value })} />
          </SearchBar>
          <RefreshButton />
          <AddNewKeyDialog />
        </div>
        {mode === 'compare' ? (
          <CompareTable language={language as Locale} target={target as Locale} tKey={key} />
        ) : mode === 'search' ? (
          <SearchTable language={language as Locale} tKey={key} isTranslated={isTranslated} />
        ) : (
          <DiffTable language={language as Locale} target={target as Locale} tKey={key} />
        )}
      </div>
      <div className="flex h-full w-full items-center justify-center landscape:hidden">
        <Tran text="translation.only-work-on-landscape" />
      </div>
    </Fragment>
  );
}

type CompareTableProps = {
  language: Locale;
  target: Locale;
  tKey?: string;
};

function RefreshButton() {
  const { invalidateByKey } = useQueriesData();

  return (
    <Button className="ml-auto h-10" variant="secondary" onClick={() => invalidateByKey(['translations'])}>
      <Tran text="translation.refresh" />
    </Button>
  );
}

function CompareTable({ language, target, tKey: key }: CompareTableProps) {
  return (
    <Fragment>
      <Table className="table-fixed">
        <TableHeader>
          <TableRow>
            <TableHead className="w-40 overflow-x-auto">
              <Tran text="translation.key-group" />
            </TableHead>
            <TableHead className="w-40 overflow-x-auto">
              <Tran text="translation.key" />
            </TableHead>
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

type SearchTableProps = {
  language: Locale;
  tKey?: string;
  isTranslated: boolean | null;
};

function SearchTable({ language, tKey: key, isTranslated }: SearchTableProps) {
  return (
    <Fragment>
      <Table className="table-fixed">
        <TableHeader>
          <TableRow>
            <TableHead className="w-40 overflow-x-auto">
              <Tran text="translation.key-group" />
            </TableHead>
            <TableHead className="w-40 overflow-x-auto">
              <Tran text="translation.key" />
            </TableHead>
            <TableHead>
              <Tran text={language} />
            </TableHead>
            <TableHead className="w-20"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <GridPaginationList
            paramSchema={TranslationPaginationQuery}
            params={{ language, key: key, target: 'en', isTranslated }}
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
      <div className="mt-auto flex justify-end">
        <PaginationNavigator numberOfItems={(axios) => getTranslationSearchCount(axios, { language, key: key })} queryKey={['translations', 'search', 'total', language, key]} />
      </div>
    </Fragment>
  );
}

type DiffTableProps = {
  language: Locale;
  target: Locale;
  tKey?: string;
};

function DiffTable({ language, target, tKey: key }: DiffTableProps) {
  return (
    <Fragment>
      <Table className="table-fixed">
        <TableHeader>
          <TableRow>
            <TableHead className="w-40 overflow-x-auto">
              <Tran text="translation.key-group" />
            </TableHead>
            <TableHead className="w-40 overflow-x-auto">
              <Tran text="translation.key" />
            </TableHead>
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

  const { mutate } = useMutation({
    mutationFn: (payload: CreateTranslationRequest) => createTranslation(axios, payload),
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
      <TableCell className="align-top">{keyGroup}</TableCell>
      <TableCell className="align-top">{key}</TableCell>
      <TableCell className="align-top">
        <CopyButton className="h-full w-full items-start justify-start overflow-hidden text-wrap p-0 hover:bg-transparent" variant="ghost" data={value} content={value}>
          {value}
        </CopyButton>
      </TableCell>
      <TableCell>
        <Textarea className="border-none p-0 outline-none ring-0 focus-visible:outline-none focus-visible:ring-0" placeholder={value} onChange={handleChange} />
      </TableCell>
    </TableRow>
  );
}

type CompareCardProps = {
  translation: TranslationCompare;
  language: Locale;
  target: Locale;
};

function CompareCard({ translation: { key, id, value, keyGroup }, language, target }: CompareCardProps) {
  const axios = useClientApi();
  const { mutate } = useMutation({
    mutationFn: (payload: CreateTranslationRequest) => createTranslation(axios, payload),
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
      <TableCell className="align-top">{keyGroup}</TableCell>
      <TableCell className="align-top"> {key}</TableCell>
      <TableCell className="align-top">
        <CopyButton className="h-full w-full items-start justify-start overflow-hidden text-wrap p-0 hover:bg-transparent" variant="ghost" data={value[language]} content={value[language]}>
          {value[language]}
        </CopyButton>
      </TableCell>
      <TableCell>
        <Textarea className="min-h-full border-none p-0 outline-none ring-0 focus-visible:outline-none focus-visible:ring-0" defaultValue={value[target]} onChange={handleChange} />
      </TableCell>
      <TableCell className="flex justify-center">
        <EllipsisButton variant="ghost">
          <DeleteTranslationDialog value={{ key, id }} />
        </EllipsisButton>
      </TableCell>
    </TableRow>
  );
}

type SearchCardProps = {
  translation: Translation;
  language: Locale;
};

function SearchCard({ translation: { key, id, value, keyGroup }, language }: SearchCardProps) {
  const axios = useClientApi();
  const { mutate } = useMutation({
    mutationFn: (payload: CreateTranslationRequest) => createTranslation(axios, payload),
  });

  const create = (event: ChangeEvent<HTMLTextAreaElement>) => {
    mutate({
      key,
      keyGroup,
      language: language,
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
      <TableCell className="align-top">{keyGroup}</TableCell>
      <TableCell className="align-top"> {key}</TableCell>
      <TableCell>
        <Textarea className="min-h-full border-none p-0 outline-none ring-0 focus-visible:outline-none focus-visible:ring-0" defaultValue={value} onChange={handleChange} />
      </TableCell>
      <TableCell className="flex justify-center">
        <EllipsisButton variant="ghost">
          <DeleteTranslationDialog value={{ key, id }} />
        </EllipsisButton>
      </TableCell>
    </TableRow>
  );
}

function AddNewKeyDialog() {
  const form = useForm<CreateTranslationRequest>({
    resolver: zodResolver(CreateTranslationSchema),
    defaultValues: {
      language: 'en',
    },
  });

  const [open, setOpen] = useState(false);

  const { invalidateByKey } = useQueriesData();
  const axios = useClientApi();

  const { mutate, isPending } = useMutation({
    mutationFn: (data: CreateTranslationRequest) => createTranslation(axios, data),
    onSuccess: () => {
      toast.success(<Tran text="upload.success" />);

      form.reset();
      setOpen(false);
    },
    onError: (error) => toast.error(<Tran text="upload.fail" />, { description: error.message }),
    onSettled: () => {
      invalidateByKey(['translations']);
    },
  });

  function handleKeyGroupChange(event: ChangeEvent<HTMLInputElement>) {
    const value = event.currentTarget.value;

    if (!value.includes('.')) {
      return form.setValue('keyGroup', value);
    }

    const parts = value.split('.');

    if (parts.length !== 2) {
      return form.setValue('keyGroup', value);
    }

    const keyGroup = parts[0];
    const key = parts[1];

    form.setValue('keyGroup', keyGroup);
    form.setValue('key', key);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-10" variant="primary" title="translation add">
          <Tran text="translation.add" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <Hidden>
            <DialogTitle />
            <DialogDescription />
          </Hidden>
          <form className="flex flex-1 flex-col justify-between space-y-4 rounded-md bg-card p-2" onSubmit={form.handleSubmit((value) => mutate(value))}>
            <FormField
              control={form.control}
              name="keyGroup"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <Tran text="translation.key-group" />
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Translation" {...field} onChange={handleKeyGroupChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="key"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <Tran text="translation.key" />
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Some cool stuff" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem className="grid">
                  <FormLabel>
                    <Tran text="translation.value" />
                  </FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-1">
              <Button variant="secondary" title="reset" onClick={() => form.reset()}>
                <Tran text="reset" />
              </Button>
              <Button variant="primary" type="submit" title="save" disabled={isPending}>
                <Tran text="save" />
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

type DeleteTranslationDialogProps = {
  value: {
    id: string;
    key: string;
  };
};

function DeleteTranslationDialog({ value: { id, key } }: DeleteTranslationDialogProps) {
  const axios = useClientApi();
  const { invalidateByKey } = useQueriesData();
  const { mutate, isPending } = useMutation({
    mutationFn: (id: string) => deleteTranslation(axios, id),
    onSuccess: () => {
      invalidateByKey(['translations']);
    },
  });

  return <DeleteButton variant="command" isLoading={isPending} description={<Tran text="translation.delete" args={{ key }} />} onClick={() => mutate(id)} />;
}

function ITranslationCardSkeleton() {
  const width = 100 + Math.random() * 100;

  return (
    <TableRow>
      <TableCell>
        <Skeleton style={{ width }} className="h-8" />
      </TableCell>
    </TableRow>
  );
}
const TranslationCardSkeleton = dynamic(() => Promise.resolve(ITranslationCardSkeleton), { ssr: false });
