'use client';

import React, { Dispatch, SetStateAction } from "react";
import Command from "../command";
import { Layer, Group, Rect } from 'react-konva';

// default settings.
const padding = 5;
const fontSize = 18;
const emptyValueListHeigh = 20;

const width = 300;
const headerHeigh = 30;
const valueHeigh = 30;

type ComponentProp = {
  commands: { key: number, value: Command }[],
  setCommands: Dispatch<SetStateAction<{ key: number; value: Command }[]>>
};

function updateCommand(commands: { key: number; value: Command }[],changes: { key: number; value: Command }): { key: number; value: Command }[]{
  return commands.map(command =>
    command.key === changes.key ? { ...command, value: changes.value } : command
  );
}

export default function CommandCard({ commands, setCommands }: ComponentProp) {

  return (<Layer>
    {commands.map((element) => (
      <Group
        key={`${element.key}`}
        x={element.value.x}
        y={element.value.y}
      >
        <Rect
          x={0} y={0}
          width={width}
          height={headerHeigh + (valueHeigh * element.value.value.rows) + (element.value.value.rows == 0 ? 0 : emptyValueListHeigh)}
          fill={element.value.value.color}
          cornerRadius={10}
          stroke="black"
          strokeWidth={2}
          onMouseDown={() => {const ele = element; ele.value.drag = true; setCommands(updateCommand(commands, ele))}}

        />
      </Group>
    ))}
  </Layer>);
}