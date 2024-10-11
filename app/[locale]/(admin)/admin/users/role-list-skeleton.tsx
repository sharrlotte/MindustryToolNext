import { Skeleton } from '@/components/ui/skeleton';
import { TableCell, TableRow } from '@/components/ui/table';

export function RoleListSkeleton() {
  return new Array(10).fill(1).map((_, index) => (
    <TableRow key={index}>
      <TableCell>
        <Skeleton className="h-8 w-full" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-8 w-full" />
      </TableCell>
    </TableRow>
  ));
}
