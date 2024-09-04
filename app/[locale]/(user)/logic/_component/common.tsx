'use client';
import React, { useState } from 'react';
import Command, { CommandList } from '../command';

export type CommandPair = { key: number; value: Command };
export function AddingElement({ addCommand }: { addCommand: (command: Command) => void }) {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <div className="w-full bg-[#555] p-2 rounded-xl gap-2">
      <header className="bg-brand rounded-xl p-1 cursor-pointer" onClick={() => setIsVisible(!isVisible)}>Add element - Click to toggle</header>
      <ul className={`list-none pt-2 w-full ${isVisible ? '' : 'hidden'}`}>
        {CommandList.map((child, index) => (
          <li key={index} className="m-0 mb-2 p-1 w-full bg-[#333a] rounded-xl">
            <p className="pl-6 p-1">{child.key}</p>
            <div className="flex flex-wrap w-full">
              {child.value.map((command, idx) => (
                <p key={index + "" + idx} className="p-1 rounded-xl w-full" style={{ backgroundColor: command.value.color }} onClick={() => addCommand(command)}>{command.value.name}</p>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function LogicNavBar({ toggleText, children, side = 'left' }: { toggleText: string; side?: 'left' | 'right'; children: React.ReactNode }) {
  const [toggle, setToggle] = useState(true);
  const handleClick = () => { setToggle(prevToggle => !prevToggle)}
  return (
    <nav className={`flex ${toggle ? 'h-full' : ''} fixed flex-col top-nav ${side}-0 w-[300px] bg-[#aaaa] backdrop-blur-sm p-2 gap-2 overflow-y-auto rounded-xl`}>
      <header className='flex w-full p-2 bg-[#555] rounded-xl cursor-pointer' onClick={handleClick}>
        <p>{toggleText}</p>
      </header>
      <div className={`${toggle ? '' : 'hidden'} w-full`}>
        {children}
      </div>
    </nav>
  );
}
