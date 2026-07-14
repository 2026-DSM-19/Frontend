import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";

export function createVWorldBaseLayer(
  apiKey: string | undefined,
): TileLayer<XYZ> {
  if (!apiKey) {
    throw new Error("VWorld 지도 API 키가 설정되지 않았습니다.");
  }

  return new TileLayer({
    source: new XYZ({
      attributions: "© 국토교통부 VWorld",
      maxZoom: 18,
      tileSize: 256,
      tileUrlFunction: (tileCoord): string | undefined => {
        const [zoom, x, y] = tileCoord;

        if (zoom === undefined || x === undefined || y === undefined) {
          return undefined;
        }

        const tilePath = [zoom, y, x].join("/");
        return `https://api.vworld.kr/req/wmts/1.0.0/${encodeURIComponent(apiKey)}/Base/${tilePath}.png`;
      },
    }),
    zIndex: 0,
  });
}
