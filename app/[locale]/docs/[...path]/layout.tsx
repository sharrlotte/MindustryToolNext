import fs from 'fs';
import p from 'path';
import path from 'path';
import { ReactNode, Suspense } from 'react';

import { MediumNavItems } from '@/app/[locale]/(main)/medium-navigation-items';
import NavHeader from '@/app/[locale]/(main)/small-nav.header';
import SmallNavbarCollapse from '@/app/[locale]/(main)/small-navbar-collapse';
import SmallNavbarInsideToggle from '@/app/[locale]/(main)/small-navbar-inside-toggle';
import SmallNavbarToggle from '@/app/[locale]/(main)/small-navbar-toggle';
import { UserDisplay } from '@/app/[locale]/(main)/user-display';
import DocSearchBar from '@/app/[locale]/docs/doc-search-bar';
import { Doc, isDocExists, readDocsByLocale, reduceDocs } from '@/app/[locale]/docs/doc-type';
import LanguageSwitcher from '@/app/[locale]/docs/language-switcher';
import ThemeSwitcher from '@/app/[locale]/docs/theme-swicther';

import Aurora from '@/components/common/aurora';
import { CatchError } from '@/components/common/catch-error';
import { Hidden } from '@/components/common/hidden';
import Hydrated from '@/components/common/hydrated';
import { MenuIcon, MindustryToolIcon } from '@/components/common/icons';
import InternalLink from '@/components/common/internal-link';
import ScrollContainer from '@/components/common/scroll-container';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Divider from '@/components/ui/divider';

import { NavBarProvider } from '@/context/navbar.context';
import { Locale, locales } from '@/i18n/config';
import { cn } from '@/lib/utils';

export default async function Layout({
	children,
	params,
}: {
	children: ReactNode;
	params: Promise<{ path: string[]; locale: string }>;
}) {
	const { locale, path } = await params;
	const availableLanguages = locales.filter((locale) => isDocExists(locale, path));

	return (
		<div className="h-full relative w-full grid grid-rows-[auto_1fr] overflow-hidden">
			<NavBarProvider>
				<div className="flex border-b py-2 px-4 items-center overflow-hidden h-16 gap-4 relative bg-card dark:bg-transparent">
					<Aurora
						className="absolute inset-0 -z-10 hidden dark:flex"
						colorStops={['#3A29FF', '#FF94B4', '#FF3232']}
						blend={0.5}
						amplitude={1.0}
						speed={0.5}
					/>
					<div className="flex items-center gap-2">
						<SmallNavbarToggle className="gap-1 px-0 py-0">
							<MindustryToolIcon className="size-8" />
						</SmallNavbarToggle>
						<span className="hidden lg:block text-xl">
							<strong>M</strong>industry<strong>T</strong>ool
						</span>
					</div>
					<div className="flex items-center gap-4">
						<Suspense>
							<LanguageSwitcher availableLanguages={availableLanguages} currentLocale={locale as Locale} />
						</Suspense>
					</div>
					<div className="flex items-center gap-2 ml-auto">
						<Hydrated>
							<ThemeSwitcher />
						</Hydrated>
						<DocSearchBar />
					</div>
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
						<Hydrated>
							<UserDisplay />
						</Hydrated>
					</div>
				</SmallNavbarCollapse>
			</NavBarProvider>
			<ScrollContainer
				id="markdown-scroll-container"
				className="gap-2 flex-col md:grid md:grid-cols-[auto_1fr_auto] relative h-full flex bg-card dark:bg-background md:justify-center"
				additionalPadding="pr-4"
			>
				<aside className="block md:hidden ml-auto mt-4 px-4">
					<CatchError>
						<NavBarDialog locale={locale} selectedSegments={path} />
					</CatchError>
				</aside>
				<aside className="hidden md:flex w-full h-full sm:border-r border-border max-w-[25rem] min-w-[20rem]">
					<ScrollContainer id="nav-bar" className="max-w-[20rem] p-4 ml-auto sticky top-0 h-fit" additionalPadding="pr-0">
						<CatchError>
							<NavBar locale={locale} selectedSegments={path} />
						</CatchError>
					</ScrollContainer>
				</aside>
				{children}
			</ScrollContainer>
		</div>
	);
}

