export type CrimeLayerType =
  | "all"
  | "theft"
  | "sexual-violence"
  | "violence"
  | "robbery"
  | "child-crime"
  | "senior-crime";

export type SafeMapLayerType =
  | CrimeLayerType
  | "security-light"
  | "traffic-accident-hotspot"
  | "flood-trace"
  | "cctv"
  | "police-facility";

export type MapLayerType = SafeMapLayerType | "land-price";

export type MapStatus = "loading" | "ready" | "error";

export type MenuIconType =
  | "light"
  | "traffic"
  | "crime"
  | "flood"
  | "cctv"
  | "police"
  | "land-price";

export interface LayerOption<TLayerType extends MapLayerType = MapLayerType> {
  id: TLayerType;
  label: string;
}

export interface MainLayerOption extends LayerOption {
  icon: Exclude<MenuIconType, "crime">;
}

export interface SafeMapLayerConfig {
  readonly title: string;
  readonly endpoint: string;
  readonly layer: string;
  readonly style: string;
  readonly provider: string;
}
