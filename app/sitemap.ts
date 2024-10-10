import env from '@/constant/env';

const routes = [
  'schematics',
  'maps',
  'posts',
  'servers',
  'upload/schematic',
  'upload/map',
  'upload/post',
];

import { getMaps } from '@/query/map';
import { getSchematics } from '@/query/schematic';
import { getServerApi } from '@/action/action';
import { MetadataRoute } from 'next/dist/types';

export const revalidate = 60 * 60 * 24;

async function schematicSitemap(): Promise<MetadataRoute.Sitemap> {
  const axios = await getServerApi();
  const data = await getSchematics(axios, { page: 0, size: 100 });

  return data.map(({ id }) => ({
    url: `${env.url.base}/schematics/${id}`,
    alternates: {
      languages: Object.fromEntries(
        env.locales.map((lang) => [
          lang,
          `${env.url.base}/${lang}/schematics/${id}`,
        ]),
      ),
    },
  }));
}
async function mapSitemap(): Promise<MetadataRoute.Sitemap> {
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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [maps, schematics] = await Promise.all([
    mapSitemap(),
    schematicSitemap(),
  ]);

  const defaultSitemap: MetadataRoute.Sitemap = routes.map((route) => ({
    url: `${env.url.base}/${route}`,
    alternates: {
      languages: Object.fromEntries(
        env.locales.map((lang) => [lang, `${env.url.base}/${lang}/${route}`]),
      ),
    },
  }));

  return defaultSitemap.concat(maps).concat(schematics);
}
