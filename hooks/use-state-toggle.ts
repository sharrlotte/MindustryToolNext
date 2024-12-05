import { useCallback, useMemo, useState } from 'react';

const useToggle = (initialState: boolean = false) => {
  const [isOpen, setIsOpen] = useState(initialState);

  const toggle = useCallback(() => setIsOpen((prevState) => !prevState), []);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const handlers = useMemo(() => ({ toggle, open, close }), [toggle, open, close]);

  return { isOpen, ...handlers };
};

export default useToggle;
