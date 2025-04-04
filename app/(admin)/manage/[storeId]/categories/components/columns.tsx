"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type CategoryColumn = {
  id: string;
  name: string;
  description: string | null;
};

export const columns: ColumnDef<CategoryColumn>[] = [
  {
    accessorKey: "name",
    header: "Categoria",
  },
  {
    accessorKey: "description",
    header: "Descripcion",
  },
  {
    accessorKey: "id",
    header: "Acciones",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
