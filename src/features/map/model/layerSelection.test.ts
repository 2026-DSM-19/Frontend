import { describe, expect, test } from "bun:test";

import { getOverlayZIndex, toggleMapLayerSelection } from "./layerSelection";

describe("toggleMapLayerSelection", () => {
  test("전체 범죄 레이어와 개별 범죄 레이어를 동시에 선택하지 않는다", () => {
    expect(toggleMapLayerSelection(["all", "cctv"], "theft")).toEqual([
      "cctv",
      "theft",
    ]);
    expect(toggleMapLayerSelection(["theft", "violence"], "all")).toEqual([
      "all",
    ]);
  });

  test("일반 레이어는 기존 선택 순서를 유지하며 토글한다", () => {
    expect(toggleMapLayerSelection(["cctv"], "land-price")).toEqual([
      "cctv",
      "land-price",
    ]);
    expect(toggleMapLayerSelection(["cctv", "land-price"], "cctv")).toEqual([
      "land-price",
    ]);
  });
});

describe("getOverlayZIndex", () => {
  test("레이어 그룹별 기존 렌더링 우선순위를 유지한다", () => {
    expect(getOverlayZIndex("land-price", 4)).toBe(10);
    expect(getOverlayZIndex("theft", 2)).toBe(22);
    expect(getOverlayZIndex("cctv", 3)).toBe(103);
  });
});
