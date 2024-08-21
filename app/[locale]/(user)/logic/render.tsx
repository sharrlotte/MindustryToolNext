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
  let markToNotRemove = -1;
  display[0] = (<Group></Group>);

  commandMap.forEach((object, id) => {
    if (object.displayFirst) {
      if (markToNotRemove === -1) {
        markToNotRemove = id;
      } else if (markToNotRemove !== id) {
        object.displayFirst = false;
      }
    }

    const meow = (
      <Group
        key={id}
        draggable
        x={object.posx - position.posx}
        y={object.posy - position.posy}
        onTap={() => { 
          commandMap.forEach((obj, i) => {
            if (i !== id) obj.displayFirst = false;
          });
          object.displayFirst = true; 
          markToNotRemove = id; 
        }}
        onDragStart={(e) => { 
          object.lastx = e.evt.clientX; 
          object.lasty = e.evt.clientY; 
          commandMap.forEach((obj, i) => {
            if (i !== id) obj.displayFirst = false;
          });
          object.displayFirst = true; 
          markToNotRemove = id; 
        }}
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
          key={`bgb${id}`}
          x={0}
          y={0}
          width={elementWidth}
          height={topHeight + spaceOfElement + (object.gridSize * gridHeight) + (padding * 2)}
          cornerRadius={padding}
          fill={object.color}
        />

        <Group
          key={`he${id}`}
          x={padding}
          y={padding}
          width={elementWidthPadded}
          height={topHeight - (padding * 2)}
        >
          <Text
            key={`hen${id}`}
            x={0}
            y={padding}
            text={object.name}
            fontSize={20}
          />
        </Group>

        <Group
          key={`ic${id}`}
          x={padding}
          y={topHeight + padding}
          width={elementWidthPadded}
          height={spaceOfElement + (object.gridSize * gridHeight)}
        >
          <Rect
            key={`fc${id}`}
            x={0}
            y={0}
            width={elementWidthPadded}
            height={spaceOfElement + (object.gridSize * gridHeight)}
            fill={'#000a'}
            cornerRadius={5}
          />

          {object.value.map((value, index) => {
            const correctWidth = (elementWidthPadded / object.columnCount);
            const width = correctWidth * value.expand;
            const height = gridHeight + (spaceOfElement / object.gridSize);
            return (
              <Group
                key={`do${id + '_' + index}`}
                x={value.x * correctWidth}
                y={value.y * height}
                width={width}
                height={height}
              >
                <Rect
                  key={`bg${id + '_' + index}`}
                  x={0}
                  y={0}
                  width={width}
                  height={height}
                  fill={'yellow'}
                />
              </Group>
            );
          })}
        </Group>

        <Group key={`cn${id}`}>
          {/* Add any connection-related elements here */}
        </Group>

        <Group key={`c${id}`}>
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
