'use client';

import { LogicNavBar, AddingElement, CommandPair } from './component/common';
import LogicDisplay from './component/logic';
import Command, { } from "./command";
import { useState } from 'react';

export default function Editor() {
  const [commands, setCommands] = useState<CommandPair[]>([]);
  function addCommand(command: Command) {
    const newCowq = {...command, x: 0, y: 0}; 
    const newCommand = { key: (() => { let key = 0; do { key = Math.floor(Math.random() * 100000); } while (commands.some(cmd => cmd.key === key)); return key })(), value: newCowq };
    setCommands(commands => [...commands, newCommand]);
  }

  return (<div>
    <LogicDisplay commands={commands} setCommands={setCommands} />

    <LogicNavBar toggleText={'Click here to hidden'}>
      <AddingElement addCommand={addCommand} />
    </LogicNavBar>

    <LogicNavBar toggleText={'Click here to hidden'} side='right'>
      <div>

      </div>
    </LogicNavBar>
  </div>);
}