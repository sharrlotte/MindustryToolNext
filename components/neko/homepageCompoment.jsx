"use client";

import { useEffect, useState } from 'react';

const ResponsiveDisplay = ({ mobileComponent, desktopComponent }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < window.innerHeight);
    };

    handleResize(); 
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return isMobile ? mobileComponent : desktopComponent;
};

export default ResponsiveDisplay;
