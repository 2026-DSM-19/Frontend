import { isCrimeLayerType } from "../constants/layers";
import type { MapLayerType } from "../types/map";

export function toggleMapLayerSelection(
  currentSelection: readonly MapLayerType[],
  mapLayerType: MapLayerType,
): MapLayerType[] {
  if (mapLayerType === "all") {
    const withoutCrimeLayers = currentSelection.filter(
      (item) => !isCrimeLayerType(item),
    );

    return currentSelection.includes("all")
      ? withoutCrimeLayers
      : [...withoutCrimeLayers, "all"];
  }

  if (isCrimeLayerType(mapLayerType)) {
    const withoutCrimeAll = currentSelection.filter((item) => item !== "all");

    return withoutCrimeAll.includes(mapLayerType)
      ? withoutCrimeAll.filter((item) => item !== mapLayerType)
      : [...withoutCrimeAll, mapLayerType];
  }

  return currentSelection.includes(mapLayerType)
    ? currentSelection.filter((item) => item !== mapLayerType)
    : [...currentSelection, mapLayerType];
}

export function getOverlayZIndex(
  mapType: MapLayerType,
  selectionIndex: number,
): number {
  if (mapType === "land-price") return 10;
  if (isCrimeLayerType(mapType)) return 20 + selectionIndex;
  return 100 + selectionIndex;
}
