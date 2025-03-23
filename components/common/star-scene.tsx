import { ReactNode } from 'react';

import { MovingStars } from '@/app/universe-scene';

import { Text } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';

type Props = {
  message?: string;
  children?: ReactNode;
};
export default function StarScene({ message, children }: Props) {
  return (
    <div className="bg-black h-full w-full absolute inset-0">
      <Canvas camera={{ position: [0, 0, 1], fov: 75 }}>
        <MovingStars />
        {message && (
          <Text position={[0, 0, 0]} color="white" fontSize={0.02} maxWidth={0.5} lineHeight={1} letterSpacing={0.02} textAlign="center">
            {message}
          </Text>
        )}
      </Canvas>
      {children}
    </div>
  );
}
