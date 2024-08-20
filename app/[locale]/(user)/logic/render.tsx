'use client';

import React from "react";
import { Command } from "./command";
import { Rect, Group, Text } from 'react-konva';

interface Position {
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
const topHeight = 30;

export default function render(commandMap: Map<number, Command>, position: Position) {
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
          height={topHeight + spaceOfElement + (object.gridSize * gridHeight) + (padding * 2)}
          cornerRadius={padding}
          fill={object.color}
        />

        <Group
          key={`header_${id}`}
          x={padding}
          y={padding}
          width={elementWidthPadded}
          height={topHeight - (padding * 2)}
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
          y={topHeight + padding}
          width={elementWidthPadded}
          height={spaceOfElement + (object.gridSize * gridHeight)}
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
            const correctWidth = (elementWidthPadded / object.columnCount);
            const width = correctWidth * value.expand;
            const height = gridHeight + (spaceOfElement / object.gridSize);
            return (
              <Group
                key={`display_object_${id + '_' + index}`}
                x={value.x * correctWidth}
                y={value.y * height}
                width={width}
                height={height}
              >
                <Rect
                  key={`bg_${id + '_' + index}`}
                  x={0}
                  y={0}
                  width={width}
                  height={height}
                  fill={'yellow'}
                />
              </Group>
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
