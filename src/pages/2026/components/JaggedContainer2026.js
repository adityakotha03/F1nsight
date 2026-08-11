import React from "react";
import classNames from "classnames";

import "./JaggedContainer2026.scss";

export const JaggedContainer2026 = ({
    as: Container = "div",
    children,
    className,
    color = "var(--ds-2026-paper)",
    edge = "bottom",
    fullBleed = false,
    lifted = false,
    size = "md",
    style,
    ...props
}) => (
    <Container
        className={classNames(
            "ds-2026-jagged-container",
            `ds-2026-jagged-container--${edge}`,
            `ds-2026-jagged-container--${size}`,
            {
                "ds-2026-jagged-container--full-bleed": fullBleed,
                "ds-2026-jagged-container--lifted": lifted,
            },
            className
        )}
        style={{ ...style, "--ds-2026-jagged-color": color }}
        {...props}
    >
        {children}
    </Container>
);
