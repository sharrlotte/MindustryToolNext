'use client';

import React, { useCallback, useState } from "react";
import { InputType } from "../command";

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
    console.log(inputValue);
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

export type InputControlProp = {
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