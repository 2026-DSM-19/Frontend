import { useCallback, useEffect, useRef, useState } from "react";
import OlMap from "ol/Map";
import { unByKey } from "ol/Observable";
import View from "ol/View";
import type { EventsKey } from "ol/events";
import { fromLonLat } from "ol/proj";

import { getErrorMessage } from "../../../shared/utils/errors";
import { DEFAULT_MAP_CENTER } from "../constants/layers";
import { createSafeMapLayer } from "../layers/createSafeMapLayer";
import { createVWorldBaseLayer } from "../layers/createVWorldBaseLayer";
import { createVWorldLandPriceLayer } from "../layers/createVWorldLandPriceLayer";
import { getOverlayZIndex } from "../model/layerSelection";
import type { MapLayerType, MapStatus } from "../types/map";
import type { SearchPoint } from "../types/search";

interface UseSafetyMapOptions {
  mapElementRef: React.RefObject<HTMLDivElement | null>;
  selectedMapTypes?: readonly MapLayerType[];
}

interface UseSafetyMapResult {
  status: MapStatus;
  error: string;
  focusPoint: (point: SearchPoint | null) => void;
}

type OverlayLayer = ReturnType<typeof createSafeMapLayer>;

export function useSafetyMap({
  mapElementRef,
  selectedMapTypes = [],
}: UseSafetyMapOptions): UseSafetyMapResult {
  const mapRef = useRef<OlMap | null>(null);
  const overlayLayersRef = useRef<Map<MapLayerType, OverlayLayer>>(new Map());
  const [status, setStatus] = useState<MapStatus>("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    let map: OlMap | undefined;
    const overlayLayers = overlayLayersRef.current;

    const initializeMap = (): void => {
      try {
        if (!mapElementRef.current) return;

        const baseLayer = createVWorldBaseLayer(
          import.meta.env.VITE_V_WORLD_API_TOKEN,
        );

        map = new OlMap({
          target: mapElementRef.current,
          layers: [baseLayer],
          view: new View({
            center: fromLonLat([...DEFAULT_MAP_CENTER]),
            zoom: 18,
            minZoom: 7,
            maxZoom: 19,
          }),
        });
        mapRef.current = map;
        setStatus("loading");
      } catch (mapError: unknown) {
        setError(getErrorMessage(mapError, "지도를 불러오지 못했습니다."));
        setStatus("error");
      }
    };

    initializeMap();

    return () => {
      map?.setTarget(undefined);
      mapRef.current = null;
      overlayLayers.clear();
    };
  }, [mapElementRef]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    let renderCompleteKey: EventsKey | undefined;

    const finishLoading = (): void => {
      setStatus("ready");
    };

    const syncLayers = (): void => {
      setStatus("loading");
      renderCompleteKey = map.once("rendercomplete", finishLoading);

      const selected = new Set(selectedMapTypes);
      const layerEntries = overlayLayersRef.current;

      layerEntries.forEach((layer, mapType) => {
        if (!selected.has(mapType)) {
          map.removeLayer(layer);
          layerEntries.delete(mapType);
        }
      });

      selectedMapTypes.forEach((mapType, index) => {
        const existingLayer = layerEntries.get(mapType);

        if (existingLayer) {
          existingLayer.setZIndex(getOverlayZIndex(mapType, index));
          return;
        }

        const layer =
          mapType === "land-price"
            ? createVWorldLandPriceLayer(
                import.meta.env.VITE_V_WORLD_API_TOKEN,
              )
            : createSafeMapLayer(
                import.meta.env.VITE_SAFE_MAP_API_TOKEN,
                mapType,
              );
        layer.setZIndex(getOverlayZIndex(mapType, index));
        layerEntries.set(mapType, layer);
        map.addLayer(layer);
      });

      map.render();
    };

    syncLayers();

    return () => {
      if (renderCompleteKey) unByKey(renderCompleteKey);
    };
  }, [selectedMapTypes]);

  const focusPoint = useCallback((point: SearchPoint | null): void => {
    const longitude = Number(point?.x);
    const latitude = Number(point?.y);

    if (
      !mapRef.current ||
      !Number.isFinite(longitude) ||
      !Number.isFinite(latitude)
    ) {
      return;
    }

    mapRef.current.getView().animate({
      center: fromLonLat([longitude, latitude]),
      zoom: 16,
      duration: 550,
    });
  }, []);

  return { status, error, focusPoint };
}
