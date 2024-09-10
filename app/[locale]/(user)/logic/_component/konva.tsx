'use client';

import { Circle, Group, Line, Rect, Text } from 'react-konva';
import Command, { CommandValue, FieldType } from '../command';
import {
  doublePadding,
  padding,
  valueHeight,
  widthPadded,
} from './command-card';
import { useCallback, useEffect, useState } from 'react';
const ConnectionPoint = ({
  index,
  circleRadius,
  spacingElement,
  command,
  totalCommands,
}: {
  index: number;
  circleRadius: number;
  spacingElement: number;
  command: Command;
  totalCommands: number;
}) => {
  const center = circleRadius / 2;
  const [{ endX, endY }, setConnectionLine] = useState({
    endX: 0,
    endY: 0,
  });

  const setPos = useCallback((x?: number, y?: number) => {
    setConnectionLine({
      endX: x !== undefined ? x : center,
      endY: y !== undefined ? y : center,
    });
  }, [setConnectionLine, center]);

  useEffect(() => {
    setPos();
  }, [setPos]);

  return (
    <Group x={0} y={index * (circleRadius + spacingElement)} key={index}>
      <Circle
        x={center}
        y={center}
        radius={center}
        fill={'white'}
        onClick={() => setPos()} 
      />
      <AutoCurvedLine startX={center} startY={center} endX={endX} endY={endY} />
      <Circle
        x={endX}
        y={endY}
        radius={center}
        fill={'white'}
        draggable
        onDragMove={(e) => {
          e.cancelBubble = true;
          const { x, y } = e.target.position();
          setPos(x, y);
        }}
        onDragEnd={(e) => {
          e.cancelBubble = true;
          setPos();
        }}
      />
    </Group>
  );
};

export const CommandConnectNode = ({
  commands,
  element,
  elementHeigh,
  x,
}: {
  commands: Command[];
  element: Command;
  elementHeigh: number;
  x: number;
}) => {
  const circleRadius = 20;
  const spacingElement = 5;
  const totalElementHeigh =
    element.value.outputs.length * (circleRadius + spacingElement) -
    spacingElement;
  const elementStart = (elementHeigh - totalElementHeigh) / 2;

  return (
    <Group x={x} y={elementStart}>
      {element.value.outputs.map((output, index) => (
        <ConnectionPoint
          key={index}
          index={index}
          circleRadius={circleRadius}
          spacingElement={spacingElement}
          command={element}
          totalCommands={commands.length}
        />
      ))}
    </Group>
  );
};

export const AutoCurvedLine = ({
  startX,
  startY,
  endX,
  endY,
}: {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}) => {

  return (
    <Line
      points={[
        startX,
        startY,
        (startX + endX) / 2,
        startY,
        (startX + endX) / 2,
        endY,
        endX,
        endY,
      ]}
      stroke="white"
      strokeWidth={4}
      lineCap="round"
      bezier={true}
      listening={false}
    />
  );
};