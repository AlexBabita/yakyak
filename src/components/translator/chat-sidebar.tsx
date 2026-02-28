"use client";

import { Button } from "@/components/ui/button";
import { ROLES } from "@/lib/translator-options";
import { cn } from "@/lib/utils";

export type ConversationListItem = {
  id: string;
  from_role: string;
  to_role: string;
  from_lang: string | null;
  to_lang: string | null;
  updated_at: string;
};

export function formatChatDate(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  if (sameDay) return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

export function getRoleLabel(value: string) {
  return ROLES.find((r) => r.value === value)?.label ?? value;
}

export function ChatSidebar({
  conversations,
  selectedId,
  onSelect,
  onNewChat,
  isLoading,
}: {
  conversations: ConversationListItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onNewChat: () => void;
  isLoading?: boolean;
}) {
  return (
    <aside
      className={cn(
        "flex h-full w-full flex-col border-r border-border bg-muted/30 md:w-64 md:min-w-[14rem] md:flex-shrink-0"
      )}
    >
      <div className="flex flex-col gap-1 p-3 sm:p-4">
        <Button
          variant="outline"
          className="justify-start gap-2 font-medium"
          onClick={onNewChat}
          disabled={isLoading}
        >
          <span className="size-4" aria-hidden>
            +
          </span>
          New chat
        </Button>
        <div className="mt-2 flex flex-col gap-0.5 overflow-y-auto">
          {conversations.length === 0 && !isLoading && (
            <p className="px-2 py-4 text-center text-sm text-muted-foreground">
              No chats yet. Start with &quot;New chat&quot; and translate.
            </p>
          )}
          {conversations.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => onSelect(c.id)}
              className={cn(
                "flex flex-col items-start gap-0.5 rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                "hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                selectedId === c.id
                  ? "bg-primary/10 text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <span className="font-medium text-foreground">
                {getRoleLabel(c.from_role)} → {getRoleLabel(c.to_role)}
              </span>
              <span className="text-xs text-muted-foreground">{formatChatDate(c.updated_at)}</span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
