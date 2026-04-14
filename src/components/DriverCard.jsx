import React, { useRef } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Popover } from "flowbite-react";
import { useInView } from "framer-motion";

export const DriverCard = (props) => {
  const {
    championshipLevel,
    className,
    driver,
    driverColor,
    stint,
    fastestLap,
    status,
    startPosition,
    endPosition,
    isActive,
    layoutSmall,
    time,
    year,
    hasHover,
    index,
    mobileSmall,
    isRace,
    darkBG,
  } = props;

  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true });

  const getTireCompound = (driverCode, lap) => {
    const driverStint = stint?.find((item) => item.acronym === driverCode);
    if (driverStint && driverStint.tires) {
      for (const tire of driverStint.tires) {
        if (lap <= tire.lap_end) {
          return tire.compound;
        }
      }
    }
    return "?";
  };

  const positionMovement = () => {
    if (startPosition !== endPosition) {
      return (
        <Popover
          aria-labelledby="default-popover"
          className="bg-glow border-neutral-400 border-[.1rem] p-4 bg-neutral-950 rounded-md z-[10]"
          trigger="hover"
          placement="top"
          arrow={false}
          content={
            <div className="p-4">
              <div>
                <span className="text-sm mr-4">Started</span>
                <span className="font-display">P{startPosition}</span>
              </div>
              <div>
                <span className="text-sm mr-4">Ended</span>
                <span className="font-display">P{endPosition}</span>
              </div>
            </div>
          }
        >
          <FontAwesomeIcon
            icon={startPosition > endPosition ? "circle-up" : "circle-down"}
            className={classNames(
              "fa-xs",
              startPosition > endPosition ? "text-emerald-500" : "text-rose-500",
            )}
          />
        </Popover>
      );
    }
    return null;
  };

  const driverImage = (
    <img
      alt=""
      src={
        championshipLevel
          ? `${"/images/" + year + "/" + championshipLevel + "/" + driver.code + ".png"}`
          : `${"/images/" + year + "/drivers/" + driver.code + ".png"}`
      }
      width={72}
      height={72}
      className={classNames("absolute block bottom-[0px]", "left-[28px]")}
      style={{
        opacity: isInView ? 1 : 0,
        transition: `all 1s cubic-bezier(0.17, 0.55, 0.55, 1) .${index}s`,
      }}
    />
  );

  const isFastestLapDriver = String(fastestLap?.rank) === "1";
  const fastestLapTime =
    fastestLap?.Time?.time ||
    fastestLap?.time?.time ||
    fastestLap?.Time ||
    fastestLap?.time ||
    "";
  const fastestLapAverageSpeed =
    fastestLap?.AverageSpeed || fastestLap?.averageSpeed;

  return (
    <div
      ref={cardRef}
      className={classNames(
        className,
        "driver-card flex items-center bg-glow relative",
        {
          "driver-card--canvas": mobileSmall,
          hidden: status === "cancelled",
          "bg-neutral-800": darkBG,
        },
        mobileSmall ? "rounded-sm mb-1" : "rounded-md mb-[2px]",
      )}
      style={{ borderColor: isActive && `#${driverColor}` }}
    >
      {/* Layout for List Items (P4+) */}
      <div
        className={classNames(
          "flex items-center justify-between w-full font-display",
          {
            "max-md:hidden": mobileSmall,
            hidden: !layoutSmall,
          },
        )}
      >
        <div className="flex items-center leading-none text-sm font-bold">
          <p
            className={classNames(
              "w-48 bg-neutral-700/80 py-[1px] text-center rounded-l-sm text-[10px] shadow-inner",
            )}
          >
            P{isRace ? endPosition : index + 1}
          </p>
          <span className="pl-12 mr-6 text-[13px] text-white brightness-125 uppercase tracking-wider">
            {driver.code}
          </span>
        </div>
        <div className="flex items-center pr-12 gap-8 h-full">
          <p className="text-[13px] text-white font-medium opacity-90">
            {time}
          </p>
          <div className="status-icons-wrapper flex flex-col items-center justify-center gap-[1px] min-w-[20px]">
            {isFastestLapDriver && (
              <Popover
                aria-labelledby="default-popover"
                className="bg-glow border-plum-500 border-[.1rem] rounded-md p-4 bg-neutral-950 z-[10]"
                trigger="hover"
                placement="top"
                arrow={false}
                content={
                  <div className="p-4">
                    <div className="bg-plum-500 text-center font-display rounded px-8 text-white">
                      {fastestLapTime}
                    </div>
                    <div className="flex align-start justify-around mt-4">
                      <div className="flex flex-col items-center px-4 text-center">
                        <span className="text-[10px] uppercase opacity-70">
                          Lap
                        </span>
                        <span className="font-display text-sm leading-tight text-white">
                          {fastestLap?.lap || "-"}
                        </span>
                      </div>
                      <div className="flex flex-col items-center px-4 text-center border-l border-white/10">
                        <span className="text-[10px] uppercase opacity-70">
                          Tyre
                        </span>
                        <span className="font-display text-sm leading-tight uppercase text-white">
                          {getTireCompound(driver.code, fastestLap?.lap).charAt(
                            0,
                          )}
                        </span>
                      </div>
                    </div>

                    {fastestLapAverageSpeed && (
                      <div className="flex flex-col items-center mt-8 pt-6 border-t border-white/5">
                        <span className="text-[10px] uppercase opacity-70 underline underline-offset-2">
                          Avg Speed
                        </span>
                        <div className="flex items-baseline gap-1 mt-1">
                          <span className="font-display text-sm text-white">
                            {fastestLapAverageSpeed?.speed}
                          </span>
                          <span className="text-[10px] opacity-60 uppercase">
                            {fastestLapAverageSpeed?.units}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                }
              >
                <span className="fa-layers fa-fw fa-xs scale-90 cursor-help">
                  <FontAwesomeIcon icon="circle" className="text-white" />
                  <FontAwesomeIcon
                    icon="clock"
                    className="text-plum-500"
                    transform="shrink-2"
                  />
                </span>
              </Popover>
            )}
            {isRace && positionMovement()}
          </div>
        </div>
      </div>

      {/* Layout for Hero Cards (P1-P3) */}
      <div
        className={classNames("flex items-center w-full", {
          "max-md:hidden": mobileSmall,
          hidden: layoutSmall,
        })}
      >
        <div
          className={classNames(
            "driver-card-position text-[18px] font-display px-6 py-1 bg-neutral-700/80 rounded-l-md flex items-center h-full min-h-[44px]",
          )}
        >
          P{isRace ? endPosition : index + 1}
        </div>
        {driverImage}
        <div className="grow py-1 pl-[10px] pr-12 text-right flex flex-col justify-center relative">
          <div className="flex items-center justify-end gap-12">
            <span className="heading-4 pl-60 uppercase font-black italic tracking-tighter text-[18px]">
              {driver.code}
            </span>
            <div className="status-icons-wrapper flex flex-col items-center justify-center gap-[1px] min-w-[20px]">
              {isFastestLapDriver && (
                <Popover
                  aria-labelledby="hero-popover"
                  className="bg-glow border-plum-500 border-[.1rem] rounded-md p-4 bg-neutral-950 z-[10]"
                  trigger="hover"
                  placement="top"
                  arrow={false}
                  content={
                    <div className="p-4 text-center">
                      <div className="bg-plum-500 text-[12px] font-display rounded px-8 inline-block text-white">
                        {fastestLapTime}
                      </div>
                    </div>
                  }
                >
                  <span className="fa-layers fa-fw fa-xs scale-110 cursor-help">
                    <FontAwesomeIcon icon="circle" className="text-white" />
                    <FontAwesomeIcon
                      icon="clock"
                      className="text-plum-500"
                      transform="shrink-2"
                    />
                  </span>
                </Popover>
              )}
              {isRace && positionMovement()}
            </div>
          </div>
          <div className="divider-glow w-full my-4" />
          <p className={classNames("text-base font-bold text-white/90")}>
            {time}
          </p>
        </div>
      </div>

      {/* Mobile Small Layout */}
      {mobileSmall && (
        <div className="md:hidden">
          <div className="flex items-center text-xs font-display">
            <p className="w-24 bg-neutral-600 py-1 text-center rounded-tl-[.4rem]">
              P{isRace ? endPosition : index + 1}
            </p>
            <p className="pl-8 pr-8 font-bold text-white">{driver.code}</p>
          </div>
          <div>
            <p className="text-sm pl-8 font-medium text-white">{time}</p>
          </div>
        </div>
      )}
    </div>
  );
};

DriverCard.propTypes = {
  isActive: PropTypes.bool,
  index: PropTypes.number,
  hasHover: PropTypes.bool,
  className: PropTypes.string,
  carNumber: PropTypes.string, // Max has a different permanentNumber than his actual car number
  driverColor: PropTypes.string,
  driver: PropTypes.shape({
    driverId: PropTypes.string,
    permanentNumber: PropTypes.string,
    code: PropTypes.string,
    url: PropTypes.string,
    givenName: PropTypes.string,
    familyName: PropTypes.string,
    dateOfBirth: PropTypes.string,
    nationality: PropTypes.string,
  }),
  fastestLap: PropTypes.shape({
    rank: PropTypes.string,
    lap: PropTypes.string,
    time: PropTypes.shape({
      time: PropTypes.string,
    }),
    averageSpeed: PropTypes.shape({
      units: PropTypes.string,
      speed: PropTypes.string,
    }),
  }),
  grid: PropTypes.string,
  startPosition: PropTypes.number,
  endPosition: PropTypes.number,
  status: PropTypes.string,
  time: PropTypes.string,
  year: PropTypes.number,
  layoutSmall: PropTypes.bool,
  mobileSmall: PropTypes.bool,
  championshipLevel: PropTypes.string,
};
