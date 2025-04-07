"use client";

import { formatter } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import StatusBadge from "./statusBadge";
import { CellAction } from "./cell-action";
import { OrderStatus, OrderPayment } from "@prisma/client";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type OrderColumn = {
  id: number;
  customer: string;
  status: OrderStatus;
  paymentStatus: OrderPayment;
  total: number;
};

export const columns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: "id",
    header: "Numero de Pedido",
  },
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
