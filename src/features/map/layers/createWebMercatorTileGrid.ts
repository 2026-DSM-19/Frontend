import { get as getProjection } from "ol/proj";
import { createXYZ } from "ol/tilegrid";
import TileGrid from "ol/tilegrid/TileGrid";

export function createWebMercatorTileGrid(): TileGrid {
  const projection = getProjection("EPSG:3857");

  if (!projection) {
    throw new Error("EPSG:3857 좌표계를 불러오지 못했습니다.");
  }

  return createXYZ({
    extent: projection.getExtent(),
    maxZoom: 18,
    tileSize: 256,
  });
}
