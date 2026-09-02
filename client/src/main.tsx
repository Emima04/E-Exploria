import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { AudioProvider } from "./contexts/AudioContext";
import { InventoryProvider } from "./contexts/InventoryContext";

// Force dark theme by default to match Exploria's cyber/space aesthetic
if (typeof document !== "undefined") {
  document.documentElement.classList.add("dark");
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <AudioProvider>
        <InventoryProvider>
          <App />
        </InventoryProvider>
      </AudioProvider>
    </AuthProvider>
  </StrictMode>
);