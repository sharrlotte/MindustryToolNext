import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import Command from '../command';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

export default function CommandStorage({
  commands,
  setCommands,
}: {
  commands: Command[];
  setCommands: Dispatch<SetStateAction<Command[]>>;
}) {
  const { toast } = useToast();
  const [isVisible, setIsVisible] = useState(true);
  const [isPageReady, setIsPageReady] = useState(false);
  const [currentSaveName, setCurrentSaveName] = useState('untitled');
  const [newSaveName, setNewSaveName] = useState('');
  const [isStorageAvailable, setIsStorageAvailable] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
      setIsStorageAvailable(true);
      const untitledSave = localStorage.getItem('logic-untitled');
      if (untitledSave) loadCommands('untitled');
    } catch (error) {
      setIsStorageAvailable(false);
      setIsVisible(false);
    }
    setIsPageReady(true);
  }, []);

  function showToast(
    title: string,
    description: string,
    variant: 'default' | 'destructive' | 'success',
  ) {
    toast({ title: title, description: description, variant: variant });
  }

  function saveCommands(saveName: string) {
    if (!isStorageAvailable) return;
    try {
      localStorage.setItem(
        'logic-' + currentSaveName,
        JSON.stringify(commands),
      );
      setCurrentSaveName(saveName);
    } catch (error) {
      showToast(
        'Error saving commands',
        'Could not save commands due to storage limit.',
        'destructive',
      );
    }
  }

  const loadCommands = (saveName: string) => {
    if (!isStorageAvailable) return;
    const savedCommands = localStorage.getItem('logic-' + saveName);
    if (savedCommands) {
      setCommands(JSON.parse(savedCommands));
      setCurrentSaveName(saveName);
      showToast(
        'Load command successfully',
        `Loaded save "${saveName}"`,
        'success',
      );
    }
  };

  const deleteSave = (saveName: string) => {
    if (!isStorageAvailable) return;
    if (saveName !== currentSaveName) {
      localStorage.removeItem('logic-' + saveName);
      showToast(
        'Delete command successfully',
        `Deleted save "${saveName}"`,
        'success',
      );
    }
  };

  const getAllSave = (): string[] => {
    if (!isStorageAvailable) return [];
    const saves: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('logic-')) {
        saves.push(key.slice(6));
      }
    }
    return saves;
  };

  useEffect(() => {
    if (isPageReady) saveCommands(currentSaveName);
  }, [currentSaveName, commands, isPageReady]);

  const isValidSaveName = (name: string) => /^[a-zA-Z0-9-_]+$/.test(name);

  const handleNewSave = () => {
    if (newSaveName.length > 20) {
      showToast(
        'Save name too long',
        'Please use a shorter name (max 20 characters).',
        'destructive',
      );
      return;
    }

    if (getAllSave().includes(newSaveName)) {
      showToast(
        'This save has been used',
        'Please use another save name',
        'destructive',
      );
      return;
    }

    if (isValidSaveName(newSaveName)) {
      try {
        saveCommands(newSaveName);
        showToast(
          'Create successfully',
          `Save '${newSaveName}' successfully created`,
          'success',
        );
        setNewSaveName('');
        setCommands([]);
      } catch (error) {
        showToast(
          'Save failed',
          'Could not save the new save name.',
          'destructive',
        );
      }
    } else {
      showToast(
        'Invalid save name',
        'Only a-Z, 0-9, -, and _ are allowed.',
        'destructive',
      );
    }
  };

  if (!isStorageAvailable) {
    return (
      <div className="flex w-full flex-col gap-2 rounded-md bg-[#5555] p-2">
        <p>Lưu trữ không khả dụng do không cho phép sử dụng cookie.</p>
      </div>
    );
  }

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
            <p>{save}</p>
            <div className="flex gap-2">
              <button
                className="rounded-md bg-[#444a] p-1"
                onClick={() => currentSaveName !== save && loadCommands(save)}
              >
                {currentSaveName === save ? 'Current use' : 'Use'}
              </button>
              <Dialog>
                <DialogTrigger className="rounded-md bg-[#444a] p-1">
                  Delete
                </DialogTrigger>
                <DialogContent className="p-4">
                  <DialogTitle>Delete save</DialogTitle>
                  {currentSaveName === save ? (
                    <div className="p-2">
                      <DialogDescription className="text-red-500">
                        You cannot delete the current save.
                      </DialogDescription>
                      <DialogFooter className="p-2">
                        <DialogClose className="w-20 rounded-md bg-gray-500 p-2">
                          Close
                        </DialogClose>
                      </DialogFooter>
                    </div>
                  ) : (
                    <div className="p-2">
                      <DialogDescription>
                        Are you sure you want to delete the save {save}?
                      </DialogDescription>
                      <DialogFooter className="p-2">
                        <DialogClose className="w-20 rounded-md bg-gray-500 p-2">
                          Cancel
                        </DialogClose>
                        <DialogClose
                          onClick={() => {
                            deleteSave(save);
                          }}
                          className="w-20 rounded-md bg-red-500 p-2 text-white"
                        >
                          Delete
                        </DialogClose>
                      </DialogFooter>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </div>
          </div>
        ))}
        <Dialog>
          <DialogTrigger className="w-full rounded-md bg-brand p-1">
            New save...
          </DialogTrigger>
          <DialogContent className="p-2">
            <DialogTitle className="p-2">New save...</DialogTitle>
            <div className="flex flex-col gap-2 p-2">
              <input
                type="text"
                placeholder="Save name..."
                value={newSaveName}
                onChange={(e) => setNewSaveName(e.target.value)}
                className="p-2"
              />
              <DialogDescription>
                Save name cannot contain any special chars, only a-Z, 0-9, -,
                and _.
              </DialogDescription>
            </div>
            <DialogFooter className="p-2">
              <DialogClose className="w-20 rounded-md bg-gray-500 p-2">
                Close
              </DialogClose>
              <DialogClose
                onClick={handleNewSave}
                className="w-20 rounded-md bg-brand p-2"
              >
                Create
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </ul>
    </div>
  );
}
