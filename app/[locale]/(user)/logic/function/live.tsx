'use client';

import React, { useEffect, useState } from 'react';
import Command, { CommandValue } from '../command';

type LiveData = {
  startAt: number;
  value: string[];
};

export default function LiveCode({ commands }: { commands: Command[] }) {
  const [display, setDisplay] = useState<LiveData[]>([]);

  function findZeroOutputIndex(cValue: CommandValue) {
    return cValue.outputs ? cValue.outputs[0] : -1;
  }

  useEffect(() => {
    try {
      const displaySetList: LiveData[] = [];
      commands.forEach((startCommand, index) => {
        if (startCommand.value.name === 'Start') {
          const commandStringList: string[] = [];
          const decodeStep: (number | string | CommandValue)[] = [];
          const decodeContain = new Map<number, number>();

          const primary = (nextIndex: number) => {
            for (const nextAppendIndex of decode(nextIndex)) {
              if (!decodeContain.has(nextAppendIndex)) {
                primary(nextAppendIndex);
              }
            }
          };

          const decode = (nextIndex: number) => {
            const laterProces = new Set<number>();
            while (nextIndex && nextIndex > -1 && nextIndex < commands.length) {
              const command = commands[nextIndex];
              if (command.value.commandValue) {
                // for (const _ of command.value.commandValue) {
                // } // later uhhhhhh
              } else if (commands[nextIndex].value.parseName === 'end') {
                decodeStep.push('end');
                break;
              } else {
                decodeStep.push(nextIndex);
                decodeContain.set(nextIndex, decodeStep.length - 1);

                for (const field of command.value.fields) {
                  if (
                    field.linkedOutput &&
                    command.value.outputs.length > field.linkedOutput &&
                    field.linkedOutput > 0 &&
                    !decodeContain.has(
                      command.value.outputs[field.linkedOutput],
                    )
                  ) {
                    laterProces.add(command.value.outputs[field.linkedOutput]);
                  }
                }
              }

              if (decodeContain.has(findZeroOutputIndex(command.value))) {
                decodeStep.push(
                  `jump ${decodeContain.get(findZeroOutputIndex(command.value))} always`,
                );
                break;
              }

              nextIndex = findZeroOutputIndex(command.value);
            }
            return laterProces;
          };

          const nextIndex = findZeroOutputIndex(startCommand.value);
          primary(nextIndex);

          for (const cData of decodeStep) {
            if (typeof cData === 'number') {
              if (commands.length < cData || cData < -1) {
                commandStringList.push('end');
              } else {
                const nowCommand = commands[cData].value;
                let cParse = nowCommand.parseName;

                for (const field of nowCommand.fields) {
                  if (field.linkedOutput) {
                    const position = decodeContain.get(
                      nowCommand.outputs[field.linkedOutput],
                    );
                    cParse += ` ${position}`;
                  } else {
                    cParse += ` ${field.parseValue}`;
                  }
                }

                commandStringList.push(cParse);
              }
            } else if (typeof cData === 'string') {
              commandStringList.push(cData);
            } else {
              commandStringList.push(JSON.stringify(cData));
            }
          }

          displaySetList.push({ startAt: index, value: commandStringList });
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

      {display.length > 0 && (
        <div>
          {display.map((liveData, index) => (
            <div
              key={index}
              className="command-block mb-4 rounded bg-[#3333] p-2"
            >
              <p className="font-bold">Start At: {liveData.startAt}</p>
              <ul>
                {liveData.value.map((commandString, idx) => (
                  <li key={idx} className="command-string mb-1">
                    {commandString}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
