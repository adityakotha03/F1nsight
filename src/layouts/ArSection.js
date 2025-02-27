import React, { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";

import { Button } from "../components";
import { Navigate } from "react-router-dom";

const ArSection = ({ layoutMobile }) => {
    const navigate = useNavigate();
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

    const { scrollYProgress } = useScroll({
            target: sectionRef,
            offset: ["start end", "end start"],
        });

    const yTextContent = useTransform(scrollYProgress, [0, 1], layoutMobile ? [0, 0] : [50, -50]);

    return (
        <section className="ar-experience-section py-64 bg-gradient-to-b from-neutral-950/30 to-neutral-950/5">
            <div className="max-w-screen-sm mx-auto">
                <h2 className="heading-3 text-center mb-64">
                    bring the excitement of F1 right into your own space
                </h2>
                <div ref={sectionRef} className="flex flex-col sm:flex-row items-center mx-auto relative">
                    <motion.div
                        className="w-full sm:w-1/2 flex flex-col gap-16 relative z-10 bg-gradient-to-b from-neutral-900 to-neutral-900/10 py-32 pl-32 pr-64 sm:mr-[-40px] rounded-xlarge"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        style={{ y: yTextContent }}
                    >
                        <p>
                            Place and scale your favorite F1 car model right in
                            your environment. Walk around and inspect every
                            intricate detail as if you were in the paddock!
                            Don’t forget to tag @f1nsight1! #f1nsight
                        </p>
                        <Button
                            as="button"
                            onClick={() => Navigate("/ar-viewer")}
                            size="sm"
                            className="shadow-xl w-fit"
                        >
                            Go to AR Experience
                        </Button>
                        <p>or scan qr code to get started </p>
                        <img
                            className="w-1/2"
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
                    <motion.img
                        className="w-2/3 sm:w-1/2 ar-experience-section__phone z-10"
                        src={`${
                            process.env.PUBLIC_URL + "/images/testPhone.png"
                        }`}
                        alt="AR Car"
                        initial={{ opacity: 0, scale: 1.2 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                </div>
            </div>
        </section>
    );
};

export default ArSection;
