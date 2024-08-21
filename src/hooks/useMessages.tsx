import { deleteMessage } from "@/app/actions/messageActions";
import { MessageDto } from "@/app/types";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Key, useCallback, useEffect, useState } from "react";
import useMessageStore from "./useMessageStore";

export default function useMessages(initialMessages: MessageDto[]) {
  const { set, remove, messages, updateUnreadCount } = useMessageStore(
    (state) => ({
      set: state.set,
      remove: state.remove,
      messages: state.messages,
      updateUnreadCount: state.updateUnreadCount,
    })
  );
  const searchParams = useSearchParams();
  const isOutbox = searchParams.get("container") === "outbox";
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState({ id: "", loading: false });

  useEffect(() => {
    set(initialMessages);

    return () => {
      set([]);
    };
  }, [initialMessages, set]);

  const columns = [
    {
      key: isOutbox ? "recipientName" : "senderName",
      label: isOutbox ? "Recipient" : "Sender",
    },
    { key: "text", label: "Message" },
    { key: "created", label: isOutbox ? "Date Sent" : "Date Recieved" },
    { key: "actions", label: "Actions" },
  ];

  const handleDeleteMessage = useCallback(
    async (message: MessageDto) => {
      setIsDeleting({ id: message.id, loading: true });

      await deleteMessage(message.id, isOutbox);

      remove(message.id);

      if (!message.dateRead && !isOutbox) updateUnreadCount(-1);

      setIsDeleting({ id: "", loading: false });
    },
    [isOutbox, remove, updateUnreadCount]
  );

  const handleRowSelect = (key: Key) => {
    const message = messages.find((m) => m.id === key);

    const url = isOutbox
      ? `/members/${message?.recipientId}`
      : `/members/${message?.senderId}`;

    router.push(url + "/chat");
  };

  return {
    isOutbox,
    columns,
    deleteMessage: handleDeleteMessage,
    selectRow: handleRowSelect,
    isDeleting,
    messages,
  };
}
