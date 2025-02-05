"use client";

import { ColumnDef } from "@tanstack/react-table";
import { formatter } from "@/lib/utils";
import { CellAction } from "./cell-action";

export type OrderProductColumn = {
  id: string;
  brand: string | undefined;
  model: string | undefined;
  color: string | undefined;
  variant: string | undefined;
  quantity: number;
  total: number;
};

export const columns: ColumnDef<OrderProductColumn>[] = [
  {
    accessorKey: "brand",
    header: "Marca",
  },
  {
    accessorKey: "model",
    header: "Modelo",
  },
  {
    accessorKey: "color",
    header: "Color",
  },
  {
    accessorKey: "variant",
    header: "Variante",
  },
  {
    accessorKey: "quantity",
    header: "Cantidad",
  },
  {
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) => formatter.format(row.original.total),
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
