'use client';

import React, { Dispatch, SetStateAction, useState } from 'react';
import { Delete, Copy } from './icon';
import Command, { FieldType } from '../command';
import { Layer, Group, Rect, Text } from 'react-konva';
import { CommandPair } from './common';

const padding = 5;
const doublePadding = padding * 2;
const width = 300;
const headerHeight = 30;
const valueHeight = 30;
const emptyValueListHeight = 20;
const widthPadded = width - doublePadding;

function caculateHeigh(rows: number) {
  return rows === 0 ? emptyValueListHeight : valueHeight * rows;
}

function caculateFullHeigh(rows: number) {
  return caculateHeigh(rows) + headerHeight + doublePadding;
}

type ComponentProp = {
  commands: { key: number; value: Command }[];
  setCommands: Dispatch<SetStateAction<CommandPair[]>>;
  zoom: number;
};

function updateCommand(
  commands: CommandPair[],
  changes: CommandPair,
): CommandPair[] {
  return commands.map((command) =>
    command.key === changes.key
      ? { ...command, value: changes.value }
      : command,
  );
}

type InputEditor = {
  x: number;
  y: number;
  w: number;
  h: number;
  t: number;
  filedType: FieldType;
};

type TextEditorProp = {
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  onSubmit: (output: string) => void;
};

function TextEditor({ x, y, width, height, text, onSubmit }: TextEditorProp) {
  const [value, setValue] = useState(text);

  return (
    <textarea
      style={{
        position: 'absolute',
        top: `${y}px`,
        left: `${x}px`,
        width: `${width}px`,
        height: `${height}px`,
      }}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={() => onSubmit(value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          onSubmit(value);
        }
      }}
    />
  );
}

function ValueEditor(i: {
  inp: InputEditor | null;
  submitFunc: (o: string) => void;
}) {
  return <Group></Group>;
}

export default function CommandCard({ commands, setCommands }: ComponentProp) {
  const [input, setInput] = useState<InputEditor | null>(null);

  const submit = (output: string) => {};

  const deleteCommandByKey = (key: number) => {
    setCommands(commands.filter((command) => command.key !== key));
  };

  function addCommand(command: Command) {
    const newCowq = {...command, x: 0, y: 0}; 
    const newCommand = { key: (() => { let key = 0; do { key = Math.floor(Math.random() * 100000); } while (commands.some(cmd => cmd.key === key)); return key })(), value: newCowq };
    setCommands(commands => [...commands, newCommand]);
  }

  return (
    <Layer>
      <ValueEditor inp={input} submitFunc={submit} />
      {commands.map((element) => (
        <Group
          key={element.key}
          x={element.value.x}
          y={element.value.y}
          draggable
          onDragEnd={(e) => {
            const ele = element;
            ele.value.x = e.target.position().x;
            ele.value.y = e.target.position().y;
            setCommands(updateCommand(commands, ele));
          }}
        >
          <Rect
            key={`a${element.key}`}
            x={0}
            y={0}
            width={width}
            height={caculateFullHeigh(element.value.value.rows)}
            fill={element.value.value.color}
            cornerRadius={10}
            stroke="black"
            strokeWidth={2}
          />

          <Group x={5} y={5} key={`b${element.key}`}>
            <Text
              key={`ba${element.key}`}
              x={0}
              y={0}
              text={element.value.value.name}
              fill={'white'}
              fontSize={19}
            />
            <Delete
              x={widthPadded - 20}
              y={2}
              size={16}
              strokeWidth={2}
              fill={'black'}
              onClick={() => deleteCommandByKey(element.key)}
            />
            <Copy 
              x={widthPadded - 20 - 20 - padding}
              y={2}
              size={16}
              strokeWidth={2}
              fill='black'
              onClick={() => {addCommand(element.value)}}
            />
          </Group>

          <Group x={padding} y={headerHeight} key={`c${element.key}`}>
            <Rect
              key={`ca${element.key}`}
              x={0}
              y={0}
              width={widthPadded}
              height={caculateHeigh(element.value.value.rows)}
              fill={'#0009'}
              cornerRadius={5}
            />
            {element.value.value.fields.map((meow, index) => {
              const fieldSize =
                meow.value.fieldSize *
                (widthPadded / element.value.value.columns);
              const x = meow.value.x * fieldSize;
              const y = meow.value.y * valueHeight;

              return (
                <Group x={x} y={y} key={index}>
                  <Text
                    x={padding}
                    y={doublePadding + 2}
                    fontSize={14}
                    text={meow.value.placeHolder}
                    fill="white"
                  />
                  <Rect
                    x={meow.value.placeHolderWidth}
                    y={padding}
                    width={fieldSize - padding - meow.value.placeHolderWidth}
                    height={30 - padding}
                    fill={element.value.value.color}
                    cornerRadius={5}
                  />
                </Group>
              );
            })}
          </Group>
        </Group>
      ))}
    </Layer>
  );
}
