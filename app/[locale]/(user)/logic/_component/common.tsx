'use client';
import React, { useCallback, useState } from 'react';
import Command, { CommandList } from '../command';

export const useForceUpdate = () => {
  const [, setTick] = useState(0);
  const update = useCallback(() => {
    setTick((tick) => tick + 1);
  }, []);
  return update;
};

export function AddingElement({
  addCommand,
}: {
  addCommand: (command: Command) => void;
}) {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <div className="w-full rounded-md bg-[#555] p-2">
      <header
        className="cursor-pointer rounded-md bg-brand p-1"
        onClick={() => setIsVisible(!isVisible)}
      >
        Add element - Click to toggle
      </header>
      <ul className={`w-full list-none pt-2 ${isVisible ? '' : 'hidden'}`}>
        {CommandList.map((child, index) => (
          <li key={index} className="m-0 mb-4 w-full rounded-md bg-[#333a] p-2 pt-1">
            <p className="pl-6 p-1">{child.key}</p>
            <div className="flex w-full flex-wrap gap-2">
              {child.value.map((command, idx) => (
                <p
                  key={index + '' + idx}
                  className="w-full rounded-md p-1"
                  style={{ backgroundColor: command.value.color }}
                  onClick={() => addCommand(command)}
                >
                  {command.value.name}
                </p>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function LogicNavBar({
  toggleText,
  children,
  side = 'left',
}: {
  toggleText: string;
  side?: 'left' | 'right';
  children: React.ReactNode;
}) {
  const [toggle, setToggle] = useState(true);
  const handleClick = () => {
    setToggle((prevToggle) => !prevToggle);
  };
  return (
    <nav
      className={`flex ${toggle ? 'h-full' : ''} fixed top-nav flex-col ${side}-0 w-[300px] gap-2 overflow-y-auto rounded-md bg-[#aaaa] p-2 backdrop-blur-sm`}
    >
      <header
        className="flex w-full cursor-pointer rounded-md bg-[#555] p-2"
        onClick={handleClick}
      >
        <p>{toggleText}</p>
      </header>
      <div className={`${toggle ? '' : 'hidden'} w-full`}>{children}</div>
    </nav>
  );
}
