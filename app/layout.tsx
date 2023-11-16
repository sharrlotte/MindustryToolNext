import type { Metadata } from 'next';
import { Monomaniac_One } from 'next/font/google';
import { cn } from '@/lib/utils';
import { ThemeProvider } from './theme-provider';
import NavigationBar from './navigation';

import './globals.css';

const inter = Monomaniac_One({ subsets: ['latin'], weight: '400' });

export const metadata: Metadata = {
	title: 'MindustryTool',
	description: 'A website about mindustry',
};

interface RootParam {
	lang: string;
}

export async function generateStaticParams(): Promise<RootParam[]> {
	return [{ lang: 'en-US' }, { lang: 'vi' }];
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
					{children}
				</ThemeProvider>
			</body>
		</html>
	);
}
