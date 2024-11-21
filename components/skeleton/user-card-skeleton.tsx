import { Skeleton } from '@/components/ui/skeleton';

export default function UserCardSkeleton() {
  return (
    <div className="flex min-h-8 h-8 w-56 items-end justify-start gap-2">
      <Skeleton className="block h-8 w-8 rounded-full border border-border" />
      <Skeleton className="h-full w-full flex-1" />
    </div>
  );
}
