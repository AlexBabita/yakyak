"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { ArrowRight, Copy, MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

function getRoleLabel(value: RoleValue) {
  return ROLES.find((r) => r.value === value)?.label ?? value;
}

type FromLanguageValue = LanguageValue | typeof LANGUAGE_SELECT_AUTO;

function getLangLabel(value: LanguageValue | FromLanguageValue) {
  if (!value || value === LANGUAGE_SELECT_AUTO) return value === LANGUAGE_SELECT_AUTO ? "Auto-detect" : null;
  if (value === LANGUAGE_SELECT_NONE) return null;
  return LANGUAGES.find((l) => l.value === value)?.label ?? value;
}

export type ConversationMeta = {
  id: string;
  fromRole: RoleValue;
  toRole: RoleValue;
  fromLang: string;
  toLang: string;
};

export type TranslatorChatProps = {
  /** When set, we're viewing/editing this conversation and load its messages. */
  selectedConversationId?: string | null;
  /** Meta for the selected conversation (roles + langs). Used to set dropdowns and when saving. */
  selectedConversationMeta?: ConversationMeta | null;
  /** Called when a new conversation is created (first message in "New chat"). Parent can refetch list and select this. */
  onConversationCreated?: (id: string) => void;
  /** Called after messages are saved (so parent can refetch list and reorder). */
  onMessagesSaved?: () => void;
  /** When true (default), input bar is fixed to viewport bottom. Set false for inline use (e.g. landing "Try it"). */
  floatingInput?: boolean;
};

