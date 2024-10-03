'use client';

import DeleteButton from '@/components/button/delete-button';
import ComboBox from '@/components/common/combo-box';
import GridPaginationList from '@/components/common/grid-pagination-list';
import PaginationNavigator from '@/components/common/pagination-navigator';
import Tran from '@/components/common/tran';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { EllipsisButton } from '@/components/ui/ellipsis-button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import useClientApi from '@/hooks/use-client';
import useClientQuery from '@/hooks/use-client-query';
import useQueriesData from '@/hooks/use-queries-data';
import useQueryState from '@/hooks/use-query-state';
import useSearchQuery from '@/hooks/use-search-query';
import { useToast } from '@/hooks/use-toast';
import { useI18n } from '@/i18n/client';
import { Locale, locales } from '@/i18n/config';
import { omit } from '@/lib/utils';
import { TranslationPaginationQuery } from '@/query/search-query';
import {
  createTranslation,
  CreateTranslationRequest,
  CreateTranslationSchema,
  deleteTranslation,
  getTranslationCompare,
  getTranslationCompareCount,
  getTranslationDiff,
  getTranslationDiffCount,
} from '@/query/translation';
import {
  TranslationCompare,
  TranslationDiff,
} from '@/types/response/Translation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { debounce } from 'lodash';
import { ChangeEvent, Fragment, useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';

const translateModes = ['diff', 'compare'] as const;
type TranslateMode = (typeof translateModes)[number];

const defaultState = {
  target: 'vi',
  language: 'en',
  mode: 'compare',
  key: '',
};

export default function Page() {
  const [{ language, target, mode, key }, setQueryState] =
    useQueryState(defaultState);
  const t = useI18n();

  return (
    <Fragment>
      <div className="hidden h-full flex-col gap-4 p-4 landscape:flex">
        <div className="flex items-center gap-2">
          <ComboBox<Locale>
            value={{ label: t(language), value: language as Locale }}
            values={locales.map((locale) => ({
              label: t(locale),
              value: locale,
            }))}
            onChange={(language) =>
              setQueryState({ language: language ?? 'en' })
            }
          />
          {'=>'}
          <ComboBox<Locale>
            value={{ label: t(target), value: target as Locale }}
            values={locales.map((locale) => ({
              label: t(locale),
              value: locale,
            }))}
            onChange={(target) => setQueryState({ target: target ?? 'en' })}
          />
          <ComboBox<TranslateMode>
            value={{
              label: t(`translation.${mode}`),
              value: mode as TranslateMode,
            }}
            values={translateModes.map((value) => ({
              label: t(`translation.${value}`),
              value,
            }))}
            onChange={(mode) => setQueryState({ mode: mode ?? 'compare' })}
          />
          <Input
            placeholder={t('translation.search-by-key')}
            value={key}
            onChange={(event) =>
              setQueryState({ key: event.currentTarget.value })
            }
          />
          <RefreshButton />
          <AddNewKeyDialog />
        </div>
        {mode === 'compare' ? (
          <CompareTable
            language={language as Locale}
            target={target as Locale}
          />
        ) : (
          <DiffTable language={language as Locale} target={target as Locale} />
        )}
      </div>
      <div className="flex h-full w-full items-center justify-center">
        <Tran text="translation.only-work-on-landscape" />
      </div>
    </Fragment>
  );
}

type CompareTableProps = {
  language: Locale;
  target: Locale;
};

function RefreshButton() {
  const { invalidateByKey } = useQueriesData();

  return (
    <Button
      className="ml-auto"
      onClick={() => invalidateByKey(['translations'])}
    >
      <Tran text="translation.refresh" />
    </Button>
  );
}

function CompareTable({ language, target }: CompareTableProps) {
  const params = useSearchQuery(TranslationPaginationQuery);
  const { data } = useClientQuery({
    queryKey: [
      'translations',
      'compare',
      'total',
      omit(params, 'page', 'size'),
    ],
    queryFn: (axios) => getTranslationCompareCount(axios, params),
    placeholderData: 0,
  });

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
            <TableHead>{language}</TableHead>
            <TableHead>{target}</TableHead>
            <TableHead className="w-20"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <GridPaginationList
            params={{ ...params, size: 20, language }}
            queryKey={['translations', 'compare', language]}
            getFunc={getTranslationCompare}
            loader={<Fragment></Fragment>}
            noResult={<Fragment></Fragment>}
            skeleton={{
              amount: 20,
              item: (index) => <TranslationCardSkeleton key={index} />,
            }}
            asChild
          >
            {(data) => (
              <CompareCard
                key={data.id}
                translation={data}
                language={language}
                target={target}
              />
            )}
          </GridPaginationList>
        </TableBody>
      </Table>
      <div className="mt-auto flex justify-end">
        <PaginationNavigator numberOfItems={data} />
      </div>
    </Fragment>
  );
}

type DiffTableProps = {
  language: Locale;
  target: Locale;
};

