"use client";

import { useEffect, useState } from "react";

const ROTATING_PHRASES = [
  "Developer",
  "PM",
  "QA",
  "Designer",
  "Human",
  "Customer",
  "Agent",
  "AI",
  "Bot",
];
const ROTATION_INTERVAL_MS = 2200;

export function HeroHeadline() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % ROTATING_PHRASES.length);
    }, ROTATION_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  const phrase = ROTATING_PHRASES[index];

  return (
    <h1
      id="hero-heading"
      className="text-2xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl xl:text-6xl"
    >
      <span className="block">
        Make every message clear — even from your{" "}
        <span className="inline-block w-[10ch] text-center align-baseline">
          <span
            key={phrase}
            className="hero-headline-role inline-block bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-primary"
            aria-hidden
          >
            {phrase}
          </span>
          <span className="sr-only">{ROTATING_PHRASES.join(", ")}</span>
        </span>
      </span>
    </h1>
  );
}
