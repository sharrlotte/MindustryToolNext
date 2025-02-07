'use client';

import { useRef } from 'react';

import { Stars } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

export const MovingStars = () => {
  const starsRef = useRef<any>(null!);

  useFrame((state) => {
    if (starsRef.current) {
      starsRef.current.rotation.x += state.mouse.y * 0.0005;
      starsRef.current.rotation.y += state.mouse.x * 0.0005;
    }
  });

  return <Stars ref={starsRef} radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />;
};
