import React from "react";
import classNames from "classnames";

import "./DriverNameLockup2026.scss";

const LOCKUP_SIZES = new Set(["sm", "md", "lg", "xl"]);

export const splitDriverName2026 = (name = "Driver") => {
    const parts = name.trim().split(/\s+/);
    return {
        firstName: parts.slice(0, -1).join(" ") || parts[0],
        lastName: parts.length > 1 ? parts.at(-1) : parts[0],
    };
};

export const DriverNameLockup2026 = ({
    name,
    firstName,
    lastName,
    lastNameAs: LastNameTag = "strong",
    size = "md",
    shrinkForMobile = false,
    className,
    firstNameClassName,
    firstNameStyle,
    lastNameClassName,
    lastNameStyle,
    children,
}) => {
    const splitName = splitDriverName2026(name);
    const resolvedSize = LOCKUP_SIZES.has(size) ? size : "md";

    return (
        <div
            className={classNames(
                "ds-2026-driver-name-lockup",
                `ds-2026-driver-name-lockup--${resolvedSize}`,
                { "ds-2026-driver-name-lockup--shrink-for-mobile": shrinkForMobile },
                className
            )}
        >
            <span
                className={classNames("ds-2026-driver-name-lockup__first", firstNameClassName)}
                style={firstNameStyle}
            >
                {firstName || splitName.firstName}
            </span>
            <LastNameTag
                className={classNames("ds-2026-driver-name-lockup__last", lastNameClassName)}
                style={lastNameStyle}
            >
                {lastName || splitName.lastName}
            </LastNameTag>
            {children}
        </div>
    );
};
