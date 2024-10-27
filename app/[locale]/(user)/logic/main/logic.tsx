import { KonvaEventObject } from 'konva/lib/Node';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Layer, Line, Rect, Stage } from 'react-konva';
import Command from '../command';
import { CommandListDisplay } from './display';
import { SelectInputProps } from './editor';

type LogicProp = {
  commands: Command[];
  setCommands: React.Dispatch<React.SetStateAction<Command[]>>;
  deleteCommand: (index: number) => void;
  replaceCommand: (command: Command, index: number) => void;
  copyCommand: (index: number) => void;
  selectInput: (arg0: SelectInputProps) => void;
  findCommandByIndex: (index: number) => Command;
};

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

export default function LogicDisplay({ commands, setCommands, deleteCommand, replaceCommand, copyCommand, selectInput, findCommandByIndex }: LogicProp) {
  const [position, setPosition] = useState({
    windowWidth: window.innerWidth,
    windowHeight: window.innerHeight - 40,
    posx: 0,
    posy: 0,
    scale: 1,
    lastDragX: 0,
    lastDragY: 0,
    drag: false,
  });

  const [rerender, handleRerender] = useState(false);
  const [lastCommands, setLastCommands] = useState(commands);

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

  const handleWheel = useCallback(
    (e: any) => {
      e.evt.preventDefault();
      const scaleBy = 1.1;
      const oldScale = position.scale;
      setPosition((prev) => ({
        ...prev,
        scale: Math.max(0.25, Math.min(4, e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy)),
      }));
    },
    [position],
  );

  const handleOutside = useCallback(() => setPosition((prev) => ({ ...prev, posx: 0, posy: 0 })), []);

  const handleDragStart = useCallback((dx: number, dy: number) => {
    setPosition((prev) => ({
      ...prev,
      lastDragX: dx,
      lastDragY: dy,
      drag: true,
    }));
  }, []);

  const handleDragMove = useCallback((dx: number, dy: number) => {
    setPosition((prev) => ({
      ...prev,
      posx: prev.posx + (prev.lastDragX - dx),
      posy: prev.posy + (prev.lastDragY - dy),
      lastDragX: dx,
      lastDragY: dy,
    }));
  }, []);

  const handleDragEnd = useCallback(() => {
    setPosition((prev) => ({ ...prev, drag: false }));
  }, []);

  useEffect(() => {
    if (lastCommands !== commands) {
      setCommands((commands) => {
        setLastCommands(commands);
        return commands.map((command) =>
          command.x === 0 && command.y === 0
            ? {
                ...command,
                x: -position.posx / position.scale + (position.windowWidth / position.scale / 2 - 150),
                y: -position.posy / position.scale + position.windowHeight / position.scale / 2,
              }
            : command,
        );
      });
    }
  }, [position, setCommands]);

  const handleDragElement = useCallback(
    (e: KonvaEventObject<DragEvent>, command: Command, index: number) => {
      const { x, y } = e.target.position();
      replaceCommand({ ...command, x, y }, index);
    },
    [replaceCommand],
  );

  return useMemo(
    () => (
      <div className="h-full w-full">
        <h3 className="left-10 top-1.5 p-4">{`Pos: ${-position.posx}, ${-position.posy}. Zoom: x${(1 / position.scale).toFixed(2)}. Total element: ${commands.length}`}</h3>
        <Stage
          width={position.windowWidth}
          height={position.windowHeight}
          scaleX={position.scale}
          scaleY={position.scale}
          x={position.posx}
          y={position.posy}
          onWheel={handleWheel}
          onMouseMove={(e) => position.drag && handleDragMove(-e.evt.clientX, -e.evt.clientY)}
          onMouseUp={() => {
            handleDragEnd();
            handleRerender((last) => !last);
          }}
          onMouseLeave={handleDragEnd}
        >
          <Layer>
            <Rect x={-8000} y={-8000} width={16000} height={16000} onClick={handleOutside} />
            <Rect x={-4000} y={-4000} width={8000} height={8000} onMouseDown={(e) => handleDragStart(-e.evt.clientX, -e.evt.clientY)} fill={'#200'} />
            <Line points={[-4000, 0, 4000, 0]} stroke="white" strokeWidth={4} />
            <Line points={[0, -4000, 0, 4000]} stroke="white" strokeWidth={4} />
          </Layer>
          <CommandListDisplay
            commands={commands}
            dragElement={handleDragElement}
            deleteCommand={deleteCommand}
            copyCommand={copyCommand}
            selectInput={selectInput}
            findCommandByIndex={findCommandByIndex}
            position={position}
            setCommands={setCommands}
          />
        </Stage>
      </div>
    ),
    [rerender, commands],
  );
}
