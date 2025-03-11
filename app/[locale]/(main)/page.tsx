import { Book, Cpu, DownloadIcon, FileCode, Flame, Gamepad2, Github, Globe, MapIcon, MessageSquareIcon, MessagesSquare, Milestone, PlayIcon, RocketIcon, Server, ServerIcon, Swords, YoutubeIcon } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import React, { Suspense } from 'react';
import 'server-only';

import Counter from '@/app/[locale]/counter';
import { HomeMapPreview, HomeSchematicPreview, HomeServerPreview, OnlineDisplay } from '@/app/[locale]/home';
import StatisticCard from '@/app/[locale]/statistic-card';

import CopyButton from '@/components/button/copy-button';
import { CopyIcon, DiscordIcon, FacebookIcon, GithubIcon, PostIcon, SchematicIcon } from '@/components/common/icons';
import InternalLink from '@/components/common/internal-link';
import T from '@/components/common/server-tran';

import { getServerApi, getSession } from '@/action/action';
import env from '@/constant/env';
import type { Locale } from '@/i18n/config';
import { getTranslation } from '@/i18n/server';
import { cn, formatTitle } from '@/lib/utils';
import { getMapCount } from '@/query/map';
import { getSchematicCount } from '@/query/schematic';

import { YouTubeEmbed } from '@next/third-parties/google';

import './style.css';

export const experimental_ppr = true;

type Props = {
  params: Promise<{
    locale: Locale;
  }>;
};

const links = [
  {
    key: 'home.official',
    icon: MessagesSquare,
    color: 'cyan-400',
    value: [
      {
        href: 'https://discord.gg/mindustry',
        text: 'home.official-discord-server',
        icon: DiscordIcon,
        class: 'min-w-8 h-8 text-[#5865F2]',
      },
      {
        href: 'https://mindustrygame.github.io/wiki/',
        text: 'home.mindustry-wiki',
        icon: Book,
        class: 'min-w-8 h-8 text-blue-500',
      },
      {
        href: 'https://github.com/Anuken/Mindustry',
        text: 'home.mindustry-github',
        icon: Github,
        class: 'min-w-8 h-8 text-gray-700',
      },
    ],
  },
  {
    key: 'home.mindustrytool-and-vietnam',
    icon: MessagesSquare,
    color: 'brand',
    value: [
      {
        href: 'https://discord.gg/nQDrEHVkrt',
        text: 'home.mindustry-tool-discord-server',
        icon: DiscordIcon,
        class: 'min-w-8 h-8 text-[#5865F2]',
      },
      {
        href: 'https://discord.gg/DCX5yrRUyp',
        text: 'home.vietnamese-discord-server',
        icon: DiscordIcon,
        class: 'min-w-8 h-8 text-[#5865F2]',
      },
      {
        href: 'https://www.youtube.com/@FourEverNice',
        text: 'Four Ever Nice',
        icon: YoutubeIcon,
        class: 'min-w-8 h-8 text-red-600',
      },
      {
        href: 'http://www.youtube.com/@gezpil8397',
        text: 'Gezpil',
        icon: YoutubeIcon,
        class: 'min-w-8 h-8 text-red-600',
      },
    ],
  },
  {
    key: 'home.suggested-posts',
    icon: MessageSquareIcon,
    color: 'purple-400',
    value: [
      {
        href: 'posts/e7610862-bf57-4ab0-9204-ae7a4a31d41b',
        text: 'home.download-tutorial',
        icon: MessagesSquare,
        class: 'min-w-8 h-8 text-white',
      },
      {
        href: '/posts/fa6c9516-7b98-428d-9129-c86aa40ea3d6',
        text: 'home.play-with-friend-tutorial',
        icon: MessagesSquare,
        class: 'min-w-8 h-8 text-white',
      },
    ],
  },
];

const gamemode = [
  {
    title: 'home.catali-intro',
    icon: Swords,
    class: 'w-6 h-6 text-red-400',
    text: 'home.catali-infomation',
    link: 'server.mindustry-tool.com:6568',
  },
];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const { t } = await getTranslation(locale);
  const title = t('home');

  return {
    title: formatTitle(title),
  };
}

const SectionTitle = ({ text, locale }: { text: string; locale: Locale }) => (
  <h1 className="flex text-xl font-extrabold">
    <T locale={locale} text={text} />
  </h1>
);

