import type { ReactElement } from "react";

import {
  Logo,
  Sidebar,
  SidebarCopyright,
} from "../styles/mapStyles";
import type { MapLayerType } from "../types/map";
import type { SearchPoint } from "../types/search";
import { AddressSearch } from "./AddressSearch";
import { LayerMenu } from "./LayerMenu";

interface MapSidebarProps {
  selectedMapTypes: readonly MapLayerType[];
  isCrimeOpen: boolean;
  focusPoint: (point: SearchPoint | null) => void;
  onToggleLayer: (mapLayerType: MapLayerType) => void;
  onToggleCrimeMenu: () => void;
  onClearSelection: () => void;
}

export function MapSidebar({
  selectedMapTypes,
  isCrimeOpen,
  focusPoint,
  onToggleLayer,
  onToggleCrimeMenu,
  onClearSelection,
}: MapSidebarProps): ReactElement {
  return (
    <Sidebar>
      <Logo to="/" aria-label="Safe Scope 홈으로 이동">
        <img src="/logo.svg" alt="" />
      </Logo>

      <AddressSearch focusPoint={focusPoint} />

      <LayerMenu
        selectedMapTypes={selectedMapTypes}
        isCrimeOpen={isCrimeOpen}
        onToggleLayer={onToggleLayer}
        onToggleCrimeMenu={onToggleCrimeMenu}
        onClearSelection={onClearSelection}
      />

      <SidebarCopyright>
        © {new Date().getFullYear()} Safe Scope. All rights reserved.
      </SidebarCopyright>
    </Sidebar>
  );
}
