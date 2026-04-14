import React, { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

import { Button, LumaKeyVideo } from "../components";

import classNames from "classnames";

const TelemetrySection = ({ layoutMobile, onClick, container }) => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
    container: container,
  });

  const yTextContent = useTransform(
    scrollYProgress,
    [0, 1],
    layoutMobile ? [0, 0] : [126, -74],
  );

  return (
    <section className="telemetry-section min-h-screen snap-start flex items-center justify-center bg-neutral-950 pt-32 relative z-0 overflow-x-hidden">
      <div className="max-w-[1200px] w-full mx-auto px-16">
        <h2 className="heading-2 text-center mb-16 uppercase">
          Interactive Telemetry
        </h2>
        <div
          ref={sectionRef}
          className="flex flex-col-reverse md:flex-row-reverse md:items-start items-center mx-auto relative"
        >
          <motion.div
            className={classNames(
              "p-32 md:py-32 md:pr-32 md:pl-64 md:ml-[-100px] md:rounded-xlarge max-md:text-small max-md:text-center",
              "w-full md:w-1/3 flex flex-col max-md:items-center gap-8 relative z-10",
              "md:bg-gradient-to-b md:from-neutral-900 md:to-neutral-900/10",
            )}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ y: yTextContent }}
          >
            <p className="uppercase font-semibold tracking-xs gradient-text-light">
              Select a Driver
            </p>
            <p className="mb-12">Monitor their race progress lap by lap.</p>
            <p className="uppercase tracking-xs gradient-text-light">
              Multiple Camera Views
            </p>
            <p className="mb-12">
              Get closer to the action with various perspectives.
            </p>
            <p className="uppercase tracking-xs gradient-text-light">
              Detailed Telemetry Data
            </p>
            <p className="mb-12">Analyze every aspect of driver performance.</p>
            <Button
              as="button"
              onClick={onClick}
              size="sm"
              className="shadow-xl w-fit"
            >
              View Latest F1 Race
            </Button>
          </motion.div>
          <motion.div
            className="w-full sm:w-2/3 ar-experience-section__phone z-10 md:ml-[-40px]"
            initial={{ opacity: 0, scale: 1.2 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <LumaKeyVideo
              src="/Media/PngSequenceCanvas.mp4"
              poster="/images/telemetryImage.png"
              className="w-full h-auto"
            />

            <div className="divider-glow-dark -mt-8" />
          </motion.div>
          <motion.img
            className="w-[300px] absolute -left-[100px] top-64 z-[1]"
            src={`${"/images/plusPatterns.png"}`}
            alt=""
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ y: yTextContent }}
          />
        </div>
      </div>
    </section>
  );
};

export default TelemetrySection;
