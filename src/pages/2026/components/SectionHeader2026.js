import React from "react";
import classNames from "classnames";

export const SectionHeader2026 = ({
    eyebrow,
    title,
    accent,
    meta,
    className,
}) => {
    const titleParts = title.split(" ");
    const accentIndex = accent ? titleParts.findIndex(part => part === accent) : -1;

    return (
        <div className={classNames("ds-2026-section-header", className)}>
            <div className="ds-2026-section-header__eyebrow">{eyebrow}</div>
            <div className="ds-2026-section-header__rule" />
            {meta && <div className="ds-2026-section-header__meta">{meta}</div>}
            <h2>
                {titleParts.map((part, index) => (
                    <React.Fragment key={`${part}-${index}`}>
                        {index > 0 && " "}
                        <span
                            className={classNames({
                                "ds-2026-section-header__accent": index === accentIndex,
                            })}
                        >
                            {part}
                        </span>
                    </React.Fragment>
                ))}
            </h2>
        </div>
    );
};
