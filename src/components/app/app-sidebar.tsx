"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  History,
  LogOut,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  formatChatDate,
  getRoleLabel,
  type ConversationListItem,
} from "@/components/translator/chat-sidebar";

export function AppSidebar({
  userLabel,
  onSignOut,
  isLoading,
  onCloseMobile,
  isMobileOpen,
  isCollapsed = false,
  onToggleCollapse,
  conversations = [],
  selectedConversationId = null,
  onSelectConversation,
  onNewChat,
  isLoadingConversations = false,
}: {
  userLabel: string | null;
  onSignOut: () => void;
  isLoading?: boolean;
  onCloseMobile?: () => void;
  isMobileOpen?: boolean;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  conversations?: ConversationListItem[];
  selectedConversationId?: string | null;
  onSelectConversation?: (id: string) => void;
  onNewChat?: () => void;
  isLoadingConversations?: boolean;
}) {
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(true);
  const collapsed = isCollapsed && !isMobileOpen;

  return (
    <>
      {/* Mobile overlay when sidebar is open */}
      {isMobileOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onCloseMobile}
        />
      )}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-full flex-col border-r border-border bg-card shadow-sm transition-[width] duration-200 ease-out md:translate-x-0",
          isMobileOpen ? "translate-x-0 w-64" : "-translate-x-full md:translate-x-0",
          collapsed ? "md:w-16" : "md:w-64"
        )}
      >
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Brand + collapse toggle */}
          <div className="flex h-16 shrink-0 items-center border-b border-border px-2 md:px-3">
            <div className="flex w-full items-center gap-2">
              <Link
                href="/"
                className="flex shrink-0 items-center gap-2"
                onClick={onCloseMobile}
              >
                <Image
                  src="/logo.svg"
                  alt="YakYak"
                  width={32}
                  height={32}
                  className="h-8 w-8"
                />
                {!collapsed && (
                  <span className="truncate text-xl font-bold text-primary">
                    YakYak.dev
                  </span>
                )}
              </Link>
              {!collapsed && onToggleCollapse && (
                <button
                  type="button"
                  onClick={onToggleCollapse}
                  className="ml-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                  aria-label="Collapse sidebar"
                >
                  <ChevronLeft className="size-[18px]" />
                </button>
              )}
            </div>
          </div>

          {/* Collapsed: expand button */}
          {collapsed && onToggleCollapse && (
            <div className="shrink-0 p-2">
              <button
                type="button"
                onClick={onToggleCollapse}
                className="flex h-9 w-full items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label="Expand sidebar"
              >
                <ChevronRight className="size-[18px]" />
              </button>
            </div>
          )}

          {!collapsed && (
            <>
              {/* New chat */}
          <div className="shrink-0 p-3">
            <Button
              variant="outline"
              className="w-full justify-start gap-2 font-medium"
              onClick={() => {
                onNewChat?.();
                onCloseMobile?.();
              }}
              disabled={isLoadingConversations}
            >
              <Plus className="size-4" aria-hidden />
              New chat
            </Button>
          </div>

          {/* History (expandable) */}
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <button
              type="button"
              onClick={() => setIsHistoryExpanded((prev) => !prev)}
              className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              aria-expanded={isHistoryExpanded}
            >
              <span>History</span>
              <ChevronDown
                className={cn(
                  "size-4 shrink-0 transition-transform duration-200",
                  isHistoryExpanded && "rotate-180"
                )}
                aria-hidden
              />
            </button>
            {isHistoryExpanded && (
              <div className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto px-3 pb-3">
                {conversations.length === 0 && !isLoadingConversations && (
                  <p className="px-2 py-4 text-center text-sm text-muted-foreground">
                    No chats yet. Start with &quot;New chat&quot; and translate.
                  </p>
                )}
                {conversations.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      onSelectConversation?.(c.id);
                      onCloseMobile?.();
                    }}
                    className={cn(
                      "flex flex-col items-start gap-0.5 rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                      "hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                      selectedConversationId === c.id
                        ? "bg-primary/10 text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <span className="font-medium text-foreground">
                      {getRoleLabel(c.from_role)} → {getRoleLabel(c.to_role)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatChatDate(c.updated_at)}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User & sign out */}
          <div className="shrink-0 border-t border-border p-3">
            {!isLoading && userLabel && (
              <p
                className="mb-2 truncate px-3 text-sm text-muted-foreground"
                title={userLabel}
              >
                {userLabel}
              </p>
            )}
            <Button
              variant="ghost"
              className="w-full justify-start gap-3"
              onClick={onSignOut}
              disabled={isLoading}
            >
              Sign out
            </Button>
          </div>
            </>
          )}

          {/* Collapsed: icon strip */}
          {collapsed && (
            <div className="flex flex-1 flex-col gap-1 pt-2">
              <button
                type="button"
                onClick={() => {
                  onNewChat?.();
                  onCloseMobile?.();
                }}
                disabled={isLoadingConversations}
                className="flex h-9 w-full items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-50"
                aria-label="New chat"
              >
                <Plus className="size-[18px]" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsHistoryExpanded(true);
                  onToggleCollapse?.();
                }}
                className="flex h-9 w-full items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label="Expand sidebar to view history"
              >
                <History className="size-[18px]" />
              </button>
              <div className="mt-auto border-t border-border p-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  onClick={onSignOut}
                  disabled={isLoading}
                  aria-label="Sign out"
                >
                  <LogOut className="size-[18px]" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
