'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

import { MovingStars } from '@/app/universe-scene';

import useClientApi from '@/hooks/use-client';
import { TError, getErrorMessage, getLoggedErrorMessage } from '@/lib/utils';
import { reportError } from '@/query/api';

import { Text } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';

import './globals.css';

export default function Error({ error }: { error: TError }) {
  const message = getErrorMessage(error);
  const loggedMessage = getLoggedErrorMessage(error);

  const path = usePathname();
  const axios = useClientApi();

  useEffect(() => {
    reportError(axios, `${path} > ${loggedMessage}`);
  }, [axios, message, path, loggedMessage]);

  return (
    <html>
      <body>
        <div className="h-full w-full bg-black">
          <Canvas camera={{ position: [0, 0, 1], fov: 75 }}>
            <MovingStars />
            <Text position={[0, 0, 0]} color="white" fontSize={0.5} maxWidth={5} lineHeight={1} letterSpacing={0.02} textAlign="center">
              {message}
            </Text>
          </Canvas>
        </div>
      </body>
    </html>
  );
}
