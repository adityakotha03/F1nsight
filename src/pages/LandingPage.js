import React, { useRef } from 'react';
import { FaGithub, FaInstagram } from 'react-icons/fa';
import { useInView } from "framer-motion";
import classNames from 'classnames';

import { Button } from '../components';

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
      <div className="landing-section-features pb-56 flex flex-col relative">
        <div className="landing-section__content mb-96">
          <div className="landing-section-features__media">
            <img alt="" src={`${process.env.PUBLIC_URL + "/images/lapData.png"}`} />
            <img alt="" src={`${process.env.PUBLIC_URL + "/images/tireStrat.png"}`} />
          </div>

          <div className="relative z-10">
            <p className="uppercase text-neutral-400 tracking-sm md:mt-24">beyond the track</p>
            <p className="heading-3 mb-24">Data, Insights, Action</p>

            <p className="text-sm uppercase text-neutral-400 tracking-xs">Detailed Leaderboards </p>
            <p className="mb-24">Stay ahead with real-time rankings and statistics from every race.</p>

            <p className="text-sm uppercase text-neutral-400 tracking-xs">Lap Times Analysis</p>
            <p className="mb-24">Gain in-depth knowledge of driver performance, consistency, and strategy.</p>

            <p className="text-sm uppercase text-neutral-400 tracking-xs">Tire Strategies</p>
            <p className="mb-24">Discover how tire choices impact race outcomes.</p>

            <p className="text-sm uppercase text-neutral-400 tracking-xs">Fastest Laps</p>
            <p className="mb-24">Track the drivers setting the pace each race.</p>
          </div>

          <img 
            className={classNames(
              "absolute top-full",
              "max-md:-translate-y-[20%] max-md:scale-105",
              "md:-translate-y-[40%] md:translate-x-[10%]",
            )} 
            alt="" 
            src={`${process.env.PUBLIC_URL + "/images/liveryFrontSide.png"}`} />
        </div>
      </div>

      {/* Interactive Telemetry Viewer */}
      <div className="landing-section -mt-[12rem] max-md:pt-[12rem] md:pt-[15rem]">
        <div className="landing-section__content landing-section__content--reverse">
          <div className="">
            <p className="uppercase text-neutral-400 tracking-sm">State-of-the-art</p>
            <p className="heading-3 mb-24">Interactive Telemetry Viewer</p>
            <p className="text-sm uppercase text-neutral-400 tracking-xs">Select a Driver</p>
            <p className="mb-24">Monitor their race progress lap by lap.</p>
            <p className="text-sm uppercase text-neutral-400 tracking-xs">Multiple Camera Views</p>
            <p className="mb-24">Get closer to the action with various perspectives.</p>
            <p className="text-sm uppercase text-neutral-400 tracking-xs">Detailed Telemetry Data</p>
            <p className="mb-24">Analyze every aspect of driver performance.</p>
          </div>
          <div className="" >
            <img alt="" src={`${process.env.PUBLIC_URL + "/images/telemetry.png"}`} /> 
          </div>
        </div>
      </div>
     
      {/* Comparisons */}
      <div className="landing-section">
        <div className="landing-section__content md:mt-24">
          <div className="landing-section__content__media shrink-0 md:flex md:items-center gap-4 max-md:-mt-64" >
            <img className="rounded-lg shadow-12-dark w-full" alt="" src={`${process.env.PUBLIC_URL + "/images/teamComparison.jpg"}`} /> 
            <img className="rounded-lg shadow-12-dark w-full max-md:hidden" alt="" src={`${process.env.PUBLIC_URL + "/images/driverComparison.jpg"}`} /> 
          </div>
          <div className="">
            <p className="heading-3 mb-24">Driver & team comparisons</p>
            <p className="mb-24">Compare drivers and teams from any generation based on performance metrics and statistics.</p>
            <div className="flex max-sm:flex-col max-sm:w-full md:flex-row items-center gap-16">
              <Button to="/driver-comparison" buttonStyle="solid">Driver Comparison</Button>
              <Button to="/team-comparison" buttonStyle="solid">Team Comparison</Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* AR */}
      <div className="landing-section">
        <div className="landing-section__content landing-section__content--reverse md:mt-24">
          <div className="">
            <p className="heading-3 mb-24">AR Experience</p>
            <p className="mb-24">Place and scale your favorite F1 car model in your environment. Walk around it, inspect every detail.</p>
            <p className="mb-24">Capture stunning photos and videos of your AR F1 car in different settings. Share these memorable moments with friends and fellow F1 enthusiasts and be sure to mention @f1nsight1.</p>
            <div className="flex flex-col items-center gap-16">
              <Button to="/apxar" buttonStyle="solid">Click here to try it out</Button>
              <div>or scan QR code</div>
              <img className="rounded-lg shadow-12-dark w-[12rem]" alt="" src={`${process.env.PUBLIC_URL + "/images/arQr.png"}`} /> 
            </div>
          </div>
          <div className="landing-section__content__media flex-grow max-md:-mt-64" >
            <video
                src={`${process.env.PUBLIC_URL + "/images/arcapture.mp4"}`}
                loop
                autoPlay
                muted
                playsInline
                className="max-md:h-[30rem] md:h-full w-full object-cover rounded-lg shadow-12-dark"
            />
          </div>
        </div>
      </div>

      {/* Contact Us */}
      <div className="landing-section-contact mx-16 flex items-center mb-[12rem] -mt-56">
        <img className="landing-section-contact__media mb-24" alt="" src={`${process.env.PUBLIC_URL + "/images/liveryTopView.png"}`} />
        
        <div className="landing-section-contact__info p-32 r-24">
          <div className="sm:flex sm:items-center sm:justify-between gap-32">
            <p className="heading-3">Contact Us</p>
            <div className="flex items-center sm:justify-between max-sm:pt-16 gap-32">
              <a href="https://www.instagram.com/f1nsight1/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  <FaInstagram size={24} />
              </a>
              <a href="https://github.com/adityakotha03/F1nsight" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
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
