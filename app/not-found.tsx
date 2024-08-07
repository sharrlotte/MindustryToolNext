import InternalLink from '@/components/common/internal-link';
import BackButton from '@/components/ui/back-button';

export default function NotFoundScreen() {
  return (
    <div className="flex h-full flex-1 flex-col items-center justify-center gap-4">
      <div>
        <h2 className="text-bold text-3xl">Resource not found</h2>
        <p>Could not find requested resource</p>
      </div>
      <div className="grid grid-flow-col gap-2">
        <InternalLink variant="button-primary" href="/">
          Home
        </InternalLink>
        <BackButton>Back</BackButton>
      </div>
    </div>
  );
}
