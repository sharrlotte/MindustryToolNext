'use client';

import React, { Dispatch, SetStateAction, useCallback, useState } from 'react';
import Command, { FieldType, InputType } from '../command';
import { Html } from 'react-konva-utils';
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
  deleteCommand,
  replaceCommand,
  copyCommand,
}: CommandCardProp) {
  const [inputKeys, setInputKeys] = useState<{
    cKey: number;
    cValue: number;
  } | null>(null);
  const [input, setInput] = useState<InputControlProp | null>({
    position: {
      x: 0,
      y: 0,
    },
    defaultValue: '',
    inputType: InputType.TextInput,
    onSubmit: onSubmit,
  });

  function selectInput(
    x: number,
    y: number,
    defaultValue: string,
    inputType: InputType,
  ) {
    setInput({
      position: {
        x: x,
        y: y,
      },
      defaultValue: defaultValue,
      inputType: inputType,
      onSubmit: onSubmit,
    });
  }

  function onSubmit(value: string, displayValue?: string) {}

  return (
    <Layer>
      <InputControl input={input} />
      {commands.map((element, index) => (
        <InteractCard
          key={index}
          index={index}
          command={element}
          replaceFunction={replaceCommand}
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
            {element.value.fields.map((field, fIndex) => (
              <CommandField
                key={fIndex}
                x={
                  field.x *
                  field.fieldSize *
                  (widthPadded / element.value.columns)
                }
                y={field.y * valueHeight}
                fieldSize={
                  field.fieldSize * (widthPadded / element.value.columns)
                }
                color={element.value.color}
                field={field}
                commandIndex={index}
                fieldIndex={fIndex}
                onClickField={() => {
                  console.log('meow');
                }}
              />
            ))}
            <Rect></Rect>
          </CommandBody>
        </InteractCard>
      ))}
    </Layer>
  );
}

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
        <button className="">Meow</button>
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

export function InputControl({ input }: { input: InputControlProp | null }) {
  return (
    <Group>
      {input?.inputType == InputType.TextInput && (
        <TextEditorView
          position={input.position}
          defaultValue={input.defaultValue}
          onSubmit={input.onSubmit}
        />
      )}
    </Group>
  );
}

export const CommandField = ({
  x,
  y,
  fieldSize,
  color,
  field,
  commandIndex,
  fieldIndex,
  onClickField,
}: {
  x: number;
  y: number;
  fieldSize: number;
  color: string;
  field: FieldType;
  commandIndex: number;
  fieldIndex: number;
  onClickField: (cIndex: number, fIndex: number) => void;
}) => (
  <Group x={x} y={y}>
    <Text
      x={padding}
      y={doublePadding + 2}
      fontSize={14}
      text={field.placeHolder}
      fill="white"
    />
    <Rect
      x={field.placeHolderWidth}
      y={padding}
      width={fieldSize - padding - field.placeHolderWidth}
      height={valueHeight - padding}
      fill={color}
      cornerRadius={5}
    />
    <Text
      x={field.placeHolderWidth + padding}
      y={doublePadding + 5}
      width={fieldSize - doublePadding - field.placeHolderWidth}
      fill={'white'}
      fontSize={14}
      height={11}
      text={`${field.displayValue ? field.displayValue : field.value}`}
      ellipsis={true}
    />
    <Rect
      x={field.placeHolderWidth}
      y={padding}
      width={fieldSize - padding - field.placeHolderWidth}
      height={valueHeight - padding}
      onClick={() => {
        onClickField(commandIndex, fieldIndex);
      }}
    />
  </Group>
);

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
    <Text
      x={padding}
      y={2}
      text={command.value.name}
      fill={'white'}
      fontSize={18}
    />
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
