import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="absolute inset-0 space-y-2 overflow-auto bg-background p-4">
      <div className="flex gap-2 rounded-md bg-card p-2">
        <Skeleton className="h-20 w-20 rounded-full" />
        <div className="flex h-full flex-col justify-between">
          <Skeleton className="w-30 h-8 text-2xl capitalize" />
          <Skeleton className="h-8 w-20 text-2xl capitalize" />
        </div>
      </div>
    </div>
  );
}
