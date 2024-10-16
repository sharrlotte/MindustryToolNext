import { useEffect, useState } from 'react';

export default function useOnline() {
  const [isOnline, setOnline] = useState(true);

  useEffect(() => {
    window.addEventListener('offline', (_) => {
      setOnline(false);
    });

    window.addEventListener('online', (_) => {
      setOnline(true);
    });
  }, [setOnline]);

  return isOnline;
}
