import { Skeleton } from '@/components/ui/skeleton';
import Skeletons from '@/components/ui/skeletons';
import { TableCell, TableRow } from '@/components/ui/table';

export function RoleListSkeleton() {
  return (
    <Skeletons number={20}>
      <TableRow>
        <TableCell>
          <Skeleton className="h-8 w-full rounded-sm" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-8 w-full rounded-sm" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-8 w-full rounded-sm" />
        </TableCell>
      </TableRow>
    </Skeletons>
  );
}
