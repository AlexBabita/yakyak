"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const DICEBEAR_AVATAR = "https://api.dicebear.com/9.x/avataaars/svg";

type Phase = "idle" | "show-original" | "show-yakyak" | "show-translated";

function Avatar({
  name,
  className,
  phase,
}: {
  name: string;
  className?: string;
  phase: Phase;
}) {
  const [imgError, setImgError] = useState(false);
  const seed = encodeURIComponent(name.replace(/\s+/g, ""));
  const src = `${DICEBEAR_AVATAR}?seed=${seed}&size=72`;

  if (imgError) {
    return (
      <div
        className={cn(
          "flex shrink-0 items-center justify-center rounded-full text-xs font-semibold",
          className,
          phase === "show-original" && "bg-muted text-muted-foreground",
          phase !== "show-original" && "bg-primary/20 text-primary"
        )}
      >
        {getInitials(name)}
      </div>
    );
  }

  return (
    <div className={cn("relative h-9 w-9 shrink-0 overflow-hidden rounded-full", className)}>
      <Image
        src={src}
        alt=""
        width={36}
        height={36}
        className="h-full w-full object-cover"
        unoptimized
        onError={() => setImgError(true)}
      />
    </div>
  );
}

type Scenario = {
  tabLabel: string;
  fromRole: string;
  toRole: string;
  senderName: string;
  original: string;
  translated: string;
};

