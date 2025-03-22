import { MapIcon, ServerIcon } from 'lucide-react';
import type { Metadata } from 'next';
import { unstable_cache } from 'next/cache';
import Image from 'next/image';
import Link from 'next/link';
import React, { Suspense } from 'react';
import 'server-only';

import Counter from '@/app/[locale]/(main)/counter';
import FadeIn from '@/app/[locale]/(main)/fade-in';
import FlyIn from '@/app/[locale]/(main)/fly-in';
import { MediumNavItems } from '@/app/[locale]/(main)/medium-navigation-items';
import NavHeader from '@/app/[locale]/(main)/small-nav-header';
import SmallNavbarCollapse from '@/app/[locale]/(main)/small-navbar-collapse';
import SmallNavbarInsideToggle from '@/app/[locale]/(main)/small-navbar-inside-toggle';
import { UserDisplay } from '@/app/[locale]/(main)/user-display';
import SmallNavbarToggle from '@/app/small-navbar-toggle';

import LoginButton from '@/components/button/login-button';
import ErrorScreen from '@/components/common/error-screen';
import { DiscordIcon, MindustryToolIcon, SchematicIcon } from '@/components/common/icons';
import InternalLink from '@/components/common/internal-link';
import T from '@/components/common/server-tran';
import Tran from '@/components/common/tran';
import MapPreviewCard from '@/components/map/map-preview-card';
import SchematicPreviewCard from '@/components/schematic/schematic-preview-card';
import ServerCard from '@/components/server/server-card';
import Divider from '@/components/ui/divider';

import { getServerApi, getSession } from '@/action/action';
import { serverApi } from '@/action/action';
import env from '@/constant/env';
import { NavBarProvider } from '@/context/navbar-context';
import type { Locale } from '@/i18n/config';
import { getTranslation } from '@/i18n/server';
import { formatTitle } from '@/lib/utils';
import { isError } from '@/lib/utils';
import { getMapCount } from '@/query/map';
import { getMaps } from '@/query/map';
import { getSchematicCount } from '@/query/schematic';
import { getSchematics } from '@/query/schematic';
import { ItemPaginationQueryType } from '@/query/search-query';
import { getServers } from '@/query/server';

import { YouTubeEmbed } from '@next/third-parties/google';

import './style.css';

export const experimental_ppr = true;

type Props = {
  params: Promise<{
    locale: Locale;
  }>;
};

