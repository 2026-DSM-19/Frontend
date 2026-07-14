export type SearchTargetType = "place" | "address";

type SearchAddressCategory = "road" | "parcel";

type CoordinateValue = string | number;

export interface SearchPoint {
  x: CoordinateValue;
  y: CoordinateValue;
}

export interface SearchResultModel {
  id: string;
  type: SearchTargetType;
  title: string;
  roadAddress: string;
  parcelAddress: string;
  category: string;
  point: SearchPoint | null;
}

export interface SearchRequestOptions {
  signal?: AbortSignal;
}

export interface SearchTarget {
  type: SearchTargetType;
  category?: SearchAddressCategory;
}
