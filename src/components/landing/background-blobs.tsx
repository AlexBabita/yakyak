"use client";

/**
 * Sprayed / mixed background effect - full page. Primary palette (teal, light teal, accent, warm).
 * Fixed to viewport so the spray stays visible as you scroll (goes through whole page).
 */
export function BackgroundBlobs() {
  return (
    <div
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none"
      aria-hidden
    >
      <div className="absolute inset-0 bg-background/40" />
      <div className="bg-blob bg-blob-1" />
      <div className="bg-blob bg-blob-2" />
      <div className="bg-blob bg-blob-3" />
      <div className="bg-blob bg-blob-4" />
      <div className="bg-blob bg-blob-5" />
      <div className="bg-blob bg-blob-6" />
    </div>
  );
}
