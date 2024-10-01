'use client';

import { LogicNavBar, AddingElement } from '../_component/common';
import { InputControl, InputControlProp } from '../_component/input';
import LogicDisplay from './logic';
import Command, { InputType } from '../command';
import { useState, useCallback } from 'react';
import CommandStorage from '../function/storage';
import LiveCode from '../function/live';

export type SelectInputProps = {
  commandIndex: number;
  fieldIndex: number;
  defaultValue: string;
  inputType: InputType;
  x: number;
  y: number;
  width?: number;
  height?: number;
};

export default function Editor() {
  const [commands, setCommands] = useState<Command[]>([]);
  const [inputKeys, setInputKeys] = useState<{ commandIndex: number | null; fieldIndex: number | null }>({ commandIndex: null, fieldIndex: null });
  const [input, setInput] = useState<InputControlProp | null>(null);

  const updateCommands = (updateFn: (prev: Command[]) => Command[]) => {
    setCommands(prev => updateFn(prev));
  };

  const addCommand = useCallback((command: Command) => {
    updateCommands(prev => [
      ...prev,
      { ...command, value: { ...command.value, fields: [...command.value.fields], outputs: [...command.value.outputs] }, x: 0, y: 0 }
    ]);
  }, []);

  const deleteCommand = useCallback((index: number) => {
    updateCommands(prev => prev
      .filter((_, i) => i !== index)
      .map((cmd) => ({
        ...cmd,
        value: { ...cmd.value, outputs: cmd.value.outputs.map(value => (value > index ? value - 1 : value === index ? -1 : value)) }
      }))
    );
  }, []);

  const replaceCommand = useCallback((command: Command, index: number) => {
    updateCommands(prev => {
      const newCommands = [...prev];
      newCommands[index] = command;
      return newCommands;
    });
  }, []);

  const updateCommand = useCallback((cIndex: number, callback: (c: Command) => Command) => {
    updateCommands(prev => {
      const newCommands = [...prev];
      if (newCommands[cIndex]) {
        newCommands[cIndex] = callback(newCommands[cIndex]);
      }
      return newCommands;
    });
  }, []);

  const copyCommand = useCallback((index: number) => {
    updateCommands(prev => {
      if (prev[index]) {
        addCommand({ ...prev[index], value: { ...prev[index].value, outputs: prev[index].value.outputs.map(() => -1) } });
      }
      return prev;
    });
  }, [addCommand]);

  const findCommandByIndex = (index: number) => commands[index];

  const onSubmit = useCallback((value: string, displayValue?: string) => {
    setInputKeys(prev => {
      const { commandIndex, fieldIndex } = prev;
      if (commandIndex !== null && fieldIndex !== null) {
        updateCommand(commandIndex, command => {
          const newFields = [...command.value.fields];
          newFields[fieldIndex] = { ...newFields[fieldIndex], parseValue: value, displayValue };
          return { ...command, value: { ...command.value, fields: newFields } };
        });
        setInput(null); 
      }
      return { commandIndex: null, fieldIndex: null };
    });
  }, [updateCommand]);

  const selectInput = useCallback(({ commandIndex, fieldIndex, defaultValue, inputType, x, y, width, height }: SelectInputProps) => {
    setInput({ position: { x, y, width, height }, defaultValue, inputType, onSubmit });
    setInputKeys({ commandIndex, fieldIndex });
  }, [onSubmit]);

  return (
    <div className="text-white">
      <LogicDisplay
        commands={commands}
        setCommands={setCommands}
        deleteCommand={deleteCommand}
        replaceCommand={replaceCommand}
        copyCommand={copyCommand}
        selectInput={selectInput}
        findCommandByIndex={findCommandByIndex}
      />
      <InputControl input={input} setCommands={setCommands} cIndex={inputKeys.commandIndex} />
      <LogicNavBar toggleText={'Click here to toggle'}>
        <AddingElement addCommand={addCommand} />
        <CommandStorage commands={commands} setCommands={setCommands} />
      </LogicNavBar>
      <LogicNavBar toggleText={'Click here to toggle'} side="right">
        <LiveCode commands={commands} />
      </LogicNavBar>
    </div>
  );
}
