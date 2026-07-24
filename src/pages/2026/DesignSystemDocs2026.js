import React from "react";

import { DesignSystem2026 } from "./DesignSystem2026";

const colorTokens = [
    ["Background", "--ds-2026-bg", "Base dossier page background"],
    ["Paper", "--ds-2026-paper", "Cream torn-paper panels and secondary data marks"],
    ["Paper Text", "--ds-2026-paper-text", "Text on paper panels"],
    ["Surface", "--ds-2026-surface", "Primary glass panel background"],
    ["Strong Surface", "--ds-2026-surface-strong", "Higher contrast panels and overlays"],
    ["Border", "--ds-2026-border", "Subtle strokes on glass surfaces"],
    ["Text", "--ds-2026-text", "Primary foreground text"],
    ["Muted Text", "--ds-2026-text-muted", "Secondary labels and helper text"],
    ["Accent", "--ds-2026-accent", "Primary highlight color"],
    ["Cool Accent", "--ds-2026-accent-cool", "Secondary highlight color"],
];

const radiusTokens = [
    ["Small", "--ds-2026-radius-sm", "Compact controls"],
    ["Medium", "--ds-2026-radius-md", "Cards and inputs"],
    ["Large", "--ds-2026-radius-lg", "Major panels"],
];

const principles = [
    "Scope 2026 styling under .design-system-2026 unless the style is intentionally route-level.",
    "Build new 2026 pages in src/pages/2026 and keep legacy pages intact until they are intentionally archived.",
    "Prefer shared 2026 tokens before adding one-off colors, shadows, spacing, or radii.",
    "Use team color as --ds-2026-accent and fall back to the F1nsight plum when a team color is unavailable.",
    "Roll out the redesign one route at a time so old and new surfaces can coexist safely.",
];

const componentPatterns = [
    ["DesignSystem2026", "Route wrapper that scopes tokens and per-page custom properties."],
    ["DriverNameLockup2026", "Shared sm–xl handwritten-first-name and Lato-last-name identity lockup."],
    ["HeroShell2026", "Shared max-width, minimum-height, and responsive page-hero padding shell."],
    ["TeammateComparisonHero2026", "Dossier hero for driver/team identity and matchup framing."],
    ["TeammateComparisonControlDeck2026", "Torn-paper season/team/driver selection controls."],
    ["SectionHeader2026", "Reusable numbered section header with accent word and metadata."],
    ["TeammateComparisonScoreboard2026", "Horizontal tally rows for head-to-head season verdicts."],
    ["TeammateComparisonStatSheet2026", "Paper-style stat table for archived comparison facts."],
    ["TeammateComparisonChartPanel2026", "Dark framed panel for existing and future chart components."],
];

const architectureNotes = [
    "Data for teammates comparison lives in useTeammatesComparison so design variants do not duplicate fetch and calculation logic.",
    "The 2026 teammates page reuses existing chart components while wrapping them in 2026 layout components.",
    "Future redesign pages should add reusable pieces under src/pages/2026/components before adding page-specific markup.",
];

export const DesignSystemDocs2026 = () => {
    return (
        <DesignSystem2026 className="design-system-2026--docs">
            <section className="design-system-docs-2026">
                <div className="design-system-docs-2026__hero">
                    <p className="design-system-docs-2026__eyebrow">F1nsight 2026</p>
                    <h1>Design System Documentation</h1>
                    <p>
                        A scoped design system for new 2026 pages. Use this page
                        to document tokens, page patterns, and rollout decisions
                        as the redesign grows.
                    </p>
                </div>

                <div className="design-system-docs-2026__grid">
                    <section className="design-system-docs-2026__panel">
                        <h2>Principles</h2>
                        <ul>
                            {principles.map((principle) => (
                                <li key={principle}>{principle}</li>
                            ))}
                        </ul>
                    </section>

                    <section className="design-system-docs-2026__panel">
                        <h2>Route Scope</h2>
                        <p>
                            Active 2026 routes get the <code>bg-gradient-2026</code>
                            body class and wrap page content in{" "}
                            <code>DesignSystem2026</code>.
                        </p>
                        <p>
                            Current rollout route:{" "}
                            <code>/teammates-comparison/:urlYear?/:urlTeam?</code>
                        </p>
                    </section>
                </div>

                <section className="design-system-docs-2026__panel">
                    <h2>Architecture</h2>
                    <ul>
                        {architectureNotes.map((note) => (
                            <li key={note}>{note}</li>
                        ))}
                    </ul>
                </section>

                <section className="design-system-docs-2026__panel">
                    <h2>Component Patterns</h2>
                    <div className="design-system-docs-2026__tokens">
                        {componentPatterns.map(([name, description]) => (
                            <article className="design-system-docs-2026__token" key={name}>
                                <span className="design-system-docs-2026__component-mark" />
                                <div>
                                    <h3>{name}</h3>
                                    <p>{description}</p>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="design-system-docs-2026__panel">
                    <h2>Color Tokens</h2>
                    <div className="design-system-docs-2026__tokens">
                        {colorTokens.map(([name, token, description]) => (
                            <article className="design-system-docs-2026__token" key={token}>
                                <span
                                    className="design-system-docs-2026__swatch"
                                    style={{ background: `var(${token})` }}
                                />
                                <div>
                                    <h3>{name}</h3>
                                    <code>{token}</code>
                                    <p>{description}</p>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="design-system-docs-2026__panel">
                    <h2>Radius Tokens</h2>
                    <div className="design-system-docs-2026__tokens design-system-docs-2026__tokens--compact">
                        {radiusTokens.map(([name, token, description]) => (
                            <article className="design-system-docs-2026__token" key={token}>
                                <span
                                    className="design-system-docs-2026__radius"
                                    style={{ borderRadius: `var(${token})` }}
                                />
                                <div>
                                    <h3>{name}</h3>
                                    <code>{token}</code>
                                    <p>{description}</p>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>
            </section>
        </DesignSystem2026>
    );
};
