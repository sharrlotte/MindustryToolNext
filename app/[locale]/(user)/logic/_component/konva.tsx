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


