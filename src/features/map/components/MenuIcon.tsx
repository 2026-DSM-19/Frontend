import type { ReactElement, SVGProps } from "react";

import { MENU_ICON_PATHS } from "../constants/layers";
import type { MenuIconType } from "../types/map";

interface MenuIconProps {
  type: MenuIconType;
}

const COMMON_SVG_PROPS: Pick<
  SVGProps<SVGSVGElement>,
  "fill" | "stroke" | "strokeWidth" | "strokeLinecap" | "strokeLinejoin"
> = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export function MenuIcon({ type }: MenuIconProps): ReactElement {
  return (
    <svg
      width="25"
      height="25"
      viewBox="0 0 24 24"
      aria-hidden="true"
      {...COMMON_SVG_PROPS}
    >
      <path d={MENU_ICON_PATHS[type]} />
    </svg>
  );
}
