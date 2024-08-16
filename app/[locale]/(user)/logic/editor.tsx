'use client';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Stage, Layer, Line, Rect } from 'react-konva';
import { Plus, X, ArrowDownToLine, ArrowUpToLine } from "lucide-react";

interface inputType {
  show(): React.JSX.Element;
  value: string;
}

interface FieldType {
  x: number;
  y: number;
  expand: number;
  afterText: string | null;
  inputType: inputType;
}

interface Command {
  name: string;
  color: string;
  gridSize: number;
  value: FieldType[];
  isStart: false;
  displayFirst: false;
  lastx: 0;
  lasty: 0;
  posx: 0;
  posy: 0;
  output1: -1;
  output2: -1;
}

const defaultCommand: Command = {
  name: "",
  color: "#5ABFFA",
  gridSize: 0,
  value: [],
  isStart: false,
  displayFirst: false,
  lastx: 0,
  lasty: 0,
  posx: 0,
  posy: 0,
  output1: -1,
  output2: -1,
};

const start: Command = {
  ...defaultCommand,
  name: "Start",
  color: "#5ABFFA",
  gridSize: 0,
  value: []
}

const read: Command = {
  ...defaultCommand,
  name: "Read",
  color: "#8782FE",
  gridSize: 2,
  value: [],
};

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
    elementSizeMultiplier: 1
  });

  useEffect(() => {
    const resize = () => setPosition((prev) => ({
      ...prev,
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight - 40,
    }));
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  const dstart = useCallback((dragx: number, dragy: number) => {
    setPosition((prev) => ({ ...prev, dragx, dragy, psx: prev.posx, psy: prev.posy }));
    setDrag(true);
  }, []);

  const dend = useCallback(() => setDrag(false), []);

  const dmove = useCallback((dragx: number, dragy: number) => {
    if (isDrag) {
      setPosition((prev) => {
        let newPosx = ((dragx - prev.dragx) * 1.5) + prev.psx;
        let newPosy = ((dragy - prev.dragy) * 1.5) + prev.psy;

        newPosx = Math.min(Math.max(newPosx, prev.negMaxContext), prev.maxContext - prev.windowWidth);
        newPosy = Math.min(Math.max(newPosy, prev.negMaxContext), prev.maxContext - prev.windowHeight);

        return { ...prev, posx: newPosx, posy: newPosy };
      });
    }
  }, [isDrag]);

  const [item, setItem] = useState(new Map<number, Command>);
  const [codeLayer, setCodeLayer] = useState([]);

  function adding(command: Command) {
    console.log(command);
  };

  function getAndChange(id: number, exec: (object: Command) => Command) {

  };

  function remove(id: number) {

  };

  async function reomveFirstLayer(params: any) {
    
  }

  function render(): React.JSX.Element[] {
    const layers: React.JSX.Element[] = [];

    item.forEach((object, id) => {
      const display = (<Layer
        id={"Layer " + id}
        draggable
        x={object.posx - position.posx}
        y={object.posy - position.posy}
        width={300 * position.elementSizeMultiplier}
        height={50 + (object.gridSize * 50) * position.elementSizeMultiplier} // header size + 10px + grid size
        onDragStart={() => { }}
      >
        <Rect
          x={0}
          y={0}
          width={300 * position.elementSizeMultiplier}
          height={50 + (object.gridSize * 50) * position.elementSizeMultiplier}
          fill={object.color}
        ></Rect>
      </Layer>);

      layers.push(display);
    });

    return layers;
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
        <Layer>
          <Rect
            x={0}
            y={0}
            width={position.windowWidth}
            height={position.windowHeight}
            onMouseDown={(e) => dstart(e.evt.x, e.evt.y)}
            onMouseMove={(e) => dmove(e.evt.x, e.evt.y)}
            onMouseUp={dend}
          />
        </Layer>
        {render()}
      </Stage>

      <div className='flex fixed top-12 left-4 text-xl'>{`Pos: ${position.posx}, ${position.posy}`}</div>
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