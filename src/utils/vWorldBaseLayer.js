import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";

export function createVWorldBaseLayer(apiKey) {
  if (!apiKey) {
    throw new Error("VWorld 지도 API 키가 설정되지 않았습니다.");
  }

  return new TileLayer({
    source: new XYZ({
      attributions: "© 국토교통부 VWorld",
      maxZoom: 19,
      tileSize: 256,
      tileUrlFunction: ([zoom, x, y]) =>
        `https://api.vworld.kr/req/wmts/1.0.0/${encodeURIComponent(apiKey)}/Base/${zoom}/${y}/${x}.png`,
    }),
    zIndex: 0,
  });
}
