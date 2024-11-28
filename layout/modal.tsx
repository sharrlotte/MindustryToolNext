'use client';

import { AnimatePresence, motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import React from 'react';
import ReactDOM from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  return ReactDOM.createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="fixed inset-0 z-50">
          <div
            className="flex h-full w-full items-center justify-center bg-black/80 backdrop-blur-md"
            onClick={(e) => {
              if (e.target === e.currentTarget) onClose();
            }}
          >
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ duration: 0.3, type: 'spring' }}
              className="relative mx-4 flex text-white items-center justify-center rounded border border-border p-8 shadow-lg bg-black"
            >
              <button onClick={onClose} className="absolute right-2 flex top-0 aspect-square text-4xl text-center">
                &times;
              </button>
              {children}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
};

Modal.displayName = 'Modal';

export default dynamic(() => Promise.resolve(Modal), { ssr: false });
