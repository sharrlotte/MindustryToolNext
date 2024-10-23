import { motion } from 'framer-motion';
import React from 'react';

interface TooltipProps {
  direction: 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  content: React.ReactNode;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ direction, content, children }) => {
  const getDirectionStyles = () => {
    switch (direction) {
      case 'top':
        return { x: '-50%', y: '-100%' };
      case 'bottom':
        return { x: '-50%', y: '0%' };
      case 'left':
        return { x: '-100%', y: '-50%' };
      case 'right':
        return { x: '0%', y: '-50%' };
      case 'top-left':
        return { x: '-100%', y: '-100%' };
      case 'top-right':
        return { x: '0%', y: '-100%' };
      case 'bottom-left':
        return { x: '-100%', y: '0%' };
      case 'bottom-right':
        return { x: '0%', y: '0%' };
      default:
        return { x: '-50%', y: '-100%' };
    }
  };

  return (
    <div className="relative inline-block">
      {children}
      <motion.div
        className="p2 pointer-events-none absolute whitespace-nowrap rounded-sm bg-black/75 text-white"
        initial={{ opacity: 0, ...getDirectionStyles() }}
        animate={{ opacity: 1, x: '-50%', y: '-50%' }}
        transition={{ duration: 0.3 }}
      >
        {content}
      </motion.div>
    </div>
  );
};

export default Tooltip;
