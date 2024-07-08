'use client';

import { useEffect, useState } from 'react';

export default function useFocus(defaultState = false) {
  const [state, setState] = useState(defaultState);

  useEffect(() => {
    function handleVisibilityChange() {
      setState(document.visibilityState === 'visible');
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return state;
}
