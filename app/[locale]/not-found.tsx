import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex h-full flex-1 flex-col items-center justify-center">
      <h2 className="text-bold text-3xl">Resource Not Found</h2>
      <p>Could not find requested resource</p>

      <Link
        className="rounded-md border bg-button p-2 text-background dark:text-foreground"
        href="/"
      >
        Return Home
      </Link>
    </div>
  );
}
