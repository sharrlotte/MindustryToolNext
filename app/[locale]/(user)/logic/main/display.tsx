'use client';

import { KonvaEventObject } from 'konva/lib/Node';
import { Layer, Group } from 'react-konva';
import CommandCard from './command-card';
import Command from '../command';
import { SelectInputProps } from './editor';
import { Position } from './logic';
import CommandConnectPoint from './command-connect';
import { useMemo } from 'react';

export const CommandListDisplay = ({
  commands,
  dragElement,
  deleteCommand,
  copyCommand,
  selectInput,
  findCommandByIndex,
  position,
  setCommands,
}: {
  commands: Command[];
  dragElement: (
    e: KonvaEventObject<DragEvent>,
    command: Command,
    index: number,
  ) => void;
  deleteCommand: (index: number) => void;
  copyCommand: (index: number) => void;
  selectInput: (arg0: SelectInputProps) => void;
  findCommandByIndex: (index: number) => Command;
  position: Position;
  setCommands: React.Dispatch<React.SetStateAction<Command[]>>;
}) => {
  return useMemo(
    () => (
      <Layer>
        {commands.map((command, index) => (
          <CommandDisplay
            key={index}
            command={command}
            index={index}
            dragElement={dragElement}
          >
            <CommandCard
              commands={commands}
              elementValue={command.value}
              index={index}
              deleteCommand={deleteCommand}
              copyCommand={copyCommand}
              selectInput={selectInput}
              findCommandByIndex={findCommandByIndex}
              setCommands={setCommands}
              position={position}
            />
          </CommandDisplay>
        ))}
        {commands.map((command, index) => (
          <Group x={command.x} y={command.y} key={index}>
            <CommandConnectPoint
              commands={commands}
              index={index}
              elementValue={command.value}
              findCommandByIndex={findCommandByIndex}
              setCommands={setCommands}
            />
          </Group>
        ))}
      </Layer>
    ),
    [
      commands,
      dragElement,
      deleteCommand,
      copyCommand,
      selectInput,
      findCommandByIndex,
      setCommands,
      position,
    ],
  );
};

const CommandDisplay = ({
  command,
  index,
  dragElement,
  children,
}: {
  command: Command;
  index: number;
  dragElement: (
    e: KonvaEventObject<DragEvent>,
    command: Command,
    index: number,
  ) => void;
  children: React.ReactNode;
}) => {
  const handleDragEnd = (e: KonvaEventObject<DragEvent>) => {
    dragElement(e, command, index);
  };

  return (
    <Group x={command.x} y={command.y} draggable onDragEnd={handleDragEnd}>
      {children}
    </Group>
  );
};
