import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="absolute inset-0 space-y-2 overflow-auto bg-background p-2">
      <div className="flex gap-2 rounded-md bg-card p-2">
        <Skeleton className="h-20 w-20 rounded-full" />
        <div className="flex h-full flex-col justify-between gap-2">
          <Skeleton className="h-8 w-32 text-2xl capitalize" />
          <Skeleton className="h-8 w-20 text-2xl capitalize" />
        </div>
      </div>
      <div className="flex h-12 items-center gap-2 bg-card p-1">
        <Skeleton className="h-8 w-20 text-2xl capitalize" />
        <Skeleton className="h-8 w-20 text-2xl capitalize" />
        <Skeleton className="h-8 w-20 text-2xl capitalize" />
      </div>
    </div>
  );
}
