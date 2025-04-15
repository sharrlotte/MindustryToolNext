import dynamic from 'next/dynamic';

import { Skeleton } from '@/components/ui/skeleton';
import { TableCell, TableRow } from '@/components/ui/table';

function ITranslationCardSkeleton() {
  const width = 100 + Math.random() * 100;

  return (
    <TableRow>
      <TableCell>
        <Skeleton style={{ width }} className="h-8" />
      </TableCell>
    </TableRow>
  );
}
export const TranslationCardSkeleton = dynamic(() => Promise.resolve(ITranslationCardSkeleton), { ssr: false });
