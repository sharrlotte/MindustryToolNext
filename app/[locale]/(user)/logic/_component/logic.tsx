'use client';

import React, {
  useEffect,
  useState,
  useCallback,
  Dispatch,
  SetStateAction,
} from 'react';
import { Stage, Layer, Rect, Line } from 'react-konva';
import Command from '../command';
import CommandCard from './command-card';

type LogicProp = {
  commands: Command[];
  setCommands: Dispatch<SetStateAction<Command[]>>;
  addCommand: (command: Command) => void;
  deleteCommand: (index: number) => void;
  replaceCommand: (command: Command, index: number) => void;
  copyCommand: (command: Command) => void;
};

export default function LogicDisplay({
  commands,
  setCommands,
  addCommand,
  deleteCommand,
  replaceCommand,
  copyCommand
}: LogicProp) {
  
  const [position, setPosition] = useState({
    windowWidth: 0,
    windowHeight: 0,
    posx: 0,
    posy: 0,
    scale: 1,
    lastDragX: 0,
    lastDragY: 0,
    drag: false,
  });

  // auto resize.
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

  // auto center new command
  useEffect(() => {
    commands.forEach((command, index) => {
      if (command.x === 0 && command.y === 0) {
        const centerX =
          -position.posx / position.scale +
          (position.windowWidth / position.scale / 2 - 150);
        const centerY =
          -position.posy / position.scale +
          position.windowHeight / position.scale / 2;
        setCommands((commands) => {
          commands[index] = { ...command, x: centerX, y: centerY };
          return commands;
        });
      }
    });
  }, [
    commands,
    position.posx,
    position.posy,
    position.scale,
    position.windowWidth,
    position.windowHeight,
    setCommands,
  ]);

  // inputs
  const handleWheel = useCallback(
    (e: any) => {
      // nó chạy đr, kệ mẹ nó đi
      e.evt.preventDefault();
      const scaleBy = 1.1;
      const oldScale = position.scale;
      setPosition((prev) => ({
        ...prev,
        scale: Math.max(
          0.25,
          Math.min(
            4,
            e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy,
          ),
        ),
      }));
    },
    [position],
  );
  const handleOutside = useCallback(
    () => setPosition((prev) => ({ ...prev, posx: 0, posy: 0 })),
    [],
  );
  const handleDragStart = useCallback(
    (dx: number, dy: number) =>
      setPosition((prev) => ({
        ...prev,
        lastDragX: dx,
        lastDragY: dy,
        drag: true,
      })),
    [],
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
    [],
  );
  const handleDragEnd = useCallback(
    () => setPosition((prev) => ({ ...prev, drag: false })),
    [],
  );

  return (
    <div className="h-full w-full">
      <h3 className="fixed left-10 top-1.5">{`Pos: ${position.posx}, ${position.posy} Zoom: x${(1 / position.scale).toFixed(2)}`}</h3>
      <Stage
        width={position.windowWidth}
        height={position.windowHeight}
        scaleX={position.scale}
        scaleY={position.scale}
        x={position.posx}
        y={position.posy}
        onWheel={handleWheel}
        onMouseMove={(e) =>
          position.drag && handleDragMove(e.evt.clientX, e.evt.clientY)
        }
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
      >
        <Layer>
          <Rect
            x={-8000}
            y={-8000}
            width={16000}
            height={16000}
            onClick={handleOutside}
          />
          <Rect
            x={-4000}
            y={-4000}
            width={8000}
            height={8000}
            onMouseDown={(e) => handleDragStart(e.evt.clientX, e.evt.clientY)}
            fill={'#7777'}
          />
          <Line points={[-4000, 0, 4000, 0]} stroke="white" strokeWidth={4} />
          <Line points={[0, -4000, 0, 4000]} stroke="white" strokeWidth={4} />
        </Layer>
        <Layer>
          <Rect
            x={500}
            y={100}
            width={200}
            height={200}
            fill={'yellow'}
            draggable
          />
        </Layer>
        <CommandCard
          commands={commands}
          scale={position.scale}
          setCommands={setCommands}
          addCommand={addCommand}
          deleteCommand={deleteCommand}
          replaceCommand={replaceCommand}
          copyCommand={copyCommand}
        />
      </Stage>
    </div>
  );
}
