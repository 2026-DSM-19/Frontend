import { useCallback, useEffect, useRef, useState } from "react";
import OlMap from "ol/Map";
import { unByKey } from "ol/Observable";
import View from "ol/View";
import { fromLonLat } from "ol/proj";
import { createSafeMapLayer } from "../utils/safeMapLayer";
import { createVWorldBaseLayer } from "../utils/vWorldBaseLayer";
import { createVWorldLandPriceLayer } from "../utils/vWorldLandPriceLayer";

const DEFAULT_CENTER = [127.36307, 36.39151];
const CRIME_LAYER_TYPES = new Set([
  "all",
  "theft",
  "sexual-violence",
  "violence",
  "robbery",
  "child-crime",
  "senior-crime",
]);

function getOverlayZIndex(mapType, selectionIndex) {
  if (mapType === "land-price") return 10;
  if (CRIME_LAYER_TYPES.has(mapType)) return 20 + selectionIndex;
  return 100 + selectionIndex;
}

export function useSafetyMap({ mapElementRef, selectedMapTypes = [] }) {
  const mapRef = useRef(null);
  const overlayLayersRef = useRef(new Map());
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    let map;
    const overlayLayers = overlayLayersRef.current;

    const initializeMap = () => {
      try {
        if (!mapElementRef.current) return;

        const baseLayer = createVWorldBaseLayer(
          import.meta.env.VITE_V_WORLD_API_TOKEN,
        );

        map = new OlMap({
          target: mapElementRef.current,
          layers: [baseLayer],
          view: new View({
            center: fromLonLat(DEFAULT_CENTER),
            zoom: 18,
            minZoom: 7,
            maxZoom: 19,
          }),
        });
        mapRef.current = map;
        setStatus("loading");
      } catch (mapError) {
        setError(mapError.message || "지도를 불러오지 못했습니다.");
        setStatus("error");
      }
    };

    initializeMap();

    return () => {
      map?.setTarget(null);
      mapRef.current = null;
      overlayLayers.clear();
    };
  }, [mapElementRef]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    let renderCompleteKey;

    const finishLoading = () => {
      setStatus("ready");
    };

    const syncLayers = () => {
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
        if (layerEntries.has(mapType)) {
          layerEntries.get(mapType).setZIndex(getOverlayZIndex(mapType, index));
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

  const focusPoint = useCallback((point) => {
    const longitude = Number(point?.x);
    const latitude = Number(point?.y);
    if (!mapRef.current || !Number.isFinite(longitude) || !Number.isFinite(latitude)) {
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
