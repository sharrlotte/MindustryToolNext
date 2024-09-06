'use client';

import React, { Dispatch, SetStateAction, useCallback, useState } from 'react';
import Command from '../command';
import { CommandHeader, InputControl } from './konva';
import { Layer, Group, Rect, Text } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';

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
  setCommands: Dispatch<SetStateAction<Command[]>>;
  addCommand: (command: Command) => void;
  deleteCommand: (index: number) => void;
  replaceCommand: (command: Command, index: number) => void;
};

export default function CommandCard({
  commands,
  setCommands,
  addCommand,
  deleteCommand,
  replaceCommand,
}: CommandCardProp) {
  return (
    <Layer>
      {commands.map((element, index) => (
        <DragGroup
        key={index}
        index={index}
        command={element}
        replaceFunction={() => {}}>
          <Rect
            width={width}
            height={calculateFullHeigh(element.value.rows)}
            fill={element.value.color}
            cornerRadius={10}
            stroke="black"
            strokeWidth={2}
          />
        </DragGroup>
      ))}
    </Layer>
  );
}

export function DragGroup({
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
    <Group
      x={command.x}
      y={command.y}
      draggable
      onDragEnd={handleDragEnd}
    >
      {children}
    </Group>
  );
}
