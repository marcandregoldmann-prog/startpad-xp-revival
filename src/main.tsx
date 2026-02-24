import { createRoot } from "react-dom/client";
import { ThemeProvider } from "next-themes";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
    <App />
  </ThemeProvider>
);

// ---- PWA Service Worker Registrierung ----
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register(import.meta.env.BASE_URL + "sw.js")
      .then(() => {
        console.log("Service Worker registriert");
      })
      .catch((error) => {
        console.error("Service Worker Registrierung fehlgeschlagen:", error);
      });
  });
}
