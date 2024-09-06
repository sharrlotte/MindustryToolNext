'use client';

import { LogicNavBar, AddingElement } from './_component/common';
import LogicDisplay from './_component/logic';
import Command from './command';
import { useState, useCallback } from 'react';

export default function Editor() {
  const [commands, setCommands] = useState<Command[]>([]);

  const addCommand = useCallback((command: Command) => {
    setCommands((prevCommands) => [...prevCommands, { ...command, x: 0, y: 0 }]);
  }, []);

  const deleteCommand = useCallback((index: number) => {
    setCommands((prevCommands) => {
      const newCommands = prevCommands.filter((_, i) => i !== index);
      newCommands.forEach((cmd) =>
        cmd.value.outputs.forEach(
          (value) => value.value > index && value.value--,
        ),
      );
      return newCommands;
    });
  }, []);

  const replaceCommand = useCallback((command: Command, index: number) => {
    setCommands((prevCommands) => {
      const newCommands = [...prevCommands];
      newCommands[index] = command;
      return newCommands;
    });
  }, []);

  const copyCommand = useCallback((command: Command) => {
    addCommand({
      ...command,
      value: {
        ...command.value,
        outputs: command.value.outputs.map(output => ({ ...output, value: -1 })),
      },
    });
  }, [addCommand]);

  return (
    <div>
      <LogicDisplay
        commands={commands}
        setCommands={setCommands}
        addCommand={addCommand}
        deleteCommand={deleteCommand}
        replaceCommand={replaceCommand}
        copyCommand={copyCommand}
      />

      <LogicNavBar toggleText={'Click here to hidden'}>
        <AddingElement addCommand={addCommand} />
      </LogicNavBar>

      <LogicNavBar toggleText={'Click here to hidden'} side="right">
        <div></div>
      </LogicNavBar>
    </div>
  );
}
