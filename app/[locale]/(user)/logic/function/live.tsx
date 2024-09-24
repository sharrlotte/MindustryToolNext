'use client';

import React, { useEffect, useState } from 'react';
import Command from '../command';

export default function LiveCode({ commands }: { commands: Command[] }) {
  const [display, setDisplay] = useState<string[][]>([]);

  useEffect(() => {
    try {
      const displaySetList: string[][] = [];
      commands.forEach((command) => {
        if (command.value.name === 'Start') {
          const commandStringList: string[] = [];
          let decodeTree = new Map<number, Command>();
          let decodeIndex = new Map<number, number>();
          let laterProcess = new Set<number>();

          function appendDecodeValues() {}

          function appendNextDecodeTree(nowCommandIndex: number) {
            while (
              nowCommandIndex &&
              nowCommandIndex > -1 &&
              commands[nowCommandIndex]
            ) {
              const firstField = commands[nowCommandIndex].value.fields[0].commandValue;
              if (firstField) {
                for (const command of firstField) {
                  // meow meow meow
                }

                nowCommandIndex = commands[nowCommandIndex].value.outputs[0];
              } else {
                const decodeNowIndex = decodeTree.size;
              }
            }
          }

          displaySetList.push(commandStringList);
        }
      });
      setDisplay(displaySetList);
    } catch {
      setDisplay([]);
    }
  }, [commands, setDisplay]);

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
