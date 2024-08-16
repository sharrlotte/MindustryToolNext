'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Group, Line, Rect } from 'react-konva';

enum inputType {
  text
}

interface FieldType {
  x: number;
  y: number;
  expand: number;
  afterText: string | null;
  inputType: inputType
}

interface Command {
  name: string;
  gridSize: number; 
  value: FieldType[];
  isStart: false;
  output1: -1;
  output2: -1;
}

const defaultCommand: Command = {
  name: "",
  gridSize: 0,
  value: [],
  isStart: false,
  output1: -1,
  output2: -1,
}

const read: Command = {
  ...defaultCommand,
  name: "read",
  gridSize: 2, 
  value: [], // Mảng rỗng
};





const logicList = [[read, ]]

export default function Editor() {
  const [addingPanel, setAddingPanel] = useState({
    display: 'hidden'
  });

  // fuck. debug
  const [isDrag, setDrag] = useState({
    isDrag: false
  });

  const [position, setPosition] = useState({
    windowWidth: window.innerWidth,
    windowHeight: window.innerHeight - 40,
    posx: -100,
    posy: -100,
    psx: 0,
    psy: 0,
    dragx: 0,
    dragy: 0,
    maxContext: 2000,
    negMaxContext: -2000
  });

  useEffect(() => {
    const resize = () => {
      setPosition((prevPosition) => ({
        ...prevPosition,
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight - 40,
      }));
    };
    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);

  function dstart(dragx: number, dragy: number) { setPosition({ ...position, dragx: dragx, dragy: dragy, psx: position.posx, psy: position.posy }); setDrag({ isDrag: true }) };
  function dend() { setDrag({ isDrag: false }) }
  function dmove(dragx: number, dragy: number) {
    if (isDrag.isDrag) {
      let newPosx = ((dragx - position.dragx) * 1.5) + position.psx;
      let newPosy = ((dragy - position.dragy) * 1.5) + position.psy;

      if (newPosx > position.maxContext - position.windowWidth) {
        newPosx = position.maxContext - position.windowWidth;
      } else if (newPosx < position.negMaxContext) {
        newPosx = position.negMaxContext;
      }

      if (newPosy > position.maxContext - position.windowHeight) {
        newPosy = position.maxContext - position.windowHeight;
      } else if (newPosy < position.negMaxContext) {
        newPosy = position.negMaxContext;
      }

      setPosition({
        ...position,
        posx: newPosx,
        posy: newPosy
      });
    }
  }






  return (
    <div className='flex w-full h-full'>
      <Stage width={position.windowWidth} height={position.windowHeight}>
        <Layer>
          <Line
            points={[
              0 - position.posx,
              position.negMaxContext - position.posy,
              0 - position.posx,
              position.maxContext - position.posy,
            ]}
            stroke={"white"}
            strokeWidth={5}
            lineCap='round'
            lineJoin='round'
          ></Line>
          <Line
            points={[
              position.negMaxContext - position.posx,
              0 - position.posy,
              position.maxContext - position.posx,
              0 - position.posy,
            ]}
            stroke={"white"}
            strokeWidth={5}
            lineCap='round'
            lineJoin='round'
          ></Line>
        </Layer>
        <Layer>
          <Rect x={0} y={0} width={position.windowWidth} height={position.windowHeight}
            onMouseDown={(e) => { dstart(e.evt.x, e.evt.y) }}
            onMouseMove={(e) => { dmove(e.evt.x, e.evt.y) }}
            onMouseUp={() => { dend() }}
          ></Rect>
        </Layer>

        { }
      </Stage>



      <div className='flex fixed top-12 left-4 text-xl'>{`Pos: ${position.posx}, ${position.posy}`}</div>
      <button
        onClick={() => {
          setAddingPanel({ display: 'flex' });
        }}
        className='fixed bg-white left-4 bottom-4 w-24 h-24 rounded-xl'
      ></button>
      <div
        key={"logic-table"}
        className={`flex-col absolute m-8 bg-[#707070aa] backdrop-blur-md w-[calc(100%-4rem)] h-[calc(100%-4rem)] rounded-xl ${addingPanel.display}`}
      >
        <div className='flex items-center justify-between w-full p-4 pb-0 pt-2'>
          <p className='text-xl'>Danh sách thêm phần tử logic</p>
          <div className='flex item-center space-x-2'>
          <button className='p-2'>Nhập</button>
          <button className='p-2'>Xuất</button>
          <button
              onClick={() => {
                setAddingPanel({ display: 'hidden' });
              }}
              className='w-8 h-8 bg-white rounded-md'
            ></button>
          </div>
        </div>
        <div className='flex w-[calc(100%-1rem)] h-1 bg-white rounded-md mr-2 ml-2'></div>
      </div>
    </div>
  );
}