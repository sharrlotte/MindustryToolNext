'use client';
import { motion } from 'framer-motion';
import { createContext, useContext } from 'react';

interface PageTransitionProps {
  children: React.ReactNode;
}

const variants = {
  initial: { opacity: 0 },
  enter: { opacity: 1 },
  exit: { opacity: 0 },
};

const PageTransitionContext = createContext({});

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const context = useContext(PageTransitionContext);

  return (
    <motion.div
      className="h-full overflow-hidden"
      initial="initial"
      animate="enter"
      exit="exit"
      variants={variants}
      transition={{ duration: 0.5 }}
      key={typeof window !== 'undefined' ? window.location.pathname : ''}
      {...context}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
