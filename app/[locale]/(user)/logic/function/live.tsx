import React, { useEffect, useState } from 'react';
import Command from '../command';

export default function LiveCode({ commands }: { commands: Command[] }) {
  const [display, setDisplay] = useState<string[][]>([]);

  useEffect(() => {
    try {
      // Ahhhh
    } catch {
      setDisplay([]);
    }
  }, [commands]);

  return (
    <div className="flex w-full flex-col gap-4 rounded-md bg-[#5555] p-2">
      <p>
        {display.length === 0
          ? 'No start command defined'
          : 'Commands - Multiple start support'}
      </p>
      {display.map((commandList, index) => (
        <div key={index} className="command-output">
          {commandList.map((cmd, idx) => (
            <div key={idx}>{cmd}</div>
          ))}
        </div>
      ))}
    </div>
  );
}
