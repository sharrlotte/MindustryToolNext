import I18nProvider from '@/app/[locale]/i18n-provider';
import NavigationBar from '@/app/[locale]/navigation';
import Toaster from '@/components/ui/toaster';
import { Locale, locales } from '@/i18n/config';
import { cn } from '@/lib/utils';

type RootProps = {
  children: React.ReactNode;
  params: Promise<{
    locale: Locale;
  }>;
};

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function Root({ children, params }: RootProps) {
  const { locale } = await params;

  return (
    <div className={cn('h-full overflow-hidden', locale === 'kr' ? 'font-noto' : 'font-inter')}>
      <I18nProvider locale={locale} />
      <Toaster />
      <NavigationBar>{children}</NavigationBar>
    </div>
  );
}
