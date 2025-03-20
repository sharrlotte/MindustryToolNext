'use client';

import React, { useEffect, useState } from 'react';

type Props = {
  alt?: React.ReactNode;
  children: React.ReactNode;
};

export default function Hydrated({ alt, children }: Props) {
  const [isHydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return isHydrated ? children : alt;
}
