import Link from 'next/link';

import {
  HomeMapPreview,
  HomeSchematicPreview,
  InformationGroup,
} from '@/app/[locale]/home';
import Ads from '@/components/common/ads';
import {
  DiscordIcon,
  FacebookIcon,
  GithubIcon,
} from '@/components/common/icons';
import InternalLink from '@/components/common/internal-link';
import Tran from '@/components/common/tran';
import YoutubeEmbed from '@/components/common/youtube-embed';

// export const dynamicParams = false;
export const experimental_ppr = true;

export default async function Home() {

  console.count('render')

  return (
    <div className="no-scrollbar flex h-full flex-col overflow-y-auto bg-[url('https://mindustrygame.github.io/1.d25af17a.webp')] bg-cover bg-center text-white">
      <div className="mx-auto flex w-full flex-col gap-10 p-4 pt-10 backdrop-blur-sm backdrop-brightness-50 md:gap-20 md:px-32">
        <div>
          <h1 className="w-full text-center text-xl font-extrabold">
            <Tran text="home.hero-title" />
          </h1>
        </div>
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="flex flex-col space-y-8 md:w-1/2">
            <div>
              <h3 className="font-bold">
                <Tran text="home.content-what-is-mindustry" />
              </h3>
              <p>
                <Tran text="home.content-about-mindustry" />
              </p>
            </div>
            <div>
              <h3 className="font-bold">
                <Tran text="home.content-platform-info" />
              </h3>
              <p>
                <Tran text="home.content-platform" />
              </p>
            </div>
            <div>
              <h3 className="font-bold">
                <Tran text="home.mindustry-tool-about" />
              </h3>
              <p>
                <Tran text="home.mindustry-tool-description" />
              </p>
            </div>
          </div>
          <div className="flex h-fit w-full justify-center md:w-1/2">
            <YoutubeEmbed url="https://www.youtube.com/embed/gUu3AhqpyHo?autoplay=1&loop=1&controls=1" />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="font-bold">
            <Tran text="home.schematic-preview" />
          </h3>
          <HomeSchematicPreview
            queryParam={{ page: 0, size: 10, sort: 'time_1' }}
          />
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="font-bold">
            <Tran text="home.map-preview" />
          </h3>
          <HomeMapPreview queryParam={{ page: 0, size: 10, sort: 'time_1' }} />
        </div>
        <div className="flex w-full flex-col gap-4 md:flex-row">
          <div className="flex w-full flex-col gap-8 md:w-1/2">
            <div className="space-y-2">
              <h1 className="flex text-xl font-extrabold">
                <Tran text="home.content-recommended-article" />
              </h1>
              <ul className="mb-5 flex flex-col">
                <li className="p-0">
                  <InternalLink
                    className="text-lg"
                    variant="primary"
                    href="posts/e7610862-bf57-4ab0-9204-ae7a4a31d41b"
                  >
                    <Tran text="home.download-tutorial" />
                  </InternalLink>
                </li>
                <li className="p-0">
                  <InternalLink
                    className="text-lg"
                    variant="primary"
                    href="/posts/fa6c9516-7b98-428d-9129-c86aa40ea3d6"
                  >
                    <Tran text="home.play-with-friend-tutorial" />
                  </InternalLink>
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <h1 className="flex text-xl font-extrabold">
                <Tran text="home.community" />
              </h1>
              <ul className="mb-5 flex flex-col">
                <li className="p-0">
                  <a
                    className="text-lg text-brand hover:text-brand"
                    href="https://discord.gg/mindustry"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Tran text="home.official-discord-server" />
                  </a>
                </li>
                <li className="p-0">
                  <a
                    className="text-lg text-brand hover:text-brand"
                    href="https://discord.gg/DCX5yrRUyp"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Tran text="home.vietnamese-discord-server" />
                  </a>
                </li>
                <li className="p-0">
                  <a
                    className="text-lg text-brand hover:text-brand"
                    href="https://www.reddit.com/r/Mindustry"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Tran text="home.reddit" />
                  </a>
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <h1 className="flex text-xl font-extrabold">
                <Tran text="home.youtube" />
              </h1>
              <ul className="mb-5 flex flex-col">
                <li className="p-0">
                  <a
                    className="text-lg text-brand hover:text-brand"
                    href="https://www.youtube.com/@FourEverNice"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Four Ever Nice
                  </a>
                </li>
                <li className="p-0">
                  <a
                    className="text-lg text-brand hover:text-brand"
                    href="http://www.youtube.com/@gezpil8397"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Gezpil
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex w-full flex-col md:w-1/2">
            <h1 className="mb-5 flex text-xl font-extrabold">
              <Tran text="home.website-info" />
            </h1>
            <InformationGroup />
          </div>
        </div>
      </div>
      <footer className="z-10 bg-zinc-950/95">
        <div className="space-y-4 p-6 pb-6">
          <span className="flex w-full justify-center text-center text-xl font-extrabold">
            MindustryTool
          </span>
          <div className="flex justify-center gap-2">
            <Link
              className="aspect-square rounded-full border bg-black p-2"
              href="https://github.com/MindustryVN"
            >
              <GithubIcon />
            </Link>
            <Link
              className="aspect-square rounded-full border bg-[rgb(66,103,178)] p-2"
              href="https://www.facebook.com/groups/544598159439216/"
            >
              <FacebookIcon />
            </Link>
            <Link
              className="aspect-square rounded-full border bg-[rgb(88,101,242)] p-2"
              href="https://discord.gg/72324gpuCd"
            >
              <DiscordIcon />
            </Link>
          </div>
        </div>
        <div className="flex w-full justify-center bg-black p-4 text-center text-sm">
          Copyright © 2024 ‧ MindustryTool. All rights reserved.
        </div>
        <Ads />
      </footer>
    </div>
  );
}
