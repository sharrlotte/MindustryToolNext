'use client';

import React, { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import Command from "../command";
import { Layer, Group, Rect } from 'react-konva';

const width = 300;
const headerHeight = 30;
const valueHeight = 30;
const emptyValueListHeight = 20;

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
            x={0} y={0}
            width={width}
            height={headerHeight + (valueHeight * element.value.value.rows) + (element.value.value.rows === 0 ? 0 : emptyValueListHeight)}
            fill={element.value.value.color}
            cornerRadius={10}
            stroke="black"
            strokeWidth={2}
          />
        </Group>
      ))}
    </Layer>
  );
}


