import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import Command from '../command';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog';

export default function CommandStorage({
  commands,
  setCommands,
}: {
  commands: Command[];
  setCommands: Dispatch<SetStateAction<Command[]>>;
}) {
  const [isVisible, setIsVisible] = useState(true);
  const [isStartFinish, setStartState] = useState(false);
  const [currentSaveName, setCurrentSaveName] = useState('untitled');

  async function saveCommands(saveName: string) {
    localStorage.setItem('logic-' + saveName, JSON.stringify(commands));
    setCurrentSaveName(saveName);
  }

  const loadCommands = (saveName: string) => {
    const savedCommands = localStorage.getItem('logic-' + saveName);
    if (savedCommands) {
      setCommands(JSON.parse(savedCommands));
      setCurrentSaveName(saveName);
    }
  };

  const deleteSave = (saveName: string) => {
    if (saveName != currentSaveName) {
      localStorage.removeItem('logic-' + saveName);
    }
  };

  const getAllSave = (): string[] => {
    const saves: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.slice(0, 6) === 'logic-') {
        saves.push(key.slice(6)); 
      }
    }
    return saves;
  };

  useEffect(() => {
    const untitledSave = localStorage.getItem('logic-untitled');
    if (untitledSave) {
      loadCommands('untitled');
    } else {
      saveCommands('untitled');
    }

    setStartState(true);
  }, []);

  useEffect(() => {
    isStartFinish && saveCommands(currentSaveName);
  }, [currentSaveName, commands]);

  return (
    <div className="flex w-full flex-col gap-2 rounded-md bg-[#5555] p-2">
      <header
        className="w-full cursor-pointer rounded-md bg-brand p-1"
        onClick={() => setIsVisible(!isVisible)}
      >
        <p>Save Control</p>
      </header>

      <ul
        className={`flex w-full list-none flex-col gap-2 ${isVisible ? '' : 'hidden'}`}
      >
        {getAllSave().map((save, index) => (
          <div key={index} className="flex w-full justify-between rounded-md">
            <p className="rounded-md bg-[#444a] p-1">{save}</p>
            <div className="flex gap-2">
              <button
                className="rounded-md bg-[#444a] p-1"
                onClick={() => loadCommands(save)}
              >
                Use save
              </button>
              <button
                className="rounded-md bg-[#444a] p-1"
                onClick={() => deleteSave(save)}
              >
                Delete save
              </button>
            </div>
          </div>
        ))}
        <Dialog>
          <DialogTrigger className="w-full rounded-md bg-brand p-1">
            New save...
          </DialogTrigger>
          <DialogContent className='p-2'>
            <DialogHeader>New save...</DialogHeader>
            
          </DialogContent>
        </Dialog>
      </ul>
    </div>
  );
}
