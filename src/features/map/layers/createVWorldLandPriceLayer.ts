import TileLayer from "ol/layer/Tile";
import TileImage from "ol/source/TileImage";

import { createWebMercatorTileGrid } from "./createWebMercatorTileGrid";

const LAND_PRICE_LAYER = "dt_d150";
const LAND_PRICE_OPACITY = 0.72;

export function createVWorldLandPriceLayer(
  apiKey: string | undefined,
): TileLayer<TileImage> {
  if (!apiKey) {
    throw new Error("VWorld 개별공시지가 API 키가 설정되지 않았습니다.");
  }

  const tileGrid = createWebMercatorTileGrid();
  const source = new TileImage({
    attributions: "© 국토교통부 VWorld · 개별공시지가",
    projection: "EPSG:3857",
    tileGrid,
    tileUrlFunction: (tileCoord): string | undefined => {
      const extent = tileGrid.getTileCoordExtent(tileCoord);
      const params = new URLSearchParams({
        key: apiKey,
        layers: LAND_PRICE_LAYER,
        crs: "EPSG:3857",
        bbox: extent.join(","),
        width: "256",
        height: "256",
        format: "image/png",
        transparent: "true",
        bgcolor: "0xFFFFFF",
        exceptions: "blank",
      });

      return `https://api.vworld.kr/ned/wms/getIndvdLandPriceWMS?${params}`;
    },
  });

  return new TileLayer({
    source,
    opacity: LAND_PRICE_OPACITY,
    visible: true,
    zIndex: 10,
  });
}
