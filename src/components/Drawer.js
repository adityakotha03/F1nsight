import React, { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Drawer = ({ isOpen, onClose, children }) => {
  // Disable scrolling when the drawer is open
  useEffect(() => {
    if (isOpen) {
      document.documentElement.classList.add("overflow-hidden");
    } else {
      document.documentElement.classList.remove("overflow-hidden");
    }

    return () => {
      document.documentElement.classList.remove("overflow-hidden");
    };
  }, [isOpen]);

  // Handle Escape key to close drawer
  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Background Overlay */}
          <motion.div
            className="fixed inset-[0] bg-neutral-900/80 backdrop-blur-md z-[9000]"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Drawer */}
          <motion.div
            className={classNames(
              "fixed bottom-[0] left-0 w-full max-h-[90vh] bg-glow bg-neutral-900 shadow-xl rounded-t-2xl z-[9001] px-16 pb-32 pt-24 flex flex-col",
            )}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Close Button */}
            <button
              className="absolute -top-32 right-16"
              onClick={onClose}
            >
              <FontAwesomeIcon icon="xmark" className="fa-lg" />
            </button>

            {/* Drawer Content */}
            <div className="overflow-y-auto">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Drawer;