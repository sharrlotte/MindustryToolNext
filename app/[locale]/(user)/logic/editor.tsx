'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Stage, Layer, Line, Rect, Group, Text, Circle } from 'react-konva';
import { Command, start, read } from './command';

const logicList = [[start], [read, read, read, read, read, read, read]];

export default function Editor() {
  const [isLnav, setLnav] = useState(false);
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
    scale: 1,
  });

  const dstart = useCallback((dragx: number, dragy: number) => {
    setPosition((prev) => ({ ...prev, dragx, dragy, psx: prev.posx, psy: prev.posy }));
    setDrag(true);
  }, []);

  const dend = useCallback(() => setDrag(false), []);

  const dmove = useCallback((dragx: number, dragy: number) => {
    if (isDrag) {
      setPosition((prev) => {
        const displayableWidth = prev.windowWidth / prev.scale;
        const displayableHeight = prev.windowHeight / prev.scale;

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

    newScale = Math.min(Math.max(newScale, 0.25), 2);

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
    return () => {
      window.removeEventListener('resize', resize);
    };
  }, [position.scale]);

  const [item, setItem] = useState<Map<number, Command>>(new Map());

  function addingCommand(command: Command) {
    setItem((prevItems) => {
      const newItems = new Map(prevItems);
      let id;
      do {
        id = Math.floor(Math.random() * 100000);
      } while (newItems.has(id));

      newItems.set(id, command);
      return newItems;
    });
  }

  function removeCommand(id: number) {
    setItem((prevItems) => {
      const newItems = new Map(prevItems);
      newItems.delete(id);
      return newItems;
    });
  }

  function render(): React.JSX.Element {
    const layers: React.JSX.Element[] = [];
    layers.push(
      <Rect
        key='touching'
        x={0}
        y={0}
        width={position.windowWidth / position.scale}
        height={position.windowHeight / position.scale}
        onMouseDown={(e) => dstart(e.evt.clientX, e.evt.clientY)}
      />
    );

    item.forEach((object, id) => {
      const display = (
        <Group
          key={`element-${id}`}
          draggable
          x={object.posx - position.posx}
          y={object.posy - position.posy}
          onDragStart={(e) => { object.lastx = e.evt.clientX; object.lasty = e.evt.clientY }}
          onDragMove={(e) => {
            object.posx += (e.evt.clientX - object.lastx) / position.scale;
            object.posy += (e.evt.clientY - object.lasty) / position.scale;
            object.lastx = e.evt.clientX;
            object.lasty = e.evt.clientY;
          }}
          onDragEnd={(e) => {
            object.posx += (e.evt.clientX - object.lastx) / position.scale;
            object.posy += (e.evt.clientY - object.lasty) / position.scale;
            object.lastx = e.evt.clientX;
            object.lasty = e.evt.clientY;
          }}
        >
          <Rect
            key={`backgroundBox-${id}`}
            x={0}
            y={0}
            width={300}
            height={(object.gridSize + 1.2) * 50}
            cornerRadius={5}
            fill={object.color}
          />
          <Rect
            key={`content-${id}`}
            x={5}
            y={35}
            width={290}
            height={(object.gridSize + 0.4) * 50}
            fill={'#000000aa'}
            cornerRadius={5}
          />
          <Text
            key={`elementName-${id}`}
            x={5}
            y={10}
            text={object.name}
            fontSize={19}
          />
          <Group
            key={`fieldType-${id}`}
            x={5}
            y={35}
            width={290}
            height={20 + (object.gridSize * 50)}
          >
            {object.value.map((value, index) => (
              <Rect
                key={'filling' + id + "aaa" + index}
                x={(290 / object.columnCount) * value.x}
                y={(value.y * 50) + ((20 / object.gridSize) * value.y)}
                width={(290 / object.columnCount) * value.expand}
                height={50 + (20 / object.gridSize)}
                fill={"green"}
              />
            ))}
          </Group>
          <Group key={`connection-${id}`}>
            {/* Add any connection-related elements here */}
          </Group>
        </Group>
      );

      layers.push(display);
    });

    return (
      <Layer
        key='logicShow'
        onMouseMove={(e) => dmove(e.evt.clientX, e.evt.clientY)}
        onMouseUp={(e) => { dmove(e.evt.clientX, e.evt.clientY); dend(); }}
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

      <div className='flex fixed top-1.5 left-11 text-xl'>{`Pos: ${position.posx}, ${position.posy}, Scale: ${position.scale}`}</div>
      <div key='Lnav' className={`${isLnav ? 'bottom-0' : 'rounded-2xl'} flex fixed flex-col top-[40px] left-0 w-[300px] bg-[#707070aa] backdrop-blur-sm p-2`}>
        <div className='bg-[#999999ba] rounded-2xl p-2' onClick={() => setLnav((value) => !value)}>
          <p className='text-xl'>Danh sách thêm phần tử logic</p>
          <p>Ấn vào đây để mở/đóng</p>
        </div>
        <div key="LnavShowing" className={isLnav ? 'flex-1 overflow-y-auto mt-4' : 'hidden'}>
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
