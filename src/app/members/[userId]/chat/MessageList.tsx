"use client";

import { MessageDto } from "@/app/types";
import React, { useCallback, useEffect, useRef, useState } from "react";
import MessageBox from "./MessageBox";
import { pusherClient } from "@/lib/pusher";
import { formatShortDateTime } from "@/lib/utils";
import { Channel } from "pusher-js";
import useMessageStore from "@/hooks/useMessageStore";

type Props = {
  initialMessages: { messages: MessageDto[]; readCount: number };
  currentUserId: string;
  chatId: string;
};

function MessageList({ initialMessages, currentUserId, chatId }: Props) {
  const setReadCount = useRef(false);
  const channelRef = useRef<Channel | null>();
  const [messages, setMessages] = useState(initialMessages.messages);
  const { updateUnreadCount } = useMessageStore((state) => ({
    updateUnreadCount: state.updateUnreadCount,
  }));

  useEffect(() => {
    if (!setReadCount.current) {
      updateUnreadCount(-initialMessages.readCount);
      setReadCount.current = true;
    }
  }, [updateUnreadCount, initialMessages.readCount]);

  const handleNewMessage = useCallback((message: MessageDto) => {
    setMessages((prevState) => {
      return [...prevState, message];
    });
  }, []);

  const handleReadMessages = useCallback((messageIds: string) => {
    setMessages((prevState) =>
      prevState.map((message) =>
        messageIds.includes(message.id)
          ? { ...message, dateRead: formatShortDateTime(new Date()) }
          : message
      )
    );
  }, []);

  useEffect(() => {
    if (!channelRef.current) {
      channelRef.current = pusherClient.subscribe(chatId);

      channelRef.current.bind("message:new", handleNewMessage);
      channelRef.current.bind("message:read", handleReadMessages);
    }

    return () => {
      if (channelRef.current && channelRef.current.subscribed) {
        channelRef.current.unsubscribe();
        channelRef.current.unbind("message:new", handleNewMessage);
        channelRef.current.unbind("message:read", handleReadMessages);
      }
    };
  }, [chatId, handleNewMessage, handleReadMessages]);

  return (
    <div>
      {messages.length === 0 ? (
        "No Messages To Display"
      ) : (
        <div>
          {messages.map((m) => (
            <MessageBox key={m.id} message={m} currentUserId={currentUserId} />
          ))}
        </div>
      )}
    </div>
  );
}

export default MessageList;
