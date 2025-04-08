"use client";

import { formatter } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { OrderStatus, OrderPayment } from "@prisma/client";
import PaymentStatusBadge from "./paymentStatusBadge";
import StatusBadge from "./statusBadge";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type OrderColumn = {
  id: number;
  customer: string;
  status: OrderStatus;
  paymentStatus: OrderPayment;
  total: number;
  storeId: string;
  createdAt: Date;
};

export const columns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: "createdAt",
    header: "Fecha de creacion",
    cell: ({ row }) =>
      row.original.createdAt.toLocaleDateString("es-PY", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
  },
  {
    accessorKey: "customer",
    header: "Cliente",
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => (
      <StatusBadge
        status={row.original.status}
        orderId={row.original.id}
        storeId={row.original.storeId}
      />
    ),
  },
  {
    accessorKey: "paymentStatus",
    header: "Pago",
    cell: ({ row }) => (
      <PaymentStatusBadge
        paymentStatus={row.original.paymentStatus}
        orderId={row.original.id}
        storeId={row.original.storeId}
      />
    ),
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
