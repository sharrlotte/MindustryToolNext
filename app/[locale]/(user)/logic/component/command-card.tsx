'use client';

import React, { Dispatch, SetStateAction } from "react";
import { Delete } from "./icon";
import Command from "../command";
import { Layer, Group, Rect, Text } from 'react-konva';

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
  commands: { key: number, value: Command }[],
  setCommands: Dispatch<SetStateAction<{ key: number; value: Command }[]>>
  zoom: number
};

function updateCommand(commands: { key: number; value: Command }[], changes: { key: number; value: Command }): { key: number; value: Command }[] {
  return commands.map(command =>
    command.key === changes.key ? { ...command, value: changes.value } : command
  );
}

export default function CommandCard({ commands, setCommands }: ComponentProp) {
  
  const deleteCommandByKey = (key: number) => {
    setCommands(commands.filter(command => command.key !== key));
  };

  return (
    <Layer>
      {commands.map(element => (
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
            x={0} y={0}
            width={width}
            height={caculateFullHeigh(element.value.value.rows)}
            fill={element.value.value.color}
            cornerRadius={10}
            stroke="black"
            strokeWidth={2}
          />

          <Group x={5} y={5} key={`b${element.key}`}>
            <Text key={`ba${element.key}`} x={0} y={0} text={element.value.value.name} fill={'white'} fontSize={19} />
            <Delete x={widthPadded - 20} y={2} size={16} strokeWidth={2} fill={"black"} onClick={() => deleteCommandByKey(element.key)} />
          </Group>

          <Group x={padding} y={headerHeight} key={`c${element.key}`}>
            <Rect
              key={`ca${element.key}`}
              x={0} y={0}
              width={widthPadded}
              height={caculateHeigh(element.value.value.rows)}
              fill={'#0009'}
              cornerRadius={5}
            />
          </Group>
        </Group>
      ))}
    </Layer>
  );
}
