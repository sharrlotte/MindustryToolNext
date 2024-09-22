'use client';

import { Circle, Group, Line } from "react-konva";
import { width, padding, calculateFullHeight, calculateConnectHeigh, connectCircleRadius } from "./command-card";
import Command, { CommandValue } from "../command";
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";

export default function CommandConnectPoint({
	elementValue,
	index,
	commands,
	setCommands,
	findCommandByIndex
} : {
	elementValue: CommandValue;
	index: number;
  commands: Command[];
  setCommands: Dispatch<SetStateAction<Command[]>>;
  findCommandByIndex: (index: number) => Command;
}) {

	return (<Group
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
	</Group>)
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
  const [isDrag, setDrag] = useState(false);

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
        (elements[cIndex].value.outputs[oIndex].value != -1 &&
          elements[elements[cIndex].value.outputs[oIndex].value] ==
            undefined) ||
        (elements[cIndex].value.outputs[oIndex].value != -1 &&
          elements[elements[cIndex].value.outputs[oIndex].value] != undefined &&
          elements[elements[cIndex].value.outputs[oIndex].value].value.name ==
            'Start')
      ) {
        handleReset();
        return elements;
      }

      if (elements[cIndex].value.outputs[oIndex].value == -1 && !isDrag) {
        setWirePos({
          posX: connectCircleRadius,
          posY: connectCircleRadius,
        });
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
    isDrag,
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
          setDrag(true);
        }}
        onDragEnd={(e) => {
          e.cancelBubble = true;
          const { x, y } = e.target.position();
          handleFinish(x, y);
          setDrag(false);
        }}
      />
    </Group>
  );
};
