import { Metadata } from 'next';
import Link from 'next/link';

import { translate } from '@/action/action';
import { HomeMapPreview, HomeSchematicPreview, InformationGroup } from '@/app/[locale]/home';
import Ads from '@/components/common/ads';
import { DiscordIcon, FacebookIcon, GithubIcon } from '@/components/common/icons';
import InternalLink from '@/components/common/internal-link';
import Tran from '@/components/common/tran';
import YoutubeEmbed from '@/components/common/youtube-embed';
import { Locale } from '@/i18n/config';
import { formatTitle } from '@/lib/utils';

export const experimental_ppr = true;

type Props = {
  params: Promise<{
    locale: Locale;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const title = await translate(locale, 'home');

  return {
    title: formatTitle(title),
  };
}

const SectionTitle = ({ text }: { text: string }) => (
  <h1 className="flex text-xl font-extrabold">
    <Tran text={text} />
  </h1>
);

const CommunityLinks = () => (
  <section className="space-y-2">
    <SectionTitle text="home.community" />
    <ul className="mb-5 flex flex-col">
      {[
        { href: 'https://discord.gg/mindustry', text: 'home.official-discord-server' },
        { href: 'https://discord.gg/nQDrEHVkrt', text: 'home.mindustry-tool-discord-server' },
        { href: 'https://discord.gg/DCX5yrRUyp', text: 'home.vietnamese-discord-server' },
        { href: 'https://www.reddit.com/r/Mindustry', text: 'home.reddit' },
        { href: 'https://mindustrygame.github.io/wiki/', text: 'home.mindustry-wiki' },
        { href: 'https://github.com/Anuken/Mindustry', text: 'home.mindustry-github' },
      ].map(({ href, text }) => (
        <li key={href} className="p-0">
          <a className="text-lg text-brand hover:text-brand" href={href} target="_blank" rel="noopener noreferrer">
            <Tran text={text} />
          </a>
        </li>
      ))}
    </ul>
  </section>
);

const YoutubeLinks = () => (
  <section className="space-y-2">
    <SectionTitle text="home.youtube" />
    <ul className="mb-5 flex flex-col">
      {[
        { href: 'https://www.youtube.com/@FourEverNice', text: 'Four Ever Nice' },
        { href: 'http://www.youtube.com/@gezpil8397', text: 'Gezpil' },
      ].map(({ href, text }) => (
        <li key={href} className="p-0">
          <a className="text-lg text-brand hover:text-brand" href={href} target="_blank" rel="noopener noreferrer">
            {text}
          </a>
        </li>
      ))}
    </ul>
  </section>
);

const RecommendedArticles = () => (
  <div className="space-y-2">
    <SectionTitle text="home.content-recommended-article" />
    <ul className="mb-5 flex flex-col">
      {[
        { href: 'posts/e7610862-bf57-4ab0-9204-ae7a4a31d41b', text: 'home.download-tutorial' },
        { href: '/posts/fa6c9516-7b98-428d-9129-c86aa40ea3d6', text: 'home.play-with-friend-tutorial' },
      ].map(({ href, text }) => (
        <li key={href} className="p-0">
          <InternalLink className="text-lg" variant="primary" href={href}>
            <Tran text={text} />
          </InternalLink>
        </li>
      ))}
    </ul>
  </div>
);

const AboutSection = () => (
  <div className="flex flex-col space-y-8 md:w-1/2">
    {[
      { title: 'home.about-mindustry', content: 'home.content-about-mindustry' },
      { title: 'home.content-platform-info', content: 'home.content-platform' },
      { title: 'home.mindustry-tool-about', content: 'home.mindustry-tool-description' },
    ].map(({ title, content }) => (
      <div key={title}>
        <h3 className="font-bold">
          <Tran text={title} />
        </h3>
        <p>
          <Tran text={content} />
        </p>
      </div>
    ))}
  </div>
);

const Footer = () => (
  <footer className="z-10 bg-zinc-950/95">
    <div className="space-y-4 p-6 pb-6">
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
    </div>
    <div className="flex w-full justify-center bg-black p-4 text-center text-sm">Copyright © 2024 ‧ MindustryTool. All rights reserved.</div>
    <Ads />
  </footer>
);

export default async function Home() {
  return (
    <main className="no-scrollbar flex h-full flex-col bg-[url('/assets/home.jpg')] bg-cover bg-center text-white">
      <div className="mx-auto flex w-full flex-col gap-10 p-4 pt-10 backdrop-blur-sm backdrop-brightness-50 md:gap-20 md:px-32">
        <h1 className="w-full text-center text-xl font-extrabold">
          <Tran text="home.hero-title" />
        </h1>
        <article className="flex flex-col gap-4 md:flex-row">
          <AboutSection />
          <div className="flex h-fit w-full justify-center md:w-1/2">
            <YoutubeEmbed url="https://www.youtube.com/embed/gUu3AhqpyHo?autoplay=1&loop=1&controls=1" />
          </div>
        </article>
        <article className="flex flex-col gap-2">
          <h3 className="font-bold">
            <Tran text="home.schematic-preview" />
          </h3>
          <HomeSchematicPreview queryParam={{ page: 0, size: 10, sort: 'time_desc' }} />
        </article>
        <article className="flex flex-col gap-2">
          <h3 className="font-bold">
            <Tran text="home.map-preview" />
          </h3>
          <HomeMapPreview queryParam={{ page: 0, size: 10, sort: 'time_desc' }} />
        </article>
        <div className="flex w-full flex-col gap-4 md:flex-row">
          <div className="flex w-full flex-col gap-8 md:w-1/2">
            <RecommendedArticles />
            <CommunityLinks />
            <YoutubeLinks />
          </div>
          <div className="flex w-full flex-col md:w-1/2">
            <SectionTitle text="home.website-info" />
            <InformationGroup />
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
