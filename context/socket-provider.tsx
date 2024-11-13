'use client';

import dynamic from 'next/dynamic';

const SocketProvider = dynamic(() => import('@/context/socket-context'), { ssr: false });

export default SocketProvider;
