import type { ReactElement } from "react";
import { Navigate, Route, Routes } from "react-router";

import MapPage from "../pages/MapPage";

function App(): ReactElement {
  return (
    <Routes>
      <Route path="/" element={<MapPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
