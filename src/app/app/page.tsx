"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { AppShell } from "@/components/app/app-shell";
import { AppChatView } from "@/components/translator/app-chat-view";
import type { ConversationListItem } from "@/components/translator/chat-sidebar";

export default function AppPage() {
  const [conversations, setConversations] = useState<ConversationListItem[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);

  const fetchConversations = useCallback(async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setConversations([]);
      setIsLoadingConversations(false);
      return;
    }
    const { data } = await supabase
      .from("conversations")
      .select("id, from_role, to_role, from_lang, to_lang, updated_at")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });
    setConversations((data as ConversationListItem[]) ?? []);
    setIsLoadingConversations(false);
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const handleConversationCreated = useCallback((id: string) => {
    setSelectedConversationId(id);
    fetchConversations();
  }, [fetchConversations]);

  return (
    <AppShell
      conversations={conversations}
      selectedConversationId={selectedConversationId}
      onSelectConversation={setSelectedConversationId}
      onNewChat={() => setSelectedConversationId(null)}
      isLoadingConversations={isLoadingConversations}
    >
      <AppChatView
        conversations={conversations}
        selectedConversationId={selectedConversationId}
        onConversationCreated={handleConversationCreated}
        onMessagesSaved={fetchConversations}
      />
    </AppShell>
  );
}
