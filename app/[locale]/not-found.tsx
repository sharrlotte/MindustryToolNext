import { getI18n } from '@/locales/server';

export default async function NotFound() {
  const t = await getI18n();

  return (
    <div className="flex h-full w-full items-center justify-center text-xl">
      {t('content-not-found')}
    </div>
  );
}
