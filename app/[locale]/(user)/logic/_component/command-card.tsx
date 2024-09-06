'use client';

import React, { Dispatch, SetStateAction, useCallback, useState } from 'react';
import Command from '../command';
import { InputControl } from './konva';
import { Layer, Group, Rect, Text } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { Copy, Delete } from './icon';

export const padding = 5;
export const doublePadding = padding * 2;
export const width = 300;
export const headerHeight = 30;
export const valueHeight = 30;
export const emptyValueListHeight = 20;
export const widthPadded = width - doublePadding;

const calculateValueHeigh = (rows: number) =>
  rows === 0 ? emptyValueListHeight : valueHeight * rows;
const calculateFullHeigh = (rows: number) =>
  calculateValueHeigh(rows) + headerHeight + doublePadding;

type CommandCardProp = {
  commands: Command[];
  scale: number;
  setCommands: Dispatch<SetStateAction<Command[]>>;
  addCommand: (command: Command) => void;
  deleteCommand: (index: number) => void;
  replaceCommand: (command: Command, index: number) => void;
  copyCommand: (command: Command) => void;
};

export default function CommandCard({
  commands,
  setCommands,
  addCommand,
  deleteCommand,
  replaceCommand,
  copyCommand
}: CommandCardProp) {
  return (
    <Layer>
      {commands.map((element, index) => (
        <InteractCard
          key={index}
          index={index}
          command={element}
          replaceFunction={() => {}}
        >
          <Rect
            width={width}
            height={calculateFullHeigh(element.value.rows)}
            fill={element.value.color}
            cornerRadius={10}
            stroke="black"
            strokeWidth={2}
          />

          <CommandHeader
            command={element}
            index={index}
            onCopy={copyCommand}
            onDelete={deleteCommand}
          />

          <CommandBody
            x={padding}
            y={headerHeight}
            width={widthPadded}
            height={calculateValueHeigh(element.value.rows)}
          >
            {}
            <Rect></Rect>
          </CommandBody>
        </InteractCard>
      ))}
    </Layer>
  );
}

export const CommandBody = ({
  x,
  y,
  width,
  height,
  children,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  children: React.ReactNode;
}) => (
  <Group x={x} y={y}>
    <Rect width={width} height={height} fill={'#0009'} cornerRadius={5} />
    {children}
  </Group>
);

export function InteractCard({
  index: key,
  command,
  replaceFunction,
  children,
}: {
  index: number;
  command: Command;
  replaceFunction: (command: Command, index: number) => void;
  children: React.ReactNode;
}) {
  const handleDragEnd = useCallback(
    (e: KonvaEventObject<DragEvent>) => {
      const x = e.target.position().x;
      const y = e.target.position().y;
      replaceFunction({ ...command, x, y }, key);
    },
    [command, key, replaceFunction],
  );

  return (
    <Group x={command.x} y={command.y} draggable onDragEnd={handleDragEnd}>
      {children}
    </Group>
  );
}

export const CommandHeader = ({
  command,
  index,
  onCopy,
  onDelete,
}: {
  command: Command;
  index: number;
  onCopy: (command: Command) => void;
  onDelete: (index: number) => void;
}) => (
  <Group x={padding} y={padding}>
    <Text text={command.value.name} fill={'white'} fontSize={19} />
    <Delete
      x={widthPadded - 20}
      y={2}
      size={16}
      strokeWidth={2}
      fill={'black'}
      onClick={() => onDelete(index)}
    />
    <Copy
      x={widthPadded - 20 - 20 - padding}
      y={2}
      size={16}
      strokeWidth={2}
      fill="black"
      onClick={() => onCopy(command)}
    />
  </Group>
);
