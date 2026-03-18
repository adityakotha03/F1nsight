import React, { useEffect, useMemo, useState } from "react";
import classNames from "classnames";

export const Tabs = ({
    tabs = [],
    className,
    tabListClassName,
    panelClassName,
}) => {
    const visibleTabs = useMemo(
        () => tabs.filter((tab) => tab && tab.id && tab.label),
        [tabs]
    );
    const [activeTabId, setActiveTabId] = useState(visibleTabs[0]?.id || "");

    useEffect(() => {
        if (!visibleTabs.length) {
            setActiveTabId("");
            return;
        }

        const activeTabStillVisible = visibleTabs.some(
            (tab) => tab.id === activeTabId
        );
        if (!activeTabStillVisible) {
            setActiveTabId(visibleTabs[0].id);
        }
    }, [activeTabId, visibleTabs]);

    if (!visibleTabs.length) return null;

    const activeTab =
        visibleTabs.find((tab) => tab.id === activeTabId) || visibleTabs[0];

    return (
        <div className={classNames("", className)}>
            <div
                className={classNames("flex flex-wrap gap-8", tabListClassName)}
                role="tablist"
            >
                {visibleTabs.map((tab) => (
                    <button
                        key={tab.id}
                        type="button"
                        role="tab"
                        aria-selected={tab.id === activeTab.id}
                        className={classNames(
                            "px-12 py-3 rounded-sm text-xs tracking-xs uppercase transition-colors",
                            tab.id === activeTab.id
                                ? "bg-plum-500 text-white"
                                : "bg-glow text-neutral-300 hover:text-white"
                        )}
                        onClick={() => setActiveTabId(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <div className={classNames("mt-16", panelClassName)}>{activeTab.content}</div>
        </div>
    );
};
