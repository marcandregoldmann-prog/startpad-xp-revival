import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);

// ---- PWA Service Worker Registrierung ----
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then(() => {
        console.log("Service Worker registriert");
      })
      .catch((error) => {
        console.error("Service Worker Registrierung fehlgeschlagen:", error);
      });
  });
}
