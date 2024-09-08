import { MetadataRoute } from 'next';

import env from '@/constant/env';
import getServerApi from '@/query/config/get-server-api';
import { getMaps } from '@/query/map';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const axios = await getServerApi();
  const data = await getMaps(axios, { page: 0, size: 100 });

  return data.map(({ id }) => ({
    url: `${env.url.base}/maps/${id}`,
    alternates: {
      languages: Object.fromEntries(
        env.locales.map((lang) => [lang, `${env.url.base}/${lang}/maps/${id}`]),
      ),
    },
  }));
}
