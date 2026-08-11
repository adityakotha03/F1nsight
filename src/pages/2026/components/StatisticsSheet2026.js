import React from "react";

import "./StatisticsSheet2026.scss";

export const StatisticsSheet2026 = ({
    columns,
    fileMeta,
    rows,
    stamp = "F1nsight Verified",
    title,
}) => (
    <section className="ds-2026-statistics-sheet">
        <header className="ds-2026-statistics-sheet__header">
            <h3>{title}</h3>
            <span>File — {fileMeta}</span>
        </header>
        <div className="ds-2026-statistics-sheet__grid">
            <span aria-hidden="true" />
            {columns.map((column, index) => <strong key={`${column}-${index}`}>{column}</strong>)}
            {rows.map(([label, ...values]) => (
                <React.Fragment key={label}>
                    <span>{label}</span>
                    {values.map((value, index) => <b key={`${label}-${index}`}>{value}</b>)}
                </React.Fragment>
            ))}
        </div>
        {stamp && <div className="ds-2026-statistics-sheet__stamp">{stamp}</div>}
    </section>
);
