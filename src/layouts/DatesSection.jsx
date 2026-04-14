import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

const DatesSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      className="h-screen snap-start flex flex-col items-center justify-center px-16 bg-neutral-950 relative py-32 overflow-hidden"
    >
      <div className="max-w-[1200px] w-full mx-auto text-center z-10">
        <motion.h2
          className="heading-2 uppercase mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          2026 F1 Race Calendar
        </motion.h2>
        <motion.p
          className="text-neutral-400 text-2xl mb-48 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Plan your season with the full 2026 F1 Race Calendar
        </motion.p>

        <motion.div
          className="relative w-full max-w-5xl mx-auto rounded-2xl overflow-hidden border border-neutral-800 shadow-2xl bg-neutral-900"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <img
            src="/images/2026/F1Dates.png"
            alt="2026 F1 Race Calendar"
            className="w-full h-auto max-h-[65vh] object-contain mx-auto"
          />
        </motion.div>
      </div>

      {/* Subtle background decoration matches other sections */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <img
          className="w-[300px] absolute -left-[100px] top-64"
          src="/images/plusPatterns.png"
          alt=""
        />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_rgba(255,0,0,0.05),_transparent_70%)]" />
      </div>
    </section>
  );
};

export default DatesSection;
