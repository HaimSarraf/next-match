import {
  deleteMessage,
  getMessagesByContainer,
} from "@/app/actions/messageActions";
import { MessageDto } from "@/app/types";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Key, useCallback, useEffect, useRef, useState } from "react";
import useMessageStore from "./useMessageStore";

export default function useMessages(
  initialMessages: MessageDto[],
  nextCursor?: string
) {
  const cursorRef = useRef(nextCursor);

  const { set, remove, messages, updateUnreadCount, resetMessages } =
    useMessageStore((state) => ({
      set: state.set,
      remove: state.remove,
      messages: state.messages,
      updateUnreadCount: state.updateUnreadCount,
      resetMessages: state.resetMessages,
    }));
  const searchParams = useSearchParams();
  const isOutbox = searchParams.get("container") === "outbox";
  const router = useRouter();
  const container = searchParams.get("container");
  const [isDeleting, setIsDeleting] = useState({ id: "", loading: false });
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    set(initialMessages);

    return () => {
      resetMessages();
    };
  }, [initialMessages, resetMessages, set]);

  const loadMore = useCallback(async () => {
    if (cursorRef.current) {
      setLoadingMore(true);
      const { messages, nextCursor } = await getMessagesByContainer(
        container,
        cursorRef.current
      );
      set(messages);
      cursorRef.current = nextCursor;
      setLoadingMore(false);
    }
  }, [container, set]);

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
    loadMore,
    loadingMore,
    hasMore: !!cursorRef.current,
  };
}
