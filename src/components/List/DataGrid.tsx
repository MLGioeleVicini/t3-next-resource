"use client";

import React, { useState } from "react";

import {
  type Column,
  type ColumnDef,
  type ColumnFiltersState,
  type FilterFn,
  type RowData,
  type SortingFn,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  sortingFns,
  useReactTable,
} from "@tanstack/react-table";

import { type RankingInfo, rankItem } from "@tanstack/match-sorter-utils";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { api } from "@/trpc/react";
import { ResourcesSchema } from "prisma/generated/zod";

declare module "@tanstack/react-table" {
  //add fuzzy filter to the filterFns
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }
}

declare module "@tanstack/table-core" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void;
  }
}

const fuzzyFilter: FilterFn<unknown> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value as string);

  // Store the itemRank info
  addMeta({
    itemRank,
  });

  // Return if the item should be filtered in/out
  return itemRank.passed;
};

const fuzzySort: SortingFn<unknown> = (rowA, rowB, columnId) => {
  let dir = 0;

  dir = 1;
  // Only sort by rank if the column has ranking information
  // if (rowA.columnFiltersMeta[columnId] && rowB !== undefined) {
  //   dir = compareItems(
  //     rowA?.columnFiltersMeta[columnId].itemRank,
  //     rowB.columnFiltersMeta[columnId].itemRank,
  //   );
  // }

  // Provide an alphanumeric fallback for when the item ranks are equal
  return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir;
};

interface DataTableProps<TData, TValue> {
  _columns: ColumnDef<TData, TValue>[];
  _data: TData[];
}

export function DataGrid<TData, TValue>({
  _columns,
  _data,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");

  const columns = React.useMemo<ColumnDef<TData, TValue>[]>(() => {
    return _columns;
  }, [_columns]);

  const [data] = React.useState<TData[]>(() => {
    return _data;
  });

  const updateData = api.resource.update.useMutation({
    onSuccess: (): void => {
      console.log("fatto");
    },
  });

  const table = useReactTable({
    data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter, //define as a filter function that can be used in column definitions
    },
    state: {
      columnFilters,
      globalFilter,
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "fuzzy", //apply fuzzy filter to the global filter (most common use case for fuzzy filter)
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(), //client side filtering
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10, //custom default page size
      },
    },
    debugTable: true,
    debugHeaders: true,
    debugColumns: false,
    meta: {
      updateData: (rowIndex, columnId, value) => {
        let resource: unknown = data[rowIndex];

        resource = {
          ...resource!,
          [columnId]: value,
        };

        updateData.mutate(ResourcesSchema.parse(resource));

        console.log(resource);
      },
    },
  });

  //apply the fuzzy sort if the fullName column is being filtered
  React.useEffect(() => {
    if (table.getState().columnFilters[0]?.id === "fullName") {
      if (table.getState().sorting[0]?.id !== "fullName") {
        table.setSorting([{ id: "fullName", desc: false }]);
      }
    }
  }, [table]);

  return (
    <div className="p-2">
      <div className="flex gap-2 text-center">
        <Input
          value={globalFilter ?? ""}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setGlobalFilter(e.target.value);
          }}
          className="font-lg border-block w-full border p-2 shadow"
          placeholder="Search all columns..."
        />
        <div className="min-w-10 text-nowrap">
          {table.getPrePaginationRowModel().rows.length} Rows
        </div>
      </div>
      <div className="h-2" />
      <table className="w-full table-auto">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    className="w-fit"
                  >
                    {header.isPlaceholder ? null : (
                      <>
                        <div
                          {...{
                            className: header.column.getCanSort()
                              ? "cursor-pointer select-none"
                              : "",
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {{
                            asc: " 🔼",
                            desc: " 🔽",
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                        {header.column.getCanFilter() ? (
                          <div>
                            <Filter column={header.column} />
                          </div>
                        ) : null}
                      </>
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => {
            return (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  return (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="h-2" />
      <div className="flex items-center justify-start space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            table.previousPage();
          }}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            table.nextPage();
          }}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </strong>
        </span>
        <Select
          value={table.getState().pagination.pageSize.toString()}
          onValueChange={(value) => {
            table.setPageSize(Number(value));
          }}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select a pagination size" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {[10, 20, 30, 40, 50, 100].map((pageSize) => (
                <SelectItem key={pageSize} value={pageSize.toString()}>
                  Show {pageSize}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div>{table.getPrePaginationRowModel().rows.length} Rows</div>
      <pre>
        {JSON.stringify(
          {
            columnFilters: table.getState().columnFilters,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            globalFilter: table.getState().globalFilter,
          },
          null,
          2,
        )}
      </pre>
    </div>
  );
}

function Filter({ column }: { column: Column<TData, TValue> }) {
  const columnFilterValue = column.getFilterValue();

  return (
    <Input
      type="text"
      value={(columnFilterValue ?? "") as string}
      onChange={(value) => column.setFilterValue(value)}
      placeholder={`Search...`}
      className="w-fit rounded border shadow"
    />
  );
}
