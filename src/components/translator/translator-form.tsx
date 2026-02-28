"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ROLES,
  LANGUAGES,
  LANGUAGE_SELECT_AUTO,
  LANGUAGE_SELECT_NONE,
  type RoleValue,
  type LanguageValue,
} from "@/lib/translator-options";

type FromLanguageValue = LanguageValue | typeof LANGUAGE_SELECT_AUTO;
import { cn } from "@/lib/utils";

export function TranslatorForm() {
  const [fromRole, setFromRole] = useState<RoleValue>("developer");
  const [toRole, setToRole] = useState<RoleValue>("project-manager");
  const [fromLang, setFromLang] = useState<FromLanguageValue>(LANGUAGE_SELECT_AUTO);
  const [toLang, setToLang] = useState<LanguageValue>("");
  const [message, setMessage] = useState("");
  const [output, setOutput] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setIsLoading(true);
    setOutput(null);
    try {
      // TODO: wire to backend API when ready
      await new Promise((r) => setTimeout(r, 600));
      setOutput(
        `[Translated from ${fromRole} → ${toRole}${fromLang && toLang ? `, ${fromLang} → ${toLang}` : ""}]\n\nYour translated message will appear here once the API is connected.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="from-role">From role</Label>
          <Select value={fromRole} onValueChange={(v) => setFromRole(v as RoleValue)}>
            <SelectTrigger id="from-role" aria-label="Select source role">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ROLES.map((r) => (
                <SelectItem key={r.value} value={r.value}>
                  {r.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="to-role">To role</Label>
          <Select value={toRole} onValueChange={(v) => setToRole(v as RoleValue)}>
            <SelectTrigger id="to-role" aria-label="Select target role">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ROLES.map((r) => (
                <SelectItem key={r.value} value={r.value}>
                  {r.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="from-lang">
            From language <span className="text-muted-foreground">(optional)</span>
          </Label>
          <Select
            value={fromLang === "" ? LANGUAGE_SELECT_NONE : fromLang}
            onValueChange={(v) =>
              setFromLang(v === LANGUAGE_SELECT_NONE ? "" : (v as FromLanguageValue))
            }
          >
            <SelectTrigger id="from-lang" aria-label="Select source language">
              <SelectValue placeholder="From language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={LANGUAGE_SELECT_AUTO}>Auto-detect</SelectItem>
              {LANGUAGES.map((l) => (
                <SelectItem key={l.value || "none"} value={l.value === "" ? LANGUAGE_SELECT_NONE : l.value}>
                  {l.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="to-lang">
            To language <span className="text-muted-foreground">(optional)</span>
          </Label>
          <Select
            value={toLang === "" ? LANGUAGE_SELECT_NONE : toLang}
            onValueChange={(v) => setToLang((v === LANGUAGE_SELECT_NONE ? "" : v) as LanguageValue)}
          >
            <SelectTrigger id="to-lang" aria-label="Select target language">
              <SelectValue placeholder="To language" />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map((l) => (
                <SelectItem key={l.value || "none"} value={l.value === "" ? LANGUAGE_SELECT_NONE : l.value}>
                  {l.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Original message</Label>
        <textarea
          id="message"
          rows={4}
          placeholder="e.g. We need to refactor the legacy auth before we can add SSO."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={cn(
            "flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm min-h-[100px] resize-y"
          )}
          aria-label="Message to translate"
        />
      </div>

      <Button type="submit" size="lg" disabled={isLoading || !message.trim()}>
        {isLoading ? "Translating…" : "YakYak It"}
      </Button>

      {output !== null && (
        <div className="rounded-lg border border-border bg-card p-4 text-card-foreground shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
            Translated message
          </p>
          <p className="whitespace-pre-wrap text-sm">{output}</p>
        </div>
      )}
    </form>
  );
}
