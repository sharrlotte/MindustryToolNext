'use client';

import { Group, Text } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { Html } from 'react-konva-utils';
import { Delete, Copy } from './icon';
import { widthPadded, padding } from './command-card';
import Command, { InputType } from '../command';
import { useCallback } from 'react';

export type Position = {
  x: number;
  y: number;
  width?: number;
  height?: number;
};

type submitFunction = (value: string, displayValue?: string) => void;
type ValueEditorDefaultProp = {
  position: Position;
  defaultValue: string;
  onSubmit: submitFunction;
};

function TextEditorView({ position, onSubmit }: ValueEditorDefaultProp) {
  const top = position.y + 40;

  return (
    <Html>
      <div
        className="fixed"
        style={{
          top: `${top}px`,
          left: `${position.x}px`,
          width: `${position.width}px`,
          height: `${position.height}px`,
        }}
      >
        <input type="text" placeholder="" defaultValue={'meow'} />
        <button className=''>Meow</button>
      </div>
    </Html>
  );
}

type InputControlProp = {
  position: Position;
  defaultValue: string;
  inputType: InputType;
  onSubmit: submitFunction;
};

export function InputControl({
  position,
  defaultValue,
  inputType,
  onSubmit,
}: InputControlProp) {
  return (
    <Group>
      {inputType == InputType.TextInput && (
        <TextEditorView
          position={position}
          defaultValue={defaultValue}
          onSubmit={onSubmit}
        />
      )}
    </Group>
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

export function CommandHeader({
  command,
  index,
  onCopy,
  onDelete,
}: {
  command: Command;
  index: number;
  onCopy: (command: Command) => void;
  onDelete: (index: number) => void;
}) {
  return (
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
}
