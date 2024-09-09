'use client';

import { LogicNavBar, AddingElement } from './_component/common';
import { InputControl, InputControlProp } from './_component/input';
import LogicDisplay from './_component/logic';
import Command, { InputType } from './command';
import { useState, useCallback } from 'react';

export type selectInputProps = {
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

  const addCommand = useCallback((command: Command) => {
    const newCommand = {
      ...command,
      value: {
        ...command.value,
        fields: command.value.fields.map((field) => ({ ...field })),
        outputs: command.value.outputs.map((output) => ({ ...output })),
      },
      x: 0,
      y: 0,
    };
    setCommands((prevCommands) => [...prevCommands, newCommand]);
  }, []);

  const deleteCommand = useCallback(
    (index: number) => {
      setCommands((prevCommands) => {
        const newCommands = prevCommands.filter((_, i) => i !== index);
        newCommands.forEach((cmd) =>
          cmd.value.outputs.forEach(
            (value) => value.value > index && value.value--,
          ),
        );
        return newCommands;
      });
    },
    [setCommands],
  );

  const replaceCommand = useCallback((command: Command, index: number) => {
    setCommands((prevCommands) => {
      const newCommands = [...prevCommands];
      newCommands[index] = command;
      return newCommands;
    });
  }, []);

  const updateCommand = useCallback(
    (cIndex: number, callback: (c: Command) => Command) => {
      setCommands((prev) => {
        const newCommands = [...prev];
        if (newCommands[cIndex]) {
          const updatedCommand = callback(newCommands[cIndex]);
          // Ensure deep copy of fields
          newCommands[cIndex] = {
            ...updatedCommand,
            value: {
              ...updatedCommand.value,
              fields: updatedCommand.value.fields.map((field) => ({
                ...field,
              })),
            },
          };
        }
        return newCommands;
      });
    },
    [],
  );

  const copyCommand = useCallback(
    (command: Command) => {
      addCommand({
        ...command,
        value: {
          ...command.value,
          outputs: command.value.outputs.map((output) => ({
            ...output,
            value: -1,
          })),
        },
      });
    },
    [addCommand],
  );

  //input controller.
  const [inputKeys, setInputKeys] = useState<{
    commandIndex: number | null;
    fieldIndex: number | null;
  }>({ commandIndex: null, fieldIndex: null });

  const [input, setInput] = useState<InputControlProp | null>(null);
  const onSubmit = useCallback(
    (value: string, displayValue?: string) => {
      setInputKeys((prev) => {
        if (prev.commandIndex !== null && prev.fieldIndex !== null) {
          const cIndex = prev.commandIndex;
          const fIndex = prev.fieldIndex;
          updateCommand(cIndex, (command) => {
            const newFields = [...command.value.fields];
            newFields[fIndex] = {
              ...newFields[fIndex],
              value: value,
              displayValue: displayValue,
            };
            return {
              ...command,
              value: { ...command.value, fields: newFields },
            };
          });
          setInput(null);
        }
        return { commandIndex: null, fieldIndex: null };
      });
    },
    [updateCommand],
  );

  const selectInput = useCallback(
    ({
      commandIndex,
      fieldIndex,
      defaultValue,
      inputType,
      x,
      y,
      width,
    }: selectInputProps) => {
      setInput({
        position: {
          x: x,
          y: y,
          width: width,
        },
        defaultValue: defaultValue,
        inputType: inputType,
        onSubmit: onSubmit,
      });

      setInputKeys({
        commandIndex: commandIndex,
        fieldIndex: fieldIndex,
      });
    },
    [onSubmit],
  );

  return (
    <div>
      <LogicDisplay
        commands={commands}
        setCommands={setCommands}
        addCommand={addCommand}
        deleteCommand={deleteCommand}
        replaceCommand={replaceCommand}
        copyCommand={copyCommand}
        selectInput={selectInput}
      />
      <InputControl input={input} />
      <h3 className="fixed right-10 top-1.5">{`Inputs: cIndex: ${inputKeys?.commandIndex}, fIndex: ${inputKeys?.fieldIndex}`}</h3>

      <LogicNavBar toggleText={'Click here to hidden'}>
        <AddingElement addCommand={addCommand} />
      </LogicNavBar>

      <LogicNavBar toggleText={'Click here to hidden'} side="right">
        <div></div>
      </LogicNavBar>
    </div>
  );
}
