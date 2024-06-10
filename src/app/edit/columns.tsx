"use client";

import EditableCell from "@/components/List/EditableCell";
import { type Resources } from "@prisma/client";
import { type ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";

export const columns: ColumnDef<Resources>[] = [
  {
    header: "ID",
    accessorKey: "id_resources",
    filterFn: "equalsString",
    // sortingFn: fuzzySort,
  },
  {
    header: "Page",
    accessorKey: "page_keys",
    cell: EditableCell,
    filterFn: "includesStringSensitive",
  },
  {
    header: "Resource Key",
    accessorKey: "resource_key",
    cell: EditableCell,
    filterFn: "includesStringSensitive",
  },
  {
    header: "Resource Value",
    accessorKey: "resource_value",
    cell: EditableCell,
    filterFn: "includesStringSensitive",
  },
  {
    header: "Ultimo aggiornamento",
    accessorKey: "last_modified",
    cell: ({ row }) => {
      const date: string = dayjs(row.getValue("last_modified")).format(
        "YYYY-MM-DD HH:mm:ss",
      );

      return <div>{date}</div>;
    },
    // sortingFn: fuzzySort,
  },
];
