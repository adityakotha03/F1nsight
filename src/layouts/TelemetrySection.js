import React, { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

import { Button } from "../components";
import PngSequencePlayer from "../components/PngSequencePlayer";
import classNames from "classnames";

const TelemetrySection = ({ layoutMobile, onClick }) => {
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"],
    });

    const yTextContent = useTransform(
        scrollYProgress,
        [0, 1],
        layoutMobile ? [0, 0] : [50, -50]
    );

    return (
        <section className="ar-experience-section pb-64 bg-gradient-to-b from-neutral-950/30 to-neutral-950/5">
            <div className="divider-glow-dark mb-64" />
            <div className="max-w-screen-lg mx-auto">
                <h2 className="heading-3 text-center mb-64">
                    Interactive Telemetry
                </h2>
                <div
                    ref={sectionRef}
                    className="flex flex-col-reverse md:flex-row-reverse items-center mx-auto relative md:ml-[-80px]"
                >
                    <motion.div
                        className={classNames(
                            "p-32 md:py-32 md:pr-32 md:pl-64 md:ml-[-100px] md:rounded-xlarge max-md:text-small max-md:text-center",
                            "w-full md:w-1/3 flex flex-col max-md:items-center gap-8 relative z-10",
                            "md:bg-gradient-to-b md:from-neutral-900 md:to-neutral-900/10"
                        )}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        style={{ y: yTextContent }}
                    >
                        <p className="uppercase font-semibold tracking-xs gradient-text-light">
                            Select a Driver
                        </p>
                        <p className="mb-12">
                            Monitor their race progress lap by lap.
                        </p>
                        <p className="uppercase tracking-xs gradient-text-light">
                            Multiple Camera Views
                        </p>
                        <p className="mb-12">
                            Get closer to the action with various perspectives.
                        </p>
                        <p className="uppercase tracking-xs gradient-text-light">
                            Detailed Telemetry Data
                        </p>
                        <p className="mb-12">
                            Analyze every aspect of driver performance.
                        </p>
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
                        className="w-full sm:w-2/3 ar-experience-section__phone z-10"
                        initial={{ opacity: 0, scale: 1.2 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <PngSequencePlayer
                            frameCount={301}
                            path={`${
                                process.env.PUBLIC_URL +
                                "/Media/pngSequenceCanvas/canvasAnimation_"
                            }`}
                            className=""
                            canvasClasses="w-full"
                            loadingImage={`${process.env.PUBLIC_URL}/images/telemetryImage.png`}
                        />
                        <div className="divider-glow-dark -mt-8" />
                    </motion.div>
                    <motion.img
                        className="w-[300px] absolute -left-[100px] top-64 z-[1]"
                        src={`${
                            process.env.PUBLIC_URL + "/images/plusPatterns.png"
                        }`}
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
