'use client';

import { useEffect, useState } from 'react';

export default function SpotLight() {
  const [position, setPosition] = useState({ x: -320, y: -320 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX - 160, y: e.clientY - 160 });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      className="z-50 pointer-events-none fixed w-80 h-80 min-w-80 min-h-80 max-w-80 max-h-80 rounded-full blur-3xl"
      style={{
        left: position.x,
        top: position.y,
        background: 'radial-gradient(circle, rgba(255,255,255,0.25) 0%, rgba(0,0,0,0) 80%)',
      }}
    />
  );
}