const groups = [
  {
    key: 'home.resource',
    value: [
      {
        href: '/schematics',
        text: 'schematic',
      },
      {
        href: '/maps',
        text: 'map',
      },
      {
        href: '/servers',
        text: 'server',
      },
      {
        href: '/mindustry-gpt',
        text: 'mindustry-gpt',
      },
    ],
  },
  {
    key: 'home.community',
    color: 'cyan-400',
    value: [
      {
        href: 'https://discord.gg/mindustry',
        text: 'home.official-discord-server',
        class: 'min-w-8 h-8 text-[#5865F2]',
      },
      {
        href: 'https://mindustrygame.github.io/wiki/',
        text: 'home.mindustry-wiki',
        class: 'min-w-8 h-8 text-blue-500',
      },
      {
        href: 'https://github.com/Anuken/Mindustry',
        text: 'home.mindustry-github',
        class: 'min-w-8 h-8 text-gray-700',
      },

      {
        href: 'https://discord.gg/9qMxQZm6Wb',
        text: 'home.vn-discord-server',
        class: 'min-w-8 h-8 text-[#5865F2]',
      },
    ],
  },
  {
    key: 'home.legal',
    value: [
      {
        href: '/',
        text: 'home.terms-of-service',
        class: 'min-w-8 h-8 text-white',
      },
      {
        href: '',
        text: 'home.privacy-policy',
        class: 'min-w-8 h-8 text-white',
      },
      {
        href: '/credit',
        text: 'home.credit',
        class: 'min-w-8 h-8 text-white',
      },
    ],
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

export default async function Page({ params }: Props) {
  const { locale } = await params;

  return (
    <div className="h-full w-full overflow-y-auto no-scrollbar flex flex-col">
      <Header locale={locale} />
      <Hero locale={locale} />
      <AboutMindustrySection locale={locale} />
      <AboutMindustryToolSection locale={locale} />
      <NewSchematics queryParam={{ page: 0, size: 10, autoSize: false }} />
      <NewMaps queryParam={{ page: 0, size: 10, autoSize: false }} />
      <ServerSection locale={locale} />
      <Suspense>
        <LoginAction locale={locale} />
      </Suspense>
      <Footer locale={locale} />
    </div>
  );
}

async function Header({ locale }: { locale: Locale }) {
  return (
    <NavBarProvider>
      <header className="sticky top-0 z-50 bg-black border-b border-border">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 text-brand rounded-md flex items-center justify-center">
              <span className="font-bold text-xl">
                <SmallNavbarToggle>
                  <MindustryToolIcon />
                </SmallNavbarToggle>
              </span>
            </div>
            <span className="text-xl font-bold text-brand-foreground">Mindustry Tool</span>
          </div>
          <SmallNavbarCollapse>
            <div className="flex h-full flex-col justify-between overflow-hidden p-2">
              <div className="flex h-full flex-col overflow-hidden">
                <span className="flex flex-col gap-2">
                  <span className="flex justify-between items-start rounded-sm p-1">
                    <NavHeader />
                    <SmallNavbarInsideToggle />
                  </span>
                </span>
                <MediumNavItems />
              </div>
              <Divider />
              <UserDisplay />
            </div>
          </SmallNavbarCollapse>
          <Suspense>
            <HeaderLogin locale={locale} />
          </Suspense>
        </div>
      </header>
    </NavBarProvider>
  );
}

async function HeaderLogin({ locale }: { locale: Locale }) {
  const session = await getSession();

  if (session) {
    return undefined;
  }

  return (
    <div>
      <LoginButton className="w-fit px-6 border-brand">
        <T locale={locale} text="login" />
      </LoginButton>
    </div>
  );
}

async function Hero({ locale }: { locale: Locale }) {
  return (
    <section className="relative bg-gradient bg-gradient-to-t text-brand-foreground min-h-dvh">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">Mindustry Tool</h1>
        <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8 text-brand-foreground">
          <T locale={locale} text="home.hero-title" />
          {/* Your comprehensive platform for Mindustry schematics, maps, servers, and community resources */}
        </p>
        <div className="grid grid-cols-2 w-fit mx-auto justify-center gap-4">
          <Link className="bg-brand/90 hover:bg-brand p-4 py-2 rounded-md" href="/schematics">
            <T locale={locale} text="home.explore-schematics" />
            {/* Explore Schematics */}
          </Link>
          <Link className="border border-brand text-brand p-4 py-2 rounded-md" href="/maps">
            <T locale={locale} text="home.browse-map" />
            {/* Browse Maps */}
          </Link>
        </div>
      </div>
      <Statistic locale={locale} />
    </section>
  );
}

async function AboutMindustrySection({ locale }: { locale: Locale }) {
  return (
    <section className="py-16 bg-black text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">
          <T locale={locale} text="home.about-mindustry" />
          {/* About Mindustry */}
        </h2>
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="md:w-1/2 aspect-video overflow-hidden rounded-lg">
            <YouTubeEmbed videoid="gUu3AhqpyHo" />
          </div>
          <div className="md:w-1/2">
            <p className="mb-4">
              <T locale={locale} text="home.about-mindustry-description-1" />
              {/* Mindustry is a sandbox tower defense game that blends real-time strategy and resource management. Developed by Anuken, it challenges players to gather resources, build factories, and automate production chains for both defense and
              offense. */}
            </p>
            <p className="mb-4">
              <T locale={locale} text="home.about-mindustry-description-2" />
              {/* The game focuses on creating complex production lines to gather and process resources, building defensive structures, and launching attacks against enemies. */}
            </p>
            <p>
              <T locale={locale} text="home.about-mindustry-description-3" />
              {/* Available on multiple platforms including Windows, Linux, macOS, Android, and iOS, Mindustry offers both single-player and multiplayer experiences for strategy enthusiasts. */}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

async function AboutMindustryToolSection({ locale }: { locale: Locale }) {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">
          <T locale={locale} text="home.about-mindustry-tool" />
          {/* About Mindustry Tool */}
        </h2>
        <div className="flex flex-col md:flex-row-reverse gap-8 items-center">
          <div className="md:w-1/2 overflow-hidden rounded-lg">
            <Image src="/placeholder.svg?height=400&width=600" alt="Mindustry Tool Platform" width={600} height={400} className="rounded-lg shadow-lg" />
          </div>
          <div className="md:w-1/2">
            <p className="mb-4">
              <T locale={locale} text="home.about-mindustry-tool-description-1" />
              {/* Mindustry Tool is a comprehensive platform dedicated to enhancing your Mindustry gaming experience. We offer an extensive collection of schematics, maps, and servers, along with helpful posts and an active community. */}
            </p>
            <p className="mb-4">
              <T locale={locale} text="home.about-mindustry-description-2" />
              {/* Our platform provides free server hosting that supports mods, plugins, map downloading HUD, Docker environment, anti-DDoS protection, and powerful hardware. Players can claim their free server to enjoy a customized gaming experience. */}
            </p>
            <p>
              <T locale={locale} text="home.about-mindustry-description-3" />
              {/* Additionally, we feature MindustryGpt, which offers further resources and tools related to the game, and maintain an active community with official Discord servers, a Mindustry Wiki, and GitHub repositories. */}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function CheckCircleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  );
}

const serverFeatures = ['home.server-mod-support', 'home.server-plugin-support', 'home.server-download-map', 'home.server-console-control', 'home.server-web-ui'];

async function ServerSection({ locale }: { locale: Locale }) {
  return (
    <section className="py-16 bg-black text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">
          <T locale={locale} text="home.create-server-for-free" />
          {/* Create Your Mindustry Server For Free */}
        </h2>
        <div className="flex flex-col md:flex-row gap-8 items-stretch">
          <div id="server" className="md:w-1/2 h-full">
            <HomeServerPreview />
          </div>
          <div className="md:w-1/2">
            <h3 className="text-2xl font-semibold mb-4 text-brand">
              <T locale={locale} text="home.host-title" asChild />
              {/* Powerful Server Hosting at No Cost */}
            </h3>
            <p className="mb-4">
              <T locale={locale} text="home.host-description" asChild />
              {/* Launch your own Mindustry server completely free with our powerful hosting platform. Whether you want to play with friends or build a community, we've got you covered. */}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {serverFeatures.map((item, index) => (
                <div className="flex items-start" key={index}>
                  <div className="mr-2 mt-1 bg-brand p-1 rounded-full">
                    <CheckCircleIcon />
                  </div>
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <Link href="/servers?create=true" className="bg-brand/90 hover:bg-brand w-full md:w-auto px-4 py-2 rounded-md">
              <T locale={locale} text="home.create-free-server" asChild />
              {/* Create Your Free Server */}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

async function Statistic({ locale }: { locale: Locale }) {
  return (
    <div className="my-auto">
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-brand-foreground">
            <T locale={locale} text="home.explore-our-collection" />
          </h2>
          <Suspense fallback={<div className="h-[300px]"></div>}>
            <StatisticSection locale={locale} />
          </Suspense>
        </div>
      </section>
    </div>
  );
}

async function StatisticSection({ locale }: { locale: Locale }) {
  const axios = await getServerApi();
  const [schematics, maps] = await Promise.all([getSchematicCount(axios, {}), getMapCount(axios, {})]);

  return (
    <FlyIn className="grid grid-cols-1 md:grid-cols-3 gap-8 h-[300px]">
      {[
        { icon: SchematicIcon, text: 'home.schematics-count', count: schematics, color: 'text-brand', link: '#new-schematics' },
        { icon: MapIcon, text: 'home.maps-count', count: maps, color: 'text-cyan-400', link: '#new-maps' },
        { icon: ServerIcon, text: 'home.free-servers-count', count: 3, color: 'text-purple-400', link: '#server' },
      ].map((item, index) => (
        <FlyIn key={index} className="h-full">
          <Link href={item.link} shallow className={`text-center p-6 text-brand-foreground bg-gray-900/50 backdrop-blur-sm h-full rounded-xl grid place-content-center text-xl md:text-4xl font-bold gap-0.5 items-center justify-center`}>
            <div className={`flex justify-center items-center flex-col gap-2 ${item.color}`}>
              <item.icon className="size-12" />
            </div>
            <Counter from={0} to={item.count} />
            <T className="text-xl" locale={locale} text={item.text} />
          </Link>
        </FlyIn>
      ))}
    </FlyIn>
  );
}

async function LoginAction({ locale }: { locale: Locale }) {
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
        <p className="text-center mb-4">
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

async function NewSchematics({ queryParam }: { queryParam: ItemPaginationQueryType }) {
  return (
    <section id="new-schematics" className="py-16 bg-black text-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8 w-full">
          <h2 className="text-3xl font-bold text-nowrap">
            <Tran text="home.new-schematics" asChild />
          </h2>
          <InternalLink href="/schematics" className="cursor-pointer">
            <Tran className="text-base" text="see-all" /> {'->'}
          </InternalLink>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Suspense>
            <InternalHomeSchematicPreview queryParam={queryParam} />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
async function NewMaps({ queryParam }: { queryParam: ItemPaginationQueryType }) {
  return (
    <section id="new-maps" className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8 w-full">
          <h2 className="text-3xl font-bold text-nowrap">
            <Tran text="home.new-maps" asChild />
          </h2>
          <InternalLink href="/maps" className="cursor-pointer">
            <Tran className="text-base" text="see-all" /> {'->'}
          </InternalLink>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Suspense>
            <InternalHomeMapPreview queryParam={queryParam} />
          </Suspense>
        </div>
      </div>
    </section>
  );
}

function Footer({ locale }: { locale: Locale }) {
  return (
    <footer className="bg-black border-t border-border py-12 text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Mindustry Tool</h3>
            <p className="text-gray-400">
              <T locale={locale} text="home.footer-description" />
              {/* Your comprehensive platform for Mindustry schematics, maps, servers, and community resources. */}
            </p>
          </div>
          {groups.map((group, index) => (
            <div key={index}>
              <h4 className="font-semibold mb-4">
                <T locale={locale} text={group.key} />
              </h4>
              <ul className="space-y-2 text-gray-400">
                {group.value.map((value, index) => (
                  <div key={index}>
                    <Link href={value.href} className="hover:text-blue-400">
                      <T locale={locale} text={value.text} />
                    </Link>
                  </div>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-border mt-8 pt-8 text-center ">
          <p>© {new Date().getFullYear()} Mindustry Tool. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

async function HomeServerPreview() {
  return (
    <Suspense>
      <InternalHomeServerPreview />
    </Suspense>
  );
}

const findSchematics = unstable_cache((axios, queryParams) => getSchematics(axios, queryParams), ['home-schematics'], { revalidate: 60 * 60 });

const findMaps = unstable_cache((axios, queryParams) => getMaps(axios, queryParams), ['home-maps'], { revalidate: 60 * 60 });

const findServers = unstable_cache((axios) => getServers(axios, { page: 0, size: 0 }), ['home-servers'], { revalidate: 60 * 60 });

async function InternalHomeSchematicPreview({ queryParam }: { queryParam: ItemPaginationQueryType }) {
  const result = await serverApi((axios) => findSchematics(axios, queryParam));

  if (isError(result)) {
    return <ErrorScreen error={result} />;
  }

  return result.slice(0, 3).map((schematic, index) => (
    <div key={schematic.id} className="m-0 snap-center p-0 list-none">
      <FadeIn delay={index}>
        <SchematicPreviewCard schematic={schematic} />
      </FadeIn>
    </div>
  ));
}

async function InternalHomeMapPreview({ queryParam }: { queryParam: ItemPaginationQueryType }) {
  const result = await serverApi((axios) => findMaps(axios, queryParam));

  if (isError(result)) {
    return <ErrorScreen error={result} />;
  }

  return result.slice(0, 3).map((map, index) => (
    <div key={map.id} className="m-0 snap-center p-0 list-none">
      <FadeIn delay={index}>
        <MapPreviewCard map={map} />
      </FadeIn>
    </div>
  ));
}

async function InternalHomeServerPreview() {
  const result = await serverApi((axios) => findServers(axios));

  if (isError(result)) {
    return <ErrorScreen error={result} />;
  }

  return result.slice(0, 1).map((server, index) => <ServerCard key={index} server={server} />);
}
