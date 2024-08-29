'use client';
import React, { useState } from 'react';





export function LogicNavBar({ toggleText, children, side = 'left' }: { toggleText: string; side?: 'left' | 'right'; children: React.ReactNode }) {
  const [toggle, setToggle] = useState(true);

  function handleClick() {
    setToggle(prevToggle => !prevToggle);
  }

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
