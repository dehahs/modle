import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";

// Only load Tempo devtools when enabled
if (import.meta.env.VITE_TEMPO === "true") {
  import("tempo-devtools").then(({ TempoDevtools }) => {
    TempoDevtools.init();
  });
  
  // Conditionally load the error-handling script
  const script = document.createElement("script");
  script.src = "https://api.tempolabs.ai/proxy-asset?url=https://storage.googleapis.com/tempo-public-assets/error-handling.js";
  script.onerror = () => {
    // Silently fail if the script can't be loaded
    console.warn("Tempo error-handling script could not be loaded");
  };
  document.body.appendChild(script);
}

const basename = import.meta.env.BASE_URL;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
