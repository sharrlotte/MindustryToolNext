import { setStaticParamsLocale } from 'next-international/server';
import Link from 'next/link';

import IdUserCard from '@/components/user/id-user-card';
import UserCard from '@/components/user/user-card';
import { getI18n } from '@/locales/server';
import getServerAPI from '@/query/config/get-server-api';
import getUsers from '@/query/user/get-users';

export const dynamicParams = false;

export default async function Home({
  params: { locale },
}: {
  params: { locale: string };
}) {
  await setStaticParamsLocale(locale);

  const t = await getI18n();
  const axios = await getServerAPI();

  const getAdmins = getUsers(axios, {
    page: 0,
    size: 20,
    role: 'ADMIN',
  });

  const getShar = getUsers(axios, {
    page: 0,
    size: 20,
    role: 'SHAR',
  });

  const getContributor = getUsers(axios, {
    page: 0,
    size: 20,
    role: 'CONTRIBUTOR',
  });

  let [shar, admins, contributors] = await Promise.all([
    getShar,
    getAdmins,
    getContributor,
  ]);

  admins = admins.filter((user) => !shar.includes(user));
  contributors = contributors.filter(
    (user) => !shar.includes(user) && !admins.includes(user),
  );

  return (
    <div className="grid h-full overflow-y-auto bg-[url(https://mindustrygame.github.io/1.d25af17a.webp)] bg-cover bg-center p-8 pt-10 text-white">
      <div className="no-scrollbar overflow-y-auto rounded-md bg-zinc-900/80 p-8 shadow-md backdrop-blur-sm">
        <div className="flex flex-wrap gap-4 p-4 md:gap-32">
          <section className="flex flex-col gap-4 p-4">
            <span className="text-2xl">{t('home.welcome')}</span>
            <Link className="text-2xl font-medium capitalize" href="/">
              {t('website-name')}
            </Link>
            <b>{t('home.download-free')}</b>
            <ul>
              <li>
                <a
                  className="text-button hover:text-button"
                  href="https://anuke.itch.io/mindustry?fbclid=IwAR2HgdkixMrQEDhcj1an_qtWnnq6YmOlm-c8VoyPsNp5bMtu5aWq_ff7K2M"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Itch.io
                </a>
              </li>
              <li>
                <Link
                  className="text-button hover:text-button"
                  href="posts/66138f77b02b7c52c1dc6281"
                >
                  {t('home.download-tutorial')}
                </Link>
              </li>
              <li>
                <Link
                  className="text-button hover:text-button"
                  href="/posts/660c1d0a078cab34e564e269"
                >
                  {t('home.play-with-friend-tutorial')}
                </Link>
              </li>
            </ul>
            <b>{t('home.community')}</b>
            <ul>
              <li>
                <a
                  className="text-button hover:text-button"
                  href="https://discord.gg/mindustry"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t('home.official-discord-server')}
                </a>
              </li>
              <li>
                <a
                  className="text-button hover:text-button"
                  href="https://discord.gg/DCX5yrRUyp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t('home.vietnamese-discord-server')}
                </a>
              </li>
              <li>
                <a
                  className="text-button hover:text-button"
                  href="https://www.reddit.com/r/Mindustry"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t('home.reddit')}
                </a>
              </li>
            </ul>
            <b>{t('home.youtube')}</b>
            <ul>
              <li>
                <a
                  className="text-button hover:text-button"
                  href="https://www.youtube.com/@FourEverNice "
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Four Ever Nice
                </a>
              </li>
              <li>
                <a
                  className="text-button hover:text-button"
                  href="http://www.youtube.com/@gezpil8397"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Gezpil
                </a>
              </li>
            </ul>
            <b>{t('home.find-schematic')}</b>
            <ul>
              <li>
                <Link
                  className="text-button hover:text-button"
                  href="/schematics"
                >
                  {t('schematic')}
                </Link>
              </li>
            </ul>
            <b>{t('home.find-map')}</b>
            <ul>
              <li>
                <Link className="text-button hover:text-button" href="/maps">
                  {t('map')}
                </Link>
              </li>
            </ul>
          </section>
          <section className="flex flex-col gap-4 p-4">
            <b> {t('home.website-info')}</b>
            <ul className="grid grid-cols-1 items-start justify-start gap-y-2 md:grid-cols-2">
              <p className="list-item whitespace-nowrap">{t('web-owner')}</p>
              <div className="grid gap-1">
                {shar.map((user) => (
                  <UserCard key={user.id} user={user} />
                ))}
              </div>
              <p className="list-item whitespace-nowrap">{t('admin')}</p>
              <div className="grid gap-1">
                {admins.map((user) => (
                  <UserCard key={user.id} user={user} />
                ))}
              </div>
              <p className="list-item whitespace-nowrap">{t('contributor')}</p>
              <div className="grid gap-1">
                {contributors.map((user) => (
                  <UserCard key={user.id} user={user} />
                ))}
              </div>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
