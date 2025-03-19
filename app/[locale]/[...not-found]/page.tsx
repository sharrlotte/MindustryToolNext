import { notFound } from 'next/navigation';

export default function NotFoundDummy() {
  notFound();

  return <div>You not gonna see this</div>;
}
