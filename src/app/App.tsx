import type { ReactElement } from "react";
import { Navigate, Route, Routes } from "react-router";

import MapPage from "../pages/MapPage";
import Chatbot from "../pages/ChatbotPage"

function App(): ReactElement {
  return (
    <Routes>
      <Route path="/" element={<MapPage />} />
      <Route path="/chatbot" element={<Chatbot />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
