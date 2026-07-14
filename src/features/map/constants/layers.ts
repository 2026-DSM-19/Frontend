import type {
  CrimeLayerType,
  LayerOption,
  MainLayerOption,
  MapLayerType,
  MenuIconType,
} from "../types/map";

export const DEFAULT_MAP_CENTER: readonly [number, number] = [
  127.36307, 36.39151,
];

export const CRIME_OPTIONS: readonly LayerOption<CrimeLayerType>[] = [
  { id: "all", label: "범죄 전체" },
  { id: "theft", label: "절도" },
  { id: "sexual-violence", label: "성폭력" },
  { id: "violence", label: "폭력" },
  { id: "robbery", label: "강도" },
  { id: "child-crime", label: "아동대상 범죄" },
  { id: "senior-crime", label: "노인대상 범죄" },
];

export const MAIN_OPTIONS: readonly MainLayerOption[] = [
  { id: "security-light", label: "보안등", icon: "light" },
  { id: "traffic-accident-hotspot", label: "교통사고", icon: "traffic" },
  { id: "flood-trace", label: "침수", icon: "flood" },
  { id: "cctv", label: "CCTV", icon: "cctv" },
  { id: "police-facility", label: "치안센터", icon: "police" },
  { id: "land-price", label: "공시지가", icon: "land-price" },
];

export const MENU_ICON_PATHS: Readonly<Record<MenuIconType, string>> = {
  light:
    "M9 21h6M10 17h4M8.7 14.5a6 6 0 1 1 6.6 0c-.9.7-1.3 1.4-1.3 2.5h-4c0-1.1-.4-1.8-1.3-2.5Z",
  traffic:
    "M8 3h8v18H8zM5 7H3m2 5H3m2 5H3m16-10h-2m2 5h-2m2 5h-2M12 7v10m-2-5h4",
  crime: "M7 4h10v4H7zM9 8v12m6-12v12M6 20h12M5 8h14M9 13h6",
  "land-price":
    "M4 5.5 9 3l6 2.5L20 3v15.5L15 21l-6-2.5L4 21zM9 3v15.5m6-13V21M11.5 9.5h1.8a1.7 1.7 0 0 1 0 3.4h-1.6a1.7 1.7 0 0 0 0 3.4h1.8",
  flood:
    "M3 8h18M5 4h14M4 13c2 0 2 1.5 4 1.5s2-1.5 4-1.5 2 1.5 4 1.5 2-1.5 4-1.5M4 18c2 0 2 1.5 4 1.5s2-1.5 4-1.5 2 1.5 4 1.5 2-1.5 4-1.5",
  cctv: "m4 8 12-3 1 5-12 3zM17 7l3 1v5l-3-1M10 12v5m-3 3h6m-3-3-3 3m3-3 3 3",
  police: "M4 9h16M6 9v10m12-10v10M3 20h18M12 3l9 5H3zM9 13h6",
};

const CRIME_LAYER_TYPES: ReadonlySet<MapLayerType> = new Set(
  CRIME_OPTIONS.map(({ id }) => id),
);

export function isCrimeLayerType(
  mapLayerType: MapLayerType,
): mapLayerType is CrimeLayerType {
  return CRIME_LAYER_TYPES.has(mapLayerType);
}
