'use client';

import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
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
  const [currentSaveName, setCurrentSaveName] = useState<null | string>(null);
  const [newSaveName, setNewSaveName] = useState('');
  const [isStorageAvailable, setIsStorageAvailable] = useState(false);

  const showToast = useCallback(
    (
      title: string,
      description: string,
      variant: 'default' | 'destructive' | 'success',
    ) => toast({ title, description, variant }),
    [toast],
  );

  const getAllSave = useCallback(() => {
    return Array.from({ length: localStorage.length })
      .map((_, i) => localStorage.key(i))
      .filter((key) => key?.startsWith('ls-'))
      .map((key) => key?.slice(3) || '');
  }, []);

  const getCommandBySaveName = useCallback((saveName: string) => {
    return JSON.parse(localStorage.getItem('ls-' + saveName) || 'null');
  }, []);

  const isHaveCommand = useCallback(
    (saveName: string) => {
      return getAllSave().includes(saveName);
    },
    [getAllSave],
  );

  const loadCommandToSave = useCallback(
    (saveName: string) => {
      localStorage.setItem('ls-' + saveName, JSON.stringify(commands));
    },
    [commands],
  );

  const newSaveCommand = useCallback(
    (saveName: string) => {
      localStorage.setItem('ls-' + saveName, '');
      setCurrentSaveName(saveName);
      showToast(
        'Save created',
        'Your save has been successfully created.',
        'success',
      );
    },
    [showToast],
  );

  const loadSaveCommand = useCallback(
    (saveName: string) => {
      if (isHaveCommand(saveName)) {
        try {
          const savedCommands = getCommandBySaveName(saveName);
          if (savedCommands) {
            setCommands(savedCommands);
            setCurrentSaveName(saveName);
            showToast(
              'Loaded',
              `Save "${saveName}" has been loaded.`,
              'success',
            );
          } else {
            throw new Error('Invalid save data');
          }
        } catch {
          showToast(
            'Failed to load',
            'This save has the wrong type. Your data is corrupted.',
            'destructive',
          );
        }
      } else {
        newSaveCommand(saveName);
      }
    },
    [
      isHaveCommand,
      getCommandBySaveName,
      setCommands,
      showToast,
      newSaveCommand,
    ],
  );

  function deleteSaveCommand(saveName: string) {
    if (saveName !== currentSaveName) {
      localStorage.removeItem('ls-' + saveName);
      showToast('Deleted', `Save "${saveName}" has been deleted.`, 'success');
    } else {
      showToast(
        'Deletion error',
        'Cannot delete the currently active save.',
        'destructive',
      );
    }
  }

  function handleNewSave() {
    const isValidName = /^[a-zA-Z0-9-_]+$/.test(newSaveName);

    if (!isValidName || newSaveName.length > 21) {
      showToast(
        'Invalid Save Name',
        'The save name contains invalid characters. Only letters, numbers, hyphens, underscores and not over 20 letter are allowed.',
        'destructive',
      );
      setNewSaveName('');
      return;
    }

    if (isHaveCommand(newSaveName)) {
      showToast(
        'Failed to create',
        'This save name is already used. Please choose another name.',
        'destructive',
      );
      setNewSaveName('');
    } else {
      newSaveCommand(newSaveName);
      setNewSaveName('');
    }
  }

  useEffect(() => {
    try {
      localStorage.setItem('test-item-for-logic', 'meow');
      setIsStorageAvailable(true);
      loadSaveCommand('untitled');
    } catch {
      showToast(
        'Storage not available',
        'Storage is not available due to cookie restrictions.',
        'destructive',
      );
      setIsStorageAvailable(false);
    }
  }, [setIsStorageAvailable, loadSaveCommand, showToast]);

  useEffect(() => {
    if (currentSaveName) loadCommandToSave(currentSaveName);
  }, [commands, currentSaveName, loadCommandToSave]);

  if (!isStorageAvailable) {
    return (
      <div className="flex w-full flex-col gap-2 rounded-md bg-[#5555] p-2">
        <p>Storage is not available due to cookie restrictions.</p>
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
            <p className="max-w-[150px] truncate">{save}</p>
            <div className="flex gap-2">
              <button
                className="rounded-md bg-[#444a] p-1"
                onClick={() =>
                  currentSaveName !== save && loadSaveCommand(save)
                }
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
                          onClick={() => deleteSaveCommand(save)}
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
