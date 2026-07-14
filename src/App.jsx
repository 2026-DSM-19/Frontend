import { Navigate, Route, Routes } from "react-router";
import MapPage from "./pages/map";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MapPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
