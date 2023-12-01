"use client";

import { Badge, Checkbox } from "@phunq/ui";
import { ColumnDef } from "@tanstack/react-table";

import { TableColumnHeader } from "./column-header";
import { labels, statuses, types } from "./data/data";
import { Page } from "./data/schema";
import { TableRowActions } from "./row-actions";

export const columns: ColumnDef<Page>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => <TableColumnHeader column={column} title="Title" />,
    cell: ({ row }) => {
      const label = labels.find((label) => label.value === row.original.label);

      return (
        <div className="flex space-x-2">
          {label && <Badge variant="neutral">{label.label}</Badge>}
          <span className="max-w-[250px] truncate font-medium">
            {row.getValue("title")}
          </span>
        </div>
      );
    },
  },

  {
    accessorKey: "url",
    header: ({ column }) => <TableColumnHeader column={column} title="Url" />,
    cell: ({ row }) => (
      <a
        className="w-[300px] text-blue-600 underline dark:text-blue-200"
        // http://localhost:8888/naguna/hormoneguardformula.com/vsl to https://hormoneguardformula.com/vsl
        href={`https://${row.getValue("url")}`}
        target="_blank"
        rel="noreferrer"
      >
        {row.getValue("url")}
      </a>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = statuses.find(
        (status) => status.value === row.getValue("status"),
      );

      if (!status) {
        return null;
      }

      return (
        <div className="flex w-[75px] items-center">
          {/* {status.icon && (
            <status.icon className="text-muted-foreground mr-2 h-4 w-4" />
          )} */}
          {status.label === "Published" ? (
            <Badge variant="success">{status.label}</Badge>
          ) : (
            <Badge variant="neutral">{status.label}</Badge>
          )}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Page Type" />
    ),
    cell: ({ row }) => {
      const type = types.find((type) => type.value === row.getValue("type"));

      if (!types) {
        return null;
      }

      return (
        <div className="flex w-[75px] items-center">
          {type?.value === "custom" ? (
            <Badge variant="default">{type?.label}</Badge>
          ) : (
            <Badge variant="default">{type?.label}</Badge>
          )}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <TableRowActions row={row} />,
  },
];
