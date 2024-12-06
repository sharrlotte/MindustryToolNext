"use client";

import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import React, { useCallback } from "react";
import ReactDOM from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose],
  );

  return ReactDOM.createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div
            className="flex h-full w-full items-center justify-center bg-black/80 backdrop-blur-md"
            onClick={handleBackdropClick}
          >
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ duration: 0.3, type: "spring" }}
              className="border-border relative mx-4 flex items-center justify-center rounded border bg-black p-8 text-white shadow-lg"
            >
              <button
                onClick={onClose}
                className="absolute right-2 top-0 flex aspect-square text-center text-4xl"
                aria-label="Close modal"
              >
                &times;
              </button>
              <div id="modal-title" className="sr-only">
                Modal Title
              </div>
              {children}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
};

Modal.displayName = "Modal";

export default dynamic(() => Promise.resolve(React.memo(Modal)), {
  ssr: false,
});
