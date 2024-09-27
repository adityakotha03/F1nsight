import React, { useRef } from 'react';
import { FaGithub, FaInstagram } from 'react-icons/fa';
import { useInView } from "framer-motion";
import classNames from 'classnames';

import { Button } from '../components';
import { trackButtonClick } from '../utils/gaTracking';

export function LandingPage({setResultPagePath}) {
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
        <div className="landing-section__content mb-[10.4rem]">
          <div className="landing-section-features__media">
            <img alt="" src={`${process.env.PUBLIC_URL + "/images/lapData.png"}`} />
            <img alt="" src={`${process.env.PUBLIC_URL + "/images/tireStrat.png"}`} />
          </div>

          <div className="relative z-10 md:mb-96">
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
      <div className="landing-section -mt-[12rem] max-md:pt-[12rem] md:pt-[18rem]">
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
      <div className="landing-section py-96 md:py-64">
        <div className="landing-section__content md:mt-24">
          <div className="max-md:-mt-64 max-md:mb-16">
            <img 
              className="rounded-lg md:hidden shadow-12-dark" 
              alt="" 
              src={`${process.env.PUBLIC_URL + "/images/comparisons-lg.png"}`}
            />
          </div>
          <div className="md:min-w-[50%]">
            <p className="heading-3 mb-24">Driver & team comparisons</p>
            <p className="mb-24">Dive into the exciting world of Formula 1 with our innovative comparison feature, allowing you to analyze performance metrics and statistics of drivers and teams across all generations. Whether you’re a die-hard fan or a casual observer, this tool provides invaluable insights into the rich history of the sport..</p>
            <div className="flex items-center gap-16 mb-24">
              <img
                className="rounded-lg max-md:hidden w-1/3 shadow-12-dark" 
                alt="" 
                src={`${process.env.PUBLIC_URL + "/images/comparisons-sm.png"}`} 
              /> 
              <div className="">
                <p className="text-sm uppercase text-neutral-400 tracking-xs">Head-to-Head Teammate Comparisons</p>
                <p className="mb-24">With our head-to-head feature, you can compare teammates directly, evaluating their performances in the same car during specific seasons. This comparison reveals how drivers stack up against one another under identical conditions, highlighting their strengths and weaknesses. Discover who consistently outperformed their partner, and understand the dynamics within the team.</p>
                <Button to="/teammates-comparison" onClick={() => trackButtonClick('team-comparison-landing')} buttonStyle="solid" className="w-full">Team Comparison</Button>
              </div>
            </div>
            <div className="flex items-center gap-16">
              <div className="">
                <p className="text-sm uppercase text-neutral-400 tracking-xs">All-Time Driver Comparisons</p>
                <p className="mb-24">Extend your analysis beyond teammates to include any driver from any team throughout F1’s illustrious history. This feature empowers you to examine a vast array of performance metrics, such as the number of race wins, pole positions, and qualifying statistics. Whether you want to pit legendary drivers against current stars or compare up-and-coming talents with established champions, our platform provides a detailed look at their achievements.</p>
                <Button to="/driver-comparison" onClick={() => trackButtonClick('driver-comparison-landing')} buttonStyle="solid" className="w-full">Driver Comparison</Button>
              </div>
              <img
                className="rounded-lg max-md:hidden w-1/3 shadow-12-dark" 
                alt="" 
                src={`${process.env.PUBLIC_URL + "/images/driverComparison.png"}`} 
              /> 
            </div>

          </div>
        </div>
      </div>
      
      {/* AR */}
      <div className="landing-section">
        <div className="landing-section__content landing-section__content--reverse md:mt-24">
          <div className="md:w-1/2">
            <p className="heading-3 mb-24">AR Experience</p>
            <p className="mb-24">Place and scale your favorite F1 car model right in your environment. Walk around it and inspect every intricate detail as if you were in the paddock!</p>
            <p className="text-sm uppercase text-neutral-400 tracking-xs">Capture stunning moments</p>
            <p className="mb-24">With our AR feature, you can snap breathtaking photos and videos of your F1 car in various settings. Share these memorable moments with friends and fellow F1 enthusiasts, and don’t forget to mention @f1nsight1! #f1nsight</p>
            <p className="text-sm uppercase text-neutral-400 tracking-xs">Learn about team history</p>
            <p className="mb-24">As you explore, dive deeper into the legacy of your favorite teams. For example, did you know that Ferrari has a storied history spanning over 70 years, while Red Bull, known for its recent dominance, has been racing for nearly 20 years under its current name? Discover the rich heritage of constructors and their drivers’ championships, including the transformations of teams from their origins to present-day achievements.</p>
            <div className="flex flex-col items-center gap-16">
              <Button to="/ar-viewer" buttonStyle="solid" onClick={() => trackButtonClick('ar-viewer-landing')}>Click here to try it out</Button>
              <div>or scan QR code</div>
              <img className="rounded-sm shadow-12-dark w-[12rem]" alt="" src={`${process.env.PUBLIC_URL + "/images/arQr.png"}`} />
            </div>
          </div>
          <div className="landing-section__content__media flex-grow max-md:-mt-64 max-md:mb-16 md:w-1/2">
            <video
                src={`${process.env.PUBLIC_URL + "/images/arCapture2.mp4"}`}
                loop
                autoPlay
                muted
                playsInline
                className="max-md:h-[40rem] max-md:w-2/3 max-md:mx-auto md:h-full w-full object-cover rounded-lg shadow-12-dark"
            />
          </div>
        </div>
      </div>

      {/* F1A */}
      <div className="landing-section pt-96 pb-[16rem]">
        <div className="landing-section__content md:mt-24">
          <div className="landing-section__content__media max-md:-mt-64 max-md:mb-16 md:mr-4">
            <img className="rounded-lg shadow-12-dark w-full max-md:w-2/3 max-md:mx-auto shrink-0" alt="" src={`${process.env.PUBLIC_URL + "/images/F1AnsightMedia1.jpg"}`} /> 
          </div>
          <div className="md:min-w-[50%] shrink">
            <p className="heading-3 mb-24">F1 ACADEMY™</p>
            <p className="mb-8">We’re thrilled to announce that F1nsight now includes comprehensive statistics and insights from the exciting F1 Academy series!</p>
            <p className="mb-24">Get ready to dive into detailed results, driver performances, and constructor standings from each thrilling race of the F1 Academy season. Whether you’re following the rising stars or analyzing the latest trends, our new features will keep you updated and informed.</p>
            <Button 
              to="/f1a/race-results" 
              buttonStyle="solid" 
              className="w-full mb-24" 
              onClick={() => {
                setResultPagePath('/f1a/race-results')
                trackButtonClick('f1a-results-landing')
              }}
            >
              Explore F1A Results
            </Button>
            <p className="mb-24">Stay tuned as we continue to enhance our coverage with even more insights and data visualizations. Your ultimate source for F1 Academy stats is here—experience it now and be at the forefront of the racing action!</p>
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
