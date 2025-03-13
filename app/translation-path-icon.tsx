'use client';

import { IconNotification } from '@/components/common/icon-notification';
import { GlobIcon } from '@/components/common/icons';

import useClientQuery from '@/hooks/use-client-query';
import useLocaleStore from '@/hooks/use-current-locale';
import { getTranslationSearchCount } from '@/query/translation';

export function TranslationPathIcon() {
  const { currentLocale } = useLocaleStore();

  const { data } = useClientQuery({
    queryKey: ['translations', 'search', 'total', currentLocale],
    queryFn: (axios) =>
      getTranslationSearchCount(axios, {
        language: currentLocale,
        isTranslated: false,
      }),
    placeholderData: 0,
  });

  return (
    <IconNotification number={data}>
      <GlobIcon />
    </IconNotification>
  );
}
