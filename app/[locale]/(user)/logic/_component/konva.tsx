'use client';

import { Circle, Group, Line, Rect, Text } from 'react-konva';
import Command, { FieldType } from '../command';
import {
  doublePadding,
  padding,
  valueHeight,
  widthPadded,
} from './command-card';
import { useCallback, useEffect, useState } from 'react';
import { KonvaEventObject } from 'konva/lib/Node';
import { Copy, Delete } from './icon';

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
      {element.value.outputs.map((output, index) => {
        const center = circleRadius / 2;
        const [{ endX, endY }, setConnectionLine] = useState({
          endX: 0,
          endY: 0,
        });

        const setPos = (x?: number, y?: number) =>
          setConnectionLine({ endX: x ? x : center, endY: y ? y : center });
        
        useEffect(() => {
          setPos();
        }, []);

        return (
          <Group x={0} y={index * (circleRadius + spacingElement)} key={index}>
            <Circle
              x={center}
              y={center}
              radius={center}
              fill={'white'}
              onClick={() => setPos}
            />
            <AutoCurvedLine
              startX={center}
              startY={center}
              endX={endX}
              endY={endY}
            />
            <Circle
              x={endX}
              y={endY}
              radius={center}
              fill={'white'}
              draggable
              onDragMove={(e) => {
                e.cancelBubble = true;
                setPos(e.target.position().x, e.target.position().y);
              }}
              onDragEnd={(e) => {
                e.cancelBubble = true;
                setPos();
              }}
            />
          </Group>
        );
      })}
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
  const controlPointX1 = (startX + endX) / 2;
  const controlPointY1 = startY;
  const controlPointX2 = (startX + endX) / 2;
  const controlPointY2 = endY;

  return (
    <Line
      points={[
        startX,
        startY,
        controlPointX1,
        controlPointY1,
        controlPointX2,
        controlPointY2,
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

export const CommandField = ({
  x,
  y,
  fieldSize,
  color,
  field,
  onClickField,
}: {
  x: number;
  y: number;
  fieldSize: number;
  color: string;
  field: FieldType;
  onClickField: () => void;
}) => (
  <Group x={x} y={y}>
    <Text
      x={padding}
      y={doublePadding + 2}
      fontSize={14}
      text={field.placeHolder}
      fill="white"
    />
    <Rect
      x={field.placeHolderWidth}
      y={padding}
      width={fieldSize - padding - field.placeHolderWidth}
      height={valueHeight - padding}
      fill={color}
      cornerRadius={5}
    />
    <Text
      x={field.placeHolderWidth + padding}
      y={doublePadding + 5}
      width={fieldSize - doublePadding - field.placeHolderWidth}
      fill={'white'}
      fontSize={14}
      height={11}
      text={`${field.displayValue ? field.displayValue : field.value}`}
      ellipsis={true}
    />
    <Rect
      x={field.placeHolderWidth}
      y={padding}
      width={fieldSize - padding - field.placeHolderWidth}
      height={valueHeight - padding}
      onClick={() => {
        onClickField();
      }}
    />
  </Group>
);

export const CommandBody = ({
  x,
  y,
  width,
  height,
  children,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  children: React.ReactNode;
}) => (
  <Group x={x} y={y}>
    <Rect width={width} height={height} fill={'#0009'} cornerRadius={5} />
    {children}
  </Group>
);

export function InteractCard({
  index: key,
  command,
  replaceFunction,
  children,
}: {
  index: number;
  command: Command;
  replaceFunction: (command: Command, index: number) => void;
  children: React.ReactNode;
}) {
  const handleDragEnd = useCallback(
    (e: KonvaEventObject<DragEvent>) => {
      const x = e.target.position().x;
      const y = e.target.position().y;
      replaceFunction({ ...command, x, y }, key);
    },
    [command, key, replaceFunction],
  );

  return (
    <Group x={command.x} y={command.y} draggable onDragEnd={handleDragEnd}>
      {children}
    </Group>
  );
}

export const CommandHeader = ({
  command,
  index,
  onCopy,
  onDelete,
}: {
  command: Command;
  index: number;
  onCopy: (command: Command) => void;
  onDelete: (index: number) => void;
}) => (
  <Group x={padding} y={padding}>
    <Text
      x={padding}
      y={2}
      text={`${command.value.name} - ${command.x.toFixed(0)}, ${command.y.toFixed(0)}`}
      fill={'white'}
      fontSize={18}
    />
    <Delete
      x={widthPadded - 20}
      y={2}
      size={16}
      strokeWidth={2}
      fill={'black'}
      onClick={() => onDelete(index)}
    />
    <Copy
      x={widthPadded - 20 - 20 - padding}
      y={2}
      size={16}
      strokeWidth={2}
      fill="black"
      onClick={() => onCopy(command)}
    />
  </Group>
);
