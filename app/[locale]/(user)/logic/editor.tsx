'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { Stage, Layer, Line, Rect } from 'react-konva';
import { start, read, fieldType } from './command';
import Render from './render';

const logicList = [[start], [read, read, read, read, read, read, read]];

export default function Editor() {
  const [isLeftNav, setLeftNav] = useState(false);
  const [isDragging, setDragging] = useState(false);
  const [position, setPosition] = useState({
    windowWidth: window.innerWidth,
    windowHeight: window.innerHeight - 40,
    posx: -100,
    posy: -100,
    psx: 0,
    psy: 0,
    dragx: 0,
    dragy: 0,
    maxContext: 4000,
    negMaxContext: -4000,
    scale: 1,
  });

  const handleDragEnd = useCallback(() => setDragging(false), []);
  const handleDragStart = useCallback((dragx: number, dragy: number) => {
    setPosition((prev) => ({
      ...prev,
      dragx,
      dragy,
      psx: prev.posx,
      psy: prev.posy,
    }));
    setDragging(true);
  }, []);

  const handleDragMove = useCallback((dragx: number, dragy: number) => {
    if (isDragging) {
      setPosition((prev) => {
        const newPosx = Math.min(Math.max(((dragx - prev.dragx) * 1.5) + prev.psx, prev.negMaxContext), prev.maxContext - prev.windowWidth / prev.scale);
        const newPosy = Math.min(Math.max(((dragy - prev.dragy) * 1.5) + prev.psy, prev.negMaxContext), prev.maxContext - prev.windowHeight / prev.scale);
        return { ...prev, posx: newPosx, posy: newPosy };
      });
    }
  }, [isDragging]);

  const handleWheel = useCallback((e: { evt: { preventDefault: () => void; deltaY: number; }; }) => {
    e.evt.preventDefault();
    const scaleBy = 1.07;
    const newScale = Math.min(Math.max(e.evt.deltaY > 0 ? position.scale / scaleBy : position.scale * scaleBy, 0.25), 2);
    setPosition((prev) => ({
      ...prev,
      scale: newScale,
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight - 40,
    }));
  }, [position.scale]);

  useEffect(() => {
    const resize = () => setPosition((prev) => ({
      ...prev,
      windowWidth: window.innerWidth * prev.scale,
      windowHeight: (window.innerHeight - 40) * prev.scale,
    }));
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [position.scale]);

  const [commandMap, setCommandMap] = useState(new Map());

  const addingCommand = (command: { posx: number; posy: number; name: string; color: string; gridSize: number; columnCount: number; value: fieldType[]; isStart: boolean; displayFirst: boolean; lastx: number; lasty: number; output1: number; output2: number; }) => {
    setCommandMap((prevItems) => {
      const newItems = new Map(prevItems);
      let id;
      do {
        id = Math.floor(Math.random() * 100000);
      } while (newItems.has(id));
      newItems.set(id, command);
      return newItems;
    });
  };

  const render = () => (
    <Layer
      key='logicShow'
      onMouseMove={(e) => handleDragMove(e.evt.clientX, e.evt.clientY)}
      onMouseUp={(e) => { handleDragMove(e.evt.clientX, e.evt.clientY); handleDragEnd(); }}
      onMouseLeave={handleDragEnd}
    >
      <Rect
        key='touching'
        x={0}
        y={0}
        width={position.windowWidth / position.scale}
        height={position.windowHeight / position.scale}
        onMouseDown={(e) => handleDragStart(e.evt.clientX, e.evt.clientY)}
      />
      {Render(commandMap, position)}
    </Layer>
  );

  return (
    <div className='flex w-full h-full'>
      <Stage
        width={position.windowWidth}
        height={position.windowHeight}
        scaleX={position.scale}
        scaleY={position.scale}
        onWheel={handleWheel}
      >
        <Layer>
          <Line
            points={[
              0 - position.posx,
              position.negMaxContext - position.posy,
              0 - position.posx,
              position.maxContext - position.posy,
            ]}
            stroke="white"
            strokeWidth={5}
            lineCap='round'
            lineJoin='round'
          />
          <Line
            points={[
              position.negMaxContext - position.posx,
              0 - position.posy,
              position.maxContext - position.posx,
              0 - position.posy,
            ]}
            stroke="white"
            strokeWidth={5}
            lineCap='round'
            lineJoin='round'
          />
        </Layer>
        {render()}
      </Stage>

      <div className='flex fixed top-1.5 left-11 text-xl'>{`Pos: ${position.posx}, ${position.posy}, Scale: ${position.scale}`}</div>
      <div className={`${isLeftNav ? 'bottom-0' : 'rounded-2xl'} flex fixed flex-col top-[40px] left-0 w-[300px] bg-[#707070aa] backdrop-blur-sm p-2`}>
        <div className='bg-[#999999ba] rounded-2xl p-2' onClick={() => setLeftNav((value) => !value)}>
          <p className='text-xl'>Danh sách thêm phần tử logic</p>
          <p>Ấn vào đây để mở/đóng</p>
        </div>
        <div className={isLeftNav ? 'flex-1 overflow-y-auto mt-4' : 'hidden'}>
          {logicList.map((elementArray, a) => (
            <ul key={`logic-${a}`} className='flex flex-row flex-wrap w-full gap-2 mb-4'>
              {elementArray.map((element, b) => (
                <button
                  key={`element-${element.name}-${b}`}
                  className='flex p-2 pl-4 pr-4 mr-4 w-full text-xl rounded-2xl bg-black'
                  style={{ backgroundColor: element.color }}
                  onClick={() => addingCommand({ ...element, posx: 0, posy: 0 })}
                >
                  {element.name}
                </button>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </div>
  );
}
