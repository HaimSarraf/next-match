"use client";

import { MessageDto } from "@/app/types";
import React, { useEffect, useRef } from "react";
import clsx from "clsx";
import { Avatar } from "@nextui-org/react";
import { transformImageUrl } from "@/lib/utils";

type Props = {
  message: MessageDto;
  currentUserId: string;
};

export default function MessageBox({ currentUserId, message }: Props) {
  const isCurrentUserSender = message.senderId === currentUserId;

  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messageEndRef]);

  const renderedAvatar = () => (
    <Avatar
      name={message.senderName}
      className="self-end"
      src={transformImageUrl(message.senderImage) || "/images/user.png"}
    />
  );

  const messageContentClasses = clsx("flex flex-col w-[50%] px-2 py-1", {
    "rounded-l-xl rounded-tr-xl bg-yellow-300": !isCurrentUserSender,
    "rounded-r-xl rounded-tl-xl border-gray-200  bg-orange-300":
      isCurrentUserSender,
  });

  const renderedMessageHeader = () => (
    <div
      className={clsx("flex items-center w-full", {
        "justify-between": isCurrentUserSender,
        "justify-start": !isCurrentUserSender,
      })}
    >
      {message.dateRead && message.recipientId !== currentUserId ? (
        <span className="text-xs text-gray-400 text-italic">
          (read 4 mins ago)
        </span>
      ) : (
        <div></div>
      )}
      <div className="flex">
        <span className="text-sm">
          {message.senderId !== currentUserId && (
            <span className="font-bold">{message.senderName}</span>
          )}
        </span>
        <span className="text-sm text-gray-600 font-thin ml-2">
          {message.created}
        </span>
      </div>
    </div>
  );

  const renderedMessageContent = () => (
    <div className={messageContentClasses}>
      {message.senderId !== currentUserId && renderedMessageHeader()}
      <p className="text-md py-3 text-gray-800">{message.text}</p>
      {message.senderId === currentUserId && renderedMessageHeader()}
    </div>
  );

  return (
    <div className="grid grid-rows-1 text-w">
      <div
        className={clsx("flex gap-2 mb-3", {
          "justify-end text-right": !isCurrentUserSender,
          "justify-start": isCurrentUserSender,
        })}
      >
        {isCurrentUserSender && renderedAvatar()}

        {renderedMessageContent()}

        {!isCurrentUserSender && renderedAvatar()}
      </div>
      <div ref={messageEndRef} />
    </div>
  );
}
