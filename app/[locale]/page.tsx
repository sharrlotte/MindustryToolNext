import { setStaticParamsLocale } from 'next-international/server';
import Link from 'next/link';
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

  const [shar, admins, contributors] = await Promise.all([
    getShar,
    getAdmins,
    getContributor,
  ]);

  const onlyAdmins = admins.filter((user) => !shar.includes(user));
  const onlyContributors = contributors.filter(
    (user) => !shar.includes(user) && !admins.includes(user),
  );

  return (
    <div className="flex h-full overflow-y-auto bg-[url(https://mindustrygame.github.io/1.d25af17a.webp)] bg-cover bg-center p-8 text-white">
      <div className="flex flex-col no-scrollbar overflow-y-auto rounded-md bg-zinc-900/80 p-8 shadow-md backdrop-blur-sm w-full max-w-5xl mx-auto">
        <h1 className="flex mb-5 w-full text-center justify-center text-3xl">{t('home-hero-title')}</h1>
        <h3 className="flex px-5 mb-7 text-center text-xl">{t('home-hero-infomation')}</h3>

        <div className="flex flex-col md:flex-row mb-7">
          <div className="flex w-[calc(100%-12px)] md:w-1/2 flex-col m-3">
            <h1 className="flex mb-2.5 w-full justify-center text-2xl">{t('home-content-what-is-mindustry')}</h1>
            <h5 className="mt-2.5 mx-1.5 mb-2.5 text-center">{t('home-content-about-mindustry')}</h5>
            <h3 className="flex w-full justify-center text-center mb-1.5 text-xl">{t('home-content-platform-info')}</h3>
            <h5 className="flex w-full justify-center text-center mb-2.5">{t('home-content-platform')}</h5>
          </div>
          <div className="flex justify-center w-full md:w-1/2 h-[40vw] md:h-[20vw]">
            <iframe src={`https://www.youtube.com/embed/gUu3AhqpyHo`} className='w-[100%] h-[100%]' allowFullScreen></iframe>
          </div>
        </div>

        <div className="flex flex-col md:flex-row w-full">
          <div className="flex w-full md:w-1/2 flex-col">
            <h1 className="flex ml-12 mb-2.5 text-xl">{t('home-content-recommended-article')}</h1>
            <ul className="flex flex-col mb-5">
              <li>
                <Link className="text-brand hover:text-brand text-lg" href="posts/e7610862-bf57-4ab0-9204-ae7a4a31d41b">
                  {t('home.download-tutorial')}
                </Link>
              </li>
              <li>
                <Link className="text-brand hover:text-brand text-lg" href="/posts/fa6c9516-7b98-428d-9129-c86aa40ea3d6">
                  {t('home.play-with-friend-tutorial')}
                </Link>
              </li>
            </ul>

            <h1 className="flex ml-12 mb-2.5 text-xl">{t('home.community')}</h1>
            <ul className="flex flex-col mb-5">
              <li>
                <a className="text-brand hover:text-brand text-lg" href="https://discord.gg/mindustry" target="_blank" rel="noopener noreferrer">
                  {t('home.official-discord-server')}
                </a>
              </li>
              <li>
                <a className="text-brand hover:text-brand text-lg" href="https://discord.gg/DCX5yrRUyp" target="_blank" rel="noopener noreferrer">
                  {t('home.vietnamese-discord-server')}
                </a>
              </li>
              <li>
                <a className="text-brand hover:text-brand text-lg" href="https://www.reddit.com/r/Mindustry" target="_blank" rel="noopener noreferrer">
                  {t('home.reddit')}
                </a>
              </li>
            </ul>

            <h1 className="flex ml-12 mb-2.5 text-xl">{t('home.youtube')}</h1>
            <ul className="flex flex-col mb-5">
              <li>
                <a className="text-brand hover:text-brand text-lg" href="https://www.youtube.com/@FourEverNice" target="_blank" rel="noopener noreferrer">
                  Four Ever Nice
                </a>
              </li>
              <li>
                <a className="text-brand hover:text-brand text-lg" href="http://www.youtube.com/@gezpil8397" target="_blank" rel="noopener noreferrer">
                  Gezpil
                </a>
              </li>
            </ul>
          </div>

          <div className="flex w-full md:w-1/2 flex-col">
            <h1 className="flex ml-12 mb-5 text-xl">{t('home.website-info')}</h1>
            <ul className="grid grid-cols-1 items-start justify-start gap-y-2 md:grid-cols-2">
              <p className="list-item whitespace-nowrap">{t('web-owner')}</p>
              <div className="grid gap-1">
                {shar.map((user) => (
                  <UserCard key={user.id} user={user} />
                ))}
              </div>
              <p className="list-item whitespace-nowrap">{t('admin')}</p>
              <div className="grid gap-1">
                {onlyAdmins.map((user) => (
                  <UserCard key={user.id} user={user} />
                ))}
              </div>
              <p className="list-item whitespace-nowrap">{t('contributor')}</p>
              <div className="grid gap-1">
                {onlyContributors.map((user) => (
                  <UserCard key={user.id} user={user} />
                ))}
              </div>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
