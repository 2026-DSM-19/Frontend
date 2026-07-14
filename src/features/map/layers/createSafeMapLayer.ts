import TileLayer from "ol/layer/Tile";
import TileImage from "ol/source/TileImage";

import type { SafeMapLayerConfig, SafeMapLayerType } from "../types/map";
import { createWebMercatorTileGrid } from "./createWebMercatorTileGrid";

const DEFAULT_CRIME_LAYER = "A2SM_CRMNLHSPOT_TOT";

const SAFE_MAP_OPACITY = 0.72;

const SAFE_MAP_LAYER_CONFIG: Readonly<
  Record<SafeMapLayerType, SafeMapLayerConfig>
> = Object.freeze({
  all: {
    title: "범죄주의구간 전체",
    endpoint: "IF_0087_WMS",
    layer: DEFAULT_CRIME_LAYER,
    style: "A2SM_CrmnlHspot_Tot_Tot",
    provider: "경찰청",
  },
  violence: {
    title: "범죄주의구간 폭력",
    endpoint: "IF_0083_WMS",
    layer: DEFAULT_CRIME_LAYER,
    style: "A2SM_CrmnlHspot_Tot_Violn",
    provider: "경찰청",
  },
  theft: {
    title: "범죄주의구간 절도",
    endpoint: "IF_0084_WMS",
    layer: DEFAULT_CRIME_LAYER,
    style: "A2SM_CrmnlHspot_Tot_Theft",
    provider: "경찰청",
  },
  "sexual-violence": {
    title: "범죄주의구간 성폭력",
    endpoint: "IF_0085_WMS",
    layer: DEFAULT_CRIME_LAYER,
    style: "A2SM_CrmnlHspot_Tot_Rape",
    provider: "경찰청",
  },
  robbery: {
    title: "범죄주의구간 강도",
    endpoint: "IF_0086_WMS",
    layer: DEFAULT_CRIME_LAYER,
    style: "A2SM_CrmnlHspot_Tot_Brglr",
    provider: "경찰청",
  },
  "flood-trace": {
    title: "침수흔적도",
    endpoint: "IF_0092_WMS",
    layer: "A2SM_FLUDMARKS",
    style: "",
    provider: "행정안전부",
  },
  "traffic-accident-hotspot": {
    title: "교통사고 다발구역",
    endpoint: "IF_0093_WMS",
    layer: "A2SM_TFCACDHSPOT_NEW",
    style: "",
    provider: "한국도로교통공단",
  },
  "senior-crime": {
    title: "노인대상 범죄주의구간",
    endpoint: "IF_0082_WMS",
    layer: "A2SM_ODBLRCRMNLHSPOT_ODSN",
    style: "A2SM_OdblrCrmnlHspot_Odsn",
    provider: "경찰청",
  },
  cctv: {
    title: "CCTV 정보",
    endpoint: "IF_0131_WMS",
    layer: "A2SM_CCTV_INFO",
    style: "",
    provider: "행정안전부",
  },
  "police-facility": {
    title: "치안센터",
    endpoint: "IF_0036_WMS",
    layer: "A2SM_CMMNPOI2",
    style: "A2SM_CmmnPoi2",
    provider: "경찰청",
  },
  "child-crime": {
    title: "아동대상 범죄주의구간",
    endpoint: "IF_0081_WMS",
    layer: "A2SM_ODBLRCRMNLHSPOT_KID",
    style: "A2SM_OdblrCrmnlHspot_Kid",
    provider: "경찰청",
  },
  "security-light": {
    title: "보안등",
    endpoint: "IF_0102_WMS",
    layer: "A2SM_CMMNPOI_SECULIGHT",
    style: "A2SM_CMMNPOI_07",
    provider: "지방자치단체",
  },
});

function isSafeMapLayerType(mapType: string): mapType is SafeMapLayerType {
  return Object.hasOwn(SAFE_MAP_LAYER_CONFIG, mapType);
}

function getSafeMapLayerConfig(mapType: string): SafeMapLayerConfig {
  if (!isSafeMapLayerType(mapType)) {
    throw new Error(`지원하지 않는 생활안전지도 유형입니다: ${mapType}`);
  }

  return SAFE_MAP_LAYER_CONFIG[mapType];
}

export function createSafeMapLayer(
  serviceKey: string | undefined,
  mapType: SafeMapLayerType = "all",
): TileLayer<TileImage> {
  if (!serviceKey) {
    throw new Error("생활안전지도 API 키가 설정되지 않았습니다.");
  }

  const config = getSafeMapLayerConfig(mapType);
  const tileGrid = createWebMercatorTileGrid();
  const source = new TileImage({
    attributions: `© ${config.provider} · 생활안전지도 · ${config.title}`,
    projection: "EPSG:3857",
    tileGrid,
    tileUrlFunction: (tileCoord): string | undefined => {
      const extent = tileGrid.getTileCoordExtent(tileCoord);
      const params = new URLSearchParams({
        serviceKey,
        service: "WMS",
        request: "GetMap",
        version: "1.1.1",
        layers: config.layer,
        styles: config.style,
        srs: "EPSG:3857",
        bbox: extent.join(","),
        format: "image/png",
        width: "256",
        height: "256",
        transparent: "TRUE",
      });

      return `https://www.safemap.go.kr/openapi2/${config.endpoint}?${params}`;
    },
  });

  return new TileLayer({
    source,
    opacity: SAFE_MAP_OPACITY,
    visible: true,
    zIndex: 10,
  });
}
