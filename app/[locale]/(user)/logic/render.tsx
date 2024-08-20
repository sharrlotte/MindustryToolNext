'use client';

import React from "react";
import { Command } from "./command";
import { Rect, Group, Text } from 'react-konva';

interface a {
  windowWidth: number;
  windowHeight: number;
  posx: number;
  posy: number;
  psx: number;
  psy: number;
  dragx: number;
  dragy: number;
  maxContext: number;
  negMaxContext: number;
  scale: number;
}

export default function render(commandMap: Map<number, Command>, position: a) {
  const display: React.JSX.Element[] = [];
  display[0] = (<Group></Group>);

  commandMap.forEach((object, id) => {
    const meow = (
      <Group
        key={`element-${id}`}
        draggable
        x={object.posx - position.posx}
        y={object.posy - position.posy}
        onDragStart={(e) => { object.lastx = e.evt.clientX; object.lasty = e.evt.clientY }}
        onDragMove={(e) => {
          object.posx += (e.evt.clientX - object.lastx) / position.scale;
          object.posy += (e.evt.clientY - object.lasty) / position.scale;
          object.lastx = e.evt.clientX;
          object.lasty = e.evt.clientY;
        }}
        onDragEnd={(e) => {
          object.posx += (e.evt.clientX - object.lastx) / position.scale;
          object.posy += (e.evt.clientY - object.lasty) / position.scale;
          object.lastx = e.evt.clientX;
          object.lasty = e.evt.clientY;
        }}
      >
        <Rect
          key={`background_box_${id}`}
          x={0}
          y={0}
          width={300}
          height={(object.gridSize + 1.2) * 50}
          cornerRadius={5}
          fill={object.color}
        />

        <Rect
          key={`content_box${id}`}
          x={5}
          y={35}
          width={290}
          height={(object.gridSize + 0.4) * 50}
          fill={'#000000aa'}
          cornerRadius={5}
        />

        <Text
          key={`element_name${id}`}
          x={5}
          y={10}
          text={object.name}
          fontSize={19}
        />

        <Group
          key={`field_${id}`}
          x={5}
          y={35}
          width={290}
          height={20 + (object.gridSize * 50)}
        >
          {object.value.map((value, index) => (
            <Rect
              key={'filling_rect' + id + index}
              x={(290 / object.columnCount) * value.x}
              y={(value.y * 50) + ((20 / object.gridSize) * value.y)}
              width={(290 / object.columnCount) * value.expand}
              height={50 + (20 / object.gridSize)}
              fill={"green"}
            />
          ))}
        </Group>

        <Group key={`connection_node_${id}`}>
          {/* Add any connection-related elements here */}
        </Group>

        <Group key={`connection_${id}`}>
          {/* Add any connection-related elements here */}
        </Group>
      </Group>);
    if (!object.isStart)
      display.push(meow);
    else
      display[0] = meow;
  });

  return display;
}