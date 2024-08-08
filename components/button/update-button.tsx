import InternalLink from '@/components/common/internal-link';
import Tran from '@/components/common/tran';
import { PencilIcon } from 'lucide-react';
import React from 'react';

type Props = {
  href: string;
};

export default function UpdateButton({ href }: Props) {
  return (
    <InternalLink variant="command" href={href}>
      <PencilIcon className="size-5" />
      <Tran text="update" />
    </InternalLink>
  );
}
