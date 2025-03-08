import { MetadataRoute } from 'next/dist/types';

import { getServerApi } from '@/action/action';
import env from '@/constant/env';
import { getImageById } from '@/lib/utils';
import { getMaps } from '@/query/map';
import { getPosts } from '@/query/post';
import { getSchematics } from '@/query/schematic';

const routes = ['schematics', 'maps', 'posts', 'servers', 'upload/schematic', 'upload/map', 'upload/post'];

async function schematicSitemap(): Promise<MetadataRoute.Sitemap> {
  const axios = await getServerApi();
  const data = await getSchematics(axios, { page: 0, size: 1000 });

  return data.map(({ id }) => ({
    url: `${env.url.base}/schematics/${id}`,
    changeFrequency: 'daily',
    lastModified: new Date(),
    priority: 1,
    images: [getImageById('schematics', id)],
    alternates: {
      languages: Object.fromEntries(env.locales.map((lang) => [lang, `${env.url.base}/${lang}/schematics/${id}`])),
    },
  }));
}
async function mapSitemap(): Promise<MetadataRoute.Sitemap> {
  const axios = await getServerApi();
  const data = await getMaps(axios, { page: 0, size: 1000 });

  return data.map(({ id }) => ({
    url: `${env.url.base}/maps/${id}`,
    changeFrequency: 'daily',
    lastModified: new Date(),
    images: [getImageById('maps', id)],
    priority: 1,
    alternates: {
      languages: Object.fromEntries(env.locales.map((lang) => [lang, `${env.url.base}/${lang}/maps/${id}`])),
    },
  }));
}

async function postSitemap(): Promise<MetadataRoute.Sitemap> {
  const axios = await getServerApi();
  const data = await getPosts(axios, { page: 0, size: 1000 });

  return data.map(({ id }) => ({
    url: `${env.url.base}/posts/${id}`,
    changeFrequency: 'daily',
    lastModified: new Date(),
    images: [getImageById('posts', id)],
    alternates: {
      priority: 1,
      languages: Object.fromEntries(env.locales.map((lang) => [lang, `${env.url.base}/${lang}/posts/${id}`])),
    },
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [maps, schematics, posts] = await Promise.all([mapSitemap(), schematicSitemap(), postSitemap()]);

  const defaultSitemap: MetadataRoute.Sitemap = routes.map((route) => ({
    url: `${env.url.base}/${route}`,
    alternates: {
      languages: Object.fromEntries(env.locales.map((lang) => [lang, `${env.url.base}/${lang}/${route}`])),
    },
  }));

  return defaultSitemap.concat(maps).concat(schematics).concat(posts);
}