export default async function Page({ params }: Props) {
  const { locale } = await params;

  return (
    <main className="h-screen no-scrollbar overflow-auto bg-gradient dark">
      <div className="container p-4 mx-auto flex h-full flex-col bg-center text-foreground gap-16 min-h-screen">
        <Header locale={locale} />
        <Suspense fallback={<div className="w-full h-[144px]"></div>}>
          <Statistic locale={locale} />
        </Suspense>
        <About locale={locale} />
        <Features locale={locale} />
        <Design locale={locale} />
        <Hosting locale={locale} />
        <Community locale={locale} />
        <Suspense>
          <Action locale={locale} />
        </Suspense>
        <Footer locale={locale} />
      </div>
    </main>
  );
}

function Footer({ locale }: { locale: Locale }) {
  return (
    <footer className="bg-background p-8">
      <div>
        <div className="grid gap-4 md:grid-cols-3">
          {/* Brand & Socials */}
          <div className="space-y-4 md:text-left">
            <h3 className="text-3xl font-bold text-card-foreground text-gradient">
              <T locale={locale} text="home.mindustry-tool" asChild />
            </h3>
            <div className="flex justify-center md:justify-start gap-2">
              {[
                { href: 'https://github.com/MindustryVN', icon: GithubIcon, bg: 'bg-black' },
                {
                  href: 'https://www.facebook.com/groups/544598159439216/',
                  icon: FacebookIcon,
                  bg: 'bg-[rgb(66,103,178)]',
                },
                { href: 'https://discord.gg/72324gpuCd', icon: DiscordIcon, bg: 'bg-[rgb(88,101,242)]' },
              ].map((social, index) => (
                <Link key={index} className={`aspect-square border-border rounded-full border ${social.bg} bg-opacity-30 p-2 transition-colors duration-300 hover:text-brand`} href={social.href}>
                  <social.icon />
                </Link>
              ))}
            </div>
            <SectionTitle locale={locale} text="home.credit" />
            <div className="flex flex-col items-center md:items-start space-y-2">
              <Link className="text-brand hover:underline" href="/credit">
                <T locale={locale} text="home.credit" />
              </Link>
              <Link className="text-brand hover:underline" href="https://discord.gg/72324gpuCd">
                <T locale={locale} text="report" />
              </Link>
            </div>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="font-semibold text-card-foreground">
              <T locale={locale} text="home.legal" />
            </h3>
            <div className="space-y-2">
              <Link href="/terms" className="text-brand hover:underline">
                <T locale={locale} text="home.terms-of-use" />
              </Link>
            </div>
          </div>

          {/* Resource */}
          <div className="space-y-4">
            <div className="font-semibold text-card-foreground">
              <SectionTitle locale={locale} text="home.resource" />
            </div>
            <OnlineDisplay />
          </div>
        </div>
        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>Copyright © 2025 ‧ MindustryTool. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
async function Action({ locale }: { locale: Locale }) {
  const session = await getSession();

  if (session) {
    return undefined;
  }

  return (
    <section>
      <div className="mx-auto">
        <h2 className="text-3xl text-center font-bold text-card-foreground">
          <T locale={locale} text="home.ready-to-start" asChild />
        </h2>
        <p className="text-muted-foreground text-center mb-4">
          <T locale={locale} text="home.register-and-join" asChild />
        </p>
        <div className="flex flex-col md:flex-row justify-center gap-4">
          <a className=" rounded-md bg-[rgb(88,101,242)] p-2 transition-colors hover:bg-[rgb(76,87,214)]" href={`${env.url.api}/oauth2/discord`}>
            <div className="flex items-center justify-center gap-1">
              <DiscordIcon /> <T locale={locale} text="home.login-with-discord" />
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
function Community({ locale }: { locale: Locale }) {
  return (
    <section className="bg-card rounded-xl p-8 space-y-6">
      <h2>
        <T locale={locale} text="home.active-community" />
      </h2>
      <div className="grid gap-8 md:grid-cols-3 items-stretch">
        {links.map((section, index) => (
          <div key={index} className="space-y-4">
            <div className="flex items-center gap-2">
              <section.icon className={`min-w-8 min-h-8 text-${section.color}`} />
              <h3 className="text-lg font-bold text-card-foreground">
                <T locale={locale} text={section.key} />
              </h3>
            </div>
            <ul className="space-y-2">
              {section.value.map((item, itemIndex) => (
                <li key={itemIndex} className="flex items-center text-sm gap-2 text-muted-foreground">
                  <item.icon className={item.class} />
                  <InternalLink className="flex items-center hover:text-brand transition-colors duration-300" href={item.href}>
                    <T locale={locale} text={item.text} />
                  </InternalLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

function Hosting({ locale }: { locale: Locale }) {
  return (
    <section className="p-8 rounded-xl bg-card/50 space-y-8">
      <div className="grid gap-8 grid-cols-1 md:grid-cols-2">
        <div className="flex flex-col">
          <div>
            <Gamepad2 className="w-8 h-8 text-purple-400 drop-shadow-xl" />
            <T className={`text-2xl font-bold text-purple-400`} locale={locale} text="home.host-your-server" />
          </div>
          <div className="grid gap-2">
            <T className="text-muted-foreground" locale={locale} text="home.server-features" />
            <InternalLink variant="button-primary" className="flex w-fit hover:bg-brand hover:text-white transition-colors duration-300" href="/servers?create=true">
              <T className="block break-words whitespace-normal text-center" locale={locale} text="home.claim-free-server" />
            </InternalLink>
          </div>
        </div>
        <div className="space-y-2">
          <div>
            <Milestone className="w-8 h-8 text-cyan-400" />
            <T className="text-2xl font-bold text-brand" locale={locale} text="home.recommend-gamemode" />
          </div>
          <div className="grid gap-8">
            {gamemode.map((object, index) => (
              <div key={index} className="grid gap-4 p-4 border-border border rounded-xl">
                <div className="text-lg font-bold flex items-center gap-1">
                  <object.icon className={object.class} />
                  <T locale={locale} text={object.title} />
                </div>
                <T locale={locale} text={object.text} className="text-muted-foreground" />
                <CopyButton variant="none" className="flex gap-1 max-w-full text-brand rainbow-border border bg-transparent text-white transition-colors duration-300" data={object.link}>
                  <CopyIcon />
                  <T locale={locale} text="home.copy-gamemode-ip" />
                </CopyButton>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="space-y-4 overflow-y-auto no-scrollbar w-full">
        <h3 className="text-2xl font-bold text-cyan-400 flex items-center">
          <Globe className="w-6 h-6" />
          <T locale={locale} text="home.mindustry-tool-servers" />
        </h3>
        <HomeServerPreview />
      </div>
    </section>
  );
}
function Design({ locale }: { locale: Locale }) {
  return (
    <section>
      <div className="grid gap-8 overflow-hidden">
        {[
          { title: 'home.new-schematics', icon: FileCode, color: 'text-brand', component: HomeSchematicPreview },
          { title: 'home.new-maps', icon: MapIcon, color: 'text-cyan-400', component: HomeMapPreview },
        ].map((item, index) => (
          <div key={index}>
            <div className="rounded-xl overflow-hidden">
              <h3 className="text-xl font-semibold mb-8 text-card-foreground flex items-center">
                <item.icon className={`w-6 h-6 ${item.color}`} />
                <T className="text-gradient" locale={locale} text={item.title} />
              </h3>
              <div className="rounded-md no-scrollbar">
                <item.component queryParam={{ page: 0, size: 5 }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
function Header({ locale }: { locale: Locale }) {
  return (
    <header className="w-full space-y-10 mt-10">
      <div className="grid items-center text-center">
        <h1 className="text-5xl text-gradient py-1 font-bold">
          <T asChild locale={locale} text="home.mindustry-tool" />
        </h1>
        <T className="w-full text-lg text-muted-foreground text-center mx-auto" locale={locale} text={'home.tagline'} />
      </div>
      <div className="grid grid-cols-2 justify-center items-center w-fit mx-auto gap-2">
        <InternalLink className="py-1 px-3 h-12 flex justify-center items-center border-brand rounded-md bg-brand hover:-translate-y-2 hover:bg-brand transition duration-300 ease-in-out" href="/schematics">
          <RocketIcon />
          <T locale={locale} text="home.get-started" />
        </InternalLink>
        <InternalLink className="py-1 px-3 h-12 flex justify-center items-center border-brand border rounded-md text-brand hover:-translate-y-2 transition duration-300 ease-in-out" href="/schematics">
          <PlayIcon />
          <T locale={locale} text="home.explore-webpage" />
        </InternalLink>
      </div>
    </header>
  );
}

async function Statistic({ locale }: { locale: Locale }) {
  const axios = await getServerApi();
  const [schematics, maps] = await Promise.all([getSchematicCount(axios, {}), getMapCount(axios, {})]);

  return (
    <StatisticCard>
      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x w-fit mx-auto rounded-xl bg-card/50 p-4 divide-zinc-800">
        {[
          { icon: SchematicIcon, text: 'home.schematics-count', count: schematics, color: 'text-brand' },
          { icon: MapIcon, text: 'home.maps-count', count: maps, color: 'text-cyan-400' },
          { icon: ServerIcon, text: 'home.free-servers-count', count: 3, color: 'text-purple-400' },
        ].map((item, index) => (
          <StatisticCard key={index}>
            <div className="text-center p-6">
              <div className={`text-xl md:text-4xl font-bold ${item.color} flex items-center justify-center`}>
                <item.icon className="w-8 h-8" />
                <Counter from={0} to={item.count} />
              </div>
              <T locale={locale} text={item.text} />
            </div>
          </StatisticCard>
        ))}
      </div>
    </StatisticCard>
  );
}

function Features({ locale }: { locale: Locale }) {
  return (
    <StatisticCard>
      <section className="space-y-4">
        <div className="flex justify-center items-center">
          <Flame className="text-red-400 w-8 h-8" />
          <T locale={locale} text="home.hot-features" />
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              icon: DownloadIcon,
              title: 'home.schematics-and-maps',
              description: 'home.find-what-you-need',
              color: 'text-brand',
              href: '/schematics',
            },
            {
              icon: PostIcon,
              title: 'home.wiki-and-tutorial',
              description: 'home.wiki-and-tutorial-description',
              color: 'text-cyan-400',
              href: '/',
            },
            {
              icon: Server,
              title: 'home.free-servers',
              description: 'home.claim-free-server',
              color: 'text-purple-400',
              href: '/servers',
            },
          ].map((feature, index) => (
            <StatisticCard key={index} delay={index * 0.4}>
              <div className="h-full bg-card/50 justify-between flex flex-col p-8 rounded-xl gap-2 hover:shadow-purple-400 shadow-xl">
                <feature.icon className={cn(`w-8 h-8`, feature.color)} />
                <T className="text-xl font-bold text-card-foreground" locale={locale} text={feature.title} />
                <T className="mb-4 text-muted-foreground flex-grow" locale={locale} text={feature.description} />
                <InternalLink className={cn(`w-full mt-4 transition-colors duration-300`, feature.color)} href={feature.href}>
                  <T locale={locale} text="home.details" />
                </InternalLink>
              </div>
            </StatisticCard>
          ))}
        </div>
      </section>
    </StatisticCard>
  );
}

function About({ locale }: { locale: Locale }) {
  return (
    <section className="grid grid-col md:grid-row-3 gap-16">
      <StatisticCard>
        <div className="grid md:grid-cols-2 bg-card/50 p-8 rounded-xl transition-all duration-300 ease-in-out gap-2">
          <div className="flex flex-col gap-2">
            <Cpu className="w-8 h-8 text-cyan-400" />
            <T className="text-xl font-bold text-card-foreground" locale={locale} text="home.about-mindustry" />
            <T className="text-muted-foreground" locale={locale} text="home.mindustry-description" />
            <T className="text-muted-foreground" locale={locale} text="home.mindustry-platforms" />
            <InternalLink href="https://anuke.itch.io/mindustry" className="text-brand text-sm mt-auto flex justify-start px-0">
              <T locale={locale} text="home.download-now" />
            </InternalLink>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden">
              <YouTubeEmbed videoid="gUu3AhqpyHo" />
            </div>
          </div>
        </div>
      </StatisticCard>
      <StatisticCard>
        <div className="flex bg-card/50 p-8 rounded-xl flex-col gap-2 transition-all duration-300 ease-in-out min-h-80">
          <Globe className="w-8 h-8 text-brand" />
          <T className="text-xl font-bold text-card-foreground" locale={locale} text="home.about-webpage" />
          <T className="text-muted-foreground" locale={locale} text="home.webpage-description" />
          <InternalLink className="text-brand flex justify-start mt-auto" href="/">
            <T locale={locale} text="home.explore-webpage" />
          </InternalLink>
        </div>
      </StatisticCard>
    </section>
  );
}
