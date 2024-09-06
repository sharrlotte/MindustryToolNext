'use client';
import React, { useState } from 'react';
import Command, { CommandList } from '../command';

export function AddingElement({
  addCommand,
}: {
  addCommand: (command: Command) => void;
}) {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <div className="w-full gap-2 rounded-xl bg-[#555] p-2">
      <header
        className="cursor-pointer rounded-xl bg-brand p-1"
        onClick={() => setIsVisible(!isVisible)}
      >
        Add element - Click to toggle
      </header>
      <ul className={`w-full list-none pt-2 ${isVisible ? '' : 'hidden'}`}>
        {CommandList.map((child, index) => (
          <li key={index} className="m-0 mb-2 w-full rounded-xl bg-[#333a] p-1">
            <p className="p-1 pl-6">{child.key}</p>
            <div className="flex w-full flex-wrap">
              {child.value.map((command, idx) => (
                <p
                  key={index + '' + idx}
                  className="w-full rounded-xl p-1"
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
      className={`flex ${toggle ? 'h-full' : ''} fixed top-nav flex-col ${side}-0 w-[300px] gap-2 overflow-y-auto rounded-xl bg-[#aaaa] p-2 backdrop-blur-sm`}
    >
      <header
        className="flex w-full cursor-pointer rounded-xl bg-[#555] p-2"
        onClick={handleClick}
      >
        <p>{toggleText}</p>
      </header>
      <div className={`${toggle ? '' : 'hidden'} w-full`}>{children}</div>
    </nav>
  );
}
