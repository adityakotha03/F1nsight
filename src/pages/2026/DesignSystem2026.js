import React from "react";
import classNames from "classnames";

export const DesignSystem2026 = ({ children, className, style }) => {
    return (
        <main
            className={classNames("design-system-2026", className)}
            style={style}
        >
            {children}
        </main>
    );
};
