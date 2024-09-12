import React, { useEffect } from 'react';
import Command from '../command';

export default function LiveCode({ commands }: { commands: Command[] }) {

  useEffect(() => {

  }, [commands]);

  return (
    <div className="flex w-full flex-col gap-2 rounded-md bg-[#5555] p-2"></div>
  );
}
