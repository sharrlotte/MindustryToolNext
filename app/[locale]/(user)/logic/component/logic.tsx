'use client';

import React, { useEffect, useState, useCallback, Dispatch, SetStateAction } from 'react';
import { Stage, Layer, Rect, Line } from 'react-konva';
import Command from '../command';
import CommandCard from './command-card';

type LogicProp = {
  commands: { key: number, value: Command }[],
  setCommands: Dispatch<SetStateAction<{ key: number; value: Command }[]>>
};

export default function LogicDisplay({ commands, setCommands }: LogicProp) {
  const [position, setPosition] =
    useState({ windowWidth: 0, windowHeight: 0, posx: 0, posy: 0, scale: 1, lastDragX: 0, lastDragY: 0, drag: false });

  useEffect(() => {
    function handleResize() { 
      setPosition((prev) => ({ ...prev, windowWidth: window.innerWidth, windowHeight: window.innerHeight - 40 }));
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const elementToCenter = commands.find(command => command.value.x === 0 && command.value.y === 0);
    if (elementToCenter) {
      const centerX = -position.posx + (((position.windowWidth / position.scale) / 2 ) - 150);
      const centerY = -position.posy + (((position.windowHeight / position.scale) / 2) - 100);
      const updatedCommands = commands.map(command =>
        command.key === elementToCenter.key
          ? { ...command, value: { ...command.value, x: centerX, y: centerY } }
          : command
      );

      setCommands(updatedCommands);
    }
  }, [commands]);

  const handleWheel = useCallback((e: any) => {
    e.evt.preventDefault();
    const scaleBy = 1.1;
    const oldScale = position.scale;
    setPosition((prev) => ({ ...prev, scale: Math.max(0.25, Math.min(4, e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy)) }));
  }, [position]);

  const handleOutside = useCallback(() => setPosition((prev) => ({ ...prev, posx: 0, posy: 0 })), [position]);

  const handleDragStart = useCallback((dx: number, dy: number) => {
    setPosition((prev) => ({ ...prev, lastDragX: dx, lastDragY: dy, drag: true }));
  }, [position]);

  const handleDragMove = useCallback((dx: number, dy: number) => {
    setPosition((prev) => ({
      ...prev,
      posx: prev.posx + (prev.lastDragX - dx),
      posy: prev.posy + (prev.lastDragY - dy),
      lastDragX: dx,
      lastDragY: dy
    }));
  }, [position]);

  const handleDragEnd = useCallback(() => {
    setPosition((prev) => ({ ...prev, drag: false }));
  }, [position]);

  return (
    <div className="w-full h-full">
      <h3 className="fixed top-1.5 left-10">{`Pos: ${position.posx.toFixed(2)}, ${position.posy.toFixed(2)} Zoom: x${(1 / position.scale).toFixed(2)}`}</h3>
      <Stage
        width={position.windowWidth}
        height={position.windowHeight}
        scaleX={position.scale}
        scaleY={position.scale}
        x={position.posx}
        y={position.posy}
        onWheel={handleWheel}
        onMouseMove={(e) => { if (position.drag) handleDragMove(e.evt.clientX, e.evt.clientY) }}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
      >
        <Layer>
          <Rect
            x={-8000}
            y={-8000}
            width={16000}
            height={16000}
            onClick={() => handleOutside()}
          />
          <Rect
            x={-4000}
            y={-4000}
            width={8000}
            height={8000}
            onMouseDown={(e) => handleDragStart(e.evt.clientX, e.evt.clientY)}
            fill={'#7777'}
          />
          <Line
            points={[-4000, 0, 4000, 0]}
            stroke="white"
            strokeWidth={4}
          />
          <Line
            points={[0, -4000, 0, 4000]}
            stroke="white"
            strokeWidth={4}
          />
        </Layer>
        <Layer>
          <Rect x={500} y={100} width={200} height={200} fill={'yellow'} draggable />
        </Layer>
        <CommandCard commands={commands} setCommands={setCommands} zoom={position.scale}/>
      </Stage>
    </div>
  );
}
