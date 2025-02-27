import React, { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "../components";
import classNames from "classnames";

const ComparisonsSection = ({ layoutMobile }) => {
    const navigate = useNavigate();
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

    // Get scroll progress for smooth parallax effect
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"],
    });

    // Parallax Transformations
    const yHeading = useTransform(
        scrollYProgress,
        [0, 1],
        layoutMobile ? [-75, 0] : [-75, 50]
    ); // Heading moves slower
    const computerImages = useTransform(
        scrollYProgress,
        [0, 1],
        layoutMobile ? [-50, 50] : [-75, 50]
    ); // Images move more
    const yDecorationBG = useTransform(scrollYProgress, [0, 1], [0, 0]); // Decorations move the most
    const yDecoration1 = useTransform(scrollYProgress, [0, 1], [-150, -75]); // Mobile
    const yDecoration2 = useTransform(scrollYProgress, [0, 1], [-100, 0]); // Decorations move the most
    const yDecoration3 = useTransform(scrollYProgress, [0, 1], [-50, 25]); // Decorations move the most

    const links = (customClassName) => {
        return (
            <div className={classNames(customClassName, "z-10 w-full")}>
                <Button
                    as="button"
                    onClick={() => navigate("/driver-comparison")}
                    size="sm"
                    className="shadow-xl max-sm:w-full"
                >
                    Driver Comparison
                </Button>
                <Button
                    as="button"
                    onClick={() => navigate("/teammates-comparison")}
                    size="sm"
                    className="shadow-xl max-sm:w-full"
                >
                    Teammate Comparison
                </Button>
            </div>
        );
    };

    return (
        <section
            ref={sectionRef}
            className="pt-64 max-sm:pb-[128px] sm:pb-64 px-16 bg-gradient-to-b from-neutral-950/30 to-neutral-950/5 relative"
        >
            {/* Heading Animates in & Scrolls */}
            <motion.div
                className="max-w-screen-md mx-auto text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.8, ease: "easeOut" }}
                // style={{ y: yHeading }}
            >
                <h2 className="heading-3 mb-16">
                    Driver and Teammate Comparisons
                </h2>
                <p>
                    Compare teammates directly, evaluating their performances in
                    the same car during specific seasons or extend your analysis
                    beyond teammates to include any driver from any team
                    throughout F1 history.
                </p>
            </motion.div>

            {/* Comparison Grid */}
            <motion.div
                className="comparison-container relative"
                ref={sectionRef}
            >
                <div className="comparison-containers--computer z-10 relative py-32 max-w-screen-lg mx-auto">
                    <motion.div
                        className="flex flex-row items-center justify-center relative"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={isInView ? { opacity: 1, scale: layoutMobile ? 1.3 : 1 } : {}}
                        transition={{ duration: 1, ease: "easeOut" }}
                        style={{ y: computerImages }}
                    >
                        {/* Left - Driver Comparison */}
                        <div className="w-[55%] shrink-0">
                            <img
                                className="w-full h-auto"
                                src={`${
                                    process.env.PUBLIC_URL +
                                    "/images/comparisonDrivers.png"
                                }`}
                                alt="Drivers"
                            />
                        </div>

                        {/* Right - Teammate Comparison */}
                        <div className="w-[65%] shrink-0 relative ml-[-40px] sm:ml-[-100px] lg:ml-[-150px]">
                            <img
                                className="w-full"
                                src={`${
                                    process.env.PUBLIC_URL +
                                    "/images/comparisonTeammates.png"
                                }`}
                                alt="Teammates"
                            />
                        </div>
                        {links("absolute top-1/2 -translate-y-1/2 flex flex-row justify-between  items-center gap-8 max-sm:hidden")}
                    </motion.div>
                    {links("flex flex-col absolute top-full gap-8 sm:hidden")}
                </div>

                {/* Background Decorations - Move on Scroll */}
                <motion.img
                    className="w-full absolute top-1/4 z-0"
                    src={`${
                        process.env.PUBLIC_URL + "/images/arrowsBGthin.png"
                    }`}
                    alt=""
                    initial={{ opacity: 0, scale: 1.5 }}
                    animate={isInView ? { opacity: 1, scale: 1.1 } : {}}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    style={{ y: yDecorationBG }}
                />
                <motion.img
                    className="w-[300px] absolute top-1/4 left-32 z-0 sm:hidden"
                    src={`${
                        process.env.PUBLIC_URL + "/images/plusPatterns.png"
                    }`}
                    alt=""
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
                    style={{ y: yDecoration1 }}
                />
                <motion.img
                    className="w-[300px] absolute top-1/4 right-32 z-0 max-sm:hidden"
                    src={`${
                        process.env.PUBLIC_URL + "/images/plusPatterns.png"
                    }`}
                    alt=""
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
                    style={{ y: yDecoration2 }}
                />
                <motion.img
                    className="w-[300px] absolute top-1/4 left-32 z-0 max-sm:hidden"
                    src={`${
                        process.env.PUBLIC_URL + "/images/plusPatterns.png"
                    }`}
                    alt=""
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
                    style={{ y: yDecoration3 }}
                />
            </motion.div>
        </section>
    );
};

export default ComparisonsSection;
