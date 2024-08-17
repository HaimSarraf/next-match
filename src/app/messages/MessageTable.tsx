"use client";

import {
  Avatar,
  Button,
  Card,
  getKeyValue,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Key, useCallback, useState } from "react";
import { MessageDto } from "../types";
import { AiFillDelete } from "react-icons/ai";
import { deleteMessage } from "../actions/messageActions";
import { truncateString } from "@/lib/utils";

type Props = {
  messages: MessageDto[];
};

export default function MessageTable({ messages }: Props) {
  const searchParams = useSearchParams();

  const isOutbox = searchParams.get("container") === "outbox";

  const router = useRouter();

  const [isDeleting, setIsDeleting] = useState({ id: "", loading: false });

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

      router.refresh();

      setIsDeleting({ id: "", loading: false });
    },
    [isOutbox, router]
  );

  const handleRowSelect = (key: Key) => {
    const message = messages.find((m) => m.id === key);

    const url = isOutbox
      ? `/members/${message?.recipientId}`
      : `/members/${message?.senderId}`;

    router.push(url + "/chat");
  };

  const renderCell = useCallback(
    (item: MessageDto, columnKey: keyof MessageDto) => {
      const cellValue = item[columnKey];

      switch (columnKey) {
        case "recipientName":
        case "senderName":
          return (
            <div className="flex items-center gap-2 cursor-pointe">
              <Avatar
                alt="Image Of Member"
                src={
                  (isOutbox ? item.recipientImage : item.senderImage) ||
                  "/images/user.png"
                }
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
              onClick={() => handleDeleteMessage(item)}
              isLoading={isDeleting.id === item.id && isDeleting.loading}
            >
              <AiFillDelete size={24} className="text-danger" />
            </Button>
          );
      }
    },
    [isOutbox, isDeleting.id, isDeleting.loading, handleDeleteMessage]
  );

  return (
    <Card className="flex flex-col gap-3 h-[80vh] overflow-auto">
      <Table
        aria-label="Table With Messages"
        selectionMode="single"
        shadow="none"
        onRowAction={(key) => {
          handleRowSelect(key);
        }}
      >
        <TableHeader columns={columns}>
          {(columns) => (
            <TableColumn key={columns.key}
              width={columns.key === 'text' ? '50%' : undefined }
            >
              {columns.label}
              </TableColumn>
          )}
        </TableHeader>

        <TableBody
          items={messages}
          emptyContent="No Messages For This Container"
        >
          {(item) => (
            <TableRow
              key={item.id}
              className={`${
                !item.dateRead && !isOutbox
                  ? "text-slate-500 py-3 cursor-pointer my-2 bg-gradient-to-l from-yellow-100 to-yellow-200  hover:text-black hover:underline"
                  : "text-slate-500 py-3 cursor-pointer my-2 bg-gradient-to-l from-orange-300 to-orange-100"
              }`}
            >
              {(columnKey) => (
                <TableCell>
                  {renderCell(item, columnKey as keyof MessageDto)}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
}
