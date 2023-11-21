import type { Metadata } from 'next';
import { cn } from '@/lib/utils';
import cfg from '@/constant/global';
import { ThemeProvider } from './theme-provider';
import { Monomaniac_One } from 'next/font/google';
import NavigationBar from './navigation';

import './globals.css';
import QueryProvider from './query-provider';

const inter = Monomaniac_One({ subsets: ['latin'], weight: '400' });

export const metadata: Metadata = {
	title: 'MindustryTool',
	description: 'A website about mindustry',
};

interface RootParam {
	lang: string;
}

export async function generateStaticParams(): Promise<RootParam[]> {
	return cfg.locales.map((locale) => {
		return {
			lang: locale,
		};
	});
}

export default function Root({ children, params }: { children: React.ReactNode; params: RootParam }) {
	return (
		<html
			lang={params.lang ?? 'en'}
			suppressHydrationWarning
			className='dark'
		>
			<body className={cn('min-h-screen bg-background antialiased flex flex-col select-none', inter.className)}>
				<ThemeProvider
					attribute='class'
					defaultTheme='system'
					enableSystem
					disableTransitionOnChange
				>
					<NavigationBar />
					<QueryProvider>{children}</QueryProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
