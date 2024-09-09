'use client';

import React, { Dispatch, SetStateAction } from 'react';
import Command from '../command';
import { Layer, Rect } from 'react-konva';
import {
  InteractCard,
  CommandHeader,
  CommandBody,
  CommandField,
} from './konva';
import { selectInuptProps } from '../editor';
import { Position } from './logic';

export const padding = 5;
export const doublePadding = padding * 2;
export const width = 300;
export const headerHeight = 30;
export const valueHeight = 30;
export const emptyValueListHeight = 20;
export const widthPadded = width - doublePadding;

const calculateValueHeigh = (rows: number) =>
  rows === 0 ? emptyValueListHeight : valueHeight * rows;
const calculateFullHeigh = (rows: number) =>
  calculateValueHeigh(rows) + headerHeight + doublePadding;

type CommandCardProp = {
  commands: Command[];
  position: Position;
  setCommands: Dispatch<SetStateAction<Command[]>>;
  addCommand: (command: Command) => void;
  deleteCommand: (index: number) => void;
  replaceCommand: (command: Command, index: number) => void;
  copyCommand: (command: Command) => void;
  selectInput: (arg0: selectInuptProps) => void;
};

export default function CommandCard({
  commands,
  position,
  deleteCommand,
  replaceCommand,
  copyCommand,
  selectInput,
}: CommandCardProp) {
  const calculatePosition = (pos: number, element: number) =>
    (element - (-pos / position.scale)) * position.scale;

  return (
    <Layer>
      {commands.map((element, index) => (
        <InteractCard
          key={index}
          index={index}
          command={element}
          replaceFunction={replaceCommand}
        >
          <Rect
            width={width}
            height={calculateFullHeigh(element.value.rows)}
            fill={element.value.color}
            cornerRadius={10}
            stroke="black"
            strokeWidth={2}
          />

          <CommandHeader
            command={element}
            index={index}
            onCopy={copyCommand}
            onDelete={deleteCommand}
          />

          <CommandBody
            x={padding}
            y={headerHeight}
            width={widthPadded}
            height={calculateValueHeigh(element.value.rows)}
          >
            {element.value.fields.map((field, fIndex) => (
              <CommandField
                key={fIndex}
                x={
                  field.x *
                  field.fieldSize *
                  (widthPadded / element.value.columns)
                }
                y={field.y * valueHeight}
                fieldSize={
                  field.fieldSize * (widthPadded / element.value.columns)
                }
                color={element.value.color}
                field={field}
                onClickField={() => {
                  const value =
                    typeof field.value === 'string' ? field.value : '';
                  selectInput({
                    commandIndex: index,
                    fieldIndex: fIndex,
                    defaultValue: field.displayValue
                      ? field.displayValue
                      : value,
                    inputType: field.inputType,
                    x: calculatePosition(
                      position.posx,
                      element.x + field.placeHolderWidth + padding,
                    ),
                    y: calculatePosition(
                      position.posy,
                      element.y + headerHeight + padding,
                    ),
                    width:
                      field.fieldSize * (widthPadded / element.value.columns) -
                      field.placeHolderWidth -
                      padding,
                  });
                }}
              />
            ))}
          </CommandBody>
        </InteractCard>
      ))}
    </Layer>
  );
}
