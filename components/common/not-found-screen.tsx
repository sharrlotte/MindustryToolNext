import Link from 'next/link';

import Tran from '@/components/common/tran';
import BackButton from '@/components/ui/back-button';

export default function NotFoundScreen() {
  return (
    <div className="flex h-full flex-1 flex-col items-center justify-center gap-4">
      <div>
        <h2 className="text-bold text-3xl">
          <Tran text="not-found" />
        </h2>
        <p>
          <Tran text="not-found-description" />
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Link className="rounded-md text-center border bg-brand p-2 text-sm text-background dark:text-foreground" href="/">
          <Tran text="home" />
        </Link>
        <BackButton variant="primary" />
      </div>
    </div>
  );
}
