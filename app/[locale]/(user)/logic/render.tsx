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

const gridHeight = 30;
const spaceOfElement = 10;
const elementWidth = 300;
const padding = 5;
const elementWidthPadded = elementWidth - (padding * 2);
const topHeigh = 30;

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
          width={elementWidth}
          height={topHeigh + spaceOfElement + (object.gridSize * gridHeight) + (padding * 2)}
          cornerRadius={padding}
          fill={object.color}
        />

        <Group
          key={`header_${id}`}
          x={padding}
          y={padding}
          width={elementWidthPadded}
          height={topHeigh - (padding * 2)}
        >
          <Text
            key={`element_name${id}`}
            x={0}
            y={padding}
            text={object.name}
            fontSize={20}
          />
        </Group>

        <Group
          key={`inside_content_${id}`}
          x={padding}
          y={topHeigh + padding}
          width={elementWidthPadded}
          height={topHeigh + spaceOfElement + (object.gridSize * gridHeight) + (padding * 2)}
        >
          <Rect
            key={`filling_content_${id}`}
            x={0}
            y={0}
            width={elementWidthPadded}
            height={spaceOfElement + (object.gridSize * gridHeight)}
            fill={'#000000aa'}
            cornerRadius={5}
          />

          {object.value.map((value, index) => {
            (
              x = value.x * (elementWidthPadded / object.columnCount),
              y = 100
            ) => (
              <Group
                key={`display_object_${id + '_' + index}`}
                x={x}

              ></Group>
            )
          })}
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