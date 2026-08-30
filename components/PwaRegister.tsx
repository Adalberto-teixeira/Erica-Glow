"use client";

import { useEffect } from "react";

export function PwaRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
        navigator.serviceWorker.getRegistrations().then((registrations) => registrations.forEach((registration) => registration.unregister()));
        if ("caches" in window) caches.keys().then((keys) => keys.forEach((key) => caches.delete(key)));
        return;
      }
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);

  return null;
}
