"use client";

import { useEffect } from "react";

export default function RequestIdleCallbackPolyfill() {
  useEffect(() => {
    if (typeof window !== "undefined" && typeof window.requestIdleCallback === "undefined") {
      window.requestIdleCallback = function (cb: IdleRequestCallback): number {
        const start = Date.now();
        return window.setTimeout(() => {
          cb({
            didTimeout: false,
            timeRemaining: () => Math.max(0, 50 - (Date.now() - start)),
          });
        }, 1);
      };

      window.cancelIdleCallback = function (id: number): void {
        clearTimeout(id);
      };
    }
  }, []);

  return null;
}
