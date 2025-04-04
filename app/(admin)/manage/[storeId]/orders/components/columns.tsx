"use client";

import { formatter } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import StatusBadge from "./statusBadge";
import { CellAction } from "./cell-action";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type OrderColumn = {
  id: string;
  customer: string;
  status: "PENDIENTE" | "ENTREGADO" | "CANCELADO";
  paymentStatus: "PENDIENTE" | "PAGADO" | "CANCELADO";
  total: number;
};

export const columns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: "customer",
    header: "Ciente",
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "paymentStatus",
    header: "Pago",
    cell: ({ row }) => <StatusBadge status={row.original.paymentStatus} />,
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