export function TranslatorChat(props: TranslatorChatProps = {}) {
  const {
    selectedConversationId = null,
    selectedConversationMeta = null,
    onConversationCreated,
    onMessagesSaved,
    floatingInput = true,
  } = props;

  const [fromRole, setFromRole] = useState<RoleValue>("developer");
  const [toRole, setToRole] = useState<RoleValue>("project-manager");
  const [fromLang, setFromLang] = useState<FromLanguageValue>(LANGUAGE_SELECT_AUTO);
  const [toLang, setToLang] = useState<LanguageValue>("");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentConversation, setCurrentConversation] = useState<ConversationMeta | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const INPUT_MIN_HEIGHT_PX = 36;
  const INPUT_MAX_HEIGHT_PX = 112; // ~max-h-28

  const resizeInput = useCallback((el: HTMLTextAreaElement | null) => {
    if (!el) return;
    el.style.height = "auto";
    const h = Math.min(Math.max(el.scrollHeight, INPUT_MIN_HEIGHT_PX), INPUT_MAX_HEIGHT_PX);
    el.style.height = `${h}px`;
    el.style.overflowY = el.scrollHeight > INPUT_MAX_HEIGHT_PX ? "auto" : "hidden";
  }, []);

  // When switching to a conversation: load messages and sync dropdowns from meta
  const loadConversation = useCallback(async (conversationId: string, meta: ConversationMeta) => {
    const supabase = createClient();
    setFromRole(meta.fromRole as RoleValue);
    setToRole(meta.toRole as RoleValue);
    setFromLang((meta.fromLang === "__auto__" ? LANGUAGE_SELECT_AUTO : meta.fromLang || "") as FromLanguageValue);
    setToLang((meta.toLang || "") as LanguageValue);
    setCurrentConversation(meta);
    const { data: rows } = await supabase
      .from("messages")
      .select("id, role, content")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });
    const loaded: Message[] = (rows ?? []).map((m) => ({
      id: m.id,
      role: m.role as "user" | "assistant",
      content: m.content,
    }));
    setMessages(loaded);
  }, []);

  useEffect(() => {
    if (
      selectedConversationId &&
      selectedConversationMeta &&
      selectedConversationMeta.id === selectedConversationId
    ) {
      loadConversation(selectedConversationId, selectedConversationMeta);
    } else if (!selectedConversationId) {
      setMessages([]);
      setCurrentConversation(null);
      setFromRole("developer");
      setToRole("project-manager");
      setFromLang(LANGUAGE_SELECT_AUTO);
      setToLang("");
    }
  }, [selectedConversationId, selectedConversationMeta, loadConversation]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    resizeInput(textareaRef.current);
  }, [input, resizeInput]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;

    setInput("");
    const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          fromRole,
          toRole,
          fromLang: fromLang === LANGUAGE_SELECT_AUTO ? undefined : fromLang || undefined,
          toLang: toLang || undefined,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: `Error: ${data.error ?? res.statusText}. Check that GEMINI_API_KEY is set in .env (see GEMINI_SETUP.md).`,
          },
        ]);
        return;
      }

      const translatedText = data.translated ?? "";
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "assistant", content: translatedText },
      ]);

      // Store original + translated when user is signed in
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const fromLangVal = fromLang === LANGUAGE_SELECT_AUTO ? "__auto__" : (fromLang || "");
        const toLangVal = toLang || "";
        // Use selected conversation if we're in an existing chat; otherwise create or reuse by settings
        let conversationId = selectedConversationId ?? null;
        if (!conversationId) {
          const settingsMatch =
            currentConversation &&
            currentConversation.fromRole === fromRole &&
            currentConversation.toRole === toRole &&
            currentConversation.fromLang === fromLangVal &&
            currentConversation.toLang === toLangVal;
          conversationId = settingsMatch ? currentConversation.id : null;
        }
        if (!conversationId) {
          const { data: conv, error: convErr } = await supabase
            .from("conversations")
            .insert({
              user_id: user.id,
              from_role: fromRole,
              to_role: toRole,
              from_lang: fromLangVal,
              to_lang: toLangVal,
            })
            .select("id")
            .single();
          if (!convErr && conv) {
            conversationId = conv.id;
            setCurrentConversation({
              id: conv.id,
              fromRole,
              toRole,
              fromLang: fromLangVal,
              toLang: toLangVal,
            });
            onConversationCreated?.(conv.id);
          }
        }
        if (conversationId) {
          await supabase.from("messages").insert([
            { conversation_id: conversationId, role: "user", content: text },
            { conversation_id: conversationId, role: "assistant", content: translatedText },
          ]);
          await supabase
            .from("conversations")
            .update({ updated_at: new Date().toISOString() })
            .eq("id", conversationId);
          onMessagesSaved?.();
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fromLangLabel = getLangLabel(fromLang);
  const toLangLabel = getLangLabel(toLang);

  return (
    <div className="relative flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden bg-background">
      {/* Messages: only this area scrolls */}
      <div
        ref={scrollRef}
        className={cn(
          "min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-muted/20 px-4 py-4 sm:px-6 lg:px-8",
          floatingInput ? "pb-52 sm:pb-56" : "pb-4"
        )}
        style={{ minHeight: 0 }}
      >
        {messages.length === 0 && (
          <div className="flex h-full min-h-[200px] flex-col items-center justify-center gap-3 text-center text-muted-foreground">
            <div className="rounded-full bg-muted/60 p-4">
              <MessageCircle className="size-8 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground">Start the conversation</p>
            <p className="text-xs max-w-xs">
              Translating from <span className="font-medium text-foreground">{getRoleLabel(fromRole)}</span>
              {fromLangLabel && (
                <span> ({fromLangLabel})</span>
              )}{" "}
              to <span className="font-medium text-foreground">{getRoleLabel(toRole)}</span>
              {toLangLabel && (
                <span> ({toLangLabel})</span>
              )}
            </p>
          </div>
        )}
        <div className="flex w-full flex-col gap-5">
          {messages.map((m) => (
            <div
              key={m.id}
              className={cn(
                "flex gap-3",
                m.role === "user" ? "flex-row-reverse" : "flex-row"
              )}
            >
              {/* Avatar */}
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full text-xs font-medium",
                  m.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-card"
                )}
                aria-hidden
              >
                {m.role === "user" ? (
                  "You"
                ) : (
                  <Image src="/logo.svg" alt="YakYak" width={32} height={32} className="h-5 w-5 object-contain" />
                )}
              </div>
              {/* Bubble */}
              <div
                className={cn(
                  "group relative flex max-w-[85%] flex-col gap-0.5 rounded-2xl px-3 py-2 shadow-sm sm:max-w-[75%] sm:px-4 sm:py-2.5",
                  m.role === "user"
                    ? "rounded-br-md bg-primary text-primary-foreground"
                    : "rounded-bl-md border border-border bg-card text-foreground"
                )}
              >
                <p className="whitespace-pre-wrap pr-8 text-sm leading-relaxed">{m.content}</p>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "absolute right-1 top-1 h-7 w-7 shrink-0 opacity-70 transition-opacity hover:opacity-100",
                    m.role === "user"
                      ? "text-primary-foreground hover:bg-primary-foreground/20"
                      : "text-muted-foreground hover:bg-muted"
                  )}
                  onClick={() => {
                    void navigator.clipboard.writeText(m.content);
                  }}
                  aria-label="Copy message"
                >
                  <Copy className="size-3.5" />
                </Button>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3">
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-card"
                aria-hidden
              >
                <Image src="/logo.svg" alt="YakYak" width={32} height={32} className="h-5 w-5 object-contain" />
              </div>
              <div className="rounded-2xl rounded-bl-md border border-border bg-card px-4 py-3 shadow-sm">
                <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <span className="size-2 animate-pulse rounded-full bg-primary" />
                  <span className="size-2 animate-pulse rounded-full bg-primary [animation-delay:0.2s]" />
                  <span className="size-2 animate-pulse rounded-full bg-primary [animation-delay:0.4s]" />
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input area: fixed on /app, inline on landing */}
      <div
        className={cn(
          "z-20 bg-background",
          floatingInput
            ? "fixed bottom-0 left-[var(--app-sidebar-width,0)] right-0"
            : "flex-none border-t border-border"
        )}
      >
        <form onSubmit={handleSubmit} className="w-full px-4 pt-3 pb-6 sm:px-6 sm:pb-8 lg:px-8">
          {/* From → To: compact row above input */}
          <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-muted-foreground">From</span>
              <Select value={fromRole} onValueChange={(v) => setFromRole(v as RoleValue)}>
                <SelectTrigger className="h-8 w-auto min-w-0 gap-1 border-border bg-muted/50 px-2 text-xs sm:min-w-[100px]" aria-label="From role">
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
              <Select
                value={fromLang === "" ? LANGUAGE_SELECT_NONE : fromLang}
                onValueChange={(v) =>
                  setFromLang(v === LANGUAGE_SELECT_NONE ? "" : (v as FromLanguageValue))
                }
              >
                <SelectTrigger className="h-8 w-auto min-w-0 border-border bg-muted/50 px-2 text-xs sm:min-w-[90px]" aria-label="From language">
                  <SelectValue placeholder="Lang" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={LANGUAGE_SELECT_AUTO}>Auto</SelectItem>
                  {LANGUAGES.map((l) => (
                    <SelectItem key={l.value || "none"} value={l.value === "" ? LANGUAGE_SELECT_NONE : l.value}>
                      {l.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <ArrowRight className="size-3.5 shrink-0 text-muted-foreground" />
            <div className="flex items-center gap-1.5">
              <span className="text-muted-foreground">To</span>
              <Select value={toRole} onValueChange={(v) => setToRole(v as RoleValue)}>
                <SelectTrigger className="h-8 w-auto min-w-0 gap-1 border-border bg-muted/50 px-2 text-xs sm:min-w-[100px]" aria-label="To role">
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
              <Select
                value={toLang === "" ? LANGUAGE_SELECT_NONE : toLang}
                onValueChange={(v) => setToLang((v === LANGUAGE_SELECT_NONE ? "" : v) as LanguageValue)}
              >
                <SelectTrigger className="h-8 w-auto min-w-0 border-border bg-muted/50 px-2 text-xs sm:min-w-[90px]" aria-label="To language">
                  <SelectValue placeholder="Lang" />
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
          {/* Text input + send */}
          <div className="flex items-end gap-1.5 rounded-xl border border-input bg-muted/30 px-2 py-1 shadow-sm focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 sm:gap-2 sm:rounded-2xl sm:py-1.5">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                resizeInput(e.target);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e as unknown as React.FormEvent);
                }
              }}
              placeholder="Type a message to translate…"
              rows={1}
              className="min-h-[36px] max-h-28 w-full flex-1 resize-none overflow-y-auto bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              style={{ maxHeight: INPUT_MAX_HEIGHT_PX }}
              aria-label="Message to translate"
              disabled={isLoading}
            />
            <Button
              type="submit"
              size="icon"
              disabled={isLoading || !input.trim()}
              className="h-9 w-9 shrink-0 rounded-xl"
            >
              <Send className="size-4" />
              <span className="sr-only">Send</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
