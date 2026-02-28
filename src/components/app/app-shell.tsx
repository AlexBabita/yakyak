"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppSidebar } from "./app-sidebar";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import type { ConversationListItem } from "@/components/translator/chat-sidebar";

export function AppShell({
  children,
  conversations = [],
  selectedConversationId = null,
  onSelectConversation,
  onNewChat,
  isLoadingConversations = false,
}: {
  children: React.ReactNode;
  conversations?: ConversationListItem[];
  selectedConversationId?: string | null;
  onSelectConversation?: (id: string) => void;
  onNewChat?: () => void;
  isLoadingConversations?: boolean;
}) {
  const router = useRouter();
  const [userLabel, setUserLabel] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        const name =
          user.user_metadata?.display_name ??
          user.user_metadata?.full_name ??
          user.email;
        setUserLabel(name ?? user.email ?? "Account");
      } else {
        setUserLabel(null);
        router.replace("/login");
      }
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user;
      setUserLabel(
        u
          ? u.user_metadata?.display_name ??
              u.user_metadata?.full_name ??
              u.email ??
              "Account"
          : null
      );
    });
    return () => subscription.unsubscribe();
  }, [router]);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <div className="flex min-h-screen flex-col bg-background md:flex-row">
      <AppSidebar
        userLabel={userLabel}
        onSignOut={handleSignOut}
        isLoading={isLoading}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        isMobileOpen={isMobileSidebarOpen}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
        conversations={conversations}
        selectedConversationId={selectedConversationId}
        onSelectConversation={onSelectConversation}
        onNewChat={onNewChat}
        isLoadingConversations={isLoadingConversations}
      />

      {/* Main: offset by sidebar width on desktop; overflow-hidden so only inner content scrolls */}
      <div
        className={cn(
          "app-main-content flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden transition-[padding] duration-200",
          isSidebarCollapsed ? "md:pl-16" : "md:pl-64"
        )}
      >
        <style
          dangerouslySetInnerHTML={{
            __html: [
              `.app-main-content { --app-sidebar-width: 0; }`,
              `@media (min-width: 768px) { .app-main-content { --app-sidebar-width: ${isSidebarCollapsed ? "4rem" : "16rem"}; } }`,
            ].join(" "),
          }}
        />
        <main className="flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          {isLoading ? (
            <div className="flex flex-1 items-center justify-center py-24">
              <span className="text-sm text-muted-foreground">Loading…</span>
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}
