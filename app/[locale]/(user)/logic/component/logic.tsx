'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Stage, Layer, Rect } from 'react-konva';
import Command from '../command'; 
import CommandCard from './command-card';

type LogicProp = {
  commands: Command[],
};

export default function LogicDisplay({ commands }: LogicProp) {
  const [position, setPosition] = 
    useState({ windowWidth: 0, windowHeight: 0, posx: 0, posy: 0, scale: 1, lastDragX: 0, LastDragY: 0, drag: false });

  useEffect(() => {
    function handleResize() { setPosition((prev) => ({ ...prev, windowWidth: window.innerWidth, windowHeight: window.innerHeight - 40 })) }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleWheel = useCallback((e: any) => {
    e.evt.preventDefault();
    const scaleBy = 1.1;
    const oldScale = position.scale;
    setPosition((prev) => ({ ...prev, scale: e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy }));
  }, [position]);

  const handleDragStart = useCallback((dx: number, dy: number) => {
    setPosition((prev) => ({ ...prev, lastDragX: dx, LastDragY: dy, drag: true}));
  }, [position]);

  const handleDragMove = useCallback((dx: number, dy: number) => {
    setPosition((prev) => ({
      ...prev,
      posx: prev.posx + (prev.lastDragX - dx),
      posy: prev.posy + (prev.LastDragY - dy),
      lastDragX: dx,
      LastDragY: dy
    }));
  }, [position]);

  const handleDragEnd = useCallback(() => {
    setPosition((prev) => ({...prev, drag: false}));
  }, [position]);

  return (
    <div className="w-full h-full">
      <h3 className="fixed top-2 left-10">{`Pos: ${position.posx.toFixed(2)}, ${position.posy.toFixed(2)} Zoom: x${(1 / position.scale).toFixed(2)}`}</h3>
      <Stage
        width={position.windowWidth}
        height={position.windowHeight}
        scaleX={position.scale}
        scaleY={position.scale}
        x={position.posx}
        y={position.posy}
        onWheel={handleWheel}
        onMouseMove={(e) => {if (position.drag) handleDragMove(e.evt.clientX, e.evt.clientY)}}
        onMouseLeave={handleDragEnd}
      >
        <Layer>
          <Rect
            x={-4000}
            y={-4000}
            width={8000}
            height={8000}
            onMouseDown={(e) => handleDragStart(e.evt.clientX, e.evt.clientY)}
            onMouseUp={handleDragEnd}
            fill={'#7777'}
          />
        </Layer>
        <Layer> 
          <Rect x={500} y={100} width={200} height={200} fill={'yellow'} draggable />
        </Layer>
        <CommandCard commands={commands}/>
      </Stage>
    </div>
  );
}
