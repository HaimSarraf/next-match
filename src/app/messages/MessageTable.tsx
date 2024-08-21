"use client";

import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import React from "react";
import { MessageDto } from "../types";
import MessageTableCell from "./MessageTableCell";
import useMessages from "@/hooks/useMessages";

type Props = {
  initialMessages: MessageDto[];
};

export default function MessageTable({ initialMessages }: Props) {
  const { columns, deleteMessage, isDeleting, isOutbox, selectRow , messages } =
    useMessages(initialMessages);

  return (
    <Card className="flex flex-col gap-3 h-[80vh] overflow-auto">
      <Table
        aria-label="Table With Messages"
        selectionMode="single"
        shadow="none"
        onRowAction={(key) => {
          selectRow(key);
        }}
      >
        <TableHeader columns={columns}>
          {(columns) => (
            <TableColumn
              key={columns.key}
              width={columns.key === "text" ? "50%" : undefined}
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
                  <MessageTableCell
                    item={item}
                    columnKey={columnKey as string}
                    isOutbox={isOutbox}
                    deleteMessage={deleteMessage}
                    isDeleting={isDeleting.loading && isDeleting.id === item.id}
                  />
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
}
