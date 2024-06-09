import React, { useRef } from 'react';
import { FaGithub, FaInstagram } from 'react-icons/fa';
import { useInView } from "framer-motion";

export function LandingPage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
          
  return (
    <div className="global-container relative ">

      {/* Hero */}
      <div className="landing-hero drop-shadow-lg mb-32">
        <h1 className="heading-1 max-lg:px-16 lg:px-64 text-center pt-32">Your Ultimate Destination for F1 Data and Analysis</h1>
        <img alt="" src={`${process.env.PUBLIC_URL + "/images/liverySide.png"}`} />
      </div>

      {/* Intro */}
      <div className="landing-section-intro max-md:h-[20rem] md:h-[12rem] flex items-center justify-center text-center">
        <p className="text-18 z-10 relative w-[75%] max-sm:mr-32">Dive into the world of Formula 1 with our comprehensive suite of tools and insights designed to enhance your understanding and appreciation of the sport.</p>
      </div>

      {/* beyond the track */}
      <div className="landing-section-features flex item-start relative">
        <div className="landing-section-content">
        
          <div className="landing-section-features__media">
            <img alt="" src={`${process.env.PUBLIC_URL + "/images/lapData.png"}`} />
            <img alt="" src={`${process.env.PUBLIC_URL + "/images/tireStrat.png"}`} />
          </div>

          <div className="relative z-10">
            <p className="uppercase text-plum-300 tracking-sm md:mt-24">beyond the track</p>
            <p className="heading-3 mb-24">Data, Insights, Action</p>

            <p className="text-sm uppercase text-neutral-400 tracking-sm">Detailed Leaderboards </p>
            <p className="mb-24">Stay ahead with real-time rankings and statistics from every race.</p>

            <p className="text-sm uppercase text-neutral-400 tracking-sm">Lap Times Analysis</p>
            <p className="mb-24">Gain in-depth knowledge of driver performance, consistency, and strategy.</p>

            <p className="text-sm uppercase text-neutral-400 tracking-sm">Tire Strategies</p>
            <p className="mb-24">Discover how tire choices impact race outcomes.</p>

            <p className="text-sm uppercase text-neutral-400 tracking-sm">Fastest Laps</p>
            <p className="mb-24">Track the drivers setting the pace each race.</p>
          </div>

          <img className="absolute translate-x-[10%] max-md:-translate-y-[20%] md:-translate-y-[50%] top-full" alt="" src={`${process.env.PUBLIC_URL + "/images/liveryFrontSide.png"}`} />
        </div>
      </div>

      {/* Interactive Telemetry Viewer */}
      <div className="landing-section-viewer">
        <div className="landing-section-viewer__wrapper">
          <p className="heading-3">Interactive Telemetry Viewer</p>
          <p className="uppercase text-plum-300 tracking-sm mb-24">Enjoy Our state-of-the-art interactive canvas</p>
          
          <div className="landing-section-viewer__content md:flex md:items-start -mb-[20rem]">
            <div className="grow">
              <p className="text-sm uppercase text-neutral-400 tracking-sm">Select a Driver</p>
              <p className="mb-24">Monitor their race progress lap by lap.</p>

              <p className="text-sm uppercase text-neutral-400 tracking-sm">Multiple Camera Views</p>
              <p className="mb-24">Get closer to the action with various perspectives.</p>

              <p className="text-sm uppercase text-neutral-400 tracking-sm">Detailed Telemetry Data</p>
              <p className="mb-24">Analyze every aspect of driver performance.</p>
            </div>
            <img className="landing-section-viewer__media mb-24" alt="" src={`${process.env.PUBLIC_URL + "/images/telemetry.png"}`} />
          </div>
        </div>
      </div>

      {/* Contact Us */}
      <div className="landing-section-contact mx-16 flex items-center mb-[12rem]">
        <img className="landing-section-contact__media mb-24" alt="" src={`${process.env.PUBLIC_URL + "/images/liveryTopView.png"}`} />
        
        <div className="landing-section-contact__info p-32 r-24">
          <div className="sm:flex sm:items-center sm:justify-between gap-32">
            <p className="heading-3">Contact Us</p>
            <div className="flex items-center sm:justify-between max-sm:pt-16 gap-32">
              <a href="https://www.instagram.com/f1nsight1/" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2">
                  <FaInstagram size={24} />
              </a>
              <a href="https://github.com/adityakotha03/F1nsight" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2">
                  <FaGithub size={24} />
              </a>
            </div>
          </div>

          <p className="mt-16">At F1nsight, we're passionate about fostering a collaborative environment. Whether you’re a developer, a data analyst, or an F1 enthusiast, there's a place for you here. We welcome your insights, suggestions, and ideas to help us grow and improve.</p>
        </div>
      </div>
    </div>
    
  );
}
