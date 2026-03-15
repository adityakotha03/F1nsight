import React, { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";

import { Button } from "../components";
import PngSequencePlayer from "../components/PngSequencePlayer";
import { trackButtonClick } from "../utils/gaTracking";

const ArSection = ({ layoutMobile }) => {
    const navigate = useNavigate();
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
                    bring the excitement of F1 right into your own space
                </h2>
                <div
                    ref={sectionRef}
                    className="flex max-sm:flex-col-reverse sm:flex-row items-center mx-auto relative"
                >
                    <motion.div
                        className="w-full sm:w-3/4 flex flex-col max-sm:items-center gap-16 relative z-10 sm:bg-gradient-to-b sm:from-neutral-900 sm:to-neutral-900/10 p-32 sm:py-32 sm:pl-32 sm:pr-64 sm:mr-[-40px] sm:rounded-xlarge max-sm:text-center"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        style={{ y: yTextContent }}
                    >
                        <p>
                            Place and scale your favorite F1 car model right in
                            your environment. Walk around and inspect every
                            intricate detail as if you were in the paddock! 
                            <br />
                            <br />
                            Not on a phone? No problem! You can also view the car in 360 degrees on your computer and learn about your favorite teams history.
                        </p>
                        <Button
                            as="button"
                            onClick={() => {
                                navigate("/ar-viewer")
                                trackButtonClick(
                                    `Home/Click/Section/AR Viewer - /ar-viewer`
                                );
                            }}
                            size="sm"
                            className="shadow-xl w-fit"
                        >
                            {layoutMobile ? 'Full AR Experience' : '360 Team Livery Viewer and History' }
                        </Button>
                        <p>
                            Scan QR code to go to the full AR Experience on your mbile device
                            <br />
                            Don't forget to tag @f1nsight1! #f1nsight
                        </p>
                        <img
                            className="w-1/3"
                            src={`${
                                process.env.PUBLIC_URL + "/images/arQr.png"
                            }`}
                            alt="QR Code"
                        />
                        <img
                            className="w-[300px] absolute left-full top-64 z-[1]"
                            src={`${
                                process.env.PUBLIC_URL +
                                "/images/plusPatterns.png"
                            }`}
                            alt=""
                        />
                    </motion.div>
                    <motion.div
                        className="w-2/3 sm:w-1/4 ar-experience-section__phone z-10"
                        initial={{ opacity: 0, scale: 1.2 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <PngSequencePlayer
                            frameCount={301}
                            path={`${
                                process.env.PUBLIC_URL +
                                "/Media/pngSequencePhone/PhoneAnimation_"
                            }`}
                            className=""
                            canvasClasses="w-full"
                            loadingImage={`${process.env.PUBLIC_URL}/images/ArPhoneImage.png`}
                        />
                    </motion.div>
                    
                </div>
            </div>
        </section>
    );
};

export default ArSection;