const SCENARIOS: Scenario[] = [
  {
    tabLabel: "Dev to Designer",
    fromRole: "Developer",
    toRole: "Designer",
    senderName: "Alex Rivera",
    original:
      "We need to refactor the legacy auth before we can add SSO. The API returns 401 on expired tokens.",
    translated:
      "We're updating the old login system first so we can add single sign-on. When a session expires the app errors and we're not re-logging the user yet.",
  },
  {
    tabLabel: "PM to Dev",
    fromRole: "Project Manager",
    toRole: "Developer",
    senderName: "Sarah Chen",
    original:
      "Can we synergize on the low-hanging fruit and circle back to align on the paradigm shift for Q2? Need a holistic view of the deliverables.",
    translated:
      "Can we meet to decide what we're building for Q2, who does what, and what \"done\" looks like?",
  },
  {
    tabLabel: "QA to Dev",
    fromRole: "QA",
    toRole: "Developer",
    senderName: "Jordan Lee",
    original:
      "Regression on checkout—steps 2 and 3 fail with a saved address. Reproduced in Chrome and Safari. Logs show 500 from address validation.",
    translated:
      "Checkout breaks when user has a saved address: steps 2 and 3 fail. Reproduced in Chrome and Safari. Server returns 500 on address validation.",
  },
  {
    tabLabel: "PM to Customer",
    fromRole: "Project Manager",
    toRole: "Customer",
    senderName: "Mike Johnson",
    original:
      "We're leveraging best practices to optimize the pipeline and ensure alignment on deliverables for the next sprint.",
    translated:
      "We're following proven steps to improve how we build and ship, and we're agreeing on what we'll deliver in the next cycle.",
  },
  {
    tabLabel: "Finance to Dev",
    fromRole: "Finance",
    toRole: "Developer",
    senderName: "Sam Taylor",
    original:
      "We need to right-size the OpEx and align capex with the roadmap. The burn rate is above plan for this quarter.",
    translated:
      "We need to match spending to the budget and tie bigger purchases to the product plan. We're spending more this quarter than we planned.",
  },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

const DURATIONS = {
  afterYakYak: 3500,
  afterTranslated: 11000,
  idleBeforeStart: 400,
  afterTypingDone: 900,
};
const TYPING_INTERVAL_MS = 56;

export function HeroMessageDemo() {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const [typedLength, setTypedLength] = useState(0);

  const scenario = SCENARIOS[activeTabIndex];
  const fullOriginal = scenario.original;

  const goToTab = useCallback((index: number) => {
    setActiveTabIndex(index);
    setPhase("idle");
    setTypedLength(0);
  }, []);

  // Idle → show original (start typing)
  useEffect(() => {
    if (phase === "idle") {
      const t = setTimeout(() => {
        setPhase("show-original");
        setTypedLength(0);
      }, DURATIONS.idleBeforeStart);
      return () => clearTimeout(t);
    }
  }, [phase]);

  // Typing effect: reveal original character by character
  useEffect(() => {
    if (phase !== "show-original") return;

    const id = setInterval(() => {
      setTypedLength((n) => {
        if (n >= fullOriginal.length) return n;
        return n + 1;
      });
    }, TYPING_INTERVAL_MS);
    return () => clearInterval(id);
  }, [phase, fullOriginal]);

  // When typing finishes → brief pause → show-yakyak
  useEffect(() => {
    if (phase !== "show-original" || typedLength < fullOriginal.length) return;
    const t = setTimeout(() => setPhase("show-yakyak"), DURATIONS.afterTypingDone);
    return () => clearTimeout(t);
  }, [phase, typedLength, fullOriginal.length]);

  // show-yakyak → show-translated
  useEffect(() => {
    if (phase !== "show-yakyak") return;
    const t = setTimeout(() => setPhase("show-translated"), DURATIONS.afterYakYak);
    return () => clearTimeout(t);
  }, [phase]);

  // show-translated → next scenario (loop)
  useEffect(() => {
    if (phase !== "show-translated") return;
    const t = setTimeout(() => {
      setActiveTabIndex((i) => (i + 1) % SCENARIOS.length);
      setPhase("show-original");
      setTypedLength(0);
    }, DURATIONS.afterTranslated);
    return () => clearTimeout(t);
  }, [phase]);

  const isCardVisible = phase !== "idle";
  const isTranslating = phase === "show-yakyak";
  const isTranslated = phase === "show-translated";

  return (
    <div className="mx-auto mt-6 w-full max-w-[1600px] px-2 sm:mt-10 sm:px-2" aria-hidden>
      {/* Tabs row */}
      <div className="mb-4 flex flex-wrap items-center justify-center gap-1.5 sm:mb-6 sm:gap-2">
        {SCENARIOS.map((s, i) => (
          <button
            key={s.tabLabel}
            type="button"
            onClick={() => goToTab(i)}
            className={cn(
              "rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors sm:px-3 sm:py-2 sm:text-sm",
              activeTabIndex === i
                ? "border-2 border-primary bg-transparent text-primary"
                : "border border-border bg-card text-foreground hover:border-primary/50 hover:bg-accent/30"
            )}
          >
            {s.tabLabel}
          </button>
        ))}
      </div>

      {/* Single card: Original → YakYak → Translated */}
      <div className="mx-auto w-full max-w-2xl px-0 sm:px-0">
        <div
          className={cn(
            "relative overflow-hidden rounded-xl border bg-card shadow-sm transition-all duration-500 ease-out sm:rounded-2xl",
            isCardVisible
              ? "translate-x-0 scale-100 opacity-100"
              : "-translate-x-6 scale-[0.98] opacity-0",
            isTranslating && "border-primary/40 bg-accent/5",
            !isTranslating && "border-border/80"
          )}
        >
          <div className="p-3 sm:p-4">
            {/* Header: avatar, name with role underneath */}
            <div className="mb-3 flex items-center gap-2.5">
              <Avatar name={scenario.senderName} phase={phase} className="h-9 w-9" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-foreground">
                    {scenario.senderName}
                  </span>
                  {phase === "show-original" && (
                    <span className="shrink-0 text-xs text-muted-foreground">
                      2:34 PM
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {phase === "show-original" && scenario.fromRole}
                  {isTranslating && "YakYak translating…"}
                  {isTranslated && `Translated for ${scenario.toRole}`}
                </p>
              </div>
            </div>

            {/* Body: one state at a time */}
            <div
              className={cn(
                "relative min-h-[100px] rounded-lg px-2.5 py-2 sm:min-h-[120px] sm:px-3 sm:py-2.5",
                phase === "show-original" && "bg-muted/50",
                isTranslating && "bg-muted/30",
                isTranslated && "border border-primary/10 bg-primary/5"
              )}
            >
              {phase === "show-original" && (
                <p className="text-sm leading-[1.55] text-foreground">
                  {fullOriginal.slice(0, typedLength)}
                  {typedLength < fullOriginal.length && (
                    <span className="ml-0.5 inline-block h-4 w-0.5 shrink-0 animate-pulse bg-primary align-middle" aria-hidden />
                  )}
                </p>
              )}

              {isTranslating && (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="hero-demo-dots flex gap-0.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      <span className="h-1.5 w-1.5 rounded-full bg-primary animation-delay-200" />
                      <span className="h-1.5 w-1.5 rounded-full bg-primary animation-delay-400" />
                    </span>
                    <span className="text-xs font-medium text-primary">
                      YakYak translating…
                    </span>
                  </div>
                  <span className="hero-demo-shimmer inline-block h-2.5 w-24 rounded bg-primary/15" />
                </div>
              )}

              {isTranslated && (
                <p className="text-sm leading-[1.55] text-foreground">
                  {scenario.translated}
                </p>
              )}
            </div>
          </div>

          {isTranslating && (
            <div
              className="pointer-events-none absolute inset-0 rounded-2xl"
              style={{
                boxShadow: "inset 0 0 50px rgba(15, 118, 110, 0.06)",
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
