import { Button } from '@/components/ui/button';

export default function ErrorScreen({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2">
      <h2 className="text-2xl capitalize">Something went wrong!</h2>
      <Button title="reset" onClick={() => reset()}>
        Try again
      </Button>
    </div>
  );
}
