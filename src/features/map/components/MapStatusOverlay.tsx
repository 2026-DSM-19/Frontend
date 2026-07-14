import type { ReactElement } from "react";

import {
  LoadingContent,
  LoadingSpinner,
  Status,
} from "../styles/mapStyles";
import type { MapStatus } from "../types/map";

interface MapStatusOverlayProps {
  status: MapStatus;
  error: string;
}

export function MapStatusOverlay({
  status,
  error,
}: MapStatusOverlayProps): ReactElement | null {
  if (status === "ready") return null;

  const isError = status === "error";

  return (
    <Status $error={isError} role={isError ? "alert" : "status"}>
      {isError ? (
        error
      ) : (
        <LoadingContent>
          <LoadingSpinner aria-hidden="true" />
          <span>지도를 불러오는 중입니다.</span>
        </LoadingContent>
      )}
    </Status>
  );
}
