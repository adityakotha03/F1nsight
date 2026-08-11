import React from "react";
import classNames from "classnames";

import { ReactComponent as AlpineLogo } from "../../../assets/team-logos/2026/alpine.svg";
import { ReactComponent as AstonMartinLogo } from "../../../assets/team-logos/2026/aston-martin.svg";
import { ReactComponent as AudiLogo } from "../../../assets/team-logos/2026/audi.svg";
import { ReactComponent as CadillacLogo } from "../../../assets/team-logos/2026/cadillac.svg";
import { ReactComponent as FerrariLogo } from "../../../assets/team-logos/2026/ferrari.svg";
import { ReactComponent as HaasLogo } from "../../../assets/team-logos/2026/haas.svg";
import { ReactComponent as MclarenLogo } from "../../../assets/team-logos/2026/mclaren.svg";
import { ReactComponent as MercedesLogo } from "../../../assets/team-logos/2026/mercedes.svg";
import { ReactComponent as RbLogo } from "../../../assets/team-logos/2026/rb.svg";
import { ReactComponent as RedBullLogo } from "../../../assets/team-logos/2026/redbull.svg";
import { ReactComponent as WilliamsLogo } from "../../../assets/team-logos/2026/williams.svg";

const teamLogoMap = {
    alpine: AlpineLogo,
    aston_martin: AstonMartinLogo,
    audi: AudiLogo,
    cadillac: CadillacLogo,
    ferrari: FerrariLogo,
    haas: HaasLogo,
    mclaren: MclarenLogo,
    mercedes: MercedesLogo,
    rb: RbLogo,
    red_bull: RedBullLogo,
    williams: WilliamsLogo,
};

export const TeamLogo2026 = ({
    teamId,
    className,
    color,
    size,
    "aria-label": ariaLabel,
}) => {
    const Logo = teamLogoMap[teamId];

    if (!Logo) return null;

    return (
        <Logo
            aria-label={ariaLabel}
            aria-hidden={ariaLabel ? undefined : true}
            className={classNames("ds-2026-team-logo", className)}
            role={ariaLabel ? "img" : undefined}
            style={{
                color,
                width: size,
            }}
        />
    );
};

