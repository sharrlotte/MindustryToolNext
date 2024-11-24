import React from 'react';
import { debounce } from 'throttle-debounce';

export default function useDebounceValue<T>(value: T) {
  const [debounced, setDebounced] = React.useState(value);

  const set = React.useCallback((newValue: T) => debounce(1000, () => setDebounced(newValue)), [setDebounced]);

  React.useEffect(() => {
    set(value);
  }, [value]);

  return debounced;
}
