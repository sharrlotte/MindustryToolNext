'use client';

import React, { useMemo, Dispatch, SetStateAction } from 'react';
import { Group, Rect, Text } from 'react-konva';
import Command, { CommandValue, FieldType } from '../command';
import { SelectInputProps } from '@/app/[locale]/(user)/logic/main/editor';
import { Position } from '@/app/[locale]/(user)/logic/main/logic';

export const padding = 5;
export const doublePadding = padding * 2;
export const width = 300;
export const headerHeight = 30;
export const valueHeight = 30;
export const emptyValueListHeight = 20;
export const widthPadded = width - doublePadding;

export const connectCircleRadius = 10;
export const connectSpacingBetweenConnect = 10;

export const calculateConnectHeigh = (totalIndex: number) =>
  totalIndex * (2 * connectCircleRadius + connectSpacingBetweenConnect) +
  connectSpacingBetweenConnect;

export const calculateValueHeight = (rows: number) =>
  rows === 0 ? emptyValueListHeight : valueHeight * rows;

export const calculateFullHeight = (rows: number) =>
  calculateValueHeight(rows) + headerHeight + doublePadding;

type CommandCardProp = {
  commands: Command[];
  elementValue: CommandValue;
  index: number;
  position: Position;
  setCommands: Dispatch<SetStateAction<Command[]>>;
  deleteCommand: (index: number) => void;
  copyCommand: (index: number) => void;
  selectInput: (arg0: SelectInputProps) => void;
  findCommandByIndex: (index: number) => Command;
};

export default function CommandCard({
  elementValue,
  index,
  position,
  deleteCommand,
  copyCommand,
  selectInput,
  findCommandByIndex,
}: CommandCardProp) {
  const calculatePosition = useMemo(
    () => (pos: number, element: number) =>
      (element + pos / position.scale) * position.scale,
    [position.scale],
  );

  const handleFieldClick = useMemo(
    () => (field: FieldType, fIndex: number) => {
      const value =
        typeof field.parseValue === 'string' ? field.parseValue : '';
      selectInput({
        commandIndex: index,
        fieldIndex: fIndex,
        defaultValue: field.displayValue ? field.displayValue : value,
        inputType: field.inputType,
        x: calculatePosition(
          position.posx,
          findCommandByIndex(index).x +
            field.placeHolderWidth +
            padding +
            field.x * (widthPadded / elementValue.columns),
        ),
        y: calculatePosition(
          position.posy,
          findCommandByIndex(index).y +
            headerHeight +
            padding +
            field.y * valueHeight,
        ),
        width:
          (field.fieldSize * (widthPadded / elementValue.columns) -
            field.placeHolderWidth -
            padding) *
          (position.scale < 1 ? 1 : position.scale),
        height:
          (valueHeight - padding) * (position.scale < 1 ? 1 : position.scale),
      });
    },
    [
      calculatePosition,
      elementValue.columns,
      findCommandByIndex,
      index,
      position.posx,
      position.posy,
      position.scale,
      selectInput,
    ],
  );

  return (
    <Group>
      <Rect
        width={width}
        height={calculateFullHeight(elementValue.rows)}
        fill={elementValue.color}
        cornerRadius={padding}
        stroke="black"
        strokeWidth={1}
      />
      <Group x={padding} y={padding}>
        <Text
          x={padding}
          y={2}
          text={elementValue.name + ' - ' + index}
          fill={'white'}
          fontSize={18}
        />
        <Rect
          x={widthPadded - 20}
          y={2}
          width={16}
          height={16}
          fill={'#FF4C4C'}
          cornerRadius={5}
          onClick={() => deleteCommand(index)}
        />
        <Rect
          x={widthPadded - 40}
          y={2}
          width={16}
          height={16}
          cornerRadius={5}
          fill={'#4CAF50'}
          onClick={() => copyCommand(index)}
        />
      </Group>
      <Group
        x={padding}
        y={headerHeight}
        width={widthPadded}
        height={calculateValueHeight(elementValue.rows) + padding}
      >
        <Rect
          width={widthPadded}
          height={calculateValueHeight(elementValue.rows) + padding}
          fill={'#0009'}
          cornerRadius={5}
        />
        {elementValue.fields.map((field, fIndex) =>
          field.linkedOutput ? (
            <Group key={fIndex}></Group>
          ) : (
            <Group
              key={fIndex}
              x={
                field.x * field.fieldSize * (widthPadded / elementValue.columns)
              }
              y={field.y * valueHeight}
            >
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
                width={
                  field.fieldSize * (widthPadded / elementValue.columns) -
                  padding -
                  field.placeHolderWidth
                }
                height={valueHeight - padding}
                fill={elementValue.color}
                cornerRadius={2}
                onClick={() => handleFieldClick(field, fIndex)}
              />
              <Text
                x={field.placeHolderWidth + padding}
                y={doublePadding + 5}
                width={
                  field.fieldSize * (widthPadded / elementValue.columns) -
                  doublePadding -
                  field.placeHolderWidth
                }
                fill={'white'}
                fontSize={14}
                height={11}
                text={`${field.displayValue ? field.displayValue : field.parseValue}`}
                listening={false}
                ellipsis={true}
              />
            </Group>
          ),
        )}
      </Group>
    </Group>
  );
}
