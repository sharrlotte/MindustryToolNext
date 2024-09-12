'use client';

import React, {
  useMemo,
  useCallback,
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
} from 'react';
import { Group, Rect, Text, Circle, Line } from 'react-konva';
import Command, { CommandValue, FieldType } from '../command';
import { selectInputProps } from '../editor';
import { Position } from '../logic';

export const padding = 5;
export const doublePadding = padding * 2;
export const width = 300;
export const headerHeight = 30;
export const valueHeight = 30;
export const emptyValueListHeight = 20;
export const widthPadded = width - doublePadding;

// connect
export const connectCircleRadius = 10;
export const connectSpacingBetweenConnect = 10;

const calculateConnectHeigh = (totalIndex: number) =>
  totalIndex * (2 * connectCircleRadius + connectSpacingBetweenConnect) +
  connectSpacingBetweenConnect;

const calculateValueHeight = (rows: number) =>
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
  selectInput: (arg0: selectInputProps) => void;
  findCommandByIndex: (index: number) => Command;
};

export default function CommandCard({
  elementValue,
  index,
  position,
  commands,
  setCommands,
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
      const value = typeof field.value === 'string' ? field.value : '';
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
          text={elementValue.name}
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
        {elementValue.fields.map((field, fIndex) => (
          <Group
            key={fIndex}
            x={field.x * field.fieldSize * (widthPadded / elementValue.columns)}
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
              text={`${field.displayValue ? field.displayValue : field.value}`}
              listening={false}
              ellipsis={true}
            />
          </Group>
        ))}
      </Group>
      <Group
        x={width + padding}
        y={
          (calculateFullHeight(elementValue.rows) -
            calculateConnectHeigh(elementValue.outputs.length)) /
          2
        }
      >
        {elementValue.outputs.map((_, oIndex) => (
          <ConnectionPoint
            key={oIndex}
            cIndex={index}
            oIndex={oIndex}
            commands={commands}
            elementValue={elementValue}
            setCommands={setCommands}
            findCommandByIndex={findCommandByIndex}
          />
        ))}
      </Group>
    </Group>
  );
}

const ConnectionPoint = ({
  cIndex,
  oIndex,
  commands,
  elementValue,
  setCommands,
  findCommandByIndex,
}: {
  cIndex: number;
  oIndex: number;
  commands: Command[];
  elementValue: CommandValue;
  setCommands: Dispatch<SetStateAction<Command[]>>;
  findCommandByIndex: (index: number) => Command;
}) => {
  const calculateNowX = useCallback(
    () => findCommandByIndex(cIndex).x + width + padding,
    [cIndex, findCommandByIndex],
  );

  const calculateNowY = useCallback(
    () =>
      findCommandByIndex(cIndex).y +
      (calculateFullHeight(elementValue.rows) -
        calculateConnectHeigh(elementValue.outputs.length)) /
        2 +
      calculateConnectHeigh(oIndex),
    [
      cIndex,
      findCommandByIndex,
      elementValue.rows,
      oIndex,
      elementValue.outputs.length,
    ],
  );

  const [{ posX, posY }, setWirePos] = useState({
    posX: connectCircleRadius,
    posY: connectCircleRadius,
  });

  const handleDrag = (x: number, y: number) => {
    setWirePos({ posX: x, posY: y });
  };

  const handleFinish = (x: number, y: number) => {
    const dragX = x + calculateNowX();
    const dragY = y + calculateNowY();
    setCommands((commands) => {
      commands.forEach((command, index) => {
        if (
          command.x < dragX &&
          dragX < command.x + width &&
          command.y < dragY &&
          dragY < command.y + calculateFullHeight(command.value.rows) &&
          index != cIndex
        ) {
          setWirePos({
            posX:
              commands[index].x -
              calculateNowX() -
              padding -
              connectCircleRadius,
            posY:
              commands[index].y -
              calculateNowY() +
              calculateFullHeight(commands[index].value.rows) / 2,
          });
          commands[cIndex].value.outputs[oIndex].value = index;
          return commands;
        }
      });

      if (commands[cIndex].value.outputs[oIndex].value == -1) {
        setWirePos({ posX: connectCircleRadius, posY: connectCircleRadius });
      }

      return commands;
    });
  };

  const handleReset = useCallback(() => {
    setCommands((commands) => {
      if (commands[cIndex]) {
        commands[cIndex].value.outputs[oIndex].value = -1;
      }
      return commands;
    });

    setWirePos({
      posX: connectCircleRadius,
      posY: connectCircleRadius,
    });
  }, [setCommands, setWirePos, cIndex, oIndex]);

  useEffect(() => {
    setCommands((elements) => {
      if (
        elements[cIndex].value.outputs[oIndex].value != -1 &&
        elements[elements[cIndex].value.outputs[oIndex].value] == undefined
      ) {
        elements[cIndex].value.outputs[oIndex].value = -1;
        handleReset();
        return elements;
      }

      if (elements[cIndex].value.outputs[oIndex].value != -1) {
        setWirePos({
          posX:
            elements[elements[cIndex].value.outputs[oIndex].value].x -
            calculateNowX() -
            padding -
            connectCircleRadius,
          posY:
            elements[elements[cIndex].value.outputs[oIndex].value].y -
            calculateNowY() +
            calculateFullHeight(
              elements[elements[cIndex].value.outputs[oIndex].value].value.rows,
            ) /
              2,
        });
      }

      return elements;
    });
  }, [
    commands,
    handleReset,
    setCommands,
    setWirePos,
    cIndex,
    calculateNowX,
    calculateNowY,
    oIndex,
  ]);

  return (
    <Group x={0} y={calculateConnectHeigh(oIndex)}>
      <Line
        points={[
          connectCircleRadius,
          connectCircleRadius,
          (connectCircleRadius + posX) / 2,
          connectCircleRadius,
          (connectCircleRadius + posX) / 2,
          posY,
          posX,
          posY,
        ]}
        stroke="white"
        strokeWidth={4}
        lineCap="round"
        bezier={true}
        listening={false}
      />
      <Circle
        x={connectCircleRadius}
        y={connectCircleRadius}
        radius={connectCircleRadius}
        fill="yellow"
        onClick={handleReset}
      />
      <Circle
        x={posX}
        y={posY}
        radius={connectCircleRadius}
        fill="white"
        draggable
        onDragMove={(e) => {
          e.cancelBubble = true;
          const { x, y } = e.target.position();
          handleDrag(x, y);
        }}
        onDragEnd={(e) => {
          e.cancelBubble = true;
          const { x, y } = e.target.position();
          handleFinish(x, y);
        }}
      />
    </Group>
  );
};
