'use client';

import {
  LogicNavBar,
} from './component/common';
import LogicDisplay from './component/logic';
import Command from "./command";
import { useState } from 'react';

export default function editor() {
  const [commands, setCommands] = useState<Command[]>([]);

  return (<div>
    <LogicDisplay
      commands={commands}
    />

    <LogicNavBar toggleText={'Click here to hidden'}>
      <div></div>
    </LogicNavBar>

    <LogicNavBar toggleText={'Click here to hidden'} side='right'>
      <div></div>
    </LogicNavBar>
  </div>);
}