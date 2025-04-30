import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaChevronDown } from "react-icons/fa";
import classNames from "classnames";

const Accordion = ({ title, children, className, contentClasses, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <>
    <div className={classNames(className, "border-b border-neutral-700")}>
      {/* Header */}
      <button
        className="w-full flex justify-between items-center py-16 px-8 tracking-sm uppercase"
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
        <FaChevronDown
          className={`transform transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Collapsible Content */}
      <motion.div
        className="overflow-hidden"
        initial={{ height: 0 }}
        animate={{ height: isOpen ? "auto" : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className={classNames(contentClasses, "px-8 py-16")}>{children}</div>
      </motion.div>
    </div>
    <div className="divider-glow-dark" />
    </>
  );
};

export default Accordion;