"use client";

import { TranslatorChat } from "./translator-chat";
import type { ConversationMeta } from "./translator-chat";
import type { ConversationListItem } from "./chat-sidebar";

function toConversationMeta(c: ConversationListItem): ConversationMeta {
  return {
    id: c.id,
    fromRole: c.from_role as ConversationMeta["fromRole"],
    toRole: c.to_role as ConversationMeta["toRole"],
    fromLang: c.from_lang ?? "__auto__",
    toLang: c.to_lang ?? "",
  };
}

export function AppChatView({
  conversations,
  selectedConversationId,
  onConversationCreated,
  onMessagesSaved,
}: {
  conversations: ConversationListItem[];
  selectedConversationId: string | null;
  onConversationCreated: (id: string) => void;
  onMessagesSaved: () => void;
}) {
  const selectedConversation = selectedConversationId
    ? conversations.find((c) => c.id === selectedConversationId)
    : null;
  const selectedMeta = selectedConversation
    ? toConversationMeta(selectedConversation)
    : null;

  return (
    <main className="flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-background p-3 sm:p-4">
      <TranslatorChat
        key={selectedConversationId ?? "new"}
        selectedConversationId={selectedConversationId}
        selectedConversationMeta={selectedMeta}
        onConversationCreated={onConversationCreated}
        onMessagesSaved={onMessagesSaved}
      />
    </main>
  );
}
