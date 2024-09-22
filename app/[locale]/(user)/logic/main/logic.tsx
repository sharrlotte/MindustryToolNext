'use client';

import { Stage, Layer, Rect, Line } from 'react-konva';
import Command from '../command';
import { selectInputProps } from './editor';
import { KonvaEventObject } from 'konva/lib/Node';
import React, { useCallback, useEffect } from 'react';
import { usePosition } from './position';
import { CommandListDisplay } from './display';

type LogicProp = {
  commands: Command[];
  setCommands: React.Dispatch<React.SetStateAction<Command[]>>;
  deleteCommand: (index: number) => void;
  replaceCommand: (command: Command, index: number) => void;
  copyCommand: (index: number) => void;
  selectInput: (arg0: selectInputProps) => void;
  findCommandByIndex: (index: number) => Command;
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
  const {
    position,
    handleWheel,
    handleDragMove,
    handleDragEnd,
    handleOutside,
    handleDragStart,
  } = usePosition();

  useEffect(() => {
    setCommands((commands) =>
      commands.map((command) =>
        command.x === 0 && command.y === 0
          ? {
              ...command,
              x:
                -position.posx / position.scale +
                (position.windowWidth / position.scale / 2 - 150),
              y:
                -position.posy / position.scale +
                position.windowHeight / position.scale / 2,
            }
          : command,
      ),
    );
  }, [position, setCommands]);

  const handleDragElement = useCallback(
    (e: KonvaEventObject<DragEvent>, command: Command, index: number) => {
      const { x, y } = e.target.position();
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
            fill={'#200'}
          />
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
  );
}
