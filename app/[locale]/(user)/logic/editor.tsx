'use client';

import { LogicNavBar, AddingElement } from './_component/common';
import LogicDisplay from './_component/logic';
import Command, { InputType } from './command';
import { useState, useCallback } from 'react';

export default function Editor() {
  const [commands, setCommands] = useState<Command[]>([]);

  const addCommand = useCallback((command: Command) => {
    setCommands((prevCommands) => {
      const newCommands = [...prevCommands, { ...command, x: 0, y: 0 }];

      newCommands.map((command, index) => {
        if (command.value.name == 'Read') {
          selectInput(
            index,
            0,
            command.value.fields[0].value,
            command.value.fields[0].inputType,
            100,
            100,
            150,
            30,
          );
        }
      });

      return newCommands;
    });
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
    commandIndex: number;
    fieldIndex: number;
  } | null>(null);

  const [input, setInput] = useState<InputControlProp | null>(null);

  const selectInput = useCallback(
    (
      commandIndex: number,
      fieldIndex: number,
      defaultValue: string,
      inputType: InputType,
      x: number,
      y: number,
      width?: number,
      height?: number,
    ) => {
      setInput({
        position: {
          x: x,
          y: y,
          width: width,
          height: height,
        },
        defaultValue: defaultValue,
        inputType: inputType,
        onSubmit: onSubmit,
      });

      console.log('aaaa');
      setInputKeys({
        commandIndex: commandIndex,
        fieldIndex: fieldIndex,
      });
    },
    [setInput, setInputKeys],
  );

  const onSubmit = useCallback(
    (value: string, displayValue?: string) => {
      console.log('meow');
      console.log(inputKeys);
      if (inputKeys) {
        console.log('meow meow');
        setCommands((prevCommands) => {
          const updatedCommands = [...prevCommands];
          updatedCommands[inputKeys.commandIndex].value.fields[
            inputKeys.fieldIndex
          ].value = value;
          updatedCommands[inputKeys.commandIndex].value.fields[
            inputKeys.fieldIndex
          ].displayValue = displayValue;
          return updatedCommands;
        });

        setInput(null);
        setInputKeys(null);
      }
    },
    [inputKeys],
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
      />
      <InputControl input={input} />

      <LogicNavBar toggleText={'Click here to hidden'}>
        <AddingElement addCommand={addCommand} />
      </LogicNavBar>

      <LogicNavBar toggleText={'Click here to hidden'} side="right">
        <div></div>
      </LogicNavBar>
    </div>
  );
}

export type Position = {
  x: number;
  y: number;
  width?: number;
  height?: number;
};

type submitFunction = (value: string, displayValue?: string) => void;
type ValueEditorDefaultProp = {
  position: Position;
  defaultValue: string;
  onSubmit: submitFunction;
};

function TextEditorView({ position, onSubmit }: ValueEditorDefaultProp) {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = useCallback(() => {
    onSubmit(inputValue);
  }, [inputValue, onSubmit]);

  const top = position.y + 40;

  return (
    <div
      style={{
        position: 'fixed',
        top: `${top}px`,
        left: `${position.x}px`,
        width: `${position.width ? position.width : 0}px`,
        height: `${position.height ? position.height : 0}px`,
      }}
    >
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        style={{ width: '100%', padding: '5px', marginBottom: '10px' }}
      />
      <button onClick={handleSubmit} style={{ width: '100%' }}>
        Xác nhận
      </button>
    </div>
  );
}

type InputControlProp = {
  position: Position;
  defaultValue: string;
  inputType: InputType;
  onSubmit: submitFunction;
};

export function InputControl({ input }: { input: InputControlProp | null }) {
  return (
    <div>
      {input?.inputType == InputType.TextInput && (
        <TextEditorView
          position={input.position}
          defaultValue={input.defaultValue}
          onSubmit={input.onSubmit}
        />
      )}
    </div>
  );
}
