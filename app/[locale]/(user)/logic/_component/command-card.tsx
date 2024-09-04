'use client';

import React, { Dispatch, SetStateAction, useCallback, useState } from 'react';
import { Delete, Copy } from './icon';
import Command, { InputType, } from '../command';
import { Layer, Group, Rect, Text } from 'react-konva';
import { Html } from 'react-konva-utils';
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
  commands: CommandPair[];
  setCommands: Dispatch<SetStateAction<CommandPair[]>>;
  zoom: number;
};

function updateCommand(commands: CommandPair[], changes: CommandPair) {
  return commands.map((command) => command.key === changes.key ? { ...command, value: changes.value } : command);
}

type InputEditor = {
  x: number;
  y: number;
  w: number;
  h: number;
  t: string;
  commandKey: number;
  fieldKey: number;
  inputType: InputType;
};

type TextEditorProp = {
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  onSubmit: (output: string, displayOutput?: string) => void;
};

function TextEditor({ x, y, width, height, text, onSubmit }: TextEditorProp) {
  const [value, setValue] = useState(text);

  return (
    <Html>
      <textarea
        className={`fixed top-[${y + 40}px] left-[${x}px] w-[${width}px] h-[${height}px]`}
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
    </Html>

  );
}

function ValueEditor(i: { inp: InputEditor; submitFunc: (o: string, od?: string) => void }) {
  function onClick(output: string, displayOutput?: string) {

  }

  return <Group>
    {() => {
      if (i.inp?.inputType == InputType.TextInput) {
        return;
      } else {
        return (<TextEditor x={i.inp.x} y={i.inp.y} width={i.inp.w} height={i.inp.h} text={i.inp.t}
          onSubmit={onClick} />)
      }
    }}
  </Group>;
}

export default function CommandCard({ commands, setCommands }: ComponentProp) {
  const [input, setInput] = useState<InputEditor | null>(null);

  const submit = (output: string, displayOutput?: string) => {
    const cmn = commands.find((c) => c.key === input?.commandKey)?.value.value.fields
      .find((i) => i.key === input?.fieldKey);

    if (cmn) {
      cmn.value.value = output;
      if (displayOutput) cmn.value.displayValue = displayOutput;
    }
  };

  const editValue = useCallback((value: InputEditor) => {
    setInput(value);
  }, []);

  const deleteCommandByKey = (key: number) => {
    setCommands(commands.filter((command) => command.key !== key));
  };

  function addCommand(command: Command) {
    const newCowq = { ...command, x: 0, y: 0 };
    const newCommand = { key: (() => { let key = 0; do { key = Math.floor(Math.random() * 100000); } while (commands.some(cmd => cmd.key === key)); return key })(), value: newCowq };
    setCommands(commands => [...commands, newCommand]);
  }

  return (
    <Layer>
      <Html></Html>
      <ValueEditor inp={input ? input : { x: 0, y: 0, w: 0, h: 0, t: '', commandKey: -1, fieldKey: -1, inputType: InputType.TextInput }} submitFunc={submit} />
      {commands.map((element) => (
        <Group
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
            width={width}
            height={caculateFullHeigh(element.value.value.rows)}
            fill={element.value.value.color}
            cornerRadius={10}
            stroke="black"
            strokeWidth={2}
          />

          <Group x={5} y={5}>
            <Text
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
              onClick={() => { addCommand(element.value) }}
            />
          </Group>

          <Group x={padding} y={headerHeight}>
            <Rect
              width={widthPadded}
              height={caculateHeigh(element.value.value.rows)}
              fill={'#0009'}
              cornerRadius={5}
            />
            {element.value.value.fields.map((meow) => {
              const fieldSize = meow.value.fieldSize * (widthPadded / element.value.value.columns);
              const x = meow.value.x * fieldSize;
              const y = meow.value.y * valueHeight;

              return (
                <Group x={x} y={y} key={`${meow.key}${element.value.value.name}`}>
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
                  <Text
                    x={meow.value.placeHolderWidth + padding}
                    y={doublePadding + 5}
                    width={fieldSize - doublePadding - meow.value.placeHolderWidth}
                    fill={'white'}
                    fontSize={11} height={11}
                    text={`${meow.value.displayValue ? meow.value.displayValue : meow.value.value}`}
                    ellipsis={true}
                  />
                  <Rect
                    x={meow.value.placeHolderWidth}
                    y={padding}
                    width={fieldSize - padding - meow.value.placeHolderWidth}
                    height={30 - padding}
                    onClick={() => {
                      editValue({
                        x: element.value.x + padding + x,
                        y: element.value.y + headerHeight + y,
                        w: fieldSize - padding - meow.value.placeHolderWidth,
                        h: 30 - padding,
                        t: meow.value.value,
                        commandKey: element.key,
                        fieldKey: meow.key,
                        inputType: meow.value.inputType,
                      })
                    }}
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
