import IdUserCard from '@/components/user/id-user-card';
import { getI18n } from '@/locales/server';
import Link from 'next/link';

export default async function Home() {
  const t = await getI18n();

  return (
    <div className="grid h-full overflow-y-auto bg-[url(https://mindustrygame.github.io/1.d25af17a.webp)] bg-cover bg-center p-8 pt-10 text-white">
      <section className="rounded-2xl bg-zinc-900/80 p-8 shadow-md backdrop-blur-sm">
        <span className="text-2xl">{t('home.welcome')}</span>
        <Link className="text-2xl font-medium capitalize" href="/">
          {t('website-name')}
        </Link>
        <section className="flex flex-col gap-4 p-4">
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
                href="posts/65c7a3416ae1177545c438e1"
              >
                {t('home.download-tutorial')}
              </Link>
            </li>
            <li>
              <Link
                className="text-button hover:text-button"
                href="/posts/6520298fa61f817d3a535be4"
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
                href="https://www.youtube.com/@FourGamingStudio"
                target="_blank"
                rel="noopener noreferrer"
              >
                Four Gaming Studio
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
                Schematic
              </Link>
            </li>
          </ul>
          <b>{t('home.find-map')}</b>
          <ul>
            <li>
              <Link className="text-button hover:text-button" href="/maps">
                Map
              </Link>
            </li>
          </ul>
          <b> {t('home.website-info')}</b>
          <ul className="grid grid-cols-1 items-start justify-start gap-y-2 md:grid-cols-2">
            <p className="list-item whitespace-nowrap">{t('web-owner')}</p>
            <IdUserCard id="64b63239e53d0c354d505733" />
            <p className="list-item whitespace-nowrap">{t('admin')}</p>
            <div className="grid gap-1">
              <IdUserCard id="64b6def5fa35080d51928849" />
              <IdUserCard id="64b8c74b2ab2c664a63d9f0d" />
              <IdUserCard id="64ba2279c92ba71c46dc7355" />
            </div>
            <p className="list-item whitespace-nowrap">{t('contributor')}</p>
            <IdUserCard id="64b7f3cf830ef61869872548" />
          </ul>
        </section>
      </section>
    </div>
  );
}
