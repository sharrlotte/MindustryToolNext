'use client';

import ComboBox from '@/components/common/combo-box';
import GridPaginationList from '@/components/common/grid-pagination-list';
import PaginationNavigator from '@/components/common/pagination-navigator';
import Tran from '@/components/common/tran';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
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
import { omit } from '@/lib/utils';
import { Locale, locales, useI18n } from '@/locales/client';
import { TranslationPaginationQuery } from '@/query/search-query';
import {
  createTranslation,
  CreateTranslationRequest,
  CreateTranslationSchema,
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

export default function Page() {
  const [mode, setMode] = useState<TranslateMode>('compare');
  const [language, setLanguage] = useQueryState<Locale>('language', 'vi');

  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <div className="flex gap-2">
        <ComboBox<Locale>
          value={{ label: language, value: language }}
          values={locales.map((locale) => ({ label: locale, value: locale }))}
          onChange={setLanguage}
        />
        <ComboBox<TranslateMode>
          value={{ label: mode, value: mode }}
          values={translateModes.map((value) => ({
            label: value,
            value,
          }))}
          onChange={(mode) => setMode(mode ?? 'compare')}
        />
        <RefreshButton />
        <AddNewKeyDialog />
      </div>
      {mode === 'compare' ? (
        <CompareTable language={language} />
      ) : (
        <DiffTable language={language} />
      )}
    </div>
  );
}

type CompareTableProps = {
  language: Locale;
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

function CompareTable({ language }: CompareTableProps) {
  const params = useSearchQuery(TranslationPaginationQuery);
  const { data } = useClientQuery({
    queryKey: [
      'translations',
      'compare',
      'total',
      omit(params, 'page', 'size'),
    ],
    queryFn: (axios) => getTranslationCompareCount(axios, params.language),
    placeholderData: 0,
  });

  return (
    <Fragment>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Tran text="translation.key" />
            </TableHead>
            <TableHead>en</TableHead>
            <TableHead>{language}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <GridPaginationList
            params={{ size: 20, page: 0, language }}
            queryKey={['translations', 'compare']}
            getFunc={getTranslationCompare}
            loader={<></>}
            noResult={<></>}
            asChild
          >
            {(data) => (
              <CompareCard
                key={data.key}
                translation={data}
                language={language}
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
};

function DiffTable({ language }: DiffTableProps) {
  const params = useSearchQuery(TranslationPaginationQuery);
  const { data } = useClientQuery({
    queryKey: ['translations', 'diff', 'total', omit(params, 'page', 'size')],
    queryFn: (axios) => getTranslationDiffCount(axios, params.language),
    placeholderData: 0,
  });

  return (
    <Fragment>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Tran text="translation.key" />
            </TableHead>
            <TableHead>EN</TableHead>
            <TableHead>{language}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <GridPaginationList
            params={{ size: 20, page: 0, language }}
            queryKey={['translations', 'diff']}
            getFunc={getTranslationDiff}
            loader={<></>}
            noResult={<></>}
            asChild
          >
            {(data) => (
              <DiffCard key={data.key} translation={data} language={language} />
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
    <TableRow key={key}>
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
};

function CompareCard({
  translation: { key, value, keyGroup },
  language,
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
    <TableRow key={key}>
      <TableCell className="align-top">{key}</TableCell>
      <TableCell className="align-top">{value['en']}</TableCell>
      <TableCell>
        <Textarea
          className="border-none p-0 outline-none ring-0 focus-visible:outline-none focus-visible:ring-0"
          defaultValue={value[language]}
          onChange={handleChange}
        />
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
