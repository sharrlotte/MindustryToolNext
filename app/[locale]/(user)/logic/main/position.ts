'use client';

import { useEffect, useState, useCallback } from 'react';

export type Position = {
  windowWidth: number;
  windowHeight: number;
  posx: number;
  posy: number;
  scale: number;
  lastDragX: number;
  lastDragY: number;
  drag: boolean;
};

export const usePosition = () => {
  const [position, setPosition] = useState<Position>({
    windowWidth: 0,
    windowHeight: 0,
    posx: 0,
    posy: 0,
    scale: 1,
    lastDragX: 0,
    lastDragY: 0,
    drag: false,
  });

  // auto resize
  useEffect(() => {
    function handleResize() {
      setPosition((prev) => ({
        ...prev,
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight - 40,
      }));
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleWheel = useCallback((e: any) => {
    e.evt.preventDefault();
    const scaleBy = 1.1;
    const oldScale = position.scale;
    setPosition((prev) => ({
      ...prev,
      scale: Math.max(
        0.25,
        Math.min(4, e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy)
      ),
    }));
  }, [position]);

  const handleOutside = useCallback(
    () => setPosition((prev) => ({ ...prev, posx: 0, posy: 0 })),
    []
  );

  const handleDragStart = useCallback(
    (dx: number, dy: number) =>
      setPosition((prev) => ({
        ...prev,
        lastDragX: dx,
        lastDragY: dy,
        drag: true,
      })),
    []
  );

  const handleDragMove = useCallback(
    (dx: number, dy: number) =>
      setPosition((prev) => ({
        ...prev,
        posx: prev.posx + (prev.lastDragX - dx),
        posy: prev.posy + (prev.lastDragY - dy),
        lastDragX: dx,
        lastDragY: dy,
      })),
    []
  );

  const handleDragEnd = useCallback(
    () => setPosition((prev) => ({ ...prev, drag: false })),
    []
  );

  return {
    position,
    setPosition,
    handleWheel,
    handleOutside,
    handleDragStart,
    handleDragMove,
    handleDragEnd,
  };
};