function DiffTable({ language, target }: DiffTableProps) {
  const params = useSearchQuery(TranslationPaginationQuery);
  const { data } = useClientQuery({
    queryKey: ['translations', 'diff', 'total', omit(params, 'page', 'size')],
    queryFn: (axios) => getTranslationDiffCount(axios, params),
    placeholderData: 0,
  });

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
            <TableHead>{language}</TableHead>
            <TableHead>{target}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <GridPaginationList
            params={{ ...params, size: 20, language }}
            queryKey={['translations', 'diff', language]}
            getFunc={getTranslationDiff}
            loader={<Fragment></Fragment>}
            noResult={<Fragment></Fragment>}
            skeleton={{
              amount: 20,
              item: (index) => <TranslationCardSkeleton key={index} />,
            }}
            asChild
          >
            {(data) => (
              <DiffCard key={data.id} translation={data} language={language} />
            )}
          </GridPaginationList>
        </TableBody>
      </Table>
      <div className="mt-auto flex justify-end">
        <PaginationNavigator numberOfItems={data} />
      </div>
    </Fragment>
  );
}

type DiffCardProps = {
  translation: TranslationDiff;
  language: Locale;
};

function DiffCard({
  translation: { key, value, keyGroup },
  language,
}: DiffCardProps) {
  const axios = useClientApi();

  const { mutate } = useMutation({
    mutationFn: (payload: CreateTranslationRequest) =>
      createTranslation(axios, payload),
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
    debounce((event: ChangeEvent<HTMLTextAreaElement>) => create(event), 1000),
    [],
  );

  return (
    <TableRow>
      <TableCell className="align-top">{keyGroup}</TableCell>
      <TableCell className="align-top">{key}</TableCell>
      <TableCell className="align-top">{value}</TableCell>
      <TableCell>
        <Textarea
          className="border-none p-0 outline-none ring-0 focus-visible:outline-none focus-visible:ring-0"
          placeholder={value}
          onChange={handleChange}
        />
      </TableCell>
    </TableRow>
  );
}

type CompareCardProps = {
  translation: TranslationCompare;
  language: Locale;
  target: Locale;
};

function CompareCard({
  translation: { key, id, value, keyGroup },
  language,
  target,
}: CompareCardProps) {
  const axios = useClientApi();
  const { mutate } = useMutation({
    mutationFn: (payload: CreateTranslationRequest) =>
      createTranslation(axios, payload),
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
    debounce((event: ChangeEvent<HTMLTextAreaElement>) => create(event), 1000),
    [],
  );

  return (
    <TableRow>
      <TableCell className="align-top">{keyGroup}</TableCell>
      <TableCell className="align-top">{key}</TableCell>
      <TableCell className="align-top">{value[language]}</TableCell>
      <TableCell>
        <Textarea
          className="border-none p-0 outline-none ring-0 focus-visible:outline-none focus-visible:ring-0"
          defaultValue={value[target]}
          onChange={handleChange}
        />
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
  const t = useI18n();
  const form = useForm<CreateTranslationRequest>({
    resolver: zodResolver(CreateTranslationSchema),
    defaultValues: {
      language: 'en',
    },
  });

  const [open, setOpen] = useState(false);

  const { invalidateByKey } = useQueriesData();
  const axios = useClientApi();
  const { toast } = useToast();

  const { mutate, isPending } = useMutation({
    mutationFn: (data: CreateTranslationRequest) =>
      createTranslation(axios, data),
    onSuccess: () => {
      toast({
        title: t('upload.success'),
        variant: 'success',
      });
      form.reset();
      setOpen(false);
    },
    onError: (error) =>
      toast({
        title: t('upload.fail'),
        description: error.message,
        variant: 'destructive',
      }),
    onSettled: () => {
      invalidateByKey(['translations']);
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="primary" title={t('translation.add')}>
          <Tran text="translation.add" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form
            className="flex flex-1 flex-col justify-between space-y-4 rounded-md bg-card p-4"
            onSubmit={form.handleSubmit((value) => mutate(value))}
          >
            <FormField
              control={form.control}
              name="keyGroup"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <Tran text="translation.key-group" />
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Translation" {...field} />
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
              <Button
                variant="secondary"
                title={t('reset')}
                onClick={() => form.reset()}
              >
                {t('reset')}
              </Button>
              <Button
                variant="primary"
                type="submit"
                title={t('save')}
                disabled={isPending}
              >
                {t('save')}
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

function DeleteTranslationDialog({
  value: { id, key },
}: DeleteTranslationDialogProps) {
  const axios = useClientApi();
  const { invalidateByKey } = useQueriesData();
  const { mutate, isPending } = useMutation({
    mutationFn: (id: string) => deleteTranslation(axios, id),
    onSuccess: () => {
      invalidateByKey(['translations']);
    },
  });

  return (
    <DeleteButton
      variant="command"
      isLoading={isPending}
      description={`Delete ${key}`}
      onClick={() => mutate(id)}
    />
  );
}

function TranslationCardSkeleton() {
  const width = 10 + Math.random() * 10;

  console.log('card');

  return (
    <TableRow>
      <TableCell>
        <Skeleton style={{ width }} className="h-8" />
      </TableCell>
    </TableRow>
  );
}
