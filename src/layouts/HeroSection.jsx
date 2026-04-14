import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef } from "react";
import { LumaKeyVideo } from "../components";

const HeroSection = ({ layoutMobile, container }) => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-20% 0px" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
    container: container,
  });

  // Apply parallax effect when scrolling
  const yTitle = useTransform(
    scrollYProgress,
    [0, 1],
    layoutMobile ? [0, 0] : [0, -50],
  );
  const yDecorLeft = useTransform(scrollYProgress, [0, 1], [-400, 0]);
  const yDecorRight = useTransform(scrollYProgress, [0, 1], [-500, 0]);

  return (
    <section
      ref={sectionRef}
      className="bg-black relative h-[100dvh] snap-start mb-[-1px] flex items-center justify-center z-10"
    >
      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        style={{ opacity: 0.4, filter: "brightness(1.0)" }}
      >
        <source src="/Media/Hero.mp4" type="video/mp4" />
      </video>

      {/* Animated Title (Triggers when in view, moves on scroll) */}
      <motion.h1
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        style={{ y: yTitle }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="text-center heading-1 absolute top-[14%] sm:top-[18%] mx-auto w-3/4 z-10"
      >
        Your Ultimate Destination for F1 Data and Analysis
      </motion.h1>

      {/* Left Decoration (Triggers when in view, moves on scroll) */}
      <motion.img
        initial={{ opacity: 0, scale: 0.8 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        style={{ y: yDecorLeft }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="w-[300px] absolute right-32 top-1/2 -translate-y-1/2 z-0"
        src="/images/plusPatternsPurple.png"
        alt=""
      />

      {/* Right Decoration (Triggers when in view, moves on scroll) */}
      <motion.img
        initial={{ opacity: 0, scale: 0.8 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        style={{ y: yDecorRight }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="w-[300px] absolute left-32 top-1/2 -translate-y-1/2 z-0 max-sm:hidden"
        src="/images/plusPatternsPurple.png"
        alt=""
      />

      <div className="absolute bottom-[-2px] lg:bottom-[-20px] w-full flex justify-center z-20 pointer-events-none">
        <LumaKeyVideo
          src="/Media/pngSequence.mp4"
          poster="/images/HeroImage.png"
          className="w-[90%] sm:w-[100%] lg:w-[105%] max-w-none drop-shadow-[0_-64px_64px_rgba(0,0,0,1)] mx-auto mb-0 lg:mb-[-4px]"
          style={{ filter: "brightness(1.1) contrast(1.1)" }}
        />
      </div>
    </section>
  );
};

export default HeroSection;