type NavBarProps = {
	locale: string;
	selectedSegments: string[];
};

async function NavBarDialog({ locale, selectedSegments }: NavBarProps) {
	return (
		<Dialog>
			<DialogTrigger title="Navbar">
				<MenuIcon className="size-6" />
			</DialogTrigger>
			<DialogContent className="p-8 h-full">
				<Hidden>
					<DialogTitle />
					<DialogDescription />
				</Hidden>
				<NavBar locale={locale} selectedSegments={selectedSegments} />
			</DialogContent>
		</Dialog>
	);
}

async function NavBar({ locale, selectedSegments }: NavBarProps) {
	const data = readDocsByLocale(locale);

	return (
		<ScrollContainer className="w-full">
			<nav className="space-y-6 w-full">
				{data.map((doc) => (
					<NavBarDoc locale={locale} key={doc.segment} doc={doc} selectedSegments={selectedSegments} segments={[]} level={0} />
				))}
			</nav>
		</ScrollContainer>
	);
}

function NavBarDoc({
	doc,
	segments,
	level,
	selectedSegments,
	locale,
}: {
	locale: string;
	doc: Doc;
	segments: string[];
	selectedSegments: string[];
	level: number;
}) {
	const currentSegments = [...segments, doc.segment];

	if (doc.children.length === 0) {
		return (
			<InternalLink
				href={`/${locale}/docs/${path.join(...currentSegments)}`}
				className={cn('text-base w-full py-2 rounded-md hover:bg-secondary text-secondary-foreground hover:text-foreground', {
					'text-foreground bg-secondary': currentSegments
						.map((segment, index) => segment === selectedSegments[index])
						.every((v) => v),
				})}
			>
				<span
					className={cn('pr-2 capitalize', {
						'pl-2': level === 1,
						'pl-4': level === 2, //
						'pl-6': level === 3,
						'pl-8': level === 4,
						'pl-10': level === 5,
						'pl-12': level === 6,
						'pl-14': level === 7,
					})}
				>
					{doc.title.toLowerCase()}
				</span>
			</InternalLink>
		);
	}

	if (level === 0) {
		return (
			<div className="space-y-1">
				<h2 className="text-base py-0 pl-2 font-semibold uppercase">{doc.title}</h2>
				<section className="space-y-1">
					{doc.children.map((doc) => (
						<NavBarDoc
							locale={locale}
							key={doc.segment}
							doc={doc}
							selectedSegments={selectedSegments}
							segments={currentSegments}
							level={level + 1}
						/>
					))}
				</section>
			</div>
		);
	}

	return (
		<Accordion
			className="space-y-1 w-full"
			type="single"
			collapsible
			defaultValue={level === 1 ? 'open' : selectedSegments.join('/')}
		>
			<AccordionItem
				value={
					level === 1
						? 'open'
						: selectedSegments
									.map((segment, index) => index > currentSegments.length - 1 || segment === currentSegments[index])
									.every((v) => v)
							? selectedSegments.join('/')
							: doc.segment
				}
			>
				<AccordionTrigger className="text-base py-0 justify-start text-start text-nowrap w-full">
					<span
						className={cn('text-base font-normal text-secondary-foreground pr-2 capitalize', {
							'pl-2': level === 1,
							'pl-4': level === 2, //
							'pl-6': level === 3,
							'pl-8': level === 4,
							'pl-10': level === 5,
							'pl-12': level === 6,
							'pl-14': level === 7,
						})}
					>
						{doc.title.toLowerCase()}
					</span>
				</AccordionTrigger>
				<AccordionContent className="space-y-1 mt-1">
					{doc.children.map((doc) => (
						<NavBarDoc
							locale={locale}
							key={doc.segment}
							doc={doc}
							selectedSegments={selectedSegments}
							segments={currentSegments}
							level={level + 1}
						/>
					))}
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	);
}

export function generateStaticParams() {
	const localeFolders = p.join(process.cwd(), 'docs');
	const locales = fs.readdirSync(localeFolders);

	return locales.flatMap((locale) => {
		const docs = readDocsByLocale(locale);

		return docs
			.flatMap((doc) => reduceDocs([], doc))
			.map((segments) => ({
				path: segments,
				locale,
			}));
	});
}
