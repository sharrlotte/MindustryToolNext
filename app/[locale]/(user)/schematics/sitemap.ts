import { MetadataRoute } from 'next';

import env from '@/constant/env';
import getServerApi from '@/query/config/get-server-api';
import { getSchematics } from '@/query/schematic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const axios = await getServerApi();
  const data = await getSchematics(axios, { page: 0, size: 100 });

  return data.map(({ id }) => ({
    url: `${env.url.base}/schematics/${id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 1,
    alternates: {
      languages: Object.fromEntries(
        env.locales.map((lang) => [lang, `${env.url.base}/${lang}/schematics/${id}`]),
      ),
    },
  }));
}
