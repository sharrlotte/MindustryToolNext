import Tran from '@/components/common/tran';
import BackButton from '@/components/ui/back-button';
import Link from 'next/link';

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
      <div className="grid grid-flow-col gap-2">
        <Link href="/">
          <Tran text="home" />
        </Link>
        <BackButton variant="primary" />
      </div>
    </div>
  );
}
