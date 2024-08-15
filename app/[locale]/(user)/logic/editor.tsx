'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Group, Line, Rect } from 'react-konva';
import Konva from 'konva';
import { KonvaEventObject } from 'konva/lib/Node';

export default function Editor() {
  const [addingPanel, setAddingPanel] = useState({
    display: 'hidden'
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
    isDrag: false,
    maxContext: 1000
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

  function dstart(dragx: number, dragy: number) { setPosition({ ...position, dragx: dragx, dragy: dragy, psx: position.posx, psy: position.posy, isDrag: true }) };
  function dmove(dragx: number, dragy: number) { if (position.isDrag) { setPosition({ ...position, posx: (dragx - position.dragx) + position.psx, posy: (dragy - position.dragy) + position.psy }) } }
  function dend() { if (position.isDrag) { setPosition({ ...position, isDrag: false }) } }

  return (
    <div className='flex w-full h-full'>
      <Stage width={position.windowWidth} height={position.windowHeight}>
        <Layer>
          <Rect
            onMouseDown={(e) => { dstart(e.evt.x, e.evt.y); console.log('down') }}
            onMouseMove={(e) => { dmove(e.evt.x, e.evt.y); if (position.isDrag) { console.log('move') } }}
            onMouseUp={(e) => { dend(); console.log("up") }}

            x={0}
            y={0}
            width={position.windowWidth}
            height={position.windowHeight}
            fill={"#ff0000aa"}
          ></Rect>

          <Rect
            draggable
            x={100}
            y={100}
            width={100}
            height={100}
            fill={"yellow"}
          ></Rect>
          <Line
            points={[
              0 - position.posx,
              0 - position.posy,
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
              0 - position.posx,
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
      </Stage>

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
        <div className='flex justify-between w-full p-4 pb-2 pt-2'>
          <span className='text-2xl'>Danh sách thêm phần tử logic</span>
          <button
            onClick={() => {
              setAddingPanel({ display: 'hidden' });
            }}
            className='w-8 h-8 bg-white rounded-md'
          ></button>
        </div>
        <div className='flex w-[calc(100%-1rem)] h-1 bg-white rounded-md mr-2 ml-2'></div>
      </div>
    </div>
  );
}
