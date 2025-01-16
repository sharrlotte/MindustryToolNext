import { Metadata } from 'next';
import Link from 'next/link';
import 'server-only';

import { HomeMapPreview, HomeSchematicPreview, HomeServerPreview, InformationGroup, OnlineDisplay } from '@/app/[locale]/home';

import Ads from '@/components/common/ads';
import { DiscordIcon, FacebookIcon, GithubIcon } from '@/components/common/icons';
import InternalLink from '@/components/common/internal-link';
import ServerTran from '@/components/common/server-tran';

import { Locale } from '@/i18n/config';
import { getTranslation } from '@/i18n/server';
import { formatTitle } from '@/lib/utils';

export const experimental_ppr = true;

type Props = {
  params: Promise<{
    locale: Locale;
  }>;
};

const youtubeLinks = [
  { href: 'https://www.youtube.com/@FourEverNice', text: 'Four Ever Nice' },
  { href: 'http://www.youtube.com/@gezpil8397', text: 'Gezpil' },
];

const relativeLinks = [
  { href: 'https://discord.gg/mindustry', text: 'home.official-discord-server' },
  { href: 'https://discord.gg/nQDrEHVkrt', text: 'home.mindustry-tool-discord-server' },
  { href: 'https://discord.gg/DCX5yrRUyp', text: 'home.vietnamese-discord-server' },
  { href: 'https://www.reddit.com/r/Mindustry', text: 'home.reddit' },
  { href: 'https://mindustrygame.github.io/wiki/', text: 'home.mindustry-wiki' },
  { href: 'https://github.com/Anuken/Mindustry', text: 'home.mindustry-github' },
];
const postLinks = [
  { href: 'posts/e7610862-bf57-4ab0-9204-ae7a4a31d41b', text: 'home.download-tutorial' },
  { href: '/posts/fa6c9516-7b98-428d-9129-c86aa40ea3d6', text: 'home.play-with-friend-tutorial' },
];

const heroTexts = [
  { title: 'home.about-mindustry', content: 'home.content-about-mindustry' },
  { title: 'home.content-platform-info', content: 'home.content-platform' },
  { title: 'home.mindustry-tool-about', content: 'home.mindustry-tool-description' },
];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const { t } = await getTranslation(locale);
  const title = await t('home');

  return {
    title: formatTitle(title),
  };
}

const SectionTitle = ({ text, locale }: { text: string; locale: Locale }) => (
  <h1 className="flex text-xl font-extrabold">
    <ServerTran locale={locale} text={text} />
  </h1>
);

export default async function Page({ params }: Props) {
  const { locale } = await params;

  return (
    <main className="no-scrollbar flex h-full flex-col bg-center text-foreground gap-8 pt-4">
      <div className="px-4 space-y-4">
        <h1 className="w-full text-3xl font-extrabold">
          <ServerTran locale={locale} text="home.hero-title" />
        </h1>
        <article className="flex gap-4 flex-row">
          <div className="flex flex-col space-y-4 lg:w-1/2 text-foreground">
            {heroTexts.map(({ title, content }) => (
              <div key={title}>
                <h3 className="font-bold">
                  <ServerTran locale={locale} text={title} />
                </h3>
                <p className="text-muted-foreground">
                  <ServerTran locale={locale} text={content} />
                </p>
              </div>
            ))}
          </div>
        </article>
        <article className="flex flex-col gap-2">
          <h3 className="font-bold">
            <ServerTran locale={locale} text="home.schematic-preview" />
          </h3>
          <HomeSchematicPreview queryParam={{ page: 0, size: 10, sort: 'time_desc' }} />
        </article>
        <article className="flex flex-col gap-2">
          <h3 className="font-bold">
            <ServerTran locale={locale} text="home.map-preview" />
          </h3>
          <HomeMapPreview queryParam={{ page: 0, size: 10, sort: 'time_desc' }} />
        </article>
        <article className="flex flex-col gap-2">
          <h3 className="font-bold">
            <ServerTran locale={locale} text="home.server-preview" />
          </h3>
          <HomeServerPreview />
        </article>
        <div className="flex w-full flex-col gap-4 md:flex-row">
          <div className="flex w-full flex-col gap-8 md:w-1/2">
            <div className="space-y-2">
              <SectionTitle locale={locale} text="home.content-recommended-article" />
              <ul className="mb-5 flex flex-col">
                {postLinks.map(({ href, text }) => (
                  <li key={href} className="p-0">
                    <InternalLink className="text-lg" variant="primary" href={href}>
                      <ServerTran locale={locale} text={text} />
                    </InternalLink>
                  </li>
                ))}
              </ul>
            </div>
            <section className="space-y-2">
              <SectionTitle locale={locale} text="home.community" />
              <ul className="mb-5 flex flex-col">
                {relativeLinks.map(({ href, text }) => (
                  <li key={href} className="p-0">
                    <a className="text-lg text-brand hover:text-brand" href={href} target="_blank" rel="noopener noreferrer">
                      <ServerTran locale={locale} text={text} />
                    </a>
                  </li>
                ))}
              </ul>
            </section>
            <section className="space-y-2">
              <SectionTitle locale={locale} text="home.youtube" />
              <ul className="mb-5 flex flex-col">
                {youtubeLinks.map(({ href, text }) => (
                  <li key={href} className="p-0">
                    <a className="text-lg text-brand hover:text-brand" href={href} target="_blank" rel="noopener noreferrer">
                      {text}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          </div>
          <div className="flex w-full flex-col md:w-1/2">
            <SectionTitle locale={locale} text="home.website-info" />
            <InformationGroup />
            <SectionTitle locale={locale} text="home.credit" />
            <div className="grid grid-rows-2">
              <Link className="text-emerald-400 list-item h-8 whitespace-nowrap" href="/credit">
                Credit
              </Link>
              <Link className="text-emerald-400 list-item h-8 whitespace-nowrap" href="https://discord.gg/72324gpuCd">
                <ServerTran locale={locale} text="report" />
              </Link>
            </div>
          </div>
        </div>
        <OnlineDisplay />
      </div>
      <footer className="bg-zinc-950 text-white">
        <div className="space-y-4 p-2 pb-2">
          <span className="flex w-full justify-center text-center text-xl font-extrabold">MindustryTool</span>
          <div className="flex justify-center gap-2">
            <Link className="aspect-square rounded-full border bg-black p-2" href="https://github.com/MindustryVN">
              <GithubIcon />
            </Link>
            <Link className="aspect-square rounded-full border bg-[rgb(66,103,178)] p-2" href="https://www.facebook.com/groups/544598159439216/">
              <FacebookIcon />
            </Link>
            <Link className="aspect-square rounded-full border bg-[rgb(88,101,242)] p-2" href="https://discord.gg/72324gpuCd">
              <DiscordIcon />
            </Link>
          </div>
          <div className="flex w-full justify-center p-4 text-center text-sm">Copyright © 2024 ‧ MindustryTool. All rights reserved.</div>
        </div>
        <Ads />
      </footer>
    </main>
  );
}
