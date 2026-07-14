import { useRef, useState } from "react";
import type { ReactElement } from "react";

import { MapSidebar } from "../features/map/components/MapSidebar";
import { MapStatusOverlay } from "../features/map/components/MapStatusOverlay";
import { useSafetyMap } from "../features/map/hooks/useSafetyMap";
import { toggleMapLayerSelection } from "../features/map/model/layerSelection";
import {
  MapCanvas,
  MapShell,
  Page,
} from "../features/map/styles/mapStyles";
import type { MapLayerType } from "../features/map/types/map";

function MapPage(): ReactElement {
  const mapElementRef = useRef<HTMLDivElement>(null);
  const [selectedMapTypes, setSelectedMapTypes] = useState<MapLayerType[]>([]);
  const [isCrimeOpen, setIsCrimeOpen] = useState(false);
  const { status, error, focusPoint } = useSafetyMap({
    mapElementRef,
    selectedMapTypes,
  });

  const handleToggleLayer = (mapLayerType: MapLayerType): void => {
    setSelectedMapTypes((currentSelection) =>
      toggleMapLayerSelection(currentSelection, mapLayerType),
    );
  };

  const handleToggleCrimeMenu = (): void => {
    setIsCrimeOpen((isOpen) => !isOpen);
  };

  const handleClearSelection = (): void => {
    setSelectedMapTypes([]);
  };

  return (
    <Page>
      <MapSidebar
        selectedMapTypes={selectedMapTypes}
        isCrimeOpen={isCrimeOpen}
        focusPoint={focusPoint}
        onToggleLayer={handleToggleLayer}
        onToggleCrimeMenu={handleToggleCrimeMenu}
        onClearSelection={handleClearSelection}
      />

      <MapShell>
        <MapCanvas ref={mapElementRef} />
        <MapStatusOverlay status={status} error={error} />
      </MapShell>
    </Page>
  );
}

export default MapPage;
