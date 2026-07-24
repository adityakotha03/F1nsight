import React, { forwardRef } from "react";
import classNames from "classnames";

import "./HeroShell2026.scss";

export const HeroShell2026 = forwardRef(({
    as: HeroTag = "section",
    className,
    children,
    ...props
}, ref) => (
    <HeroTag
        ref={ref}
        className={classNames("ds-2026-hero-shell", className)}
        {...props}
    >
        {children}
    </HeroTag>
));

HeroShell2026.displayName = "HeroShell2026";
