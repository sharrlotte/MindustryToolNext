'use client';

import { Stage, Layer, Rect, Line, Group } from 'react-konva';
import Command from './command';
import { selectInputProps } from './editor';
import { KonvaEventObject } from 'konva/lib/Node';
import CommandCard from './_component/command-card';
import React, {
  useEffect,
  useState,
  useCallback,
  Dispatch,
  SetStateAction,
  useMemo,
} from 'react';

type LogicProp = {
  commands: Command[];
  setCommands: Dispatch<SetStateAction<Command[]>>;
  addCommand: (command: Command) => void;
  deleteCommand: (index: number) => void;
  replaceCommand: (command: Command, index: number) => void;
  copyCommand: (index: number) => void;
  selectInput: (arg0: selectInputProps) => void;
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

export default function LogicDisplay({
  commands,
  setCommands,
  deleteCommand,
  replaceCommand,
  copyCommand,
  selectInput,
  findCommandByIndex,
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
    setCommands((commands) => {
      commands.forEach((command, index) => {
        if (command.x === 0 && command.y === 0) {
          const centerX =
            -position.posx / position.scale +
            (position.windowWidth / position.scale / 2 - 150);
          const centerY =
            -position.posy / position.scale +
            position.windowHeight / position.scale / 2;
          commands[index] = { ...command, x: centerX, y: centerY };
        }
      });

      return commands;
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

  // element move
  const dragElement = useCallback(
    (e: KonvaEventObject<DragEvent>, command: Command, index: number) => {
      const x = e.target.position().x;
      const y = e.target.position().y;
      replaceCommand({ ...command, x, y }, index);
    },
    [replaceCommand],
  );

  return (
    <div className="h-full w-full">
      <h3 className="fixed left-10 top-1.5">{`Pos: ${-position.posx}, ${-position.posy}. Zoom: x${(1 / position.scale).toFixed(2)}. Total element: ${commands.length}`}</h3>
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
        <Test
          commands={commands}
          position={position}
          setCommands={setCommands}
          dragElement={dragElement}
          deleteCommand={deleteCommand}
          copyCommand={copyCommand}
          selectInput={selectInput}
          findCommandByIndex={findCommandByIndex}
        />
      </Stage>
    </div>
  );
}

const Test = ({
  commands,
  dragElement,
  position,
  setCommands,
  deleteCommand,
  copyCommand,
  selectInput,
  findCommandByIndex,
}: {
  commands: Command[];
  dragElement: (
    e: KonvaEventObject<DragEvent>,
    command: Command,
    index: number,
  ) => void;
  position: Position;
  setCommands: Dispatch<SetStateAction<Command[]>>;
  deleteCommand: (index: number) => void;
  copyCommand: (index: number) => void;
  selectInput: (arg0: selectInputProps) => void;
  findCommandByIndex: (index: number) => Command;
}) => {
  return useMemo(() => {
    return (
      <Layer>
        {commands.map((element, index) => (
          <CommandDisplay
            key={index}
            element={element}
            index={index}
            dragEvent={dragElement}
          >
            <CommandCard
              commands={commands}
              elementValue={element.value}
              index={index}
              position={position}
              setCommands={setCommands}
              deleteCommand={deleteCommand}
              copyCommand={copyCommand}
              selectInput={selectInput}
              findCommandByIndex={findCommandByIndex}
            />
          </CommandDisplay>
        ))}
      </Layer>
    );
  }, [commands]);
};

const CommandDisplay = ({
  element,
  index,
  dragEvent,
  children,
}: {
  element: Command;
  index: number;
  dragEvent: (e: KonvaEventObject<DragEvent>, a: Command, i: number) => void;
  children: React.ReactNode;
}) => {
  const memoizedElement = useMemo(() => {
    return (
      <Group
        x={element.x}
        y={element.y}
        draggable
        onDragEnd={(e) => dragEvent(e, element, index)}
      >
        {children}
      </Group>
    );
  }, [element.x, element.y, element.value]);

  return memoizedElement;
};
