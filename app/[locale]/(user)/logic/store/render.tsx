'use client';

import React from 'react';
import { Command, fieldType} from './command';
import { Rect, Group, Text, Line } from 'react-konva';
import Konva from 'konva';

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
const elementWidthPadded = elementWidth - padding * 2;
const topHeight = 30;

const onDragStart = (e: Konva.KonvaEventObject<DragEvent>, object: Command) => {
  object.lastx = e.evt.clientX;
  object.lasty = e.evt.clientY;
};

const onDragMove = (e: Konva.KonvaEventObject<DragEvent>, object: Command, position: Position) => {
  object.posx += (e.evt.clientX - object.lastx) / position.scale;
  object.posy += (e.evt.clientY - object.lasty) / position.scale;
  object.lastx = e.evt.clientX;
  object.lasty = e.evt.clientY;
};

const calculateTotalCharPercentage = (str: string, chars: string[]): number => {
  const totalLength = str.length;
  if (totalLength === 0) return 0;

  const charCounts: { [char: string]: number } = {};
  chars.forEach(char => {
    charCounts[char] = (str.match(new RegExp(char, 'g')) || []).length;
  });

  let totalPercentage = 0;
  for (const char in charCounts) {
    totalPercentage += charCounts[char] / totalLength;
  }

  return totalPercentage;
};

const render = (commandMap: Map<number, Command>, position: Position) => {
  const display: React.JSX.Element[] = [];

  commandMap.forEach((object, id) => {
    const height = topHeight + spaceOfElement + object.gridSize * gridHeight + padding * 2;

    const textWidth = elementWidthPadded / object.columnCount;
    const maxChar = (width: number, bfTextWidth: number, text: string) => 
      Math.floor((width - padding * 2 - bfTextWidth) / (3.5 + (5.5 - (calculateTotalCharPercentage(text, ['t', 'i', 'f', 'j', 'l', 'I', 'J']) * 5.5))));

    const getText = (value: fieldType, width: number) => {
      const maxCharCount = maxChar(width, value.bfTextWidth, value.inputType.value);
      const text = value.inputType.value.length > maxCharCount
        ? '..' + value.inputType.value.slice(-maxCharCount + 1)
        : value.inputType.value;
      return (
        <Text
          x={padding + value.bfTextWidth}
          y={padding + 6}
          width={width - padding * 2 - value.bfTextWidth}
          align="center"
          fontSize={14}
          fill="white"
          text={text}
        />
      );
    };

    display.push(
      <Group
        key={id}
        draggable
        x={object.posx - position.posx}
        y={object.posy - position.posy}
        onDragStart={(e) => onDragStart(e, object)}
        onDragMove={(e) => onDragMove(e, object, position)}
        onDragEnd={(e) => onDragMove(e, object, position)}
      >
        <Rect
          key={`bgb${id}`}
          x={0}
          y={0}
          width={elementWidth}
          height={height}
          cornerRadius={padding}
          fill={object.color}
          stroke="white"
          strokeWidth={1}
        />

        <Group
          key={`hd${id}`}
          x={padding}
          y={padding}
          width={elementWidthPadded}
          height={topHeight - padding * 2}
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
          height={spaceOfElement + object.gridSize * gridHeight}
        >
          <Rect
            key={`fc${id}`}
            x={0}
            y={0}
            width={elementWidthPadded}
            height={spaceOfElement + object.gridSize * gridHeight}
            fill="#000a"
            cornerRadius={5}
          />

          {object.values.map((value, index) => {
            const width = textWidth * value.expand;
            const height = gridHeight + spaceOfElement / object.gridSize;
            return (
              <Group
                key={`do${id + index}`}
                x={value.x * textWidth}
                y={value.y * height}
                width={width}
                height={height}
              >
                <Text
                  key={`t${id + index}`}
                  x={padding}
                  y={padding + 4}
                  fontSize={16}
                  fill="white"
                  text={value.beforeText}
                />
                <Line
                  key={`hul${id}`}
                  x={0}
                  y={gridHeight - 3}
                  points={[5 + value.bfTextWidth, 0, width - 5, 0]}
                  stroke={object.color}
                  strokeWidth={3}
                  lineCap="round"
                />
                {getText(value, width)}
              </Group>
            );
          })}
        </Group>

        <Group
          key={`cn${id}`}
          x={300}
          y={0}
          width={50}
          height={height}
        />
      </Group>
    );
  });

  return display;
};

export default render;
