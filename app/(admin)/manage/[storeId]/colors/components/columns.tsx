"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type ColorColumn = {
  id: string;
  name: string;
  value: string;
};

export const columns: ColumnDef<ColorColumn>[] = [
  {
    accessorKey: "name",
    header: "Color",
  },
  {
    accessorKey: "value",
    header: "Valor",
    cell: ({ row }) => (
      <div className={`bg-${row.original.value} size-6 rounded-full`} />
    ),
  },
  {
    accessorKey: "id",
    header: "Acciones",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
