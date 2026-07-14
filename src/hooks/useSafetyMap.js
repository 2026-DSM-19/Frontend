import { useCallback, useEffect, useRef, useState } from "react";
import OlMap from "ol/Map";
import View from "ol/View";
import { fromLonLat } from "ol/proj";
import { createSafeMapLayer } from "../utils/safeMapLayer";
import { createVWorldBaseLayer } from "../utils/vWorldBaseLayer";

const SEOUL_CENTER = [126.978, 37.5665];

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
            center: fromLonLat(SEOUL_CENTER),
            zoom: 11,
            minZoom: 7,
            maxZoom: 19,
          }),
        });
        mapRef.current = map;
        setStatus("ready");
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
    if (!map || status !== "ready") return;

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
        layerEntries.get(mapType).setZIndex(10 + index);
        return;
      }

      const layer = createSafeMapLayer(
        import.meta.env.VITE_SAFE_MAP_API_TOKEN,
        mapType,
      );
      layer.setZIndex(10 + index);
      layerEntries.set(mapType, layer);
      map.addLayer(layer);
    });
  }, [selectedMapTypes, status]);

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
