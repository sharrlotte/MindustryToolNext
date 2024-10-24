import clsx from "clsx"
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";

interface TooltipProps {
  direction:
    | "top"
    | "left"
    | "right"
    | "bottom"
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right";
  content: React.ReactNode;
  children: React.ReactNode;
  classname?: string;
}

const Tooltip: React.FC<TooltipProps> = ({
  direction,
  content,
  children,
  classname,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const getDirectionStyles = () => {
    switch (direction) {
      case "top":
        return { bottom: "100%", left: "50%", transform: "translateX(-50%)" };
      case "bottom":
        return { top: "100%", left: "50%", transform: "translateX(-50%)" };
      case "left":
        return { right: "100%", top: "50%", transform: "translateY(-50%)" };
      case "right":
        return { left: "100%", top: "50%", transform: "translateY(-50%)" };
      case "top-left":
        return { bottom: "100%", right: "0%" };
      case "top-right":
        return { bottom: "100%", left: "0%" };
      case "bottom-left":
        return { top: "100%", right: "0%" };
      case "bottom-right":
        return { top: "100%", left: "0%" };
      default:
        return { bottom: "100%", left: "50%", transform: "translateX(-50%)" };
    }
  };

  return (
    <div
      className={clsx("relative z-50 inline-block", classname)}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      aria-describedby="tooltip"
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            id="tooltip"
            role="tooltip"
            className="pointer-events-none absolute z-10 mt-1 whitespace-nowrap rounded-sm bg-black/75 p-1 text-sm text-white dark:bg-white/75 dark:text-gray-900"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={getDirectionStyles()}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tooltip;
