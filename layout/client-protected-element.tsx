'use client'
import { ComponentProps } from 'react';

import ProtectedElement from '@/layout/protected-element';
import { useSession } from '@/context/session-context';

type Props = Omit<ComponentProps<typeof ProtectedElement>, 'session'>

export default function ClientProtectedElement({ children, ...props }: Props) {
    const { session } = useSession()

    return <ProtectedElement session={session} {...props}>{children}</ProtectedElement>
}
