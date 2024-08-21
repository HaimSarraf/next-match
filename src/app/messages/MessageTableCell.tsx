import PresenceAvatar from "@/components/PresenceAvatar";
import { truncateString } from "@/lib/utils";
import { Button } from "@nextui-org/react";
import React from "react";
import { AiFillDelete } from "react-icons/ai";
import { MessageDto } from "../types";

type Props = {
  item: MessageDto;
  columnKey: string;
  isOutbox: boolean;
  deleteMessage: (message: MessageDto) => void;
  isDeleting: boolean;
};

export default function MessageTableCell({
  columnKey,
  deleteMessage,
  isDeleting,
  isOutbox,
  item,
}: Props) {
  const cellValue = item[columnKey as keyof MessageDto];

  switch (columnKey) {
    case "recipientName":
    case "senderName":
      return (
        <div className="flex items-center gap-2 cursor-pointe">
          <PresenceAvatar
            userId={isOutbox ? item.recipientId : item.senderId}
            src={isOutbox ? item.recipientImage : item.senderImage}
          />

          <span>{cellValue}</span>
        </div>
      );

    case "text":
      return <div>{truncateString(cellValue, 30)}</div>;

    case "created":
      return cellValue;

    default:
      return (
        <Button
          isIconOnly
          variant="light"
          onClick={() => deleteMessage(item)}
          isLoading={isDeleting}
        >
          <AiFillDelete size={24} className="text-danger" />
        </Button>
      );
  }
}
