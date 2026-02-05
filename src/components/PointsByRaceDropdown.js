import React, { useMemo, useState } from "react";
import { DEFAULT_RACE_KEY_LABELS } from "../utils/pointsByRace";

export const PointsByRaceDropdown = ({
  pointsByRace = [],
  racesMeta = [],
  raceKeyLabels = DEFAULT_RACE_KEY_LABELS,
  title = "Points by race",
}) => {
  const [open, setOpen] = useState(false);

  const activeRaceKeys = useMemo(() => {
    const keys = Object.keys(raceKeyLabels);
    const present = new Set();
    pointsByRace.forEach((race) => {
      keys.forEach((key) => {
        if (race.pointsByKey[key] !== undefined) present.add(key);
      });
    });
    return keys.filter((k) => present.has(k));
  }, [pointsByRace, raceKeyLabels]);

  // Determine if any card has data we can show
  const hasData =
    pointsByRace.length > 0 &&
    pointsByRace.some((race) =>
      activeRaceKeys.some((key) => race.pointsByKey[key] !== undefined)
    );

  return (
    <div className="mt-8 bg-glow-dark rounded-lg px-12 py-10">
      <button
        className="w-full flex items-center justify-between"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="font-semibold text-sm uppercase">
          {title}
        </span>
        <span className="text-xs text-neutral-400">
          {open ? "Hide" : "Show"}
        </span>
      </button>

      {open && (
        <div className="mt-6 overflow-x-scroll">
          {hasData ? (
            <div
              className="flex flex-row gap-4"
            >
              {pointsByRace.map((race, idx) => (
                <div
                  key={`${race.raceName}-${idx}`}
                  className="rounded-md px-12 py-8 bg-glow-dark"
                >
                  <div className="text-[8px] font-semibold mb-3 text-neutral-200 whitespace-nowrap">
                    {race.raceName || racesMeta[idx]?.raceName || `Race ${idx + 1}`}
                  </div>
                  <div className="flex flex-row gap-16">
                    {activeRaceKeys
                      .filter((raceKey) => race.pointsByKey[raceKey] !== undefined)
                      .map((raceKey) => (
                        <div
                          key={raceKey}
                          className="flex flex-col items-center justify-center text-neutral-300"
                        >
                          <span className="text-[8px] text-neutral-400">
                            {raceKeyLabels[raceKey] || raceKey}
                          </span>
                          <span className="font-semibold font-display">
                            {race.pointsByKey[raceKey] ?? "—"}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-neutral-400 px-4 py-3 border border-neutral-700 rounded-lg">
              No race points available.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
