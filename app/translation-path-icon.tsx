'use client';

import { IconNotification } from '@/components/common/icon-notification';
import { GlobIcon } from '@/components/common/icons';

import useClientQuery from '@/hooks/use-client-query';
import useLocaleStore from '@/hooks/use-current-locale';
import useSearchQuery from '@/hooks/use-search-query';
import { TranslationPaginationQuery } from '@/query/search-query';
import { getTranslationDiffCount } from '@/query/translation';

export function TranslationPathIcon() {
  const params = useSearchQuery(TranslationPaginationQuery);
  const { currentLocale } = useLocaleStore();

  if (params.language === params.target) {
    params.target = currentLocale;
  }

  const { data } = useClientQuery({
    queryKey: ['translations', 'diff', 'total', params.language, params.target],
    queryFn: (axios) => getTranslationDiffCount(axios, params),
    placeholderData: 0,
  });

  return (
    <IconNotification number={data}>
      <GlobIcon />
    </IconNotification>
  );
}
