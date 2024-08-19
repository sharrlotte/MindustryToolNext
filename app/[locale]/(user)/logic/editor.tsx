'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { Stage, Layer, Line, Rect, Group, Text } from 'react-konva';
import { Plus, X, ArrowDownToLine, ArrowUpToLine } from 'lucide-react';
import { Command, start, read } from './command';

const logicList = [[start], [read, read, read, read, read, read, read]];
export default function Editor() {
  const [addingPanel, setAddingPanel] = useState('hidden');
  const [isDrag, setDrag] = useState(false);
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
    scale: 1
  });

  const dstart = useCallback((dragx: number, dragy: number) => {
    setPosition((prev) => ({ ...prev, dragx, dragy, psx: prev.posx, psy: prev.posy }));
    setDrag(true);
  }, []);

  const dend = useCallback(() => setDrag(false), []);
  const dmove = useCallback((dragx: number, dragy: number) => {
    if (isDrag) {
      setPosition((prev) => {
        const displayableWidth = prev.windowWidth * (1 / prev.scale);
        const displayableHeight = prev.windowHeight * (1 / prev.scale);
  
        let newPosx = ((dragx - prev.dragx) * 1.5) + prev.psx;
        let newPosy = ((dragy - prev.dragy) * 1.5) + prev.psy;
  
        newPosx = Math.min(Math.max(newPosx, prev.negMaxContext), prev.maxContext - displayableWidth);
        newPosy = Math.min(Math.max(newPosy, prev.negMaxContext), prev.maxContext - displayableHeight);
  
        return { ...prev, posx: newPosx, posy: newPosy };
      });
    }
  }, [isDrag]);
  

  const handleWheel = useCallback((e: { evt: { preventDefault: () => void; deltaY: number; }; target: { getStage: () => any; }; }) => {
    e.evt.preventDefault();
    const scaleBy = 1.05;
    const oldScale = position.scale;
    let newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;
    if (newScale <= 0.25) {
      newScale = 0.25;
    } else if (newScale >= 2) {
      newScale = 2;
    }

    setPosition((prev) => ({
      ...prev,
      scale: newScale,
      windowWidth: window.innerWidth,
      windowHeight: (window.innerHeight - 40),
    }));
  }, [position]);

  useEffect(() => {
    const resize = () => setPosition((prev) => ({
      ...prev,
      windowWidth: window.innerWidth * prev.scale,
      windowHeight: (window.innerHeight - 40) * prev.scale,
    }));

    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
    };
  }, [dmove, dend]);

  const [item, setItem] = useState(new Map<number, Command>);
  const [codeLayer, setCodeLayer] = useState(new Map<number, number>);

  function adding(command: Command) {
    setItem(() => { const map = new Map(); map.set(0, command); return map })
  };

  function render(): React.JSX.Element {
    const layers: React.JSX.Element[] = [];
    layers.push(
      <Rect
        key='touching'
        x={0}
        y={0}
        width={position.windowWidth * (1 / position.scale)}
        height={position.windowHeight * (1 / position.scale)}
        onMouseDown={(e) => dstart(e.evt.clientX, e.evt.clientY)}
      ></Rect>
    );

    item.forEach((object, id) => {
      const display = (
        <Group
          key={"Element" + id}
          draggable
          x={object.posx - position.posx}
          y={object.posy - position.posy}
          width={300}
          height={50 + (object.gridSize * 50)} // header 30px + 20px + grid size
          onDragStart={(e) => { object.lastx = e.evt.clientX; object.lasty = e.evt.clientY }}
          onDragMove={(e) => { object.posx += (e.evt.clientX - object.lastx) / position.scale; object.posy += (e.evt.clientY - object.lasty) / position.scale; object.lastx = e.evt.clientX; object.lasty = e.evt.clientY }}
          onDragEnd={(e) => { object.posx += (e.evt.clientX - object.lastx) / position.scale; object.posy += (e.evt.clientY - object.lasty) / position.scale; object.lastx = e.evt.clientX; object.lasty = e.evt.clientY }}
        >
          <Rect
            key={'backgroundBox' + id}
            x={0}
            y={0}
            width={300}
            height={(50 + (object.gridSize * 50))}
            cornerRadius={5}
            fill={object.color}
          ></Rect>

          <Rect
            key={'content' + id}
            x={5}
            y={35}
            width={(300) - 10}
            height={(10 + (object.gridSize * 50))}
            fill={'#000000aa'}
            cornerRadius={5}
          ></Rect>

          <Text
            x={5}
            y={10}
            text={object.name}
            fontSize={19}
          ></Text>
        </Group>
      );

      layers.push(display);
    });

    return (
      <Layer
        key='logicShow'
        onMouseMove={(e) => dmove(e.evt.clientX, e.evt.clientY)}
        onMouseUp={() => dend()}
        onMouseLeave={() => dend()}
      >
        {layers}
      </Layer>
    );
  }

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

      <div className='flex fixed top-12 left-4 text-xl'>{`Pos: ${position.posx}, ${position.posy}. Scale ${position.scale}.`}</div>
      <Plus onClick={() => setAddingPanel('flex')} className='fixed left-4 bottom-4 w-16 h-16 rounded-2xl border-4' />
      <div key="logic-table" className={`flex-col absolute m-8 bg-[#707070aa] backdrop-blur-md w-[calc(100%-4rem)] h-[calc(100%-4rem)] rounded-xl ${addingPanel}`}>
        <div className='flex items-center justify-between w-full p-4 pb-0 pt-2'>
          <p className='text-xl'>Danh sách thêm phần tử logic</p>
          <div className='flex item-center space-x-4 h-8'>
            <div className='w-8'><ArrowDownToLine className='w-8 h-full' /></div>
            <div className='w-8'><ArrowUpToLine className='w-8 h-full' /></div>
            <div className='w-8'><X onClick={() => setAddingPanel('hidden')} className='w-8 h-full' /></div>
          </div>
        </div>
        <div className='flex w-[calc(100%-1rem)] h-1 bg-white rounded-md m-2 ml-2' />
        <div className='flex flex-col w-full p-4 pt-2 gap-4'>
          {logicList.map((elementArray, a) => (
            <ul key={a + '123456789'} className='flex flex-row flex-wrap w-full gap-2'>
              {elementArray.map((element, a) => (
                <button
                  key={element.name + " " + a}
                  className={`flex p-2 pl-4 pr-4 mr-4 min-w-20 text-xl rounded-2xl bg-black`}
                  style={{ backgroundColor: element.color }}
                  onClick={() => { adding(element); setAddingPanel('hidden') }}
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
