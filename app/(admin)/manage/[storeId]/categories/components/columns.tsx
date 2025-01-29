"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type CustomerColumn = {
  id: string;
  rucName: string;
  ruc: string;
  email: string;
  tel: number;
};

export const columns: ColumnDef<CustomerColumn>[] = [
  {
    accessorKey: "rucName",
    header: "Razon Social",
  },
  {
    accessorKey: "ruc",
    header: "RUC",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "tel",
    header: "Telefono",
  },
  {
    accessorKey: "id",
    header: "Acciones",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
