import React from "react";
import classNames from "classnames";

import "./Tabs2026.scss";

export const Tabs2026 = ({
    activeTab,
    ariaLabel,
    children,
    className,
    idPrefix,
    onChange,
    tabs,
}) => {
    const handleKeyDown = (event, tabIndex) => {
        let nextIndex = tabIndex;

        if (event.key === "ArrowRight") nextIndex = (tabIndex + 1) % tabs.length;
        if (event.key === "ArrowLeft") nextIndex = (tabIndex - 1 + tabs.length) % tabs.length;
        if (event.key === "Home") nextIndex = 0;
        if (event.key === "End") nextIndex = tabs.length - 1;
        if (nextIndex === tabIndex) return;

        event.preventDefault();
        const nextTab = tabs[nextIndex];
        onChange(nextTab.id);
        document.getElementById(`${idPrefix}-tab-${nextTab.id}`)?.focus();
    };

    return (
        <div className={classNames("ds-2026-tabs", className)}>
            <div className="ds-2026-tabs__list" role="tablist" aria-label={ariaLabel}>
                {tabs.map(({ id, label }, index) => (
                    <button
                        key={id}
                        id={`${idPrefix}-tab-${id}`}
                        className="ds-2026-tabs__tab"
                        type="button"
                        role="tab"
                        aria-controls={`${idPrefix}-panel-${id}`}
                        aria-selected={activeTab === id}
                        tabIndex={activeTab === id ? 0 : -1}
                        onClick={() => onChange(id)}
                        onKeyDown={event => handleKeyDown(event, index)}
                    >
                        {label}
                    </button>
                ))}
            </div>
            <div
                key={activeTab}
                id={`${idPrefix}-panel-${activeTab}`}
                className="ds-2026-tabs__panel"
                role="tabpanel"
                aria-labelledby={`${idPrefix}-tab-${activeTab}`}
                tabIndex={0}
            >
                {children}
            </div>
        </div>
    );
};
