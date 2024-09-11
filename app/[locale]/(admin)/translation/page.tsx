'use client';

import ComboBox from '@/components/common/combo-box';
import GridPaginationList from '@/components/common/grid-pagination-list';
import Tran from '@/components/common/tran';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import useQueryState from '@/hooks/use-query-state';
import { Locale, locales } from '@/locales/client';
import { getTranslationDiff } from '@/query/translation';
import { Translation } from '@/types/response/Translation';

export default function Page() {
  const [language, setLanguage] = useQueryState<Locale>('language', 'en');

  return (
    <div className="space-y-4 p-4">
      <div>
        <ComboBox<Locale>
          value={{ label: language, value: language }}
          values={locales.map((locale) => ({ label: locale, value: locale }))}
          onChange={setLanguage}
        />
      </div>
      <Table>
        <TableCaption>Diff between en and {language}</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Tran text="translation.key" />
            </TableHead>
            <TableHead className="capitalize">En</TableHead>
            <TableHead className="capitalize">{language}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <GridPaginationList
            params={{ size: 20, page: 0, language }}
            queryKey={['translations']}
            getFunc={getTranslationDiff}
            loader={<></>}
            noResult={<></>}
            asChild
          >
            {(data) => <TranslationCard key={data.key} translation={data} />}
          </GridPaginationList>
        </TableBody>
      </Table>
    </div>
  );
}

type TranslationCardProps = {
  translation: Translation;
};

function TranslationCard({
  translation: { key, value },
}: TranslationCardProps) {
  return (
    <TableRow key={key}>
      <TableCell className="font-medium">{key}</TableCell>
      <TableCell>{value}</TableCell>
      <TableCell>
        <Textarea
          className="min-h-[2rem] border-none outline-none ring-0 focus-visible:outline-none focus-visible:ring-0"
          placeholder={key}
        />
      </TableCell>
    </TableRow>
  );
}
